"use server";

import { prisma } from "@/lib/db";
import { gallerySchema } from "@/lib/validators";

export async function createGalleryImage(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = gallerySchema.safeParse(data);
  if (!parsed.success) return;

  await prisma.galleryImage.create({
    data: {
      ...parsed.data,
      title: parsed.data.title || null,
      category: parsed.data.category || null,
      order: parsed.data.order ?? 0,
      active,
    },
  });
}

export async function updateGalleryImage(formData: FormData) {
  const id = String(formData.get("id"));
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = gallerySchema.safeParse(data);
  if (!parsed.success || !id) return;

  await prisma.galleryImage.update({
    where: { id },
    data: {
      ...parsed.data,
      title: parsed.data.title || null,
      category: parsed.data.category || null,
      order: parsed.data.order ?? 0,
      active,
    },
  });
}

export async function deleteGalleryImage(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.galleryImage.delete({ where: { id } });
}
