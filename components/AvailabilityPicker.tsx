"use client";

import { useMemo, useState } from "react";

export type DayAvailability = {
  date: string; // "YYYY-MM-DD"
  isOpen: boolean;
  times: string[]; // ["10:00","13:00"]
  note?: string;
};

function formatDateNL(iso: string) {
  // iso = YYYY-MM-DD
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("nl-NL", { weekday: "short", day: "2-digit", month: "short" });
}

function formatRangeNL(fromIso: string, toIso: string) {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  const from = new Date(fy, fm - 1, fd);
  const to = new Date(ty, tm - 1, td);

  const fromTxt = from.toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  const toTxt = to.toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${fromTxt} t/m ${toTxt}`;
}

export default function AvailabilityPicker({
  days,
  timezone,
  onSelect,
}: {
  days: DayAvailability[];
  timezone: string;
  onSelect?: (payload: { date: string; time: string; timezone: string }) => void;
}) {
  const sorted = useMemo(() => {
    const copy = [...(days ?? [])];
    copy.sort((a, b) => a.date.localeCompare(b.date));
    return copy;
  }, [days]);

  const rangeLabel = useMemo(() => {
    if (!sorted.length) return null;
    return formatRangeNL(sorted[0].date, sorted[sorted.length - 1].date);
  }, [sorted]);

  const firstSelectableIndex = useMemo(() => {
    const idx = sorted.findIndex((d) => d.isOpen && (d.times?.length ?? 0) > 0);
    return idx >= 0 ? idx : 0;
  }, [sorted]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(firstSelectableIndex);
  const selectedDay = sorted[selectedDayIndex];

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // als dagen veranderen: probeer weer een dag te kiezen met tijden
  // (simpel, zonder effect-hooks om het clean te houden)
  const safeSelectedDay = selectedDay ?? sorted[firstSelectableIndex];

  function selectDay(i: number) {
    setSelectedDayIndex(i);
    setSelectedTime(null);
  }

  function selectTime(t: string) {
    setSelectedTime(t);
    onSelect?.({ date: safeSelectedDay.date, time: t, timezone });
  }

  if (!sorted?.length) {
    return (
      <div
        className="rounded-3xl bg-[var(--surface-2)] p-8 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm text-[var(--text-soft)]">Geen beschikbaarheid gevonden.</p>
      </div>
    );
  }

  const hasAnyTimes = sorted.some((d) => d.isOpen && (d.times?.length ?? 0) > 0);

  return (
    <section
      className="mt-10 rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--text)]">Beschikbaarheid</p>
        {rangeLabel ? (
          <p className="mt-2 text-sm italic text-[var(--text-soft)]">
            {rangeLabel} <span className="not-italic opacity-70">({timezone})</span>
          </p>
        ) : null}
      </div>

      {!hasAnyTimes ? (
        <div className="mt-6 rounded-2xl bg-white/60 p-5 text-center" style={{ border: "1px solid var(--border)" }}>
          <p className="text-sm font-medium text-[var(--text)]">Geen tijden beschikbaar</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Dit betekent meestal dat er (nog) geen <strong>defaultStartTimes</strong> zijn ingesteld,
            of dat alles in deze periode gesloten/gebokt is.
          </p>
        </div>
      ) : null}

      {/* DAGEN */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {sorted.map((d, i) => {
          const active = safeSelectedDay?.date === d.date;
          const disabled = !d.isOpen || (d.times?.length ?? 0) === 0;

          return (
            <button
              key={d.date}
              type="button"
              onClick={() => !disabled && selectDay(i)}
              disabled={disabled}
              className={[
                "rounded-2xl px-3 py-3 text-left transition",
                disabled ? "opacity-50" : "hover:bg-white/70",
                active ? "bg-white/80" : "bg-white/55",
              ].join(" ")}
              style={{ border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}` }}
            >
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">{formatDateNL(d.date)}</p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {d.isOpen ? ((d.times?.length ?? 0) > 0 ? "Open" : "Open (geen tijden)") : "Gesloten"}
              </p>
              {d.note ? <p className="mt-1 text-xs text-[var(--text-soft)] line-clamp-2">{d.note}</p> : null}
            </button>
          );
        })}
      </div>

      {/* TIJDEN */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-[var(--text)] text-center">
          {safeSelectedDay?.date ? `Tijden op ${safeSelectedDay.date}` : "Kies een dag"}
        </p>

        {(safeSelectedDay?.times?.length ?? 0) === 0 ? (
          <p className="mt-3 text-center text-sm text-[var(--text-soft)]">Geen tijden voor deze dag.</p>
        ) : (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {safeSelectedDay.times.map((t) => {
              const active = selectedTime === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => selectTime(t)}
                  className="rounded-full px-5 py-2 text-sm font-medium transition"
                  style={{
                    border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`,
                    background: active ? "var(--accent-soft)" : "rgba(255,255,255,0.65)",
                    color: "var(--text)",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}

        {selectedTime ? (
          <div className="mt-6 rounded-2xl bg-white/60 p-4 text-center" style={{ border: "1px solid var(--border)" }}>
            <p className="text-sm font-medium text-[var(--text)]">Gekozen:</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              {safeSelectedDay.date} om <strong>{selectedTime}</strong>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}