import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs/promises";
import path from "path";
import { requireAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ message: "Neautorizat." }, { status: 401 });
  }

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
