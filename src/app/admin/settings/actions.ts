"use server";

import { prisma } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validators";

export async function updateSiteSettings(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.safeParse(data);
  if (!parsed.success) return;

  const workingHoursRaw = String(formData.get("workingHours") ?? "");
  const socialsRaw = String(formData.get("socials") ?? "");
  let workingHours: unknown = undefined;
  if (workingHoursRaw) {
    try {
      workingHours = JSON.parse(workingHoursRaw);
    } catch {
      workingHours = undefined;
    }
  }

  let socials: unknown = undefined;
  if (socialsRaw) {
    try {
      socials = JSON.parse(socialsRaw);
    } catch {
      socials = undefined;
    }
  }

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
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
}
