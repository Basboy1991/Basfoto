"use client";

import { useMemo } from "react";
import type { DayAvailability } from "@/lib/availability";

function formatDateShortNL(iso: string) {
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
  // ✅ Optie B: alleen dagen die open zijn én tijden hebben
  const visibleDays = useMemo(() => {
    return [...(days ?? [])]
      .filter((d) => d.isOpen && (d.times?.length ?? 0) > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [days]);

  const rangeLabel = useMemo(() => {
    if (!visibleDays.length) return null;
    return formatRangeNL(visibleDays[0].date, visibleDays[visibleDays.length - 1].date);
  }, [visibleDays]);

  if (!visibleDays.length) {
    return (
      <div
        className="rounded-3xl bg-[var(--surface-2)] p-8 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold text-[var(--text)]">Geen tijden beschikbaar</p>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Vul in Sanity <strong>defaultStartTimes</strong> of <strong>openRanges.startTimes</strong> in,
          en zorg dat de periode open staat.
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
        <p className="text-sm font-semibold text-[var(--text)]">Beschikbaarheid</p>

        {rangeLabel ? (
          <p className="mt-2 text-sm italic text-[var(--text-soft)]">
            {rangeLabel} <span className="not-italic opacity-70">({timezone})</span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visibleDays.map((d) => {
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
              style={{
                border: `1px solid ${active ? "var(--accent-strong)" : "var(--border)"}`,
              }}
            >
              <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                {formatDateShortNL(d.date)}
              </p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">Open</p>

              {d.note ? (
                <p className="mt-1 line-clamp-2 text-xs text-[var(--text-soft)]">{d.note}</p>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--text-soft)]">
        Kies een datum hierboven, daarna verschijnen de tijden eronder.
      </p>
    </section>
  );
}