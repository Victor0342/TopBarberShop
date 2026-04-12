"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { serviceSchema } from "@/lib/validators";
import { slugify } from "@/lib/slug";
import { requireAdminSession } from "@/lib/auth";

export async function createService(formData: FormData) {
  await requireAdminSession();
  const data = Object.fromEntries(formData.entries());
  const isFeatured = formData.get("isFeatured") === "on";
  const parsed = serviceSchema.safeParse({
    ...data,
    slug: data.slug ? data.slug : slugify(String(data.title ?? "")),
  });
  if (!parsed.success) return;

  await prisma.service.create({
    data: {
      ...parsed.data,
      price: parsed.data.price ?? null,
      durationMin: parsed.data.durationMin ?? null,
      priceNote: parsed.data.priceNote || null,
      category: parsed.data.category || null,
      image: parsed.data.image || null,
      includes: parsed.data.includes || null,
      recommendations: parsed.data.recommendations || null,
      order: parsed.data.order ?? 0,
      isFeatured,
    },
  });

  revalidatePath("/admin/services");
}

export async function updateService(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));
  const data = Object.fromEntries(formData.entries());
  const isFeatured = formData.get("isFeatured") === "on";
  const parsed = serviceSchema.safeParse({
    ...data,
    slug: data.slug ? data.slug : slugify(String(data.title ?? "")),
  });
  if (!parsed.success || !id) return;

  await prisma.service.update({
    where: { id },
    data: {
      ...parsed.data,
      price: parsed.data.price ?? null,
      durationMin: parsed.data.durationMin ?? null,
      priceNote: parsed.data.priceNote || null,
      category: parsed.data.category || null,
      image: parsed.data.image || null,
      includes: parsed.data.includes || null,
      recommendations: parsed.data.recommendations || null,
      order: parsed.data.order ?? 0,
      isFeatured,
    },
  });

  revalidatePath("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id"));
  if (!id) return;
  const bookingsCount = await prisma.booking.count({ where: { serviceId: id } });
  if (bookingsCount > 0) {
    redirect("/admin/services?error=service-in-use");
  }
  await prisma.service.delete({ where: { id } });

  revalidatePath("/admin/services");
}
