import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

  const settings = await prisma.siteSettings.findFirst();
  const overrides = await prisma.scheduleOverride.findMany();
  const dayStart = new Date(dateObj);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dateObj);
  dayEnd.setHours(23, 59, 59, 999);
  const bookings = await prisma.booking.findMany({
    where: {
      startsAt: { gte: dayStart },
      endsAt: { lte: dayEnd },
      status: { not: "CANCELLED" },
    },
  });

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
    return NextResponse.json({ message: "Slot indisponibil." }, { status: 409 });
  }

  const existing = await prisma.booking.findFirst({
    where: {
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
      status: { not: "CANCELLED" },
    },
  });

  if (existing) {
    return NextResponse.json({ message: "Slot indisponibil. Alege alt interval." }, { status: 409 });
  }

  const booking = await prisma.booking.create({
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

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  // TODO: Email client + admin (Resend/SMTP).

  return NextResponse.json({ id: booking.id });
}
