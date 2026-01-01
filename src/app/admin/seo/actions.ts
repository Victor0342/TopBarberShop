"use server";

import { prisma } from "@/lib/db";
import { pageSeoSchema } from "@/lib/validators";

export async function updatePageSeo(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = pageSeoSchema.safeParse(data);
  if (!parsed.success) return;

  await prisma.pageSEO.update({
    where: { pageKey: parsed.data.pageKey },
    data: {
      title: parsed.data.title || null,
      description: parsed.data.description || null,
      ogImage: parsed.data.ogImage || null,
    },
  });
}
