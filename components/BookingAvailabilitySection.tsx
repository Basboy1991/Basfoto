"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker, { DayAvailability } from "@/components/AvailabilityPicker";

type Props = {
  days: DayAvailability[];
  timezone: string;
  from: string;
  to: string;
};

export default function BookingAvailabilitySection({ days, timezone, from, to }: Props) {
  const [selection, setSelection] = useState<{ date: string; time: string } | null>(null);

  const selectableCount = useMemo(() => {
    return (days ?? []).filter((d) => !d.closed && (d.startTimes?.length ?? 0) > 0).length;
  }, [days]);

  return (
    <div>
      {selectableCount === 0 ? (
        <div
          className="rounded-3xl bg-[var(--surface-2)] p-8 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-semibold text-[var(--text)]">Geen tijden beschikbaar</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Dit betekent meestal dat in Sanity nog geen <strong>openRanges</strong> of{" "}
            <strong>defaultStartTimes</strong> zijn ingesteld, of dat alles in deze periode
            “gesloten” is.
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl bg-black/5 p-4 text-left">
            <p className="mb-2 text-xs font-semibold text-[var(--text)]">
              Debug (range {from} → {to})
            </p>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(days?.slice(0, 14), null, 2)}</pre>
          </div>
        </div>
      ) : (
        <>
          <AvailabilityPicker
            days={days}
            timezone={timezone}
            onSelect={(payload) => setSelection(payload)}
          />

          {selection ? (
            <div
              className="mt-6 rounded-3xl bg-[var(--surface-2)] p-6 text-center"
              style={{ border: "1px solid var(--border)" }}
            >
              <p className="text-sm font-semibold text-[var(--text)]">Gekozen:</p>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                {selection.date} om {selection.time}
              </p>
              <p className="mt-3 text-xs text-[var(--text-soft)]">
                (Volgende stap: hier maken we straks automatisch een mail/WhatsApp-tekst van.)
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}