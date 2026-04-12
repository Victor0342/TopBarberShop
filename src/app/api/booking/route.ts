import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { bookingSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { addMinutes, set } from "date-fns";
import { generateSlots } from "@/lib/booking";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`booking:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json({ message: "Prea multe cereri. Incearca mai tarziu." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Date invalide." }, { status: 400 });
  }

  const { serviceId, barberId, date, time, clientName, phone, email, notes } = parsed.data;
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ message: "Ora invalida." }, { status: 400 });
  }
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ message: "Serviciul nu exista." }, { status: 404 });
  }
  if (barberId) {
    const barber = await prisma.teamMember.findUnique({ where: { id: barberId } });
    if (!barber) {
      return NextResponse.json({ message: "Barber invalid." }, { status: 404 });
    }
  }

  const [hours, minutes] = time.split(":").map(Number);
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    return NextResponse.json({ message: "Data invalida." }, { status: 400 });
  }
  const startsAt = set(dateObj, { hours, minutes, seconds: 0, milliseconds: 0 });
  const endsAt = addMinutes(startsAt, service.durationMin ?? 45);
  if (startsAt < new Date()) {
    return NextResponse.json({ message: "Data invalida." }, { status: 400 });
  }

  const dayStart = new Date(dateObj);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dateObj);
  dayEnd.setHours(23, 59, 59, 999);
  const dayLockKey = Number(date.replaceAll("-", ""));

  let booking;
  try {
    booking = await prisma.$transaction(
      async (tx) => {
        // Serialize bookings per day so concurrent requests cannot both reserve overlapping times.
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${dayLockKey})`;

        const [settings, overrides, bookings] = await Promise.all([
          tx.siteSettings.findFirst(),
          tx.scheduleOverride.findMany(),
          tx.booking.findMany({
            where: {
              startsAt: { gte: dayStart },
              endsAt: { lte: dayEnd },
              status: { not: "CANCELLED" },
            },
          }),
        ]);

        const availableSlots = generateSlots({
          date: dateObj,
          serviceDuration: service.durationMin ?? 45,
          bufferMinutes: 10,
          settings,
          overrides,
          bookings,
        });

        const isAvailable = availableSlots.some(
          (slot) => slot.startsAt.getTime() === startsAt.getTime(),
        );
        if (!isAvailable) {
          throw new Error("SLOT_UNAVAILABLE");
        }

        const existing = bookings.find(
          (item) => item.startsAt < endsAt && startsAt < item.endsAt,
        );
        if (existing) {
          throw new Error("SLOT_UNAVAILABLE");
        }

        return tx.booking.create({
          data: {
            clientName: sanitizeText(clientName),
            phone: sanitizeText(phone),
            email: email?.trim() || null,
            notes: notes?.trim() || null,
            serviceId,
            barberId: barberId || null,
            startsAt,
            endsAt,
            status: "PENDING",
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SLOT_UNAVAILABLE"
    ) {
      return NextResponse.json(
        { message: "Slot indisponibil. Alege alt interval." },
        { status: 409 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        { message: "Slotul a fost rezervat intre timp. Alege alt interval." },
        { status: 409 },
      );
    }

    throw error;
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  // TODO: Email client + admin (Resend/SMTP).

  return NextResponse.json({ id: booking.id });
}
