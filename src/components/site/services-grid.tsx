"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice, resolveImageSrc } from "@/lib/site";
type ServiceCard = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  price: number | null;
  priceNote: string | null;
  category: string | null;
};

export default function ServicesGrid({ services }: { services: ServiceCard[] }) {
  const categories = useMemo(
    () => ["Toate", ...Array.from(new Set(services.map((service) => service.category ?? "Altele")))],
    [services],
  );
  const [activeCategory, setActiveCategory] = useState("Toate");

  const visibleServices = services.filter((service) => {
    if (activeCategory === "Toate") return true;
    return (service.category ?? "Altele") === activeCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={cn("rounded-full")}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleServices.map((service) => (
          <div key={service.id} className="flex h-full flex-col rounded-2xl border border-border/60 bg-card p-6">
            <div className="relative mb-4 h-36 overflow-hidden rounded-xl">
              <Image src={resolveImageSrc(service.image)} alt={service.title} fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{service.description ?? "TODO: descriere serviciu"}</p>
            <div className="mt-4 flex items-center justify-between text-sm font-semibold">
              <span>{formatPrice(service.price, service.priceNote)}</span>
              <Link href={`/services/${service.slug}`} className="text-muted-foreground hover:text-foreground">
                Detalii
              </Link>
            </div>
            <Button asChild className="mt-4">
              <Link href={`/booking?service=${service.slug}`}>Programeaza-te</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
