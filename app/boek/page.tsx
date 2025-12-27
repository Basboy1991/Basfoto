export const dynamic = "force-dynamic";

import Link from "next/link";
import { siteConfig } from "@/config/site";

import { sanityClient, sanityClientFresh } from "@/lib/sanity.client";
import { availabilitySettingsQuery } from "@/lib/sanity.queries";
import { getAvailabilityForRange } from "@/lib/availability";

import BookingWidget from "@/components/BookingWidget";
import type { DayAvailability } from "@/lib/availability";

type BookedSlot = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status?: string;
};

function applyBookedSlots(days: DayAvailability[], booked: BookedSlot[]) {
  if (!booked?.length) return days;

  const map = new Map<string, Set<string>>();
  for (const b of booked) {
    const day = (b.date || "").slice(0, 10);
    const t = (b.time || "").slice(0, 5);
    if (!day || !t) continue;

    if (!map.has(day)) map.set(day, new Set());
    map.get(day)!.add(t);
  }

  return days.map((d) => {
    const blocked = map.get(d.date);
    if (!blocked?.size) return d;

    const times = (d.times ?? []).filter((t) => !blocked.has(t));
    return {
      ...d,
      isOpen: times.length > 0 ? d.isOpen : false,
      times,
    };
  });
}

export default async function BoekPage() {
  const contact = siteConfig.contact;

  // Settings mag via CDN (snel)
  const settings = await sanityClient.fetch(availabilitySettingsQuery);

  const advance = Number(settings?.advanceDays ?? 45);
  const tz = settings?.timezone ?? "Europe/Amsterdam";

  const now = new Date();
  const from = now.toISOString().slice(0, 10);

  const toDate = new Date(now);
  toDate.setDate(toDate.getDate() + advance);
  const to = toDate.toISOString().slice(0, 10);

  // 1) basis availability berekenen uit settings
  const daysBase: DayAvailability[] = getAvailabilityForRange(settings, from, to);

  // 2) ✅ geboekte slots ophalen ZONDER CDN (altijd vers)
  const booked: BookedSlot[] = await sanityClientFresh.fetch(
    `*[
      _type == "bookingRequest" &&
      date >= $from && date <= $to &&
      !(status in ["cancelled"])
    ]{
      date,
      time,
      status
    }`,
    { from, to }
  );

  // 3) geboekte tijden verwijderen uit de availability
  const days = applyBookedSlots(daysBase, booked);

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

      <BookingWidget days={days} timezone={tz} />

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
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-soft)]">
                {b.text}
              </p>
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