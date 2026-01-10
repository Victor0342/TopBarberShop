import Image from "next/image";
import SectionHeading from "@/components/site/section-heading";
import { getPageSEO, getPageSections, getTeamMembers } from "@/lib/site";

export async function generateMetadata() {
  const seo = await getPageSEO("about");
  return {
    title: seo?.title ?? "Despre noi",
    description: seo?.description ?? "Povestea TopBarberShop.",
  };
}

export default async function AboutPage() {
  const sections = await getPageSections("about");
  const aboutSection = sections.find((section) => section.sectionKey === "story");
  const team = await getTeamMembers();
  const values = (aboutSection?.data as { title: string; description: string }[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Despre"
        title={aboutSection?.title ?? "Despre TopBarberShop"}
        description={aboutSection?.subtitle ?? "TODO: povestea brandului"}
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>{aboutSection?.body ?? "TODO: Descriere detaliata despre brand, valori si misiune."}</p>
          {values.length ? (
            <div className="grid gap-3">
              {values.map((item) => (
                <div key={item.title}>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>TODO: valori brand.</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative h-48 overflow-hidden rounded-2xl border border-border/60">
            <Image src="/uploads/" alt="Interior" fill className="object-cover" />
          </div>
          <div className="relative h-48 overflow-hidden rounded-2xl border border-border/60">
            <Image src="/uploads/" alt="Exterior" fill className="object-cover" />
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <SectionHeading eyebrow="Echipa" title="Barberi dedicati" description="O echipa cu experienta si stil." />
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <div key={member.id} className="rounded-2xl border border-border/60 bg-card p-6 text-center">
              <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                <Image src={member.image ?? "/uploads/"} alt={member.name} fill className="object-cover" />
              </div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role ?? "TODO: rol barber"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
