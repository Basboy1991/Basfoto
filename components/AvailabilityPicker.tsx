"use client";

import { useMemo, useState } from "react";

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  closed: boolean;
  startTimes: string[];
};

export default function AvailabilityPicker({
  days,
  timezone,
  onSelect,
}: {
  days: DayAvailability[];
  timezone: string;
  onSelect?: (payload: { date: string; time: string }) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selected = useMemo(() => days.find((d) => d.date === selectedDate), [days, selectedDate]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Dagen */}
      <div
        className="rounded-3xl bg-[var(--surface-2)] p-6"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold text-[var(--text)]">Kies een dag</p>
        <p className="mt-1 text-xs text-[var(--text-soft)]">Tijdzone: {timezone}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {days.map((d) => {
            const disabled = d.closed || d.startTimes.length === 0;
            const active = d.date === selectedDate;

            return (
              <button
                key={d.date}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedDate(d.date)}
                className={[
                  "rounded-2xl px-3 py-3 text-left text-sm transition",
                  disabled ? "opacity-40" : "hover:bg-white/60",
                  active ? "bg-white/70" : "bg-white/40",
                ].join(" ")}
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="font-medium text-[var(--text)]">{d.date}</div>
                <div className="mt-1 text-xs text-[var(--text-soft)]">
                  {disabled ? "Niet beschikbaar" : `${d.startTimes.length} tijden`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tijden */}
      <div
        className="rounded-3xl bg-[var(--surface-2)] p-6"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold text-[var(--text)]">Kies een starttijd</p>

        {!selectedDate ? (
          <p className="mt-4 text-sm text-[var(--text-soft)]">Selecteer eerst een dag.</p>
        ) : selected?.closed || !selected?.startTimes?.length ? (
          <p className="mt-4 text-sm text-[var(--text-soft)]">Geen tijden beschikbaar.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {selected.startTimes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onSelect?.({ date: selected.date, time: t })}
                className="rounded-2xl bg-white/55 px-3 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white"
                style={{ border: "1px solid var(--border)" }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}