"use client";

import { useMemo } from "react";
import type { DayAvailability } from "@/lib/availability";

function formatDateNL(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("nl-NL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatRangeNL(fromIso: string, toIso: string) {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  const from = new Date(fy, fm - 1, fd);
  const to = new Date(ty, tm - 1, td);

  const fromTxt = from.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const toTxt = to.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${fromTxt} t/m ${toTxt}`;
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

  const rangeLabel = useMemo(() => {
    if (!sorted.length) return null;
    return formatRangeNL(sorted[0].date, sorted[sorted.length - 1].date);
  }, [sorted]);

  if (!sorted.length) {
    return (
      <div
        className="rounded-3xl bg-[var(--surface-2)] p-8 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm text-[var(--text-soft)]">Geen beschikbaarheid gevonden.</p>
      </div>
    );
  }

  const hasAnyOpen = sorted.some((d) => d.isOpen);
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

      {!hasAnyOpen ? (
        <div
          className="mt-6 rounded-2xl bg-white/60 p-5 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-medium text-[var(--text)]">Geen open dagen</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            In deze periode staat alles op gesloten. Voeg een open range of uitzondering toe in Sanity.
          </p>
        </div>
      ) : !hasAnyTimes ? (
        <div
          className="mt-6 rounded-2xl bg-white/60 p-5 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-medium text-[var(--text)]">Geen tijden beschikbaar</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Meestal betekent dit dat <strong>defaultStartTimes</strong> nog leeg is of dat ranges
            geen tijden hebben.
          </p>
        </div>
      ) : null}

      {/* DAGEN (nu selecteerbaar) */}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {sorted.map((d) => {
          const active = selectedDate === d.date;

          // Alleen écht gesloten dagen uitzetten.
          // Open dagen blijven klikbaar, ook als er (nog) geen tijden zijn.
          const disabled = !d.isOpen;

          const hasTimes = (d.times?.length ?? 0) > 0;

          return (
            <button
              key={d.date}
              type="button"
              onClick={() => !disabled && onSelectDate(d.date)}
              disabled={disabled}
              className={[
                "rounded-2xl px-3 py-3 text-left transition",
                disabled ? "opacity-45" : "hover:bg-white/70",
                active ? "bg-white/85" : "bg-white/55",
              ].join(" ")}
              style={{
                border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`,
              }}
            >
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                {formatDateNL(d.date)}
              </p>

              <p className="mt-1 text-sm font-medium text-[var(--text)]">
                {!d.isOpen ? "Gesloten" : hasTimes ? "Open" : "Open (geen tijden)"}
              </p>

              {d.note ? (
                <p className="mt-1 text-xs text-[var(--text-soft)] line-clamp-2">{d.note}</p>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Kleine hint onderaan */}
      <p className="mt-6 text-center text-xs text-[var(--text-soft)]">
        Kies een datum hierboven, daarna verschijnen de tijden eronder.
      </p>
    </section>
  );
}