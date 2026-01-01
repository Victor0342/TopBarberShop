import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlots } from "@/lib/booking";
import { format } from "date-fns";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`slots:${ip}`, { limit: 15, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json({ message: "Prea multe cereri." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");

  if (!date || !serviceId) {
    return NextResponse.json({ slots: [] });
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ slots: [] });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ slots: [] });
  }

  const settings = await prisma.siteSettings.findFirst();
  const overrides = await prisma.scheduleOverride.findMany();
  const startDay = new Date(parsedDate);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(parsedDate);
  endDay.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      startsAt: { gte: startDay },
      endsAt: { lte: endDay },
      status: { not: "CANCELLED" },
    },
  });

  const slots = generateSlots({
    date: parsedDate,
    serviceDuration: service.durationMin ?? 45,
    bufferMinutes: 10,
    settings,
    overrides,
    bookings,
  }).map((slot) => ({
    startsAt: format(slot.startsAt, "HH:mm"),
    endsAt: format(slot.endsAt, "HH:mm"),
  }));

  return NextResponse.json({ slots });
}
