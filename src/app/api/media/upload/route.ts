import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`media:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json({ message: "Prea multe cereri." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Fisier invalid." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Doar imagini sunt permise." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || ".png";
  const filename = `${crypto.randomUUID()}${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  const src = `/uploads/${filename}`;
  const asset = await prisma.mediaAsset.create({
    data: {
      title: file.name,
      alt: file.name,
      src,
      mimeType: file.type,
      size: file.size,
    },
  });

  return NextResponse.json({ asset });
}
