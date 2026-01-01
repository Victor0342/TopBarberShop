"use client";

import Link from "next/link";
import { List, PhoneCall } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { SiteSettings } from "@prisma/client";

const navLinks = [
  { href: "/", label: "Acasa" },
  { href: "/services", label: "Servicii" },
  { href: "/booking", label: "Programare" },
  { href: "/about", label: "Despre" },
  { href: "/gallery", label: "Galerie" },
  { href: "/contact", label: "Contact" },
];

export default function HeaderClient({ settings }: { settings: SiteSettings | null }) {
  const phone = settings?.phone ?? "TODO: telefon";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="text-lg">{settings?.brandName ?? "TopBarberShop"}</span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-muted-foreground md:inline">
            {settings?.brandTagline ?? "Barber Studio"}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="outline" className="gap-2">
            <a href={`tel:${phone}`}>
              <PhoneCall weight="bold" />
              Suna acum
            </a>
          </Button>
          <Button asChild>
            <Link href="/booking">Programeaza-te</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Deschide meniul">
                <List weight="bold" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6 pt-12">
              <div className="text-lg font-semibold">{settings?.brandName ?? "TopBarberShop"}</div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-base">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Button asChild className="mt-auto">
                <Link href="/booking">Programeaza-te</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
