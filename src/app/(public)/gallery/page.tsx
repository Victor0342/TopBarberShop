import SectionHeading from "@/components/site/section-heading";
import GalleryGrid from "@/components/site/gallery-grid";
import { getGalleryImages, getPageSEO, getPageSections } from "@/lib/site";

export async function generateMetadata() {
  const seo = await getPageSEO("gallery");
  return {
    title: seo?.title ?? "Galerie",
    description: seo?.description ?? "Galerie foto TopBarberShop.",
  };
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const galleryItems = images.map((image) => ({
    id: image.id,
    title: image.title,
    src: image.src,
    category: image.category,
  }));
  const sections = await getPageSections("gallery");
  const hero = sections.find((section) => section.sectionKey === "hero");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Galerie"
        title={hero?.title ?? "TODO: Titlu galerie"}
        description={hero?.subtitle ?? "TODO: descriere galerie"}
      />
      <GalleryGrid images={galleryItems} />
    </div>
  );
}
