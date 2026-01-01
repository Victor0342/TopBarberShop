"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function deleteMediaAsset(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return;

  await prisma.mediaAsset.delete({ where: { id } });

  if (asset.src.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", asset.src);
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore missing files
    }
  }

  revalidatePath("/admin/media");
}
