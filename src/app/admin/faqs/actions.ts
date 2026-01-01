"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { faqSchema } from "@/lib/validators";

export async function createFaq(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success) return;

  await prisma.faq.create({
    data: {
      ...parsed.data,
      order: parsed.data.order ?? 0,
      active,
    },
  });

  revalidatePath("/admin/faqs");
}

export async function updateFaq(formData: FormData) {
  const id = String(formData.get("id"));
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success || !id) return;

  await prisma.faq.update({
    where: { id },
    data: {
      ...parsed.data,
      order: parsed.data.order ?? 0,
      active,
    },
  });

  revalidatePath("/admin/faqs");
}

export async function deleteFaq(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.faq.delete({ where: { id } });

  revalidatePath("/admin/faqs");
}
