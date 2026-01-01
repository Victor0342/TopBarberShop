import SectionHeading from "@/components/site/section-heading";
import { getPageSEO } from "@/lib/site";

export async function generateMetadata() {
  const seo = await getPageSEO("privacy");
  return {
    title: seo?.title ?? "Politica de confidentialitate",
    description: seo?.description ?? "Politica de confidentialitate TopBarberShop.",
  };
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Legal"
        title="Politica de confidentialitate"
        description="TODO: completeaza politica de confidentialitate."
      />
      <div className="rounded-3xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
        TODO: continut legal pentru politica de confidentialitate.
      </div>
    </div>
  );
}
