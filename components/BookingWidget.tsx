"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import BookingForm from "@/components/BookingForm";
import type { DayAvailability } from "@/lib/availability";

function normTime(s: string) {
  const t = String(s || "").trim();
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function normDate(s: string) {
  return String(s || "").trim().slice(0, 10);
}

function keyFor(date: string, time: string) {
  return `${normDate(date)}|${normTime(time)}`;
}

export default function BookingWidget({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // ✅ lokale “blocked slots” (optimistisch + blijft weg ook als server nog even stale is)
  const [blocked, setBlocked] = useState<Set<string>>(() => new Set());

  // ✅ altijd de server-days filteren met lokale blocked set
  const daysFiltered = useMemo<DayAvailability[]>(() => {
    if (!blocked.size) return days;

    return days.map((d) => {
      const date = normDate(d.date);
      const times = (d.times ?? [])
        .map(normTime)
        .filter((t) => !blocked.has(keyFor(date, t)));

      return {
        ...d,
        times,
        isOpen: times.length > 0,
      };
    });
  }, [days, blocked]);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return daysFiltered.find((d) => d.date === selectedDate) ?? null;
  }, [daysFiltered, selectedDate]);

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
          days={daysFiltered}
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
            Geen tijden beschikbaar op <strong>{selectedDate}</strong>.
          </div>
        ) : (
          <>
            <p className="mb-3 text-center text-sm font-medium text-[var(--text)]">
              Beschikbare tijden op {selectedDate}
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {times.map((t) => {
                const active = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold transition"
                    style={{
                      border: "1px solid var(--border)",
                      background: active
                        ? "var(--accent-strong)"
                        : "rgba(255,255,255,0.7)",
                      color: active ? "white" : "var(--text)",
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
            {selectedDate ? selectedDate : "—"} {selectedTime ? `om ${selectedTime}` : ""}
          </p>
        </div>
      </div>

      {/* FORM */}
      <BookingForm
        date={selectedDate}
        time={selectedTime}
        timezone={timezone}
        onSuccess={() => {
          // ✅ blokkeer slot lokaal (blijft weg, ook als server nog even stale is)
          if (selectedDate && selectedTime) {
            const k = keyFor(selectedDate, selectedTime);
            setBlocked((prev) => {
              const next = new Set(prev);
              next.add(k);
              return next;
            });
          }

          setSelectedDate(null);
          setSelectedTime(null);
        }}
      />
    </section>
  );
}