import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSanityWriteClient } from "@/lib/sanity.write";

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

  // honeypot
  company?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    // 🛑 Honeypot (bot protection)
    if (body.company && String(body.company).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const date = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();
    const timezone = String(body.timezone ?? "Europe/Amsterdam").trim();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    const shootType = String(body.shootType ?? "").trim();
    const location = String(body.location ?? "").trim();
    const message = String(body.message ?? "").trim();

    const preferredContact =
      (body.preferredContact ?? "whatsapp") as BookingPayload["preferredContact"];
    const consent = Boolean(body.consent);

    // ✅ Validatie
    const errors: Record<string, string> = {};
    if (!date) errors.date = "Kies een datum.";
    if (!time) errors.time = "Kies een tijd.";
    if (!name) errors.name = "Naam is verplicht.";
    if (!email || !isValidEmail(email)) errors.email = "Vul een geldig e-mailadres in.";
    if (!consent) errors.consent = "Toestemming is verplicht.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // =========================
    // 1️⃣ OPSLAAN IN SANITY
    // =========================
    const sanity = getSanityWriteClient();

    const created = await sanity.create({
      _type: "bookingRequest",
      status: "new",
      createdAt: new Date().toISOString(),

      date,
      time,
      timezone,

      name,
      email,
      phone: phone || undefined,

      preferredContact,
      shootType: shootType || undefined,
      location: location || undefined,
      message: message || undefined,

      consent,
    });

    // =========================
    // 2️⃣ (OPTIONEEL) EMAIL VIA RESEND
    // =========================
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.BOOKING_TO_EMAIL;
    const fromEmail = process.env.BOOKING_FROM_EMAIL;

    if (resendKey && toEmail && fromEmail) {
      const resend = new Resend(resendKey);

      const subject = `Nieuwe boekingsaanvraag – ${date} ${time}`;
      const html = `
        <div style="font-family: system-ui, sans-serif; line-height:1.5">
          <h2>Nieuwe boekingsaanvraag</h2>

          <p><strong>Datum:</strong> ${esc(date)}</p>
          <p><strong>Tijd:</strong> ${esc(time)} (${esc(timezone)})</p>

          <h3>Contact</h3>
          <ul>
            <li><strong>Naam:</strong> ${esc(name)}</li>
            <li><strong>Email:</strong> ${esc(email)}</li>
            ${phone ? `<li><strong>Telefoon:</strong> ${esc(phone)}</li>` : ""}
            <li><strong>Voorkeur:</strong> ${esc(preferredContact ?? "")}</li>
          </ul>

          <h3>Shoot</h3>
          <ul>
            ${shootType ? `<li><strong>Type:</strong> ${esc(shootType)}</li>` : ""}
            ${location ? `<li><strong>Locatie:</strong> ${esc(location)}</li>` : ""}
          </ul>

          ${
            message
              ? `<h3>Bericht</h3><p>${esc(message).replace(/\n/g, "<br/>")}</p>`
              : ""
          }

          <hr/>
          <p style="font-size:12px;opacity:.6">
            Sanity ID: ${esc(created._id)}
          </p>
        </div>
      `;

      const result = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        reply_to: email,
        subject,
        html,
      });

      if ((result as any)?.error) {
        // opslag gelukt, mail niet → geen 500
        return NextResponse.json({
          ok: true,
          createdId: created._id,
          mailError: true,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      createdId: created._id,
    });
  } catch (e: any) {
    console.error("Booking API error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Onbekende fout" },
      { status: 500 }
    );
  }
}