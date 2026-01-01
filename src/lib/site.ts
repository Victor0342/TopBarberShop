import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export const getSiteSettings = cache(async () => {
  return prisma.siteSettings.findFirst();
});

export const getPageSEO = cache(async (pageKey: string) => {
  return prisma.pageSEO.findUnique({ where: { pageKey } });
});

export const getPageSections = unstable_cache(
  async (pageKey: string) => {
    return prisma.pageSection.findMany({
      where: { pageKey, active: true },
      orderBy: { order: "asc" },
    });
  },
  ["page-sections"],
  { tags: ["page-sections"] },
);

export const getServices = cache(async () => {
  return prisma.service.findMany({ orderBy: { order: "asc" } });
});

export const getServiceBySlug = cache(async (slug: string) => {
  return prisma.service.findUnique({ where: { slug } });
});

export const getFeaturedServices = cache(async () => {
  return prisma.service.findMany({
    where: { isFeatured: true },
    orderBy: { order: "asc" },
    take: 6,
  });
});

export const getTeamMembers = unstable_cache(
  async () => {
    return prisma.teamMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  },
  ["team-members"],
  { tags: ["team-members"] }
);

export const getGalleryImages = cache(async () => {
  return prisma.galleryImage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
});

export const getTestimonials = cache(async () => {
  return prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
});

export const getFaqs = cache(async () => {
  return prisma.faq.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
});

export const formatPrice = (price?: number | null, note?: string | null) => {
  if (price === null || price === undefined) {
    return note ?? "TODO: pret indisponibil";
  }
  return `${price} Lei`;
};

export const safeText = (value?: string | null, fallback = "TODO: completati") =>
  value?.trim() ? value : fallback;

export const formatWorkingHours = (hours?: unknown) => {
  if (!hours || !Array.isArray(hours)) {
    return "TODO: program";
  }
  const first = hours[0] as { open?: string; close?: string };
  const last = hours[hours.length - 1] as { open?: string; close?: string };
  if (!first?.open || !first?.close || !last) {
    return "TODO: program";
  }
  return `Luni - Sambata ${first.open}-${first.close}`;
};
