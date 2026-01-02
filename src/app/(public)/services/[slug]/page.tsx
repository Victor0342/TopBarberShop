import Link from "next/link";
import { notFound } from "next/navigation";
import SmartImage from "@/components/site/smart-image";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/site/section-heading";
import { formatPrice, getServiceBySlug, getPageSEO } from "@/lib/site";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const seo = await getPageSEO("services");
  const service = await getServiceBySlug(params.slug);
  return {
    title: service?.title ?? seo?.title ?? "Serviciu",
    description: service?.description ?? seo?.description ?? "Detalii serviciu TopBarberShop.",
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative h-[360px] overflow-hidden rounded-3xl border border-border/60">
          <SmartImage src={service.image} alt={service.title} fill className="object-cover" />
        </div>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Serviciu"
            title={service.title}
            description={service.description ?? "TODO: descriere serviciu"}
          />
          <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-4 text-sm">
            <div>
              <p className="font-semibold">Ce include</p>
              <p className="text-muted-foreground">{service.includes ?? "TODO: detalii incluse"}</p>
            </div>
            <div>
              <p className="font-semibold">Recomandari</p>
              <p className="text-muted-foreground">{service.recommendations ?? "TODO: recomandari"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="rounded-full border border-border/60 px-4 py-2">
              Durata: {service.durationMin ?? 45} min
            </div>
            <div className="rounded-full border border-border/60 px-4 py-2">
              Pret: {formatPrice(service.price, service.priceNote)}
            </div>
            <div className="rounded-full border border-border/60 px-4 py-2">
              Categoria: {service.category ?? "Standard"}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/booking?service=${service.slug}`}>Programeaza-te</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">Inapoi la servicii</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
