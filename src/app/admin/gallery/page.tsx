import { prisma } from "@/lib/db";
import { createGalleryImage, updateGalleryImage, deleteGalleryImage } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Galerie</h1>

      <form action={createGalleryImage} className="grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-semibold">Adauga imagine</h2>
        <Input name="src" placeholder="URL imagine" required />
        <Input name="title" placeholder="Titlu" />
        <Input name="category" placeholder="Categorie" />
        <Input name="order" type="number" placeholder="Ordine" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
          Activ
        </label>
        <Button type="submit" className="md:col-span-2">Adauga</Button>
      </form>

      <div className="space-y-4">
        {images.map((image) => (
          <div key={image.id} className="rounded-2xl border border-border/60 bg-card p-6">
            <form action={updateGalleryImage} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={image.id} />
              <Input name="src" defaultValue={image.src} placeholder="URL imagine" required />
              <Input name="title" defaultValue={image.title ?? ""} placeholder="Titlu" />
              <Input name="category" defaultValue={image.category ?? ""} placeholder="Categorie" />
              <Input name="order" type="number" defaultValue={image.order} placeholder="Ordine" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={image.active} className="h-4 w-4" />
                Activ
              </label>
              <div className="flex gap-3 md:col-span-2">
                <Button type="submit" variant="outline">Salveaza</Button>
                <Button formAction={deleteGalleryImage} name="id" value={image.id} type="submit" variant="destructive">
                  Sterge
                </Button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
