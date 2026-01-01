"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { testimonialSchema } from "@/lib/validators";

export async function createTestimonial(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) return;

  await prisma.testimonial.create({
    data: {
      ...parsed.data,
      rating: parsed.data.rating ?? 5,
      order: parsed.data.order ?? 0,
      active,
    },
  });

  revalidatePath("/admin/testimonials");
}

export async function updateTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success || !id) return;

  await prisma.testimonial.update({
    where: { id },
    data: {
      ...parsed.data,
      rating: parsed.data.rating ?? 5,
      order: parsed.data.order ?? 0,
      active,
    },
  });

  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.testimonial.delete({ where: { id } });

  revalidatePath("/admin/testimonials");
}
