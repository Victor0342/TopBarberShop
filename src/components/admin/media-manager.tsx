"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
type MediaItem = {
  id: string;
  src: string;
  alt: string | null;
  title: string | null;
};

export default function MediaManager({
  initialAssets,
}: {
  initialAssets: MediaItem[];
}) {
  const [assets, setAssets] = useState(initialAssets);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/media/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (data.asset) {
      setAssets((prev) => [data.asset, ...prev]);
    }
    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <input type="file" accept="image/*" onChange={handleUpload} />
        {isUploading ? <span className="text-sm text-muted-foreground">Upload...</span> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.id} className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="relative h-40 overflow-hidden rounded-xl">
              <Image src={asset.src} alt={asset.alt ?? "Media"} fill className="object-cover" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{asset.src}</p>
            <Button
              variant="destructive"
              size="sm"
              className="mt-3"
              onClick={async () => {
                await fetch("/api/media/delete", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: asset.id }),
                });
                setAssets((prev) => prev.filter((item) => item.id !== asset.id));
              }}
            >
              Sterge
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
