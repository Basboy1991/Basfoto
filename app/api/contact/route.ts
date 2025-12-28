// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSanityWriteClient } from "@/lib/sanity.write";

export const dynamic = "force-dynamic";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  preferredContact?: "whatsapp" | "email" | "phone";
  message: string;
  consent?: boolean;
  company?: string; // honeypot
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ContactPayload>;

    // honeypot
    if (body.company && String(body.company).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const preferredContact = (body.preferredContact ?? "whatsapp") as ContactPayload["preferredContact"];
    const message = String(body.message ?? "").trim();
    const consent = Boolean(body.consent);

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Naam is verplicht.";
    if (!email || !isValidEmail(email)) errors.email = "Vul een geldig e-mailadres in.";
    if (!message) errors.message = "Bericht is verplicht.";
    if (!consent) errors.consent = "Toestemming is verplicht.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // (optioneel) opslaan in Sanity
    // Als je dit niet wilt: verwijder dit blok.
    let createdId: string | undefined;
    try {
      const sanity = getSanityWriteClient();
      const created = await sanity.create({
        _type: "contactMessage",
        createdAt: new Date().toISOString(),
        status: "new",
        name,
        email,
        phone: phone || undefined,
        preferredContact,
        message,
        consent,
      });
      createdId = created?._id;
    } catch {
      // opslaan mag falen zonder dat contact mailt — afhankelijk van wat jij wil
    }

    // mail via Resend (optioneel)
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;       // ✅ nieuw
    const fromEmail = process.env.CONTACT_FROM_EMAIL;   // ✅ nieuw

    if (resendKey && toEmail && fromEmail) {
      const resend = new Resend(resendKey);

      const subject = `Nieuw contactbericht – ${name}`;
      const html = `
        <div style="font-family: system-ui, sans-serif; line-height:1.5">
          <h2>Nieuw contactbericht</h2>
          <ul>
            <li><strong>Naam:</strong> ${esc(name)}</li>
            <li><strong>Email:</strong> ${esc(email)}</li>
            ${phone ? `<li><strong>Telefoon:</strong> ${esc(phone)}</li>` : ""}
            <li><strong>Voorkeur:</strong> ${esc(String(preferredContact ?? ""))}</li>
          </ul>
          <h3>Bericht</h3>
          <p>${esc(message).replace(/\n/g, "<br/>")}</p>
          ${createdId ? `<hr/><p style="font-size:12px;opacity:.6">Sanity ID: ${esc(createdId)}</p>` : ""}
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
        return NextResponse.json({ ok: true, createdId, mailError: true });
      }
    }

    return NextResponse.json({ ok: true, createdId });
  } catch (e: any) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Onbekende fout" },
      { status: 500 }
    );
  }
}