import { unstable_noStore } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

const GENERIC_SERVICE_IMAGES = new Set([
  "/uploads/",
  "/imagini/locatie-exterior.png",
  "/imagini/locatie-interior.png",
  "/imagini/model-frizura.png",
  "/imagini/model-frizura2.png",
  "/hero-exterior.jpg",
  "/top-hero.jpg",
]);

const BARBER_GALLERY_IMAGE =
  "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEAM8lqbi6qyhR_coiTdHSV2xpzNOoKL9AN9GHuWmuy1xgg5FsfJz4RCFIHbQ9GS3Lqc0hJAu_OhTyy50scyATNEx2u9oF9haJsq6qO8LZOHwqCV2eTl2V0eoDIOntfMt2ouk3SO4o7SNE=s1600";

const SERVICE_IMAGE_OVERRIDES: Record<string, string> = {
  "aranjarea-barbii": "/services/aranjarea-barbii.jpg",
  "barbierit-cu-lama": "/services/barbierit-cu-lama.jpg",
  "barbierit-cu-prosop-cald": "/services/barbierit-cu-prosop-cald.jpg",
  "epilat-cu-ceara": "/services/epilat-cu-ceara.jpg",
  "extensii-de-par": "/services/extensii-de-par.jpg",
  "indreptarea-parului": "/services/indreptarea-parului.jpg",
  "ras-pe-cap": "/services/ras-pe-cap.jpg",
  "tratament-scalp": "/services/tratament-scalp.jpg",
  "tuns-aranjarea-barbii": "/services/tuns-aranjarea-barbii.jpg",
  "tuns-pe-linia-parului": "/services/tuns-pe-linia-parului.jpg",
  "tuns-par-lung": "/services/tuns-par-lung.jpg",
  "tuns-sprancene": "/services/tuns-sprancene.jpg",
  "tunsoare-cu-lama": "/services/tunsoare-cu-lama.jpg",
  "tunsoare-fade-cut": "/services/tunsoare-fade-cut.jpg",
  "tunsoare-militara": "/services/tunsoare-militara.jpg",
  "tunsori-pentru-copii": "/services/tunsori-pentru-copii.jpg",
  "tunsori-personalizate": "/services/tunsori-personalizate.jpg",
  "vopsire-sprancene": "/services/vopsire-sprancene.jpg",
};

const SERVICE_SUMMARY_OVERRIDES: Record<string, string> = {
  "aranjarea-barbii": "Contur precis si ingrijire atenta pentru o barba curata si bine definita.",
  "barbierit": "Barbierit clasic pentru un aspect curat, confortabil si elegant.",
  "barbierit-cu-lama": "Barbierit traditional cu lama pentru finisaj neted si contur precis.",
  "barbierit-cu-prosop-cald": "Experienta premium cu prosop cald pentru relaxare si barbierit fin.",
  "epilat-cu-ceara": "Indepartare rapida a firelor nedorite pentru un look curat si ingrijit.",
  "extensii-de-par": "Aplicare atenta pentru volum, lungime si un aspect natural al parului.",
  "indreptarea-parului": "Netezire si disciplinare pentru un par drept, ordonat si usor de aranjat.",
  "ingrijirea-barbii": "Hidratare, contur si produse potrivite pentru o barba sanatoasa si ordonata.",
  "pachete-pentru-miri": "Pachet complet pentru un look impecabil in ziua nuntii.",
  "par-ondulat": "Aranjare si definire pentru un par ondulat cu aspect controlat si modern.",
  "ras-pe-cap": "Ras complet pe cap pentru un aspect curat, uniform si bine finisat.",
  "tratament-capilar": "Ingrijire dedicata pentru revitalizare, hidratare si aspect sanatos al parului.",
  "tratament-cu-balsam-pentru-barba": "Balsam si ingrijire speciala pentru o barba moale, hidratata si disciplinata.",
  "tratament-scalp": "Tratament pentru scalp curat si echilibrat, cu senzatie proaspata si confort.",
  "tuns": "Tunsoare curata si precisa, adaptata stilului tau de zi cu zi.",
  "tuns-aranjarea-barbii": "Tunsoare si barba in acelasi serviciu pentru un look complet si echilibrat.",
  "tuns-militareste": "Tunsoare foarte scurta, practica si usor de intretinut.",
  "tuns-par-lung": "Tunsoare pentru par lung, cu forma echilibrata si finisaj curat.",
  "tuns-pe-linia-parului": "Definire precisa a liniei parului pentru un contur curat si modern.",
  "tuns-sprancene": "Corectare discreta pentru sprancene mai curate si mai bine definite.",
  "tunsori-personalizate": "Tunsoare adaptata fizionomiei si stilului tau pentru un rezultat personalizat.",
  "tunsori-pentru-copii": "Tunsoare rapida si prietenoasa pentru cei mici, cu rezultat curat si modern.",
  "tunsoare-cu-lama": "Tunsoare cu detalii fine si linii curate pentru un aspect precis.",
  "tunsoare-fade-cut": "Fade modern cu tranzitie curata si finisaj atent lucrat.",
  "tunsoare-militara": "Stil scurt si ordonat, cu look fresh si intretinere usoara.",
  "vopsirea-barbii": "Uniformizare si accent de culoare pentru o barba cu aspect ingrijit.",
  "vopsirea-parului": "Culoare si improspatare pentru un look schimbat si bine finisat.",
  "vopsire-sprancene": "Definire subtila a sprancenelor pentru expresie mai clara si contur uniform.",
};

