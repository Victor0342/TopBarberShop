import Link from "next/link";
import { notFound } from "next/navigation";
import SmartImage from "@/components/site/smart-image";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/site/section-heading";
import { formatPrice, getServiceBySlug, getPageSEO, resolveServiceDetailContent, resolveServiceImage } from "@/lib/site";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const seo = await getPageSEO("services");
  const service = await getServiceBySlug(slug);
  const serviceImage = service ? resolveServiceImage(service.title, service.image, service.id) : null;
  return {
    title: service?.title ?? seo?.title ?? "Serviciu",
    description: service?.description ?? seo?.description ?? "Detalii serviciu TopBarberShop.",
    openGraph: {
      images: serviceImage ? [serviceImage] : seo?.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    notFound();
  }
  const serviceImage = resolveServiceImage(service.title, service.image, service.id);
  const serviceContent = resolveServiceDetailContent(
    service.title,
    service.description,
    service.includes,
    service.recommendations,
  );

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border/60 bg-white/88">
          <div className="absolute inset-0 scale-110 opacity-35 blur-2xl">
            <SmartImage
              src={serviceImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/8 to-white/28" />
          <SmartImage
            src={serviceImage}
            alt={service.title}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain p-4"
          />
        </div>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Serviciu"
            title={service.title}
            description={serviceContent.description}
          />
          <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-4 text-sm">
            <div>
              <p className="font-semibold">Ce include</p>
              <p className="text-muted-foreground">{serviceContent.includes}</p>
            </div>
            <div>
              <p className="font-semibold">Recomandari</p>
              <p className="text-muted-foreground">{serviceContent.recommendations}</p>
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
