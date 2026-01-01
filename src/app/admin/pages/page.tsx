import { prisma } from "@/lib/db";
import { updatePageSection } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminPagesPage() {
  const sections = await prisma.pageSection.findMany({ orderBy: { pageKey: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Pagini & sectiuni</h1>
      <div className="space-y-4">
        {sections.map((section) => (
          <form key={section.id} action={updatePageSection} className="rounded-2xl border border-border/60 bg-card p-6">
            <input type="hidden" name="id" value={section.id} />
            <p className="text-sm font-semibold">
              {section.pageKey} / {section.sectionKey}
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Input name="title" defaultValue={section.title ?? ""} placeholder="Titlu" />
              <Input name="subtitle" defaultValue={section.subtitle ?? ""} placeholder="Subtitlu" />
              <Textarea name="body" defaultValue={section.body ?? ""} placeholder="Body" className="md:col-span-2" />
              <Input name="ctaText" defaultValue={section.ctaText ?? ""} placeholder="CTA text" />
              <Input name="ctaHref" defaultValue={section.ctaHref ?? ""} placeholder="CTA href" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={section.active} className="h-4 w-4" />
                Activ
              </label>
              <Textarea
                name="data"
                defaultValue={section.data ? JSON.stringify(section.data, null, 2) : ""}
                placeholder="Data JSON (ex: highlights)"
                className="md:col-span-2"
              />
            </div>
            <Button type="submit" variant="outline" className="mt-4">Salveaza</Button>
          </form>
        ))}
      </div>
    </div>
  );
}
