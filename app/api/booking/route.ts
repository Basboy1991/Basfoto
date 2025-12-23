// app/api/booking/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

type BookingPayload = {
  // keuze uit availability
  date: string;
  time: string;
  timezone: string;

  // contact
  name: string;
  email: string;
  phone?: string;

  // shoot info
  shootType?: string; // gezin/huisdier/etc
  location?: string;
  message?: string;

  // extra
  preferredContact?: "whatsapp" | "email" | "phone";
  consent?: boolean;

  // anti-spam (honeypot)
  company?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esc(s: string) {
  return s.replace(
    /[<>&]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string)
  );
}

/**
 * Resend is streng met "from".
 * - Als je geen domein hebt: gebruik onboarding@resend.dev (zonder "Naam <...>")
 * - Als iemand toch "Naam <mail@...>" invult, pak dan alleen het emailgedeelte.
 */
function normalizeFromEmail(value: string) {
  const v = String(value || "").trim();

  // Pak "email@..." uit "Naam <email@...>"
  const match = v.match(/<([^>]+)>/);
  const email = (match?.[1] ?? v).trim();

  // Als het een resend.dev adres is: alleen het pure emailadres gebruiken
  // (voorkomt: "Bas Foto <onboarding@resend.dev>" => invalid from field)
  if (email.endsWith("@resend.dev")) return email;

  // Anders: ook alleen email teruggeven (Resend accepteert vaak wél display-name,
  // maar dit is de veiligste vorm)
  return email;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    // Honeypot: als gevuld -> stil ok teruggeven (spam bots)
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

    const preferredContact = (body.preferredContact ??
      "whatsapp") as BookingPayload["preferredContact"];
    const consent = Boolean(body.consent);

    // Validatie
    const errors: Record<string, string> = {};
    if (!date) errors.date = "Kies een datum.";
    if (!time) errors.time = "Kies een tijd.";
    if (!name) errors.name = "Naam is verplicht.";
    if (!email || !isValidEmail(email))
      errors.email = "Vul een geldig e-mailadres in.";
    if (!consent) errors.consent = "Toestemming is verplicht.";

    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // ENV
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.BOOKING_TO_EMAIL;
    const rawFromEmail = process.env.BOOKING_FROM_EMAIL;

    // Handig: replies direct naar de klant
    const replyTo = process.env.BOOKING_REPLYTO_EMAIL || email;

    if (!resendKey || !toEmail || !rawFromEmail) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Mail configuratie mist (RESEND_API_KEY / BOOKING_TO_EMAIL / BOOKING_FROM_EMAIL).",
          debug: {
            hasResendKey: Boolean(resendKey),
            hasTo: Boolean(toEmail),
            hasFrom: Boolean(rawFromEmail),
            hasReplyTo: Boolean(process.env.BOOKING_REPLYTO_EMAIL),
            nodeEnv: process.env.NODE_ENV,
          },
        },
        { status: 500 }
      );
    }

    const fromEmail = normalizeFromEmail(rawFromEmail);

    const resend = new Resend(resendKey);

    const subject = `Nieuwe boekingsaanvraag: ${date} ${time}`;

    const html = `
      <div style="font-family: ui-sans-serif, system-ui; line-height:1.5">
        <h2>Nieuwe boekingsaanvraag</h2>

        <p><strong>Datum/tijd:</strong> ${esc(date)} om ${esc(time)} (${esc(
      timezone
    )})</p>

        <h3>Contact</h3>
        <ul>
          <li><strong>Naam:</strong> ${esc(name)}</li>
          <li><strong>Email:</strong> ${esc(email)}</li>
          ${phone ? `<li><strong>Telefoon:</strong> ${esc(phone)}</li>` : ""}
          <li><strong>Voorkeur contact:</strong> ${esc(
            preferredContact ?? ""
          )}</li>
        </ul>

        <h3>Shoot</h3>
        <ul>
          ${shootType ? `<li><strong>Type:</strong> ${esc(shootType)}</li>` : ""}
          ${
            location ? `<li><strong>Locatie:</strong> ${esc(location)}</li>` : ""
          }
        </ul>

        ${
          message
            ? `<h3>Opmerking</h3><p>${esc(message).replace(/\n/g, "<br/>")}</p>`
            : ""
        }

        <hr/>
        <p style="font-size:12px; opacity:.7">Verstuurd via boekingsformulier.</p>
      </div>
    `;

    const result = await resend.emails.send({
      from: fromEmail, // ✅ veilig formaat
      to: toEmail,
      reply_to: replyTo || undefined, // ✅ snake_case
      subject,
      html,
    });

    // Als Resend error teruggeeft -> ook HTTP error teruggeven
    if ((result as any)?.error) {
      return NextResponse.json(
        {
          ok: false,
          resend: result,
          debug: { fromEmail, toEmail, replyTo },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, resend: result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Onbekende fout" },
      { status: 500 }
    );
  }
}