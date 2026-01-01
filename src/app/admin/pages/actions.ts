"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function updatePageSection(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;

  const title = String(formData.get("title") ?? "");
  const subtitle = String(formData.get("subtitle") ?? "");
  const body = String(formData.get("body") ?? "");
  const ctaText = String(formData.get("ctaText") ?? "");
  const ctaHref = String(formData.get("ctaHref") ?? "");
  const active = formData.get("active") === "on";
  const dataRaw = String(formData.get("data") ?? "");
  let data: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined;
  if (dataRaw) {
    try {
      const parsed = JSON.parse(dataRaw) as Prisma.InputJsonValue | null;
      data = parsed === null ? Prisma.JsonNull : parsed;
    } catch {
      data = undefined;
    }
  }

  await prisma.pageSection.update({
    where: { id },
    data: {
      title: title || null,
      subtitle: subtitle || null,
      body: body || null,
      ctaText: ctaText || null,
      ctaHref: ctaHref || null,
      data,
      active,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/gallery");
  revalidatePath("/services");
  revalidatePath("/booking");
  revalidateTag("page-sections", "default");
}
