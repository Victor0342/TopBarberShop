"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Scissors, Users, ImageSquare, Quotes, Question, Gear, CalendarCheck, Note, ClipboardText } from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: Gauge },
  { href: "/admin/bookings", label: "Programari", icon: CalendarCheck },
  { href: "/admin/schedule", label: "Program special", icon: CalendarCheck },
  { href: "/admin/services", label: "Servicii", icon: Scissors },
  { href: "/admin/team", label: "Echipa", icon: Users },
  { href: "/admin/gallery", label: "Galerie", icon: ImageSquare },
  { href: "/admin/testimonials", label: "Testimoniale", icon: Quotes },
  { href: "/admin/faqs", label: "FAQ", icon: Question },
  { href: "/admin/pages", label: "Pagini & sectiuni", icon: Note },
  { href: "/admin/seo", label: "SEO", icon: ClipboardText },
  { href: "/admin/media", label: "Media", icon: ImageSquare },
  { href: "/admin/settings", label: "Setari site", icon: Gear },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/50 bg-card/80 px-4 py-6 backdrop-blur md:sticky md:top-0 md:h-screen">
      <div className="mb-8 flex items-center justify-between md:block">
        <Link href="/admin" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Gauge weight="bold" className="size-4" />
          </span>
          Admin
        </Link>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Meniu admin">
                <Gauge weight="bold" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-6">
              <SheetHeader className="border-b border-border/60">
                <SheetTitle className="text-lg">Meniu admin</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-4">
                {links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <nav className="hidden flex-col gap-2 md:flex">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
