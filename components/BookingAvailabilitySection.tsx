"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import type { DayAvailability } from "@/lib/availability";

function formatDateLongNL(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingWidget({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  // ✅ Alleen boekbare dagen (open + tijden)
  const bookableDays = useMemo(
    () => (days ?? []).filter((d) => d.isOpen && (d.times?.length ?? 0) > 0),
    [days]
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return bookableDays.find((d) => d.date === selectedDate) ?? null;
  }, [bookableDays, selectedDate]);

  const times = selectedDay?.times ?? [];

  return (
    <section
      className="mx-auto mt-12 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)]">Beschikbaarheid</h2>
        <p className="mt-2 text-sm italic text-[var(--text-soft)]">
          Kies eerst een datum en daarna een starttijd. (Tijdzone: {timezone})
        </p>
      </div>

      {/* DATUM PICKER */}
      <div className="mt-6">
        <AvailabilityPicker
          days={bookableDays}
          timezone={timezone}
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setSelectedTime(null);
          }}
        />
      </div>

      {/* TIJDEN */}
      <div className="mt-6">
        {!selectedDate ? (
          <p className="text-center text-sm text-[var(--text-soft)]">
            Selecteer een datum om tijden te zien.
          </p>
        ) : times.length === 0 ? (
          <div
            className="rounded-2xl bg-white/60 p-4 text-center text-sm text-[var(--text-soft)]"
            style={{ border: "1px solid var(--border)" }}
          >
            Geen tijden beschikbaar op <strong>{formatDateLongNL(selectedDate)}</strong>.
          </div>
        ) : (
          <>
            <p className="mb-3 text-center text-sm font-medium text-[var(--text)]">
              Beschikbare tijden op {formatDateLongNL(selectedDate)}
            </p>

            {/* ✅ Strakke “chips” (mooi op mobiel) */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {times.map((t) => {
                const active = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
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
          </>
        )}
      </div>

      {/* SELECTIE SAMENVATTING */}
      <div className="mt-8">
        <div
          className="rounded-2xl bg-white/60 p-4 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-medium text-[var(--text)]">Jouw keuze</p>

          <p className="mt-1 text-sm text-[var(--text-soft)]">
            {selectedDate ? formatDateLongNL(selectedDate) : "—"}{" "}
            {selectedTime ? `om ${selectedTime}` : ""}
          </p>

          {selectedDate && selectedTime ? (
            <p className="mt-2 text-xs text-[var(--text-soft)]">
              Tip: dit moment nemen we mee in je aanvraag.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}