import SectionHeading from "@/components/site/section-heading";
import ServicesGrid from "@/components/site/services-grid";
import { getPageSEO, getPageSections, getServices } from "@/lib/site";

export async function generateMetadata() {
  const seo = await getPageSEO("services");
  return {
    title: seo?.title ?? "Servicii",
    description: seo?.description ?? "Servicii si preturi TopBarberShop.",
    openGraph: {
      title: seo?.title ?? "Servicii TopBarberShop",
      description: seo?.description ?? "Servicii si preturi premium.",
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
  };
}

export default async function ServicesPage() {
  const services = await getServices();
  const serviceCards = services.map((service) => ({
    id: service.id,
    title: service.title,
    slug: service.slug,
    description: service.description,
    image: service.image,
    price: service.price,
    priceNote: service.priceNote,
    category: service.category,
  }));
  const sections = await getPageSections("services");
  const hero = sections.find((section) => section.sectionKey === "hero");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Servicii"
        title={hero?.title ?? "TODO: Titlu servicii"}
        description={hero?.subtitle ?? "TODO: descriere servicii"}
      />
      <ServicesGrid services={serviceCards} />
    </div>
  );
}
