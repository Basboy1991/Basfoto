import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { apiVersion, dataset, projectId } from "@/sanity/env";

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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    // honeypot
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

    const errors: Record<string, string> = {};
    if (!date) errors.date = "Kies een datum.";
    if (!time) errors.time = "Kies een tijd.";
    if (!name) errors.name = "Naam is verplicht.";
    if (!email || !isValidEmail(email)) errors.email = "Vul een geldig e-mailadres in.";
    if (!consent) errors.consent = "Toestemming is verplicht.";

    if (Object.keys(errors).length) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // ✅ Sanity env check
    if (!projectId || !dataset) {
      return NextResponse.json(
        {
          ok: false,
          error: "Sanity configuratie mist (NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET).",
          debug: { hasProjectId: Boolean(projectId), hasDataset: Boolean(dataset) },
        },
        { status: 500 }
      );
    }

    // ✅ Save to Sanity (write token required)
    const writeToken = process.env.SANITY_API_WRITE_TOKEN;
    if (!writeToken) {
      return NextResponse.json(
        { ok: false, error: "SANITY_API_WRITE_TOKEN ontbreekt (nodig om boekingen op te slaan)." },
        { status: 500 }
      );
    }

    const sanity = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
    });

    const created = await sanity.create({
      _type: "bookingRequest",
      status: "new",
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
      submittedAt: new Date().toISOString(),
    });

    // ✅ Mail (optioneel, laat staan zoals je had)
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.BOOKING_TO_EMAIL;
    const fromEmail = process.env.BOOKING_FROM_EMAIL;

    if (resendKey && toEmail && fromEmail) {
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        reply_to: email ? [email] : undefined,
        subject: `Nieuwe boekingsaanvraag: ${date} ${time}`,
        html: `<p>Nieuwe aanvraag van <strong>${name}</strong> (${email}) voor ${date} ${time}.</p>
              <p>Sanity ID: <code>${created._id}</code></p>`,
      });
    }

    return NextResponse.json({ ok: true, id: created._id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Onbekende fout" }, { status: 500 });
  }
}