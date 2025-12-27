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
  // ✅ lokaal kopietje zodat we direct een geboekt tijdslot kunnen verwijderen
  const [localDays, setLocalDays] = useState<DayAvailability[]>(days);

  // ✅ als server (router.refresh) nieuwe days aanlevert, syncen we weer
  useEffect(() => {
    setLocalDays(days);
  }, [days]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return localDays.find((d) => d.date === selectedDate) ?? null;
  }, [localDays, selectedDate]);

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

      <div className="mt-6">
        <AvailabilityPicker
          days={localDays}
          timezone={timezone}
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setSelectedTime(null);
          }}
        />
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
                      background: active ? "var(--accent-strong)" : "rgba(255,255,255,0.7)",
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

      <BookingForm
        date={selectedDate}
        time={selectedTime}
        timezone={timezone}
        onSuccess={() => {
          // ✅ direct uit UI halen (zonder wachten op Sanity/refresh)
          const d = selectedDate;
          const t = selectedTime ? normTime(selectedTime) : null;

          if (d && t) {
            setLocalDays((prev) =>
              prev.map((day) => {
                if (day.date !== d) return day;
                const nextTimes = (day.times ?? [])
                  .map(normTime)
                  .filter((x) => x !== t);

                return {
                  ...day,
                  times: nextTimes,
                  isOpen: nextTimes.length > 0 ? day.isOpen : false,
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