import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/site/section-heading";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const bookingId = searchParams.id;
  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { service: true, barber: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 pb-24 pt-16">
      <SectionHeading
        eyebrow="Confirmare"
        title="Programarea ta a fost inregistrata"
        description="Vei primi un SMS sau email de confirmare."
      />
      <div className="rounded-3xl border border-border/60 bg-card p-6 text-sm">
        {booking ? (
          <div className="space-y-2">
            <p><strong>Serviciu:</strong> {booking.service.title}</p>
            <p><strong>Data:</strong> {booking.startsAt.toLocaleDateString("ro-RO")}</p>
            <p><strong>Ora:</strong> {booking.startsAt.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</p>
            <p><strong>Client:</strong> {booking.clientName}</p>
            <p><strong>Status:</strong> {booking.status}</p>
          </div>
        ) : (
          <p>TODO: Nu am gasit rezervarea. Verifica inbox-ul pentru detalii.</p>
        )}
      </div>
      <Button asChild>
        <Link href="/">Inapoi acasa</Link>
      </Button>
    </div>
  );
}
