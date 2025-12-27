"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import BookingForm from "@/components/BookingForm";
import type { DayAvailability } from "@/lib/availability";

function normTime(s: string) {
  const t = String(s || "").trim();
  return t.length >= 5 ? t.slice(0, 5) : t; // "12:00:00" -> "12:00"
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

  // ✅ lokale blokkade (optimistisch) zodat het direct verdwijnt na submit
  const [blockedLocal, setBlockedLocal] = useState<Map<string, Set<string>>>(() => new Map());

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return days.find((d) => d.date === selectedDate) ?? null;
  }, [days, selectedDate]);

  // tijden uit server props
  const timesBase = selectedDay?.times ?? [];

  // ✅ filter ook op lokale blokkade
  const times = useMemo(() => {
    if (!selectedDate) return [];
    const blocked = blockedLocal.get(selectedDate);
    if (!blocked?.size) return timesBase;

    return timesBase
      .map((t) => normTime(t))
      .filter((t) => !blocked.has(t));
  }, [timesBase, blockedLocal, selectedDate]);

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
          days={days}
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
          // ✅ blokkeer direct gekozen slot in UI
          const d = selectedDate;
          const t = selectedTime ? normTime(selectedTime) : null;

          if (d && t) {
            setBlockedLocal((prev) => {
              const next = new Map(prev);
              const set = new Set(next.get(d) ?? []);
              set.add(t);
              next.set(d, set);
              return next;
            });
          }

          // reset selectie
          setSelectedDate(null);
          setSelectedTime(null);
        }}
      />
    </section>
  );
}