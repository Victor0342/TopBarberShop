import { prisma } from "@/lib/db";
import MediaManager from "@/components/admin/media-manager";

export default async function AdminMediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
  const initialAssets = assets.map((asset) => ({
    id: asset.id,
    src: asset.src,
    alt: asset.alt,
    title: asset.title,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Media Manager</h1>
      <MediaManager initialAssets={initialAssets} />
    </div>
  );
}
