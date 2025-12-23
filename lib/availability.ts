"use client";

import { useMemo } from "react";
import type { DayAvailability } from "@/lib/availability";

function formatDateNL(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("nl-NL", { weekday: "short", day: "2-digit", month: "short" });
}

export default function AvailabilityPicker({
  days,
  timezone,
  selectedDate,
  onSelectDate,
}: {
  days: DayAvailability[];
  timezone: string;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const sorted = useMemo(() => {
    const copy = [...(days ?? [])];
    copy.sort((a, b) => a.date.localeCompare(b.date));
    return copy;
  }, [days]);

  if (!sorted.length) {
    return (
      <div
        className="rounded-3xl bg-white/55 p-6 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold text-[var(--text)]">Geen open dagen in deze periode</p>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Kies een andere datumrange of voeg openRanges toe in Sanity.
        </p>
      </div>
    );
  }

  return (
    <section
      className="mt-6 rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--text)]">Open dagen</p>
        <p className="mt-2 text-sm italic text-[var(--text-soft)]">
          Alleen dagen met beschikbare tijden. <span className="not-italic opacity-70">({timezone})</span>
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {sorted.map((d) => {
          const active = selectedDate === d.date;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => onSelectDate(d.date)}
              className={[
                "rounded-2xl px-3 py-3 text-left transition hover:bg-white/70",
                active ? "bg-white/85" : "bg-white/55",
              ].join(" ")}
              style={{ border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}` }}
            >
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">{formatDateNL(d.date)}</p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">{d.date}</p>
              <p className="mt-1 text-xs text-[var(--text-soft)]">
                {d.times.length} tijd{d.times.length === 1 ? "" : "en"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}