import { prisma } from "@/lib/db";
import { createOverride, deleteOverride } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AdminSchedulePage() {
  const overrides = await prisma.scheduleOverride.findMany({ orderBy: { date: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Program special</h1>
      <form action={createOverride} className="grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
        <Input name="date" type="date" required />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isClosed" className="h-4 w-4" />
          Zi libera
        </label>
        <Input name="openTime" type="time" placeholder="Deschidere" />
        <Input name="closeTime" type="time" placeholder="Inchidere" />
        <Button type="submit" className="md:col-span-2">Adauga</Button>
      </form>

      <div className="space-y-3">
        {overrides.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 text-sm">
            <div>
              <p>{item.date.toLocaleDateString("ro-RO")}</p>
              <p className="text-muted-foreground">
                {item.isClosed ? "Zi libera" : `${item.openTime ?? "TODO"} - ${item.closeTime ?? "TODO"}`}
              </p>
            </div>
            <form action={deleteOverride}>
              <input type="hidden" name="id" value={item.id} />
              <Button type="submit" variant="destructive" size="sm">Sterge</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
