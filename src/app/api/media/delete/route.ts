import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const body = await request.json();
  const id = body?.id as string | undefined;
  if (!id) {
    return NextResponse.json({ message: "ID invalid." }, { status: 400 });
  }

  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ message: "Asset inexistent." }, { status: 404 });
  }

  await prisma.mediaAsset.delete({ where: { id } });

  if (asset.src.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", asset.src);
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ ok: true });
}