const SERVICE_DETAIL_CONTENT_OVERRIDES: Record<
  string,
  { description: string; includes: string; recommendations: string }
> = {
  "aranjarea-barbii": {
    description: "Aranjarea barbii este realizata cu atentie la detalii pentru un contur curat, echilibrat si adaptat formei fetei.",
    includes: "Consultare scurta, conturarea barbii, ajustare lungime si finisaj curat.",
    recommendations: "Foloseste ulei sau balsam pentru barba si revino periodic pentru mentinerea formei.",
  },
  "barbierit": {
    description: "Barbierit clasic pentru un aspect ingrijit, confortabil si elegant, realizat cu atentie la finisaj.",
    includes: "Pregatirea tenului, barbierit atent si curatarea conturului.",
    recommendations: "Evita produsele iritante imediat dupa serviciu si hidrateaza zona barbierita.",
  },
  "barbierit-cu-lama": {
    description: "Barbierit traditional cu lama pentru piele neteda si contur precis, potrivit unui look impecabil.",
    includes: "Pregatirea pielii, barbierit cu lama si finisare atenta a conturului.",
    recommendations: "Aplica aftershave bland si evita expunerea la iritanti in primele ore.",
  },
  "barbierit-cu-prosop-cald": {
    description: "Un serviciu relaxant si premium, combinand prosopul cald cu barbieritul precis pentru confort maxim.",
    includes: "Prosop cald, inmuierea firului, barbierit atent si finisaj curat.",
    recommendations: "Ideal pentru piele sensibila; mentine hidratarea dupa serviciu.",
  },
  "epilat-cu-ceara": {
    description: "Serviciu rapid pentru indepartarea firelor nedorite si obtinerea unui aspect curat si ordonat.",
    includes: "Aplicare ceara, indepartarea firelor si curatarea zonei tratate.",
    recommendations: "Evita atingerea excesiva a zonei imediat dupa procedura si foloseste produse calmante.",
  },
  "extensii-de-par": {
    description: "Aplicare de extensii pentru mai mult volum si lungime, cu atentie la aspectul natural al rezultatului.",
    includes: "Pregatirea parului, aplicarea extensiilor si ajustarea pentru integrare vizuala.",
    recommendations: "Foloseste produse delicate si urmeaza sfaturile de intretinere pentru durata mai buna.",
  },
  "indreptarea-parului": {
    description: "Serviciu de netezire pentru un par disciplinat, ordonat si mai usor de aranjat zilnic.",
    includes: "Evaluarea parului, netezire/indreptare si finisare pentru aspect uniform.",
    recommendations: "Evita umiditatea excesiva imediat dupa si foloseste produse pentru protectie termica.",
  },
  "ingrijirea-barbii": {
    description: "Ingrijire completa pentru barba, cu accent pe hidratare, forma si aspect sanatos.",
    includes: "Curatare, modelare usoara si aplicarea produselor de ingrijire pentru barba.",
    recommendations: "Piaptana barba zilnic si foloseste ulei sau balsam pentru hidratare constanta.",
  },
  "pachete-pentru-miri": {
    description: "Pachet dedicat evenimentelor speciale, pentru un look complet, curat si bine finisat.",
    includes: "Consultare, tunsoare, barba si finisaje adaptate momentului special.",
    recommendations: "Programeaza serviciul cu putin timp inainte de eveniment pentru cel mai bun rezultat.",
  },
  "par-ondulat": {
    description: "Aranjare si definire pentru un par ondulat cu volum controlat si aspect modern.",
    includes: "Contur, texturare si finisare pentru a pune in evidenta forma naturala a parului.",
    recommendations: "Foloseste produse pentru definirea buclelor sau a texturii si evita uscarea agresiva.",
  },
  "ras-pe-cap": {
    description: "Ras complet pentru un look curat, uniform si bine ingrijit.",
    includes: "Pregatirea scalpului, ras atent si finisaj curat al conturului.",
    recommendations: "Hidrateaza scalpul si foloseste protectie solara daca este expus frecvent.",
  },
  "tratament-capilar": {
    description: "Tratament pentru revitalizarea parului si imbunatatirea aspectului sau general.",
    includes: "Aplicarea tratamentului, masaj usor si finisare pentru aspect mai sanatos.",
    recommendations: "Repeta periodic tratamentul si foloseste produse potrivite tipului tau de par.",
  },
  "tratament-cu-balsam-pentru-barba": {
    description: "Tratament dedicat barbii pentru hidratare, catifelare si un aspect mai disciplinat.",
    includes: "Aplicarea balsamului, distribuire uniforma si finisare pentru forma curata.",
    recommendations: "Pentru rezultate mai bune, combina cu spalare delicata si ulei de barba.",
  },
  "tratament-scalp": {
    description: "Tratament pentru scalp curat si echilibrat, cu senzatie de prospetime si confort.",
    includes: "Curatare, tratament dedicat si stimulare usoara a scalpului.",
    recommendations: "Potrivit pentru intretinere periodica; foloseste sampon bland intre vizite.",
  },
  "tuns": {
    description: "Tunsoare precisa si curata, adaptata stilului tau si usor de intretinut zi de zi.",
    includes: "Consultare scurta, tunsoare, contur si finisaj final.",
    recommendations: "Revino la interval regulat pentru a pastra forma si prospetimea tunsorii.",
  },
  "tuns-aranjarea-barbii": {
    description: "Serviciu complet care combina tunsoarea cu aranjarea barbii pentru un look echilibrat si modern.",
    includes: "Tunsoare, conturarea barbii si finisaj complet pentru un rezultat unitar.",
    recommendations: "Ideal pentru intretinere completa; foloseste produse potrivite pentru par si barba.",
  },
  "tuns-militareste": {
    description: "Tunsoare foarte scurta si practica, cu aspect ordonat si intretinere minima.",
    includes: "Scurtare uniforma, contur curat si finisaj simplu si precis.",
    recommendations: "Potrivita pentru cei care prefera un stil fresh, usor de intretinut.",
  },
  "tuns-par-lung": {
    description: "Tunsoare pentru par lung, cu accent pe forma, echilibru si aspect ingrijit.",
    includes: "Ajustarea lungimii, uniformizare si finisare pentru forma curata.",
    recommendations: "Pastreaza sanatatea parului cu ingrijire regulata si protectie la coafare.",
  },
  "tuns-pe-linia-parului": {
    description: "Definire precisa a liniei parului pentru un contur clar si un look curat.",
    includes: "Conturarea liniei parului, curatarea marginilor si finisaj atent.",
    recommendations: "Revino periodic pentru mentinerea conturului clar si simetric.",
  },
  "tuns-sprancene": {
    description: "Corectare discreta a sprancenelor pentru un aspect mai ordonat si echilibrat.",
    includes: "Curatarea firelor in exces si definirea usoara a formei.",
    recommendations: "Potrivit ca intretinere rapida intre servicii mai complexe.",
  },
  "tunsori-personalizate": {
    description: "Tunsoare construita in functie de fizionomie, stil personal si preferintele tale.",
    includes: "Consultare, tunsoare personalizata si finisaj adaptat stilului dorit.",
    recommendations: "Arata cel mai bine cand forma este mentinuta prin programari regulate.",
  },
  "tunsori-pentru-copii": {
    description: "Tunsoare rapida si prietenoasa pentru copii, cu rezultat curat si modern.",
    includes: "Tunsoare adaptata varstei, contur curat si finisaj lejer.",
    recommendations: "Pentru confort mai bun, programeaza vizita intr-un moment in care copilul este odihnit.",
  },
  "tunsoare-cu-lama": {
    description: "Tunsoare cu detalii fine si linii bine definite pentru un rezultat precis.",
    includes: "Tunsoare, definirea liniilor si finisaj cu accent pe precizie.",
    recommendations: "Ideala pentru stiluri care pun accent pe contur si detalii curate.",
  },
  "tunsoare-fade-cut": {
    description: "Fade modern cu tranzitie curata, perfect pentru un look actual si atent finisat.",
    includes: "Fade bine estompat, texturare si contur final curat.",
    recommendations: "Pastreaza fade-ul fresh prin retusuri regulate.",
  },
  "tunsoare-militara": {
    description: "Tunsoare scurta, ordonata si practica, potrivita pentru un look simplu si fresh.",
    includes: "Scurtare uniforma, contur si finisaj curat.",
    recommendations: "Potrivita pentru cei care isi doresc intretinere minima si aspect impecabil.",
  },
  "vopsirea-barbii": {
    description: "Accent de culoare si uniformizare pentru o barba cu aspect mai dens si mai ingrijit.",
    includes: "Alegerea nuantei, aplicare si uniformizare a culorii pe barba.",
    recommendations: "Evita spalarea agresiva imediat dupa si foloseste produse pentru mentinerea culorii.",
  },
  "vopsirea-parului": {
    description: "Serviciu de colorare pentru schimbare de look, improspatare si aspect bine finisat.",
    includes: "Consultare, aplicare culoare si finisaj pentru uniformitate vizuala.",
    recommendations: "Foloseste produse pentru par vopsit si evita spalarea prea frecventa.",
  },
  "vopsire-sprancene": {
    description: "Definire subtila a sprancenelor prin culoare, pentru un contur mai uniform si expresiv.",
    includes: "Aplicarea culorii si ajustarea intensitatii pentru aspect natural.",
    recommendations: "Evita frecarea zonei imediat dupa procedura pentru o rezistenta mai buna.",
  },
};

