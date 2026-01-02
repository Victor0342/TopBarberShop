import Image from "next/image";
import heroImage from "@/../public/imagini/Model-Frizura.png";
import Link from "next/link";
import SectionHeading from "@/components/site/section-heading";
import FadeIn from "@/components/site/fade-in";
import ParallaxImage from "@/components/site/parallax-image";
import SmartImage from "@/components/site/smart-image";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  getFaqs,
  getFeaturedServices,
  getGalleryImages,
  getPageSEO,
  getPageSections,
  getSiteSettings,
  getTeamMembers,
  getTestimonials,
  safeText,
  formatWorkingHours,
} from "@/lib/site";

export async function generateMetadata() {
  const seo = await getPageSEO("home");
  return {
    title: seo?.title ?? "Acasa",
    description: seo?.description ?? "TopBarberShop - frizerie premium in Ialoveni.",
    openGraph: {
      title: seo?.title ?? "TopBarberShop",
      description: seo?.description ?? "Programari rapide si servicii premium.",
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const sections = await getPageSections("home");
  const featuredServices = await getFeaturedServices();
  const team = await getTeamMembers();
  const gallery = await getGalleryImages();
  const testimonials = await getTestimonials();
  const faqs = await getFaqs();

  const highlights = sections.find((section) => section.sectionKey === "highlights");
  const servicesSection = sections.find((section) => section.sectionKey === "services");
  const teamSection = sections.find((section) => section.sectionKey === "team");
  const gallerySection = sections.find((section) => section.sectionKey === "gallery");
  const testimonialsSection = sections.find((section) => section.sectionKey === "testimonials");
  const faqSection = sections.find((section) => section.sectionKey === "faq");
  const contactSection = sections.find((section) => section.sectionKey === "contact");
  const ctaSection = sections.find((section) => section.sectionKey === "cta");
  const highlightsData = (highlights?.data as { title: string; description: string }[]) ?? [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings?.brandName ?? "TopBarberShop",
    address: settings?.address ?? "TODO: adresa",
    telephone: settings?.phone ?? "TODO: telefon",
    areaServed: settings?.city ?? "Ialoveni",
    image: "/imagini/Locatie-Exterior.png",
  };

  return (
    <div className="space-y-24 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-20 lg:grid-cols-2 lg:items-center">
          <FadeIn className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              {settings?.city ?? "Ialoveni"}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {safeText(settings?.heroTitle, "TODO: Headline hero")}
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              {safeText(settings?.heroSubtitle, "TODO: Subheadline hero")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/booking">{settings?.heroCtaPrimary ?? "Programeaza-te"}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={settings?.heroCtaSecondaryHref ?? "/services"}>
                  {settings?.heroCtaSecondary ?? "Vezi servicii"}
                </Link>
              </Button>
            </div>
          </FadeIn>
          <FadeIn className="relative h-[420px] overflow-hidden rounded-3xl border border-border/60">
            <Image
              src={heroImage}
              alt="Model frizura"
              fill
              className="object-cover"
              priority
              placeholder="blur"
            />
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Highlights"
          title={safeText(highlights?.title, "TODO: Highlights title")}
          description={highlights?.subtitle ?? "TODO: descriere highlights"}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {highlightsData.length ? (
            highlightsData.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1} className="rounded-2xl border border-border/60 bg-card p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </FadeIn>
            ))
          ) : (
            <FadeIn className="rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-sm text-muted-foreground">TODO: adauga highlight-uri in Admin.</p>
            </FadeIn>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Servicii"
          title={servicesSection?.title ?? "TODO: Titlu servicii"}
          description={servicesSection?.subtitle ?? "TODO: descriere servicii"}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredServices.map((service) => (
            <FadeIn key={service.id} className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6">
              <div className="relative mb-4 h-36 overflow-hidden rounded-xl">
                <SmartImage src={service.image} alt={service.title} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description ?? "TODO: descriere serviciu"}</p>
              <div className="mt-4 flex items-center justify-between text-sm font-semibold">
                <span>{formatPrice(service.price, service.priceNote)}</span>
                <Link href={`/services/${service.slug}`} className="text-muted-foreground hover:text-foreground">
                  Detalii
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <FadeIn>
            <SectionHeading
              eyebrow="Echipa"
              title={teamSection?.title ?? "TODO: Titlu echipa"}
              description={teamSection?.subtitle ?? "TODO: descriere echipa"}
            />
            <div className="mt-6 grid gap-4">
              {team.map((member) => (
                <div key={member.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image src={member.image ?? "/imagini/Model-Frizura2.png"} alt={member.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role ?? "TODO: rol barber"}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
          <ParallaxImage src="/imagini/Locatie-Interior.png" alt="Interior TopBarberShop" className="relative h-[360px] overflow-hidden rounded-3xl border border-border/60" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Galerie"
          title={gallerySection?.title ?? "TODO: Titlu galerie"}
          description={gallerySection?.subtitle ?? "TODO: descriere galerie"}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((image) => (
            <FadeIn key={image.id} className="relative h-48 overflow-hidden rounded-2xl border border-border/60">
              <Image src={image.src} alt={image.title ?? "Galerie"} fill className="object-cover" />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Testimoniale"
          title={testimonialsSection?.title ?? "TODO: Titlu testimoniale"}
          description={testimonialsSection?.subtitle ?? "TODO: descriere testimoniale"}
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <FadeIn key={item.id} className="rounded-2xl border border-border/60 bg-card p-6">
              <p className="text-sm text-muted-foreground">"{item.text}"</p>
              <p className="mt-4 font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">{Array.from({ length: item.rating }).map(() => "★").join("")}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="FAQ"
          title={faqSection?.title ?? "TODO: Titlu FAQ"}
          description={faqSection?.subtitle ?? "TODO: descriere FAQ"}
        />
        <div className="mt-8 grid gap-4">
          {faqs.map((faq) => (
            <FadeIn key={faq.id} className="rounded-2xl border border-border/60 bg-card p-6">
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/40 blur-3xl" />
          <SectionHeading
            eyebrow="Rezerva acum"
            title={ctaSection?.title ?? "TODO: Titlu CTA"}
            description={ctaSection?.subtitle ?? "TODO: descriere CTA"}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={ctaSection?.ctaHref ?? "/booking"}>
                {ctaSection?.ctaText ?? "Programeaza-te"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services">Vezi serviciile</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title={contactSection?.title ?? "TODO: Titlu contact"}
          description={contactSection?.subtitle ?? "TODO: descriere contact"}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-3xl border border-border/60">
            <iframe
              title="Harta TopBarberShop"
              src="https://maps.google.com/maps?q=Ialoveni&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-72 w-full border-0"
              loading="lazy"
            />
          </div>
          <div className="rounded-3xl border border-border/60 bg-card p-6 text-sm">
            <p className="font-semibold">Adresa</p>
            <p className="text-muted-foreground">
              {settings?.address ?? "TODO: adresa completa"}
            </p>
            <p className="mt-4 font-semibold">Program</p>
            <p className="text-muted-foreground">{formatWorkingHours(settings?.workingHours)}</p>
            <p className="mt-4 font-semibold">Contact</p>
            <p className="text-muted-foreground">{settings?.phone ?? "TODO: telefon"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
