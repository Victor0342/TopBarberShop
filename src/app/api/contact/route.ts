import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validators";
import { sanitizeText } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json({ message: "Prea multe cereri. Incearca mai tarziu." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Date invalide." }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: sanitizeText(name),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      message: sanitizeText(message),
    },
  });

  // TODO: trimite notificare email catre admin.
  return NextResponse.json({ ok: true });
}
