"use client";

import { useMemo, useState } from "react";

type DayAvailability = {
  date: string; // YYYY-MM-DD
  closed?: boolean;
  startTimes?: string[]; // ["10:00","13:00"]
  note?: string;
};

function formatDateNL(iso: string, tz: string) {
  const d = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: tz,
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(d);
}

export default function AvailabilityPicker({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  const selectableDays = useMemo(
    () => (days ?? []).filter((d) => !d.closed && (d.startTimes?.length ?? 0) > 0),
    [days]
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    selectableDays[0]?.date ?? (days?.[0]?.date ?? "")
  );

  const selected = useMemo(
    () => (days ?? []).find((d) => d.date === selectedDate),
    [days, selectedDate]
  );

  return (
    <div className="grid gap-5 md:grid-cols-[1fr,1.2fr]">
      {/* Datums */}
      <div
        className="rounded-3xl bg-white/55 p-4 md:p-5"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="mb-3 text-sm font-semibold text-[var(--text)]">Kies een datum</p>

        <div className="grid max-h-[360px] gap-2 overflow-auto pr-1">
          {(days ?? []).map((d) => {
            const active = d.date === selectedDate;
            const disabled = d.closed || !(d.startTimes?.length);

            return (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                disabled={disabled}
                className={[
                  "rounded-2xl px-4 py-3 text-left text-sm transition",
                  disabled ? "opacity-50" : "hover:bg-white",
                  active ? "bg-[var(--accent-soft)]" : "bg-white/60",
                ].join(" ")}
                style={{ border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-[var(--text)]">
                    {formatDateNL(d.date, timezone)}
                  </span>
                  {disabled ? (
                    <span className="text-xs text-[var(--text-soft)]">Niet beschikbaar</span>
                  ) : (
                    <span className="text-xs text-[var(--text-soft)]">
                      {d.startTimes?.length} tijden
                    </span>
                  )}
                </div>

                {d.note ? (
                  <div className="mt-1 text-xs text-[var(--text-soft)]">{d.note}</div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tijden */}
      <div
        className="rounded-3xl bg-white/55 p-4 md:p-5"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="mb-3 text-sm font-semibold text-[var(--text)]">Beschikbare starttijden</p>

        {selected?.closed ? (
          <p className="text-sm text-[var(--text-soft)]">Deze dag is gesloten.</p>
        ) : selected?.startTimes?.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {selected.startTimes.map((t) => (
              <button
                key={t}
                type="button"
                className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-white"
                style={{ border: "1px solid var(--border)" }}
                onClick={() => {
                  // Voor nu: selecteren = kopieerbare hint.
                  // Later: dit wordt “formulier invullen” of direct mail/agenda.
                  const msg = `Ik wil graag een shoot boeken op ${selected.date} om ${t}.`;
                  navigator.clipboard?.writeText(msg);
                  alert(`Gekopieerd:\n${msg}\n\nPlak dit in je mail/WhatsApp 🙂`);
                }}
              >
                {t}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-soft)]">
            Kies links een datum met beschikbare tijden.
          </p>
        )}

        <p className="mt-4 text-xs text-[var(--text-soft)]">
          Tip: klik op een tijd → tekst wordt gekopieerd (handig voor mail/WhatsApp).
        </p>
      </div>
    </div>
  );
}