import { prisma } from "@/lib/db";
import { updatePageSeo } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminSeoPage() {
  const seo = await prisma.pageSEO.findMany({ orderBy: { pageKey: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">SEO</h1>
      <div className="space-y-4">
        {seo.map((item) => (
          <form key={item.id} action={updatePageSeo} className="rounded-2xl border border-border/60 bg-card p-6">
            <input type="hidden" name="pageKey" value={item.pageKey} />
            <p className="text-sm font-semibold">{item.pageKey}</p>
            <div className="mt-3 grid gap-3">
              <Input name="title" defaultValue={item.title ?? ""} placeholder="Titlu" />
              <Textarea name="description" defaultValue={item.description ?? ""} placeholder="Descriere" />
              <Input name="ogImage" defaultValue={item.ogImage ?? ""} placeholder="OG Image URL" />
            </div>
            <Button type="submit" variant="outline" className="mt-4">Salveaza</Button>
          </form>
        ))}
      </div>
    </div>
  );
}
