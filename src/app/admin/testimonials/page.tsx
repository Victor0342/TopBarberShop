import { prisma } from "@/lib/db";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Testimoniale</h1>

      <form action={createTestimonial} className="grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-semibold">Adauga testimonial</h2>
        <Input name="name" placeholder="Nume" required />
        <Input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)" />
        <Input name="order" type="number" placeholder="Ordine" />
        <Input name="text" placeholder="Testimonial" className="md:col-span-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
          Activ
        </label>
        <Button type="submit" className="md:col-span-2">Adauga</Button>
      </form>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="rounded-2xl border border-border/60 bg-card p-6">
            <form action={updateTestimonial} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={testimonial.id} />
              <Input name="name" defaultValue={testimonial.name} placeholder="Nume" required />
              <Input name="rating" type="number" min="1" max="5" defaultValue={testimonial.rating} />
              <Input name="order" type="number" defaultValue={testimonial.order} />
              <Input name="text" defaultValue={testimonial.text} placeholder="Testimonial" className="md:col-span-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={testimonial.active} className="h-4 w-4" />
                Activ
              </label>
              <div className="flex gap-3 md:col-span-2">
                <Button type="submit" variant="outline">Salveaza</Button>
                <Button formAction={deleteTestimonial} name="id" value={testimonial.id} type="submit" variant="destructive">
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
