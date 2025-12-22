export const dynamic = "force-dynamic";

import Link from "next/link";
import { siteConfig } from "@/config/site";

import { sanityClient } from "@/lib/sanity.client";
import { availabilitySettingsQuery } from "@/lib/sanity.queries";
import { getAvailabilityForRange } from "@/lib/availability";

import AvailabilityPicker from "@/components/AvailabilityPicker";

function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function ContactButton({
  href,
  label,
  sub,
  variant = "primary",
}: {
  href: string;
  label: string;
  sub?: string;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-semibold transition";
  const primary = "bg-[var(--accent-strong)] text-white hover:bg-[var(--accent)]";
  const secondary =
    "border border-[var(--border)] bg-white/70 text-[var(--text)] hover:bg-white";

  return (
    <a href={href} className={`${base} ${variant === "primary" ? primary : secondary}`}>
      <span className="text-center">
        <span className="block">{label}</span>
        {sub ? <span className="mt-1 block text-xs font-medium opacity-80">{sub}</span> : null}
      </span>
    </a>
  );
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

  // ✅ Dynamische periode
  const from = todayISO();
  const advanceDays = Number(settings?.advanceDays ?? 45); // fallback 45
  const to = addDaysISO(advanceDays);

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
            <ContactButton href={`mailto:${email}`} label="Mail" sub={email} variant="primary" />
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {phone ? (
              <ContactButton
                href={`tel:${phone.replace(/\s/g, "")}`}
                label="Bellen"
                sub={phone}
                variant="secondary"
              />
            ) : null}

            {whatsappHref ? (
              <ContactButton
                href={whatsappHref}
                label="WhatsApp"
                sub="Stuur direct een bericht"
                variant="secondary"
              />
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

      {/* ✅ Klikbare beschikbaarheid */}
      <section
        className="mx-auto mt-12 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--text)]">Beschikbaarheid</h2>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Van <strong>{from}</strong> t/m <strong>{to}</strong>
          </p>
        </div>

        <div className="mt-6">
          <AvailabilityPicker
            days={days}
            timezone={settings?.timezone ?? "Europe/Amsterdam"}
          />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pakketten"
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-7 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white"
          >
            Bekijk eerst de pakketten
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}