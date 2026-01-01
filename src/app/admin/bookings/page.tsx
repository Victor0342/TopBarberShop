import { prisma } from "@/lib/db";
import { updateBookingStatus, deleteBooking } from "./actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { service: true, barber: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Programari</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-2xl border border-border/60 bg-card p-6 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{booking.clientName}</p>
                <p className="text-muted-foreground">
                  {booking.service.title} • {booking.startsAt.toLocaleDateString("ro-RO")} •{" "}
                  {booking.startsAt.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <form action={updateBookingStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={booking.id} />
                <Select name="status" defaultValue={booking.status}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" size="sm" variant="outline">Actualizeaza</Button>
              </form>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span>Telefon: {booking.phone}</span>
              {booking.email ? <span>Email: {booking.email}</span> : null}
              {booking.barber ? <span>Barber: {booking.barber.name}</span> : null}
            </div>
            <form action={deleteBooking} className="mt-4">
              <input type="hidden" name="id" value={booking.id} />
              <Button type="submit" variant="destructive" size="sm">Sterge</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
