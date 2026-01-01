import { prisma } from "@/lib/db";
import { createFaq, updateFaq, deleteFaq } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">FAQ</h1>

      <form action={createFaq} className="grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-semibold">Adauga FAQ</h2>
        <Input name="question" placeholder="Intrebare" required />
        <Input name="answer" placeholder="Raspuns" required />
        <Input name="order" type="number" placeholder="Ordine" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
          Activ
        </label>
        <Button type="submit" className="md:col-span-2">Adauga</Button>
      </form>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="rounded-2xl border border-border/60 bg-card p-6">
            <form action={updateFaq} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={faq.id} />
              <Input name="question" defaultValue={faq.question} placeholder="Intrebare" required />
              <Input name="answer" defaultValue={faq.answer} placeholder="Raspuns" required />
              <Input name="order" type="number" defaultValue={faq.order} placeholder="Ordine" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={faq.active} className="h-4 w-4" />
                Activ
              </label>
              <div className="flex gap-3 md:col-span-2">
                <Button type="submit" variant="outline">Salveaza</Button>
                <Button formAction={deleteFaq} name="id" value={faq.id} type="submit" variant="destructive">
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
