import SectionHeading from "@/components/site/section-heading";
import { getPageSEO } from "@/lib/site";

export async function generateMetadata() {
  const seo = await getPageSEO("terms");
  return {
    title: seo?.title ?? "Termeni si conditii",
    description: seo?.description ?? "Termeni si conditii TopBarberShop.",
  };
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Legal"
        title="Termeni si conditii"
        description="TODO: completeaza termenii si conditiile."
      />
      <div className="rounded-3xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
        TODO: continut legal pentru termeni si conditii.
      </div>
    </div>
  );
}
