import { addMinutes, isSameDay, set } from "date-fns";
import type { Booking, ScheduleOverride, SiteSettings } from "@prisma/client";

type WorkingHours = { day: number; open: string; close: string; breaks?: { start: string; end: string }[] };

const parseTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
};

const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => {
  return aStart < bEnd && bStart < aEnd;
};

export const getWorkingHoursForDate = (
  date: Date,
  settings: SiteSettings | null,
  overrides: ScheduleOverride[],
) => {
  const override = overrides.find((item) => isSameDay(item.date, date));
  if (override?.isClosed) {
    return null;
  }

  if (override?.openTime && override?.closeTime) {
    return { open: override.openTime, close: override.closeTime, breaks: [] };
  }

  const hours = settings?.workingHours as WorkingHours[] | undefined;
  if (!hours?.length) return null;

  const weekday = date.getDay();
  const day = weekday === 0 ? 7 : weekday;
  const config = hours.find((item) => item.day === day);
  if (!config) return null;

  return { open: config.open, close: config.close, breaks: config.breaks ?? [] };
};

export const generateSlots = ({
  date,
  serviceDuration,
  bufferMinutes,
  settings,
  overrides,
  bookings,
}: {
  date: Date;
  serviceDuration: number;
  bufferMinutes: number;
  settings: SiteSettings | null;
  overrides: ScheduleOverride[];
  bookings: Booking[];
}) => {
  const hours = getWorkingHoursForDate(date, settings, overrides);
  if (!hours) return [];

  const start = parseTime(date, hours.open);
  const end = parseTime(date, hours.close);
  const step = serviceDuration + bufferMinutes;

  const slots: { startsAt: Date; endsAt: Date }[] = [];
  let cursor = start;

  while (addMinutes(cursor, serviceDuration) <= end) {
    const slotStart = cursor;
    const slotEnd = addMinutes(cursor, serviceDuration);

    const inBreak = hours.breaks?.some((brk) => {
      const breakStart = parseTime(date, brk.start);
      const breakEnd = parseTime(date, brk.end);
      return overlaps(slotStart, slotEnd, breakStart, breakEnd);
    });

    const isBooked = bookings.some((booking) =>
      overlaps(slotStart, slotEnd, booking.startsAt, booking.endsAt),
    );

    if (!inBreak && !isBooked) {
      slots.push({ startsAt: slotStart, endsAt: slotEnd });
    }

    cursor = addMinutes(cursor, step);
  }

  return slots;
};