const SERVICE_IMAGE_POOLS = {
  beard: [
    "/imagini/Model-Frizura2.png",
    BARBER_GALLERY_IMAGE,
    "/imagini/Model-Frizura.png",
  ],
  haircut: [
    "/imagini/Model-Frizura.png",
    "/imagini/Model-Frizura2.png",
    "https://i.postimg.cc/SXWWm8Zm/2025-12-05.webp",
    BARBER_GALLERY_IMAGE,
  ],
  color: [
    "https://i.postimg.cc/SXWWm8Zm/2025-12-05.webp",
    "/imagini/Model-Frizura.png",
    BARBER_GALLERY_IMAGE,
  ],
  browsWax: [
    BARBER_GALLERY_IMAGE,
    "/imagini/Model-Frizura2.png",
    "/imagini/Model-Frizura.png",
  ],
  treatment: [
    "/imagini/Model-Frizura2.png",
    "/imagini/Model-Frizura.png",
    BARBER_GALLERY_IMAGE,
  ],
  salon: [
    "/imagini/Locatie-Interior.png",
    "/imagini/Locatie-Exterior.png",
    "/hero-exterior.jpg",
    "/top-hero.jpg",
  ],
};

async function safeDbCall<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isExpectedConnectionIssue =
      message.includes("Can't reach database server") ||
      message.includes("Can't reach database") ||
      message.includes("PrismaClientInitializationError");

    if (!isExpectedConnectionIssue) {
      console.warn("Site data fallback triggered.", error);
    }

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
  return safeDbCall(async () => {
    const requestedSlug = decodeURIComponent(slug).trim();
    const exactMatch = await prisma.service.findUnique({ where: { slug: requestedSlug } });
    if (exactMatch) {
      return exactMatch;
    }

    const normalizedSlug = slugify(requestedSlug);
    if (!normalizedSlug) {
      return null;
    }

    const services = await prisma.service.findMany();
    return (
      services.find((service) => {
        const slugCandidates = [service.slug, service.title].filter(Boolean).map((value) => slugify(value));
        return slugCandidates.includes(normalizedSlug);
      }) ?? null
    );
  }, null);
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
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (trimmed.includes("lh3.googleusercontent.com")) {
      const base = trimmed.split("=")[0];
      return `${base}=s1600`;
    }
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return `/${trimmed}`;
};

