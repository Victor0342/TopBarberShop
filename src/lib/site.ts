import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";

async function safeDbCall<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("Site data fallback triggered.", error);
    return fallback;
  }
}

export const getSiteSettings = async () => {
  unstable_noStore();
  return safeDbCall(() => prisma.siteSettings.findFirst(), null);
};

export const getPageSEO = async (pageKey: string) => {
  unstable_noStore();
  return safeDbCall(() => prisma.pageSEO.findUnique({ where: { pageKey } }), null);
};

export const getPageSections = async (pageKey: string) => {
  unstable_noStore();
  return safeDbCall(
    () =>
      prisma.pageSection.findMany({
        where: { pageKey, active: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
};

export const getServices = async () => {
  unstable_noStore();
  return safeDbCall(() => prisma.service.findMany({ orderBy: { order: "asc" } }), []);
};

export const getServiceBySlug = async (slug: string) => {
  unstable_noStore();
  return safeDbCall(() => prisma.service.findUnique({ where: { slug } }), null);
};

export const getFeaturedServices = async () => {
  unstable_noStore();
  return safeDbCall(
    () =>
      prisma.service.findMany({
        where: { isFeatured: true },
        orderBy: { order: "asc" },
        take: 6,
      }),
    [],
  );
};

export const getTeamMembers = async () => {
  unstable_noStore();
  return safeDbCall(
    () =>
      prisma.teamMember.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
};

export const getGalleryImages = async () => {
  unstable_noStore();
  return safeDbCall(
    () =>
      prisma.galleryImage.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
};

export const getTestimonials = async () => {
  unstable_noStore();
  return safeDbCall(
    () =>
      prisma.testimonial.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
};

export const getFaqs = async () => {
  unstable_noStore();
  return safeDbCall(
    () =>
      prisma.faq.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    [],
  );
};

export const formatPrice = (price?: number | null, note?: string | null) => {
  if (price === null || price === undefined) {
    return note ?? "TODO: pret indisponibil";
  }
  return `${price} Lei`;
};

export const resolveImageSrc = (src?: string | null, fallback = "/imagini/Locatie-Exterior.png") => {
  if (!src) return fallback;
  const trimmed = src.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/${trimmed}`;
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
