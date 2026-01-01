import SectionHeading from "@/components/site/section-heading";
import ContactForm from "@/components/site/contact-form";
import { formatWorkingHours, getPageSEO, getPageSections, getSiteSettings } from "@/lib/site";
import { Button } from "@/components/ui/button";

export async function generateMetadata() {
  const seo = await getPageSEO("contact");
  return {
    title: seo?.title ?? "Contact",
    description: seo?.description ?? "Contact TopBarberShop.",
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const sections = await getPageSections("contact");
  const hero = sections.find((section) => section.sectionKey === "hero");
  const socials = (settings?.socials as { platform: string; url: string }[] | undefined) ?? [];
  const instagram = socials.find((item) => item.platform?.toLowerCase() === "instagram");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Contact"
        title={hero?.title ?? "TODO: Titlu contact"}
        description={hero?.subtitle ?? "TODO: descriere contact"}
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <ContactForm />
        <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-6 text-sm">
          <div>
            <p className="font-semibold">Adresa</p>
            <p className="text-muted-foreground">{settings?.address ?? "TODO: adresa completa"}</p>
          </div>
          <div>
            <p className="font-semibold">Telefon</p>
            <p className="text-muted-foreground">{settings?.phone ?? "TODO: telefon"}</p>
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-muted-foreground">{settings?.email ?? "TODO: email"}</p>
          </div>
          <div>
            <p className="font-semibold">Program</p>
            <p className="text-muted-foreground">{formatWorkingHours(settings?.workingHours)}</p>
          </div>
          <div>
            <p className="font-semibold">Social</p>
            {instagram ? (
              <a href={instagram.url} className="text-muted-foreground">
                Instagram
              </a>
            ) : (
              <span className="text-muted-foreground">TODO: social links</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {settings?.phone ? (
              <Button asChild size="sm" variant="outline">
                <a href={`tel:${settings.phone}`}>Suna acum</a>
              </Button>
            ) : null}
            {instagram ? (
              <Button asChild size="sm" variant="outline">
                <a href={instagram.url}>Instagram</a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
