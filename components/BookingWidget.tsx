"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import BookingForm from "@/components/BookingForm";
import type { DayAvailability } from "@/lib/availability";

export default function BookingWidget({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return days.find((d) => d.date === selectedDate) ?? null;
  }, [days, selectedDate]);

  const times = selectedDay?.times ?? [];

  return (
    <>
      {/* DATUM PICKER */}
      <AvailabilityPicker
        days={days}
        timezone={timezone}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setSelectedTime(null);
        }}
      />

      {/* TIJDEN */}
      <section
        className="mx-auto mt-6 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--text)]">Kies een starttijd</h3>
          <p className="mt-2 text-sm italic text-[var(--text-soft)]">
            {selectedDate ? `Datum: ${selectedDate}` : "Selecteer eerst een datum."}
          </p>
        </div>

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

              <div
                className="mt-6 rounded-2xl bg-white/60 p-4 text-center"
                style={{ border: "1px solid var(--border)" }}
              >
                <p className="text-sm font-medium text-[var(--text)]">Jouw keuze</p>
                <p className="mt-1 text-sm text-[var(--text-soft)]">
                  {selectedDate} {selectedTime ? `om ${selectedTime}` : ""}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FORM (koppelt selectie mee) */}
      <BookingForm date={selectedDate} time={selectedTime} timezone={timezone} />
    </>
  );
}