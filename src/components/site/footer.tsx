import Link from "next/link";
import { InstagramLogo, PhoneCall } from "@phosphor-icons/react/dist/ssr";
import { getSiteSettings } from "@/lib/site";

export default async function Footer() {
  const settings = await getSiteSettings();
  const phone = settings?.phone ?? "TODO: telefon";
  const socials = (settings?.socials as { platform: string; url: string }[] | undefined) ?? [];
  const instagram = socials.find((item) => item.platform?.toLowerCase() === "instagram");

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="text-lg font-semibold">{settings?.brandName ?? "TopBarberShop"}</div>
          <p className="text-sm text-muted-foreground">
            {settings?.brandTagline ?? "TODO: tagline premium"}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">Contact</p>
          <p>{settings?.address ?? "TODO: adresa completa"}</p>
          <p>{settings?.city ?? "TODO: oras"}</p>
          <a href={`tel:${phone}`} className="flex items-center gap-2">
            <PhoneCall />
            {phone}
          </a>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">Link-uri rapide</p>
          <div className="flex flex-col gap-2">
            <Link href="/services">Servicii</Link>
            <Link href="/booking">Programare</Link>
            <Link href="/about">Despre noi</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} TopBarberShop. Toate drepturile rezervate.</span>
          <div className="flex items-center gap-4">
            {instagram ? (
              <a href={instagram.url} className="flex items-center gap-1">
                <InstagramLogo />
                Instagram
              </a>
            ) : null}
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Termeni</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
