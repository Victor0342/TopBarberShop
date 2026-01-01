"use server";

import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function updateBookingStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = formData.get("status");
  if (!id || typeof status !== "string") return;
  if (!Object.values(BookingStatus).includes(status as BookingStatus)) return;
  await prisma.booking.update({
    where: { id },
    data: { status: status as BookingStatus },
  });

  revalidatePath("/admin/bookings");
}

export async function deleteBooking(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.booking.delete({ where: { id } });

  revalidatePath("/admin/bookings");
}