const pickStableServiceImage = (seed: string) => {
  const hash = seed.split("").reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);
  return hash;
};

export const resolveServiceImage = (title: string, src?: string | null, seed?: string) => {
  const normalizedSrc = resolveImageSrc(src).toLowerCase();
  if (!GENERIC_SERVICE_IMAGES.has(normalizedSrc)) {
    return resolveImageSrc(src);
  }

  const normalizedTitle = slugify(title);
  const overrideImage = SERVICE_IMAGE_OVERRIDES[normalizedTitle];
  if (overrideImage) {
    return overrideImage;
  }

  const stableSeed = pickStableServiceImage(slugify(seed ?? title));

  let pool = SERVICE_IMAGE_POOLS.haircut;

  if (
    normalizedTitle.includes("barbierit") ||
    normalizedTitle.includes("barba") ||
    normalizedTitle.includes("barbii") ||
    normalizedTitle.includes("prosop-cald") ||
    normalizedTitle.includes("lama")
  ) {
    pool = SERVICE_IMAGE_POOLS.beard;
  } else if (
    normalizedTitle.includes("sprancene") ||
    normalizedTitle.includes("epilat") ||
    normalizedTitle.includes("ceara")
  ) {
    pool = SERVICE_IMAGE_POOLS.browsWax;
  } else if (
    normalizedTitle.includes("vops") ||
    normalizedTitle.includes("ondulat") ||
    normalizedTitle.includes("extensii") ||
    normalizedTitle.includes("indreptarea") ||
    normalizedTitle.includes("parului") ||
    normalizedTitle.includes("par-lung")
  ) {
    pool = SERVICE_IMAGE_POOLS.color;
  } else if (
    normalizedTitle.includes("tratament") ||
    normalizedTitle.includes("scalp") ||
    normalizedTitle.includes("capilar") ||
    normalizedTitle.includes("sampon") ||
    normalizedTitle.includes("balsam")
  ) {
    pool = SERVICE_IMAGE_POOLS.treatment;
  } else if (
    normalizedTitle.includes("miri") ||
    normalizedTitle.includes("pachete")
  ) {
    pool = SERVICE_IMAGE_POOLS.salon;
  }

  return pool[stableSeed % pool.length];
};

