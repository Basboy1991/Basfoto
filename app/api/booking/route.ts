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
  shootType?: string;
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
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string);
}

function brandEmailShell({
  title,
  preheader,
  bodyHtml,
  footerHtml,
}: {
  title: string;
  preheader?: string;
  bodyHtml: string;
  footerHtml?: string;
}) {
  // 👉 Zet hier je “site look”: rustige background, rounded cards, subtiele border, accentkleur
  const accent = "#1F6F5B"; // pas aan naar jouw accentkleur
  const softBg = "#F4F6F5";
  const cardBg = "#FFFFFF";
  const text = "#111827";
  const muted = "#6B7280";
  const border = "#E5E7EB";

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${preheader ? `<meta name="x-preheader" content="${esc(preheader)}" />` : ""}
      <title>${esc(title)}</title>
    </head>
    <body style="margin:0;padding:0;background:${softBg};font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        ${preheader ? esc(preheader) : ""}
      </div>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${softBg};padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
              <tr>
                <td style="padding:10px 6px;">
                  <div style="font-weight:700;letter-spacing:0.2px;color:${text};font-size:18px;">
                    Bas-fotografie
                  </div>
                  <div style="color:${muted};font-size:13px;margin-top:2px;">
                    Rustig & persoonlijk • Heldere afspraken • Kwaliteit in levering
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:6px;">
                  <div style="background:${cardBg};border:1px solid ${border};border-radius:20px;padding:22px;">
                    <div style="font-size:18px;font-weight:700;color:${text};margin:0 0 10px 0;">
                      ${esc(title)}
                    </div>

                    ${bodyHtml}

                    <div style="margin-top:18px;border-top:1px solid ${border};padding-top:14px;color:${muted};font-size:12px;line-height:1.4;">
                      ${footerHtml ?? `Deze mail is automatisch verstuurd vanaf het boekingsformulier.`}
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:14px 6px;color:${muted};font-size:12px;line-height:1.5;">
                  <div>© ${new Date().getFullYear()} Bas-fotografie</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

function adminEmailHtml(payload: {
  date: string;
  time: string;
  timezone: string;
  name: string;
  email: string;
  phone?: string;
  shootType?: string;
  location?: string;
  message?: string;
  preferredContact?: string;
}) {
  const {
    date,
    time,
    timezone,
    name,
    email,
    phone,
    shootType,
    location,
    message,
    preferredContact,
  } = payload;

  const bodyHtml = `
    <p style="margin:0 0 12px 0;color:#111827;font-size:14px;line-height:1.6;">
      Er is een nieuwe boekingsaanvraag binnengekomen.
    </p>

    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:16px;padding:14px;margin:12px 0;">
      <div style="font-size:13px;color:#111827;"><strong>Datum/tijd:</strong> ${esc(date)} om ${esc(time)} (${esc(timezone)})</div>
      <div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Naam:</strong> ${esc(name)}</div>
      <div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Email:</strong> ${esc(email)}</div>
      ${phone ? `<div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Telefoon:</strong> ${esc(phone)}</div>` : ""}
      ${preferredContact ? `<div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Voorkeur:</strong> ${esc(preferredContact)}</div>` : ""}
    </div>

    <div style="margin-top:10px;">
      ${shootType ? `<div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Type shoot:</strong> ${esc(shootType)}</div>` : ""}
      ${location ? `<div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Locatie:</strong> ${esc(location)}</div>` : ""}
    </div>

    ${
      message
        ? `<div style="margin-top:14px;">
             <div style="font-size:13px;color:#111827;font-weight:700;margin-bottom:6px;">Opmerking</div>
             <div style="font-size:13px;color:#111827;line-height:1.6;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:16px;padding:12px;">
               ${esc(message).replace(/\n/g, "<br/>")}
             </div>
           </div>`
        : ""
    }
  `;

  return brandEmailShell({
    title: "Nieuwe boekingsaanvraag",
    preheader: `${date} ${time} • ${name}`,
    bodyHtml,
    footerHtml: "Binnengekomen via het boekingsformulier op de website.",
  });
}

function customerThanksEmailHtml(payload: {
  date: string;
  time: string;
  timezone: string;
  name: string;
  shootType?: string;
  location?: string;
}) {
  const { date, time, timezone, name, shootType, location } = payload;

  const bodyHtml = `
    <p style="margin:0 0 12px 0;color:#111827;font-size:14px;line-height:1.7;">
      Hi <strong>${esc(name)}</strong>, dankjewel voor je aanvraag. Ik heb ’m goed ontvangen.
    </p>

    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:16px;padding:14px;margin:12px 0;">
      <div style="font-size:13px;color:#111827;"><strong>Jouw gekozen moment:</strong> ${esc(date)} om ${esc(
        time
      )} <span style="color:#6B7280;">(${esc(timezone)})</span></div>
      ${shootType ? `<div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Type:</strong> ${esc(shootType)}</div>` : ""}
      ${location ? `<div style="font-size:13px;color:#111827;margin-top:6px;"><strong>Locatie:</strong> ${esc(location)}</div>` : ""}
    </div>

    <p style="margin:12px 0 0 0;color:#111827;font-size:14px;line-height:1.7;">
      Ik neem snel contact met je op om alles kort af te stemmen en je moment definitief vast te zetten.
    </p>

    <p style="margin:14px 0 0 0;color:#6B7280;font-size:13px;line-height:1.6;">
      Tip: als je alvast extra info hebt (aantal personen, wensen, kleding, etc.), mag je die gewoon replyen op deze mail.
    </p>

    <div style="margin-top:16px;">
      <a href="https://basfoto.vercel.app/pakketten"
         style="display:inline-block;background:#1F6F5B;color:#fff;text-decoration:none;border-radius:999px;padding:10px 16px;font-size:13px;font-weight:700;">
        Bekijk pakketten →
      </a>
    </div>
  `;

  return brandEmailShell({
    title: "Dankjewel! Je aanvraag is ontvangen",
    preheader: `Ik heb je aanvraag ontvangen voor ${date} om ${time}.`,
    bodyHtml,
    footerHtml: "Als je deze mail niet verwachtte, kun je ’m negeren.",
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    // Honeypot: als gevuld -> stil ok teruggeven
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

    const errors: Record<string, string> = {};
    if (!date) errors.date = "Kies een datum.";
    if (!time) errors.time = "Kies een tijd.";
    if (!name) errors.name = "Naam is verplicht.";
    if (!email || !isValidEmail(email)) errors.email = "Vul een geldig e-mailadres in.";
    if (!consent) errors.consent = "Toestemming is verplicht.";

    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.BOOKING_TO_EMAIL;
    const fromEmail = process.env.BOOKING_FROM_EMAIL;

    // reply_to mag naar klant (handig: direct replyen) óf naar je eigen inbox
    const replyTo = process.env.BOOKING_REPLYTO_EMAIL || email;

    if (!resendKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        {
          ok: false,
          error: "Mail configuratie mist (RESEND_API_KEY / BOOKING_TO_EMAIL / BOOKING_FROM_EMAIL).",
          debug: {
            hasResendKey: Boolean(resendKey),
            hasTo: Boolean(toEmail),
            hasFrom: Boolean(fromEmail),
            hasReplyTo: Boolean(process.env.BOOKING_REPLYTO_EMAIL),
            nodeEnv: process.env.NODE_ENV,
          },
        },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);

    // 1) Mail naar jou (admin)
    const adminSubject = `Nieuwe boekingsaanvraag: ${date} ${time}`;
    const adminHtml = adminEmailHtml({
      date,
      time,
      timezone,
      name,
      email,
      phone: phone || undefined,
      shootType: shootType || undefined,
      location: location || undefined,
      message: message || undefined,
      preferredContact: preferredContact || undefined,
    });

    const adminResult = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      reply_to: replyTo || undefined, // snake_case
      subject: adminSubject,
      html: adminHtml,
    });

    if ((adminResult as any)?.error) {
      return NextResponse.json({ ok: false, resend: adminResult }, { status: 500 });
    }

    // 2) Automatische dankmail naar klant
    const customerSubject = "Dankjewel! Je aanvraag is ontvangen";
    const customerHtml = customerThanksEmailHtml({
      date,
      time,
      timezone,
      name,
      shootType: shootType || undefined,
      location: location || undefined,
    });

    const customerResult = await resend.emails.send({
      from: fromEmail,
      to: email, // klant
      // reply_to: toEmail, // alternatief: replies naar jou
      reply_to: toEmail || undefined,
      subject: customerSubject,
      html: customerHtml,
    });

    // Als klantmail faalt wil je meestal niet de hele aanvraag laten falen.
    // Daarom sturen we ok:true terug, maar geven we wel mee dat de klantmail niet lukte.
    const customerError = (customerResult as any)?.error ? customerResult : null;

    return NextResponse.json({
      ok: true,
      admin: adminResult,
      customer: customerError ? { ok: false, resend: customerError } : { ok: true },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Onbekende fout" }, { status: 500 });
  }
}
