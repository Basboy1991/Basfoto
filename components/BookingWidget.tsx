"use client";

import { useEffect, useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import BookingForm from "@/components/BookingForm";
import type { DayAvailability } from "@/lib/availability";

function normTime(s: string) {
  const t = String(s || "").trim();
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export default function BookingWidget({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  // ✅ lokale state zodat we meteen een tijdslot kunnen “wegstrepen”
  const [daysState, setDaysState] = useState<DayAvailability[]>(days);

  // ✅ als de server opnieuw rendert (router.refresh), syncen we weer naar de nieuwste days
  useEffect(() => {
    setDaysState(days);
  }, [days]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return daysState.find((d) => d.date === selectedDate) ?? null;
  }, [daysState, selectedDate]);

  const times = selectedDay?.times ?? [];

  return (
    <section
      className="mx-auto mt-12 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          Beschikbaarheid
        </h2>
        <p className="mt-2 text-sm italic text-[var(--text-soft)]">
          Kies eerst een datum en daarna een starttijd. (Tijdzone: {timezone})
        </p>
      </div>

      {/* DATUM PICKER */}
      <div className="mt-6">
        <AvailabilityPicker
          days={daysState}
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
            {selectedDate ? selectedDate : "—"}{" "}
            {selectedTime ? `om ${selectedTime}` : ""}
          </p>
        </div>
      </div>

      {/* FORM */}
      <BookingForm
        date={selectedDate}
        time={selectedTime}
        timezone={timezone}
        onSuccess={() => {
          // ✅ slot direct uit UI halen (dit is de kern)
          if (selectedDate && selectedTime) {
            const bookedDate = selectedDate;
            const bookedTime = normTime(selectedTime);

            setDaysState((prev) =>
              prev.map((d) => {
                if (d.date !== bookedDate) return d;
                const newTimes = (d.times ?? [])
                  .map(normTime)
                  .filter((x) => x !== bookedTime);

                return {
                  ...d,
                  times: newTimes,
                  isOpen: newTimes.length > 0,
                };
              })
            );
          }

          // reset selectie
          setSelectedDate(null);
          setSelectedTime(null);
        }}
      />
    </section>
  );
}