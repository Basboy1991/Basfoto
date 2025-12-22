"use client";

import { useMemo, useState } from "react";
import type { AvailabilityDay } from "@/lib/availability";

function weekdayShort(i: number) {
  // maandag first
  const names = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  return names[i] ?? "";
}

function getWeekdayIndexMondayFirst(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const js = dt.getDay(); // 0 zondag
  return (js + 6) % 7; // maandag=0 ... zondag=6
}

export default function AvailabilityPicker({
  days,
  onSelect,
}: {
  days: AvailabilityDay[];
  onSelect?: (payload: { date: string; time: string }) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dayMap = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);

  const first = days[0]?.date;
  const last = days[days.length - 1]?.date;

  // grid padding (lege cellen aan begin)
  const pad = first ? getWeekdayIndexMondayFirst(first) : 0;

  const selected = selectedDate ? dayMap.get(selectedDate) : null;

  return (
    <section
      className="mx-auto mt-12 max-w-5xl rounded-3xl bg-[var(--surface-2)] p-6 md:p-10"
      style={{ border: "1px solid var(--border)" }}
    >
      <header className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)] md:text-2xl">
          Kies een datum & starttijd
        </h2>
        {first && last ? (
          <p className="mt-2 text-sm italic text-[var(--text-soft)]">
            Beschikbaarheid van {first} t/m {last}
          </p>
        ) : null}
      </header>

      {/* Weekdays */}
      <div className="mt-8 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-[var(--text-soft)]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i}>{weekdayShort(i)}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="mt-3 grid grid-cols-7 gap-2">
        {Array.from({ length: pad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((d) => {
          const dd = d.date.split("-")[2];
          const hasAny = d.times.some((t) => t.available);
          const isSelected = selectedDate === d.date;

          return (
            <button
              key={d.date}
              type="button"
              onClick={() => {
                setSelectedDate(d.date);
                setSelectedTime(null);
              }}
              disabled={!hasAny}
              className={[
                "h-12 rounded-2xl text-sm transition",
                hasAny
                  ? "bg-white/70 hover:bg-white"
                  : "bg-black/5 opacity-60 cursor-not-allowed",
                isSelected ? "ring-2 ring-[var(--accent-strong)]" : "",
              ].join(" ")}
              style={{ border: "1px solid var(--border)" }}
              aria-label={`Datum ${d.date}`}
            >
              <span className="font-semibold text-[var(--text)]">{dd}</span>
            </button>
          );
        })}
      </div>

      {/* Times */}
      <div className="mt-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--text)]">
            {selected ? `Starttijden voor ${selected.date}` : "Selecteer eerst een datum"}
          </p>
          {selected?.note ? (
            <p className="mt-1 text-xs text-[var(--text-soft)]">{selected.note}</p>
          ) : null}
        </div>

        {selected ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selected.times.map((t) => {
              const active = selectedTime === t.time;

              return (
                <button
                  key={t.time}
                  type="button"
                  disabled={!t.available}
                  onClick={() => {
                    setSelectedTime(t.time);
                    onSelect?.({ date: selected.date, time: t.time });
                  }}
                  className={[
                    "rounded-full px-5 py-3 text-sm font-semibold transition",
                    t.available
                      ? "bg-white/70 hover:bg-white"
                      : "bg-black/5 opacity-60 cursor-not-allowed",
                    active ? "bg-[var(--accent-strong)] text-white hover:bg-[var(--accent)]" : "text-[var(--text)]",
                  ].join(" ")}
                  style={{ border: "1px solid var(--border)" }}
                >
                  {t.time}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Selected summary */}
        {selectedDate && selectedTime ? (
          <div
            className="mt-8 rounded-3xl bg-white/60 p-5 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-semibold text-[var(--text)]">
              Gekozen: {selectedDate} om {selectedTime}
            </p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">
              Dit is nog geen definitieve boeking — je stuurt mij een bericht en ik bevestig.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}