const truncateServiceSummary = (value: string, maxLength = 92) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const shortened = normalized.slice(0, maxLength);
  const cutAt = shortened.lastIndexOf(" ");
  return `${(cutAt > 48 ? shortened.slice(0, cutAt) : shortened).trim()}...`;
};

export const resolveServiceSummary = (title: string, description?: string | null) => {
  const normalizedTitle = slugify(title);
  const override = SERVICE_SUMMARY_OVERRIDES[normalizedTitle];
  if (override) {
    return override;
  }

  if (description?.trim()) {
    return truncateServiceSummary(description);
  }

  return "Serviciu profesional realizat cu atentie la detalii si produse de calitate.";
};

export const resolveServiceCategory = (title: string, category?: string | null) => {
  const normalizedTitle = slugify(title);

  if (
    normalizedTitle.includes("pachete-pentru-miri") ||
    normalizedTitle.includes("tuns-aranjarea-barbii") ||
    normalizedTitle.includes("vops") ||
    normalizedTitle.includes("extensii") ||
    normalizedTitle.includes("indreptarea") ||
    normalizedTitle.includes("par-ondulat")
  ) {
    return "Complex";
  }

  if (
    normalizedTitle.includes("sprancene") ||
    normalizedTitle.includes("epilat") ||
    normalizedTitle.includes("tratament") ||
    normalizedTitle.includes("sampon") ||
    normalizedTitle.includes("balsam")
  ) {
    return "Altele";
  }

  if (category === "Complex" || category === "Standard" || category === "Altele") {
    return category;
  }

  return "Standard";
};

export const resolveServiceDetailContent = (
  title: string,
  description?: string | null,
  includes?: string | null,
  recommendations?: string | null,
) => {
  const normalizedTitle = slugify(title);
  const override = SERVICE_DETAIL_CONTENT_OVERRIDES[normalizedTitle];

  return {
    description: description?.trim() || override?.description || resolveServiceSummary(title, description),
    includes:
      includes?.trim() ||
      override?.includes ||
      "Consultare scurta, executie atenta si finisaj curat adaptat stilului ales.",
    recommendations:
      recommendations?.trim() ||
      override?.recommendations ||
      "Pentru un rezultat constant, urmeaza sfaturile barberului si revino periodic la intretinere.",
  };
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
