import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";

export const getSiteSettings = async () => {
  unstable_noStore();
  return prisma.siteSettings.findFirst();
};

export const getPageSEO = async (pageKey: string) => {
  unstable_noStore();
  return prisma.pageSEO.findUnique({ where: { pageKey } });
};

export const getPageSections = async (pageKey: string) => {
  unstable_noStore();
  return prisma.pageSection.findMany({
    where: { pageKey, active: true },
    orderBy: { order: "asc" },
  });
};

export const getServices = async () => {
  unstable_noStore();
  return prisma.service.findMany({ orderBy: { order: "asc" } });
};

export const getServiceBySlug = async (slug: string) => {
  unstable_noStore();
  return prisma.service.findUnique({ where: { slug } });
};

export const getFeaturedServices = async () => {
  unstable_noStore();
  return prisma.service.findMany({
    where: { isFeatured: true },
    orderBy: { order: "asc" },
    take: 6,
  });
};

export const getTeamMembers = async () => {
  unstable_noStore();
  return prisma.teamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
};

export const getGalleryImages = async () => {
  unstable_noStore();
  return prisma.galleryImage.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
};

export const getTestimonials = async () => {
  unstable_noStore();
  return prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
};

export const getFaqs = async () => {
  unstable_noStore();
  return prisma.faq.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
};

export const formatPrice = (price?: number | null, note?: string | null) => {
  if (price === null || price === undefined) {
    return note ?? "TODO: pret indisponibil";
  }
  return `${price} Lei`;
};

export const resolveImageSrc = (src?: string | null, fallback = "/imagini/Model-Frizura.png") => {
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
