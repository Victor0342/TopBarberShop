"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { teamSchema } from "@/lib/validators";

export async function createTeamMember(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = teamSchema.safeParse(data);
  if (!parsed.success) return;

  await prisma.teamMember.create({
    data: {
      ...parsed.data,
      role: parsed.data.role || null,
      bio: parsed.data.bio || null,
      image: parsed.data.image || null,
      order: parsed.data.order ?? 0,
      active,
    },
  });

  revalidatePath("/admin/team");
}

export async function updateTeamMember(formData: FormData) {
  const id = String(formData.get("id"));
  const data = Object.fromEntries(formData.entries());
  const active = formData.get("active") === "on";
  const parsed = teamSchema.safeParse(data);
  if (!parsed.success || !id) return;

  await prisma.teamMember.update({
    where: { id },
    data: {
      ...parsed.data,
      role: parsed.data.role || null,
      bio: parsed.data.bio || null,
      image: parsed.data.image || null,
      order: parsed.data.order ?? 0,
      active,
    },
  });

  revalidatePath("/admin/team");
}

export async function deleteTeamMember(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.teamMember.delete({ where: { id } });

  revalidatePath("/admin/team");
}
