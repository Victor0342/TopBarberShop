import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  barberId: z.string().optional().or(z.literal("")),
  date: z.string().min(1),
  time: z.string().min(1),
  clientName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(10).max(1000),
});

export const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  includes: z.string().optional().or(z.literal("")),
  recommendations: z.string().optional().or(z.literal("")),
  durationMin: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().int().positive().optional(),
  priceNote: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().optional(),
  image: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().optional(),
});

export const teamSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  image: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().optional(),
  active: z.coerce.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  order: z.coerce.number().int().optional(),
  active: z.coerce.boolean().optional(),
});

export const testimonialSchema = z.object({
  name: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  text: z.string().min(5),
  order: z.coerce.number().int().optional(),
  active: z.coerce.boolean().optional(),
});

export const gallerySchema = z.object({
  title: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  src: z.string().min(2),
  order: z.coerce.number().int().optional(),
  active: z.coerce.boolean().optional(),
});

export const siteSettingsSchema = z.object({
  brandName: z.string().min(2),
  brandTagline: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  socials: z.string().optional().or(z.literal("")),
  heroTitle: z.string().optional().or(z.literal("")),
  heroSubtitle: z.string().optional().or(z.literal("")),
  heroCtaPrimary: z.string().optional().or(z.literal("")),
  heroCtaSecondary: z.string().optional().or(z.literal("")),
  heroCtaSecondaryHref: z.string().optional().or(z.literal("")),
});

export const pageSeoSchema = z.object({
  pageKey: z.string().min(2),
  title: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
});
