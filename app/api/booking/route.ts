// app/api/booking/route.ts
import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanity.write";

// Optioneel: alleen importeren als je Resend echt gebruikt (en als package is geïnstalleerd)
// npm i resend
import { Resend } from "resend";

export const runtime = "nodejs"; // ✅ voorkomt Edge-runtime issues
export const dynamic = "force-dynamic"; // ✅ geen caching op API route

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
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));
}

function isDebugEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.BOOKING_DEBUG === "1";
}

export async function POST(req: Request) {
  const debug = isDebugEnabled();

  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    // Honeypot: gevuld = bot -> stil OK
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

    // 1) ✅ Opslaan in Sanity
    let createdId: string | null = null;
    try {
      const created = await sanityWriteClient.create({
        _type: "bookingRequest",

        // Zorg dat dit veld ook echt in je schema zit, anders weglaten:
        status: "new",

        // _createdAt wordt automatisch gezet door Sanity.
        // Als je een eigen veld wil: zorg dat "createdAt" in schema bestaat.
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

      createdId = created?._id ?? null;
    } catch (err: any) {
      // ✅ Als Sanity faalt: duidelijke fout terug
      return NextResponse.json(
        {
          ok: false,
          error: "Opslaan in Sanity mislukt.",
          ...(debug
            ? {
                details: err?.message ?? String(err),
                sanity: {
                  projectId: process.env.SANITY_PROJECT_ID ? "set" : "missing",
                  dataset: process.env.SANITY_DATASET ? "set" : "missing",
                  token: process.env.SANITY_API_WRITE_TOKEN ? "set" : "missing",
                },
              }
            : {}),
        },
        { status: 500 }
      );
    }

    // 2) ✅ Mailen via Resend (optioneel)
    // Belangrijk: zonder verified domain kun je alleen "test" sturen in Resend.
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.BOOKING_TO_EMAIL;
    const fromEmail = process.env.BOOKING_FROM_EMAIL;

    if (resendKey && toEmail && fromEmail) {
      try {
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
            <p style="font-size:12px; opacity:.7">Sanity ID: ${esc(createdId ?? "-")}</p>
          </div>
        `;

        const result = await resend.emails.send({
          from: fromEmail,
          to: [toEmail], // ✅ Resend accepteert array
          reply_to: email ? [email] : undefined, // ✅ Resend gebruikt array
          subject,
          html,
        });

        // Als Resend error teruggeeft -> géén 500 (Sanity is al gelukt)
        if ((result as any)?.error) {
          return NextResponse.json(
            { ok: true, createdId, mail: result, warning: "Opslag gelukt, mail niet verzonden." },
            { status: 200 }
          );
        }
      } catch (err: any) {
        // Ook hier: geen 500, opslag was al ok.
        return NextResponse.json(
          {
            ok: true,
            createdId,
            warning: "Opslag gelukt, mail faalde.",
            ...(debug ? { mailError: err?.message ?? String(err) } : {}),
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ ok: true, createdId });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Onbekende fout" },
      { status: 500 }
    );
  }
}