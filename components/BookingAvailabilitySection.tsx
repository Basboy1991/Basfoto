"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker, { DayAvailability } from "@/components/AvailabilityPicker";

export default function BookingAvailabilitySection({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  const [selection, setSelection] = useState<{ date: string; time: string } | null>(null);

  const selectableCount = useMemo(
    () => (days ?? []).filter((d) => !d.closed && (d.startTimes?.length ?? 0) > 0).length,
    [days]
  );

  if (!selectableCount) {
    return (
      <div
        className="rounded-3xl bg-[var(--surface-2)] p-8 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold text-[var(--text)]">Geen tijden beschikbaar</p>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Check in Sanity of <strong>defaultStartTimes</strong> gevuld is, en/of je{" "}
          <strong>openRanges</strong> de juiste periode dekt.
        </p>
      </div>
    );
  }

  return (
    <>
      <AvailabilityPicker days={days} timezone={timezone} onSelect={(p) => setSelection(p)} />

      {selection ? (
        <div
          className="mt-6 rounded-3xl bg-[var(--surface-2)] p-6 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-semibold text-[var(--text)]">Gekozen:</p>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            {selection.date} om {selection.time}
          </p>
        </div>
      ) : null}
    </>
  );
}