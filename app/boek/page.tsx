export const dynamic = "force-dynamic";

import Link from "next/link";
import { siteConfig } from "@/config/site";

import { sanityClient } from "@/lib/sanity.client";
import { availabilitySettingsQuery } from "@/lib/sanity.queries";
import { getAvailabilityForRange } from "@/lib/availability";

import BookingAvailabilitySection from "@/components/BookingAvailabilitySection";

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

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysISO(fromISO: string, days: number) {
  const [y, m, d] = fromISO.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() + days);
  return toISODate(dt);
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

  // ✅ Availability uit Sanity + berekenen (vandaag → 45 dagen vooruit)
  const settings = await sanityClient.fetch(availabilitySettingsQuery);

  const from = toISODate(new Date());
  const to = addDaysISO(from, 45);

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

        <p className="mx-auto mt-2 max-w-xl text-sm italic text-[var(--text-soft)]">{responseTime}</p>

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

      {/* ✅ Kalender + starttijden (echte UI) */}
      <BookingAvailabilitySection days={days} email={email} />

      {/* Vertrouwen / premium reassurance */}
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
            Bekijk eerst de pakketten
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}