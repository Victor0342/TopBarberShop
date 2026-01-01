import { prisma } from "@/lib/db";

export default async function AdminOverviewPage() {
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0));
  const end = new Date(today.setHours(23, 59, 59, 999));

  const [todayBookings, pendingBookings, totalServices] = await Promise.all([
    prisma.booking.count({ where: { startsAt: { gte: start, lte: end } } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.service.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <p className="text-sm text-muted-foreground">Programari azi</p>
          <p className="mt-2 text-3xl font-semibold">{todayBookings}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <p className="text-sm text-muted-foreground">Programari in asteptare</p>
          <p className="mt-2 text-3xl font-semibold">{pendingBookings}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <p className="text-sm text-muted-foreground">Servicii active</p>
          <p className="mt-2 text-3xl font-semibold">{totalServices}</p>
        </div>
      </div>
    </div>
  );
}
