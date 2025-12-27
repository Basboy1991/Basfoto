import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSanityWriteClient } from "@/lib/sanity.write";

export const dynamic = "force-dynamic";
// (optioneel) als je edge issues krijgt met Sanity/Resend:
// export const runtime = "nodejs";

type BookingPayload = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  timezone: string; // Europe/Amsterdam

  name: string;
  email: string;
  phone?: string;

  // ✅ nieuw veld
  count?: number; // aantal personen/dieren

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
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

function normalizeDate(d: string) {
  return (d || "").slice(0, 10);
}

function normalizeTime(t: string) {
  return (t || "").slice(0, 5);
}

/**
 * Deterministische id op basis van slot.
 * Hierdoor kan hetzelfde slot maar 1x bestaan (Sanity geeft conflict).
 */
function slotId(date: string, time: string) {
  const safeDate = normalizeDate(date).replace(/[^0-9-]/g, "");
  const safeTime = normalizeTime(time).replace(/[^0-9]/g, ""); // "10:30" -> "1030"
  return `bookingRequest.${safeDate}.${safeTime}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    // 🛑 Honeypot
    if (body.company && String(body.company).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const date = normalizeDate(String(body.date ?? "").trim());
    const time = normalizeTime(String(body.time ?? "").trim());
    const timezone = String(body.timezone ?? "Europe/Amsterdam").trim();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    // ✅ count normaliseren (mag leeg zijn)
    const rawCount = body.count;
    const countNum =
      rawCount === null || rawCount === undefined || rawCount === ""
        ? undefined
        : Number(rawCount);
    const count =
      typeof countNum === "number" && Number.isFinite(countNum) ? countNum : undefined;

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

    // (optioneel) als je count verplicht wil maken:
    // if (!count || count < 1) errors.count = "Vul het aantal personen/dieren in.";

    if (count !== undefined && count < 1) {
      errors.count = "Aantal moet minimaal 1 zijn.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // =========================
    // 1️⃣ OPSLAAN IN SANITY (met unieke slot-id)
    // =========================
    const sanity = getSanityWriteClient();
    const _id = slotId(date, time);

    let created: any;
    try {
      created = await sanity.create({
        _id,
        _type: "bookingRequest",
        status: "new",
        createdAt: new Date().toISOString(),

        date,
        time,
        timezone,

        name,
        email,
        phone: phone || undefined,

        // ✅ nieuw veld opslaan
        count: count ?? undefined,

        preferredContact,
        shootType: shootType || undefined,
        location: location || undefined,
        message: message || undefined,

        consent,
      });
    } catch (err: any) {
      const status = err?.statusCode || err?.response?.statusCode;

      if (status === 409) {
        return NextResponse.json(
          {
            ok: false,
            error: "Deze tijd is net geboekt. Kies een andere tijd.",
            code: "SLOT_TAKEN",
          },
          { status: 409 }
        );
      }

      throw err;
    }

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
            ${count ? `<li><strong>Aantal:</strong> ${esc(String(count))}</li>` : ""}
            ${shootType ? `<li><strong>Type:</strong> ${esc(shootType)}</li>` : ""}
            ${location ? `<li><strong>Locatie:</strong> ${esc(location)}</li>` : ""}
          </ul>

          ${message ? `<h3>Bericht</h3><p>${esc(message).replace(/\n/g, "<br/>")}</p>` : ""}

          <hr/>
          <p style="font-size:12px;opacity:.6">Sanity ID: ${esc(created._id)}</p>
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
        return NextResponse.json({ ok: true, createdId: created._id, mailError: true });
      }
    }

    return NextResponse.json({ ok: true, createdId: created._id });
  } catch (e: any) {
    console.error("Booking API error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Onbekende fout" },
      { status: 500 }
    );
  }
}