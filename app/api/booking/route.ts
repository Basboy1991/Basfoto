import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.write";

type Payload = {
  date: string;
  time: string;
  timezone?: string;

  shootType: string;
  package?: string;
  location?: string;

  name: string;
  email: string;
  phone?: string;

  message: string;
  consent?: boolean;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function maybeSendEmail(doc: any) {
  // Optioneel: Resend (werkt alleen als je RESEND_API_KEY zet)
  const key = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_EMAIL;

  if (!key || !to) return;

  // dynamische import zodat je geen dependency issues krijgt als je Resend niet gebruikt
  const { Resend } = await import("resend");
  const resend = new Resend(key);

  const subject = `Nieuwe boekingsaanvraag: ${doc.date} om ${doc.time}`;
  const text = [
    `Nieuwe boekingsaanvraag`,
    ``,
    `Datum: ${doc.date}`,
    `Tijd: ${doc.time}`,
    `Type: ${doc.shootType}`,
    doc.package ? `Pakket: ${doc.package}` : null,
    doc.location ? `Locatie: ${doc.location}` : null,
    ``,
    `Naam: ${doc.name}`,
    `Email: ${doc.email}`,
    doc.phone ? `Telefoon: ${doc.phone}` : null,
    ``,
    `Opmerkingen:`,
    doc.message,
    ``,
    `In Sanity: bookingRequest (${doc._id})`,
  ]
    .filter(Boolean)
    .join("\n");

  await resend.emails.send({
    from: "Bas-fotografie <onboarding@resend.dev>",
    to,
    subject,
    text,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    // basis validatie
    if (!body.date || !body.time) {
      return NextResponse.json({ error: "Kies eerst een datum en tijd." }, { status: 400 });
    }
    if (!body.shootType) {
      return NextResponse.json({ error: "Kies een type shoot." }, { status: 400 });
    }
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Naam is verplicht." }, { status: 400 });
    }
    if (!body.email?.trim() || !isEmail(body.email)) {
      return NextResponse.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ error: "Opmerkingen zijn verplicht." }, { status: 400 });
    }

    // Sanity write token check
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "SANITY_API_WRITE_TOKEN ontbreekt (kan niet opslaan)." },
        { status: 500 }
      );
    }

    const doc = {
      _type: "bookingRequest",
      createdAt: new Date().toISOString(),
      status: "nieuw",

      date: body.date,
      time: body.time,
      timezone: body.timezone ?? "Europe/Amsterdam",

      shootType: body.shootType,
      package: body.package ?? "",
      location: body.location ?? "",

      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() ?? "",

      message: body.message.trim(),
      consent: body.consent ?? true,
    };

    const created = await sanityWriteClient.create(doc);

    // optioneel mailen
    await maybeSendEmail(created);

    return NextResponse.json({ ok: true, id: created._id });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server fout bij versturen.", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}