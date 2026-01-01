"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function updateBookingStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!id || !status) return;
  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/bookings");
}

export async function deleteBooking(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.booking.delete({ where: { id } });

  revalidatePath("/admin/bookings");
}
