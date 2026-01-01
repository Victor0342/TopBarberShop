import SectionHeading from "@/components/site/section-heading";
import BookingForm from "@/components/site/booking-form";
import { getPageSEO, getPageSections, getServices, getTeamMembers } from "@/lib/site";

export async function generateMetadata() {
  const seo = await getPageSEO("booking");
  return {
    title: seo?.title ?? "Programare",
    description: seo?.description ?? "Rezerva un slot rapid.",
  };
}

export default async function BookingPage() {
  const services = await getServices();
  const team = await getTeamMembers();
  const serviceOptions = services.map((service) => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
  }));
  const teamOptions = team.map((member) => ({
    id: member.id,
    name: member.name,
  }));
  const sections = await getPageSections("booking");
  const hero = sections.find((section) => section.sectionKey === "hero");

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Programare"
        title={hero?.title ?? "TODO: Titlu programare"}
        description={hero?.subtitle ?? "TODO: descriere programare"}
      />
      <BookingForm services={serviceOptions} team={teamOptions} />
    </div>
  );
}
