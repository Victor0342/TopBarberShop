"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validators";
import { requireAdminSession } from "@/lib/auth";

export async function updateSiteSettings(formData: FormData) {
  await requireAdminSession();
  const data = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.safeParse(data);
  if (!parsed.success) return;

  const workingHoursRaw = String(formData.get("workingHours") ?? "");
  const socialsRaw = String(formData.get("socials") ?? "");
  let workingHours: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined;
  if (workingHoursRaw) {
    try {
      const parsedWorkingHours = JSON.parse(workingHoursRaw) as Prisma.InputJsonValue | null;
      workingHours = parsedWorkingHours === null ? Prisma.JsonNull : parsedWorkingHours;
    } catch {
      workingHours = undefined;
    }
  }

  let socials: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined;
  if (socialsRaw) {
    try {
      const parsedSocials = JSON.parse(socialsRaw) as Prisma.InputJsonValue | null;
      socials = parsedSocials === null ? Prisma.JsonNull : parsedSocials;
    } catch {
      socials = undefined;
    }
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      ...parsed.data,
      brandTagline: parsed.data.brandTagline || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      city: parsed.data.city || null,
      language: parsed.data.language || "ro",
      heroTitle: parsed.data.heroTitle || null,
      heroSubtitle: parsed.data.heroSubtitle || null,
      heroCtaPrimary: parsed.data.heroCtaPrimary || null,
      heroCtaSecondary: parsed.data.heroCtaSecondary || null,
      heroCtaSecondaryHref: parsed.data.heroCtaSecondaryHref || null,
      workingHours,
      socials,
    },
    update: {
      ...parsed.data,
      brandTagline: parsed.data.brandTagline || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      city: parsed.data.city || null,
      language: parsed.data.language || "ro",
      heroTitle: parsed.data.heroTitle || null,
      heroSubtitle: parsed.data.heroSubtitle || null,
      heroCtaPrimary: parsed.data.heroCtaPrimary || null,
      heroCtaSecondary: parsed.data.heroCtaSecondary || null,
      heroCtaSecondaryHref: parsed.data.heroCtaSecondaryHref || null,
      workingHours,
      socials,
    },
  });

  revalidatePath("/admin/settings");
}
