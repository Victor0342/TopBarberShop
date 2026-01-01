import { prisma } from "@/lib/db";
import { createService, updateService, deleteService } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Servicii</h1>

      <form action={createService} className="grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-semibold">Adauga serviciu</h2>
        <Input name="title" placeholder="Titlu" required />
        <Input name="slug" placeholder="Slug (optional)" />
        <Input name="price" type="number" placeholder="Pret (Lei)" />
        <Input name="priceNote" placeholder="Nota pret (ex: TODO)" />
        <Input name="durationMin" type="number" placeholder="Durata (min)" />
        <Input name="category" placeholder="Categorie" />
        <Input name="image" placeholder="Imagine (URL)" />
        <Input name="order" type="number" placeholder="Ordine" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" className="h-4 w-4" />
          Featured
        </label>
        <Textarea name="description" placeholder="Descriere" className="md:col-span-2" />
        <Textarea name="includes" placeholder="Ce include" className="md:col-span-2" />
        <Textarea name="recommendations" placeholder="Recomandari" className="md:col-span-2" />
        <Button type="submit" className="md:col-span-2">Adauga</Button>
      </form>

      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-border/60 bg-card p-6">
            <form action={updateService} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={service.id} />
              <Input name="title" defaultValue={service.title} placeholder="Titlu" required />
              <Input name="slug" defaultValue={service.slug} placeholder="Slug" />
              <Input name="price" type="number" defaultValue={service.price ?? ""} placeholder="Pret" />
              <Input name="priceNote" defaultValue={service.priceNote ?? ""} placeholder="Nota pret" />
              <Input name="durationMin" type="number" defaultValue={service.durationMin ?? ""} placeholder="Durata" />
              <Input name="category" defaultValue={service.category ?? ""} placeholder="Categorie" />
              <Input name="image" defaultValue={service.image ?? ""} placeholder="Imagine (URL)" />
              <Input name="order" type="number" defaultValue={service.order} placeholder="Ordine" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isFeatured" defaultChecked={service.isFeatured} className="h-4 w-4" />
                Featured
              </label>
              <Textarea name="description" defaultValue={service.description ?? ""} placeholder="Descriere" className="md:col-span-2" />
              <Textarea name="includes" defaultValue={service.includes ?? ""} placeholder="Ce include" className="md:col-span-2" />
              <Textarea name="recommendations" defaultValue={service.recommendations ?? ""} placeholder="Recomandari" className="md:col-span-2" />
              <div className="flex gap-3 md:col-span-2">
                <Button type="submit" variant="outline">Salveaza</Button>
                <Button formAction={deleteService} name="id" value={service.id} type="submit" variant="destructive">
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
