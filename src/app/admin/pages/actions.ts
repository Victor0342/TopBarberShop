"use server";

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
  let data: unknown = undefined;
  if (dataRaw) {
    try {
      data = JSON.parse(dataRaw);
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
}
