export const dynamic = "force-dynamic";

import Link from "next/link";
import { siteConfig } from "@/config/site";

import { sanityClient } from "@/lib/sanity.client";
import { availabilitySettingsQuery } from "@/lib/sanity.queries";
import { getAvailabilityForRange } from "@/lib/availability";

import BookingWidget from "@/components/BookingWidget";

export default async function BoekPage() {
  const contact = siteConfig.contact;

  // ✅ Availability uit Sanity + berekenen
  const settings = await sanityClient.fetch(availabilitySettingsQuery);

  // ✅ dynamische range: vandaag → vandaag + advanceDays (fallback 45)
  const advance = Number(settings?.advanceDays ?? 45);
  const tz = settings?.timezone ?? "Europe/Amsterdam";

  const now = new Date();
  const from = now.toISOString().slice(0, 10);

  const toDate = new Date(now);
  toDate.setDate(toDate.getDate() + advance);
  const to = toDate.toISOString().slice(0, 10);

  const days = getAvailabilityForRange(settings, from, to);

  const responseTime = contact?.responseTime ?? "Meestal reactie dezelfde dag";

  return (
    <>
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-[var(--text)] md:text-4xl">
          Boek een shoot
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-[var(--text-soft)] md:text-lg">
          Kies een moment dat past, en laat me weten wat je in gedachten hebt.
        </p>

        <p className="mx-auto mt-3 max-w-xl text-sm italic text-[var(--text-soft)]">
          {responseTime}
        </p>
      </header>

      {/* Availability + formulier */}
      <BookingWidget days={days} timezone={tz} />

      {/* Kleine trust block */}
      <section className="mx-auto mt-12 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Rustig & persoonlijk", text: "Geen gehaast. We nemen de tijd." },
            { title: "Heldere afspraken", text: "Je weet vooraf wat je krijgt." },
            { title: "Kwaliteit in levering", text: "Foto’s waar je jaren later blij van wordt." },
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