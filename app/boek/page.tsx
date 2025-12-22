export const dynamic = "force-dynamic";

import Link from "next/link";
import { siteConfig } from "@/config/site";

import { sanityClient } from "@/lib/sanity.client";
import { availabilitySettingsQuery } from "@/lib/sanity.queries";
import { getAvailabilityForRange } from "@/lib/availability";

import BookingAvailabilitySection from "@/components/BookingAvailabilitySection";

function toIsoDate(d: Date) {
  // YYYY-MM-DD (lokaal)
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default async function BoekPage() {
  // ✅ Contact uit config
  const contact = siteConfig.contact;
  const email = contact?.email ?? "";
  const phone = contact?.phone ?? "";
  const whatsapp = contact?.whatsapp ?? "";
  const responseTime = contact?.responseTime ?? "Meestal reactie dezelfde dag";

  const whatsappHref =
    whatsapp && whatsapp.replace(/\D/g, "").length >= 9
      ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
      : "";

  // ✅ Availability settings uit Sanity
  const settings = await sanityClient.fetch(availabilitySettingsQuery);

  // ✅ Dynamische range: vandaag → vandaag + advanceDays (fallback 45)
  const tz = settings?.timezone ?? "Europe/Amsterdam";
  const advanceDays = Number(settings?.advanceDays ?? 45);

  const from = toIsoDate(new Date());
  const to = toIsoDate(addDays(new Date(), advanceDays));

  const days = getAvailabilityForRange(settings, from, to);

  return (
    <>
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-[var(--text)] md:text-4xl">Boek een shoot</h1>

        <p className="mx-auto mt-3 max-w-2xl text-[var(--text-soft)] md:text-lg">
          Stuur me een bericht met je idee (gezin / huisdier / locatie / datum). Ik denk met je mee
          en we plannen iets dat ontspannen voelt.
        </p>
      </header>

      {/* Contact CTA */}
      <section
        className="mx-auto mt-10 max-w-3xl rounded-3xl bg-[var(--surface-2)] p-8 text-center md:p-10"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-medium text-[var(--text)]">Snelste route naar een afspraak</p>

        <p className="mx-auto mt-2 max-w-xl text-sm italic text-[var(--text-soft)]">
          {responseTime}
        </p>

        <div className="mt-7 grid gap-3">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent-strong)] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[var(--accent)]"
            >
              <span className="text-center">
                <span className="block">Mail</span>
                <span className="mt-1 block text-xs font-medium opacity-80">{email}</span>
              </span>
            </a>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {phone ? (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-[var(--border)] bg-white/70 px-7 py-4 text-sm font-semibold text-[var(--text)] transition hover:bg-white"
              >
                <span className="text-center">
                  <span className="block">Bellen</span>
                  <span className="mt-1 block text-xs font-medium opacity-80">{phone}</span>
                </span>
              </a>
            ) : null}

            {whatsappHref ? (
              <a
                href={whatsappHref}
                className="inline-flex w-full items-center justify-center rounded-full border border-[var(--border)] bg-white/70 px-7 py-4 text-sm font-semibold text-[var(--text)] transition hover:bg-white"
              >
                <span className="text-center">
                  <span className="block">WhatsApp</span>
                  <span className="mt-1 block text-xs font-medium opacity-80">
                    Stuur direct een bericht
                  </span>
                </span>
              </a>
            ) : null}
          </div>

          <div className="pt-4">
            <p className="text-xs text-[var(--text-soft)]">
              Tip: noem alvast je gewenste datum + locatie (Westland e.o.), en of het om gezin of
              huisdieren gaat.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Beschikbaarheid (klikbaar) */}
      <section className="mx-auto mt-12 max-w-4xl">
        <div className="mb-4 text-center">
          <p className="text-sm font-semibold text-[var(--text)]">Beschikbaarheid</p>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            Beschikbaarheid van <strong>{from}</strong> t/m <strong>{to}</strong>
          </p>
        </div>

        <BookingAvailabilitySection days={days} timezone={tz} from={from} to={to} />
      </section>

      {/* Trust blocks */}
      <section className="mx-auto mt-12 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Rustig & persoonlijk", text: "Geen gehaast. We nemen de tijd zodat het echt voelt." },
            { title: "Heldere afspraken", text: "Je weet vooraf wat je krijgt en wat het kost." },
            { title: "Kwaliteit in levering", text: "Foto’s waar je jaren later nog blij van wordt." },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-3xl bg-[var(--surface-2)] p-6 text-center"
              style={{ border: "1px solid var(--border)" }}
            >
              <p className="text-sm font-semibold text-[var(--text)]">{b.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pakketten"
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-7 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white"
          >
            Bekijk eerst de pakketten <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}