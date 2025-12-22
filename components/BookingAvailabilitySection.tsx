"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import type { AvailabilityDay } from "@/lib/availability";

function buildMailto(email: string, date: string, time: string) {
  const subject = encodeURIComponent("Boekingsaanvraag fotoshoot");
  const body = encodeURIComponent(
    `Hoi Bas,\n\nIk wil graag een fotoshoot boeken.\n\nVoorkeur:\n- Datum: ${date}\n- Starttijd: ${time}\n\nExtra info:\n- Type shoot (gezin/huisdieren): \n- Locatie (Westland e.o.): \n- Aantal personen/dieren: \n\nGroet,\n`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

export default function BookingAvailabilitySection({
  days,
  email,
}: {
  days: AvailabilityDay[];
  email: string;
}) {
  const [selection, setSelection] = useState<{ date: string; time: string } | null>(null);

  const mailto = useMemo(() => {
    if (!selection || !email) return "";
    return buildMailto(email, selection.date, selection.time);
  }, [selection, email]);

  if (!days?.length) return null;

  return (
    <section className="mt-12">
      <AvailabilityPicker
        days={days}
        onSelect={(payload) => {
          setSelection(payload);
        }}
      />

      {/* Extra CTA als er gekozen is */}
      {selection && email ? (
        <div className="mx-auto mt-8 max-w-5xl text-center">
          <a
            href={mailto}
            className="inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-semibold text-white transition hover:opacity-95"
            style={{ background: "var(--accent-strong)" }}
          >
            Mail met keuze ({selection.date} · {selection.time})
            <span className="ml-2">→</span>
          </a>

          <p className="mx-auto mt-3 max-w-2xl text-xs text-[var(--text-soft)]">
            Dit is nog geen definitieve boeking — jij stuurt de aanvraag, Bas bevestigt de afspraak.
          </p>
        </div>
      ) : null}
    </section>
  );
}