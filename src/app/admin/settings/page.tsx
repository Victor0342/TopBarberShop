import { prisma } from "@/lib/db";
import { updateSiteSettings } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Setari site</h1>
      <form action={updateSiteSettings} className="grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
        <Input name="brandName" defaultValue={settings?.brandName ?? ""} placeholder="Brand name" required />
        <Input name="brandTagline" defaultValue={settings?.brandTagline ?? ""} placeholder="Tagline" />
        <Input name="phone" defaultValue={settings?.phone ?? ""} placeholder="Telefon" />
        <Input name="email" defaultValue={settings?.email ?? ""} placeholder="Email" />
        <Input name="address" defaultValue={settings?.address ?? ""} placeholder="Adresa" />
        <Input name="city" defaultValue={settings?.city ?? ""} placeholder="Oras" />
        <Input name="language" defaultValue={settings?.language ?? ""} placeholder="Limba (ex: ro)" />
        <Input name="heroTitle" defaultValue={settings?.heroTitle ?? ""} placeholder="Hero title" />
        <Textarea name="heroSubtitle" defaultValue={settings?.heroSubtitle ?? ""} placeholder="Hero subtitle" className="md:col-span-2" />
        <Input name="heroCtaPrimary" defaultValue={settings?.heroCtaPrimary ?? ""} placeholder="CTA primar" />
        <Input name="heroCtaSecondary" defaultValue={settings?.heroCtaSecondary ?? ""} placeholder="CTA secundar" />
        <Input name="heroCtaSecondaryHref" defaultValue={settings?.heroCtaSecondaryHref ?? ""} placeholder="CTA href" />
        <Textarea
          name="workingHours"
          defaultValue={settings?.workingHours ? JSON.stringify(settings.workingHours, null, 2) : ""}
          placeholder='Working hours JSON ex: [{"day":1,"open":"10:00","close":"19:00"}]'
          className="md:col-span-2"
        />
        <Textarea
          name="socials"
          defaultValue={settings?.socials ? JSON.stringify(settings.socials, null, 2) : ""}
          placeholder='Socials JSON ex: [{"platform":"Instagram","url":"https://..."}]'
          className="md:col-span-2"
        />
        <Button type="submit" className="md:col-span-2">Salveaza</Button>
      </form>
    </div>
  );
}
