"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
type GalleryItem = {
  id: string;
  title: string | null;
  src: string;
  category: string | null;
};

export default function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const categories = ["Toate", ...Array.from(new Set(images.map((item) => item.category ?? "Altele")))];
  const [activeCategory, setActiveCategory] = useState("Toate");
  const visibleImages = images.filter((image) => {
    if (activeCategory === "Toate") return true;
    return (image.category ?? "Altele") === activeCategory;
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-1 text-sm ${
              activeCategory === category ? "bg-foreground text-background" : "border-border/60"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleImages.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(image)}
            className="group relative h-56 overflow-hidden rounded-2xl border border-border/60"
          >
            <Image src={image.src} alt={image.title ?? "Galerie"} fill className="object-cover transition duration-300 group-hover:scale-105" />
          </button>
        ))}
      </div>
      <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent shadow-none">
          {active ? (
            <div className="relative h-[480px] w-full overflow-hidden rounded-2xl">
              <Image src={active.src} alt={active.title ?? "Galerie"} fill className="object-cover" />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
