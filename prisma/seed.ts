import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

type ParsedInfo = {
  brandName?: string;
  phone?: string;
  address?: string;
  city?: string;
  language?: string;
  workingHours?: { day: number; open: string; close: string }[];
  services: { title: string; price?: number | null }[];
  socials: { platform: string; url: string }[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const parsePrice = (raw: string) => {
  const match = raw.match(/(\d+)/);
  if (!match) return null;
  return Number(match[1]);
};

const parseWorkingHours = (raw: string) => {
  const rangeMatch = raw.match(/(Luni|Lu|L)\s*-\s*(Sambata|Sa|S)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/i);
  if (!rangeMatch) return null;
  const open = rangeMatch[3];
  const close = rangeMatch[4];
  return [1, 2, 3, 4, 5, 6].map((day) => ({ day, open, close }));
};

const parseInfo = (content: string): ParsedInfo => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const info: ParsedInfo = {
    services: [],
    socials: [],
  };

  let inServices = false;
  let inSocials = false;

  for (const line of lines) {
    if (line.toLowerCase().startsWith("servicii")) {
      inServices = true;
      inSocials = false;
      continue;
    }

    if (line.toLowerCase().startsWith("social media")) {
      inServices = false;
      inSocials = true;
      continue;
    }

    if (inServices) {
      const [label, value] = line.split("-").map((part) => part.trim());
      if (!label || !value) continue;
      const title = label.replace(/^pret\s+/i, "").trim();
      info.services.push({ title, price: parsePrice(value) });
      continue;
    }

    if (inSocials) {
      const [platform, url] = line.split("-").map((part) => part.trim());
      if (platform && url) {
        info.socials.push({ platform, url });
      }
      continue;
    }

    const [label, value] = line.split("-").map((part) => part.trim());
    if (!label || !value) continue;

    if (label.toLowerCase().startsWith("nume companie")) {
      info.brandName = value;
    } else if (label.toLowerCase().startsWith("numar")) {
      info.phone = value;
    } else if (label.toLowerCase().startsWith("adresa")) {
      info.address = value;
    } else if (label.toLowerCase().startsWith("orar")) {
      info.workingHours = parseWorkingHours(value) ?? undefined;
    } else if (label.toLowerCase().startsWith("oras")) {
      info.city = value;
    } else if (label.toLowerCase().startsWith("limba")) {
      info.language = value.toLowerCase().startsWith("rom")
        ? "ro"
        : value.toLowerCase();
    }
  }

  return info;
};

const seed = async () => {
  const infoPath = path.join(process.cwd(), "Informatie.MD");
  let content: string;
  try {
    content = await fs.readFile(infoPath, "utf8");
  } catch {
    content = await fs.readFile(path.join(process.cwd(), "INFORMATIE.MD"), "utf8");
  }
  const info = parseInfo(content);

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      brandName: info.brandName ?? "TopBarberShop",
      brandTagline: "TODO: tagline brand",
      phone: info.phone,
      address: info.address,
      city: info.city,
      language: info.language ?? "ro",
      workingHours: info.workingHours ?? [
        { day: 1, open: "10:00", close: "19:00" },
        { day: 2, open: "10:00", close: "19:00" },
        { day: 3, open: "10:00", close: "19:00" },
        { day: 4, open: "10:00", close: "19:00" },
        { day: 5, open: "10:00", close: "19:00" },
        { day: 6, open: "10:00", close: "19:00" },
      ],
      socials: info.socials,
      heroTitle: "TODO: Headline principal pentru TopBarberShop",
      heroSubtitle:
        "TODO: Subheadline convingator despre servicii, experienta si stil.",
      heroCtaPrimary: "Programeaza-te",
      heroCtaSecondary: "Vezi servicii",
      heroCtaSecondaryHref: "/services",
    },
    create: {
      id: "default",
      brandName: info.brandName ?? "TopBarberShop",
      brandTagline: "TODO: tagline brand",
      phone: info.phone,
      address: info.address,
      city: info.city,
      language: info.language ?? "ro",
      workingHours: info.workingHours ?? [
        { day: 1, open: "10:00", close: "19:00" },
        { day: 2, open: "10:00", close: "19:00" },
        { day: 3, open: "10:00", close: "19:00" },
        { day: 4, open: "10:00", close: "19:00" },
        { day: 5, open: "10:00", close: "19:00" },
        { day: 6, open: "10:00", close: "19:00" },
      ],
      socials: info.socials,
      heroTitle: "TODO: Headline principal pentru TopBarberShop",
      heroSubtitle:
        "TODO: Subheadline convingator despre servicii, experienta si stil.",
      heroCtaPrimary: "Programeaza-te",
      heroCtaSecondary: "Vezi servicii",
      heroCtaSecondaryHref: "/services",
    },
  });

  const services = info.services.length
    ? info.services
    : [
        { title: "Tunsoare", price: 250 },
        { title: "Aranjarea barbei", price: null },
      ];

  for (const [index, service] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: slugify(service.title) },
      update: {
        title: service.title,
        price: service.price ?? null,
        priceNote: service.price ? null : "TODO: stabileste pretul",
        description: "TODO: descriere serviciu",
        includes: "TODO: ce include serviciul (ex: consultatie, styling).",
        recommendations: "TODO: recomandari post-serviciu.",
        durationMin: 45,
        category: "Standard",
        order: index,
        isFeatured: index < 2,
        image: "/uploads/",
      },
      create: {
        title: service.title,
        slug: slugify(service.title),
        price: service.price ?? null,
        priceNote: service.price ? null : "TODO: stabileste pretul",
        description: "TODO: descriere serviciu",
        includes: "TODO: ce include serviciul (ex: consultatie, styling).",
        recommendations: "TODO: recomandari post-serviciu.",
        durationMin: 45,
        category: "Standard",
        order: index,
        isFeatured: index < 2,
        image: "/uploads/",
      },
    });
  }

  await prisma.teamMember.upsert({
    where: { id: "todo-barber-1" },
    update: {
      name: "TODO: Nume Barber",
      role: "Senior Barber",
      bio: "TODO: scurta descriere despre experienta.",
      image: "/uploads/",
      order: 0,
      active: true,
    },
    create: {
      id: "todo-barber-1",
      name: "TODO: Nume Barber",
      role: "Senior Barber",
      bio: "TODO: scurta descriere despre experienta.",
      image: "/uploads/",
      order: 0,
      active: true,
    },
  });

  const galleryImages = [
    "/uploads/",
    "/uploads/",
    "/uploads/",
    "/uploads/",
  ];

  for (const [index, src] of galleryImages.entries()) {
    const existing = await prisma.galleryImage.findFirst({ where: { src } });
    if (existing) {
      await prisma.galleryImage.update({
        where: { id: existing.id },
        data: {
          title: "TODO: Titlu galerie",
          category: "Salon",
          order: index,
          active: true,
        },
      });
    } else {
      await prisma.galleryImage.create({
        data: {
          title: "TODO: Titlu galerie",
          category: "Salon",
          src,
          order: index,
          active: true,
        },
      });
    }
  }

  await prisma.testimonial.upsert({
    where: { id: "todo-testimonial" },
    update: {
      name: "TODO: Client",
      rating: 5,
      text: "TODO: Feedback client.",
      order: 0,
      active: true,
    },
    create: {
      id: "todo-testimonial",
      name: "TODO: Client",
      rating: 5,
      text: "TODO: Feedback client.",
      order: 0,
      active: true,
    },
  });

  await prisma.faq.upsert({
    where: { id: "todo-faq" },
    update: {
      question: "TODO: Intrebare frecventa",
      answer: "TODO: Raspuns clar si concis.",
      order: 0,
      active: true,
    },
    create: {
      id: "todo-faq",
      question: "TODO: Intrebare frecventa",
      answer: "TODO: Raspuns clar si concis.",
      order: 0,
      active: true,
    },
  });

  const homeSections = [
    {
      sectionKey: "highlights",
      title: "De ce TopBarberShop",
      subtitle: "TODO: Beneficii clare pentru clienti",
      data: [
        { title: "Barberi premium", description: "TODO: descriere scurta." },
        { title: "Programare rapida", description: "TODO: descriere scurta." },
        { title: "Atmosfera relaxata", description: "TODO: descriere scurta." },
      ],
    },
    {
      sectionKey: "services",
      title: "TODO: Titlu servicii acasa",
      subtitle: "TODO: descriere servicii acasa",
    },
    {
      sectionKey: "team",
      title: "TODO: Titlu echipa acasa",
      subtitle: "TODO: descriere echipa acasa",
    },
    {
      sectionKey: "gallery",
      title: "TODO: Titlu galerie acasa",
      subtitle: "TODO: descriere galerie acasa",
    },
    {
      sectionKey: "testimonials",
      title: "TODO: Titlu testimoniale acasa",
      subtitle: "TODO: descriere testimoniale acasa",
    },
    {
      sectionKey: "faq",
      title: "TODO: Titlu FAQ acasa",
      subtitle: "TODO: descriere FAQ acasa",
    },
    {
      sectionKey: "contact",
      title: "TODO: Titlu contact acasa",
      subtitle: "TODO: descriere contact acasa",
    },
    {
      sectionKey: "cta",
      title: "Pregatit pentru o schimbare de look?",
      subtitle: "TODO: Indemn final pentru programare.",
      ctaText: "Programeaza-te",
      ctaHref: "/booking",
    },
    {
      sectionKey: "about",
      title: "Despre noi",
      subtitle: "TODO: Povestea brandului TopBarberShop.",
    },
  ];

  for (const [index, section] of homeSections.entries()) {
    await prisma.pageSection.upsert({
      where: { pageKey_sectionKey: { pageKey: "home", sectionKey: section.sectionKey } },
      update: {
        title: section.title,
        subtitle: section.subtitle,
        ctaText: section.ctaText,
        ctaHref: section.ctaHref,
        data: section.data ?? undefined,
        order: index,
      },
      create: {
        pageKey: "home",
        sectionKey: section.sectionKey,
        title: section.title,
        subtitle: section.subtitle,
        ctaText: section.ctaText,
        ctaHref: section.ctaHref,
        data: section.data ?? undefined,
        order: index,
      },
    });
  }

  const extraSections = [
    {
      pageKey: "services",
      sectionKey: "hero",
      title: "TODO: Titlu pagina servicii",
      subtitle: "TODO: descriere servicii",
    },
    {
      pageKey: "booking",
      sectionKey: "hero",
      title: "TODO: Titlu pagina programari",
      subtitle: "TODO: descriere programari",
    },
    {
      pageKey: "about",
      sectionKey: "story",
      title: "TODO: Titlu despre noi",
      subtitle: "TODO: povestea brandului",
      data: [
        { title: "TODO: Valoare 1", description: "TODO: descriere valoare." },
        { title: "TODO: Valoare 2", description: "TODO: descriere valoare." },
        { title: "TODO: Valoare 3", description: "TODO: descriere valoare." },
      ],
    },
    {
      pageKey: "gallery",
      sectionKey: "hero",
      title: "TODO: Titlu galerie",
      subtitle: "TODO: descriere galerie",
    },
    {
      pageKey: "contact",
      sectionKey: "hero",
      title: "TODO: Titlu contact",
      subtitle: "TODO: descriere contact",
    },
  ];

  for (const [index, section] of extraSections.entries()) {
    await prisma.pageSection.upsert({
      where: { pageKey_sectionKey: { pageKey: section.pageKey, sectionKey: section.sectionKey } },
      update: {
        title: section.title,
        subtitle: section.subtitle,
        data: section.data ?? undefined,
        order: index,
      },
      create: {
        pageKey: section.pageKey,
        sectionKey: section.sectionKey,
        title: section.title,
        subtitle: section.subtitle,
        data: section.data ?? undefined,
        order: index,
      },
    });
  }

  const pages = [
    "home",
    "services",
    "booking",
    "about",
    "gallery",
    "contact",
    "privacy",
    "terms",
  ];

  for (const pageKey of pages) {
    await prisma.pageSEO.upsert({
      where: { pageKey },
      update: {
        title: `TODO: SEO titlu ${pageKey}`,
        description: `TODO: SEO descriere ${pageKey}`,
        ogImage: "/uploads/",
      },
      create: {
        pageKey,
        title: `TODO: SEO titlu ${pageKey}`,
        description: `TODO: SEO descriere ${pageKey}`,
        ogImage: "/uploads/",
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, role: "ADMIN" },
      create: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
  } else {
    console.warn("ADMIN_EMAIL/ADMIN_PASSWORD lipsesc. Admin user nu a fost creat.");
  }
};

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
