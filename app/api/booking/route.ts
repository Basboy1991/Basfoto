// app/api/booking/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sanityWriteClient } from "@/lib/sanity.write";

type BookingPayload = {
  date: string;
  time: string;
  timezone: string;

  name: string;
  email: string;
  phone?: string;

  shootType?: string;
  location?: string;
  message?: string;

  preferredContact?: "whatsapp" | "email" | "phone";
  consent?: boolean;

  company?: string; // honeypot
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    // Honeypot
    if (body.company && String(body.company).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const date = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();
    const timezone = String(body.timezone ?? "Europe/Amsterdam").trim();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim() || undefined;

    const shootType = String(body.shootType ?? "").trim() || undefined;
    const location = String(body.location ?? "").trim() || undefined;
    const message = String(body.message ?? "").trim() || undefined;

    const preferredContact = (body.preferredContact ?? "whatsapp") as BookingPayload["preferredContact"];
    const consent = Boolean(body.consent);

    // Validatie
    const errors: Record<string, string> = {};
    if (!date) errors.date = "Kies een datum.";
    if (!time) errors.time = "Kies een tijd.";
    if (!name) errors.name = "Naam is verplicht.";
    if (!email || !isValidEmail(email)) errors.email = "Vul een geldig e-mailadres in.";
    if (!consent) errors.consent = "Toestemming is verplicht.";

    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // Resend env
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.BOOKING_TO_EMAIL;
    const fromEmail = process.env.BOOKING_FROM_EMAIL;
    const replyTo = process.env.BOOKING_REPLYTO_EMAIL || email;

    if (!resendKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        { ok: false, error: "Mail configuratie mist (RESEND_API_KEY / BOOKING_TO_EMAIL / BOOKING_FROM_EMAIL)." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);

    const subject = `Nieuwe boekingsaanvraag: ${date} ${time}`;

    const html = `
      <div style="font-family: ui-sans-serif, system-ui; line-height:1.5">
        <h2>Nieuwe boekingsaanvraag</h2>
        <p><strong>Datum/tijd:</strong> ${esc(date)} om ${esc(time)} (${esc(timezone)})</p>
        <h3>Contact</h3>
        <ul>
          <li><strong>Naam:</strong> ${esc(name)}</li>
          <li><strong>Email:</strong> ${esc(email)}</li>
          ${phone ? `<li><strong>Telefoon:</strong> ${esc(phone)}</li>` : ""}
          <li><strong>Voorkeur contact:</strong> ${esc(preferredContact ?? "")}</li>
        </ul>
        <h3>Shoot</h3>
        <ul>
          ${shootType ? `<li><strong>Type:</strong> ${esc(shootType)}</li>` : ""}
          ${location ? `<li><strong>Locatie:</strong> ${esc(location)}</li>` : ""}
        </ul>
        ${message ? `<h3>Opmerking</h3><p>${esc(message).replace(/\n/g, "<br/>")}</p>` : ""}
        <hr/>
        <p style="font-size:12px; opacity:.7">Verstuurd via boekingsformulier.</p>
      </div>
    `;

    // 1) Mail versturen
    const mailResult = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      reply_to: replyTo || undefined,
      subject,
      html,
    });

    if ((mailResult as any)?.error) {
      return NextResponse.json({ ok: false, resend: mailResult }, { status: 500 });
    }

    // 2) ✅ Opslaan in Sanity
    const sanityToken = process.env.SANITY_API_TOKEN;
    if (!sanityToken) {
      // Als je (nog) geen token wilt zetten: dan blijft je mail werken maar geen save
      return NextResponse.json({ ok: true, resend: mailResult, saved: false, reason: "SANITY_API_TOKEN missing" });
    }

    const created = await sanityWriteClient.create({
      _type: "bookingRequest",
      status: "new",
      date,
      time,
      timezone,
      name,
      email,
      phone,
      preferredContact,
      consent,

      shootType,
      location,
      message,

      resendId: (mailResult as any)?.data?.id ?? null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, resend: mailResult, saved: true, bookingId: created._id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Onbekende fout" }, { status: 500 });
  }
}