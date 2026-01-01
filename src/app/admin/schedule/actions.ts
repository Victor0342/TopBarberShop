"use server";

import { prisma } from "@/lib/db";

export async function createOverride(formData: FormData) {
  const date = String(formData.get("date"));
  if (!date) return;
  const isClosed = Boolean(formData.get("isClosed"));
  const openTime = String(formData.get("openTime") ?? "");
  const closeTime = String(formData.get("closeTime") ?? "");

  await prisma.scheduleOverride.create({
    data: {
      date: new Date(date),
      isClosed,
      openTime: openTime || null,
      closeTime: closeTime || null,
    },
  });
}

export async function deleteOverride(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.scheduleOverride.delete({ where: { id } });
}
