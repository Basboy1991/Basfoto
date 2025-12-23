"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import type { DayAvailability } from "@/lib/availability";

export default function BookingWidget({
  days,
  timezone,
  initialFrom,
  initialTo,
}: {
  days: DayAvailability[];
  timezone: string;
  initialFrom: string; // YYYY-MM-DD
  initialTo: string;   // YYYY-MM-DD
}) {
  const router = useRouter();

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // ✅ Alleen dagen die echt boekbaar zijn tonen
  const openDays = useMemo(() => {
    return (days ?? []).filter((d) => d.isOpen && (d.times?.length ?? 0) > 0);
  }, [days]);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return openDays.find((d) => d.date === selectedDate) ?? null;
  }, [openDays, selectedDate]);

  const times = selectedDay?.times ?? [];

  function applyRange() {
    // URL aanpassen => server haalt nieuwe range op
    router.push(`/boek?from=${from}&to=${to}`);
  }

  return (
    <section
      className="mx-auto mt-12 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)]">Beschikbaarheid</h2>
        <p className="mt-2 text-sm italic text-[var(--text-soft)]">
          Kies een datum en daarna een starttijd. <span className="not-italic opacity-70">({timezone})</span>
        </p>
      </div>

      {/* ✅ RANGE PICKER */}
      <div
        className="mx-auto mt-6 grid max-w-xl gap-3 rounded-3xl bg-white/55 p-4 md:grid-cols-3 md:items-end"
        style={{ border: "1px solid var(--border)" }}
      >
        <label className="text-left text-xs text-[var(--text-soft)]">
          Van
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-white/70 px-3 py-2 text-sm text-[var(--text)]"
            style={{ border: "1px solid var(--border)" }}
          />
        </label>

        <label className="text-left text-xs text-[var(--text-soft)]">
          Tot
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full rounded-2xl bg-white/70 px-3 py-2 text-sm text-[var(--text)]"
            style={{ border: "1px solid var(--border)" }}
          />
        </label>

        <button
          type="button"
          onClick={applyRange}
          className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          style={{ background: "var(--accent-strong)" }}
        >
          Toon
        </button>
      </div>

      {/* ✅ Alleen open dagen */}
      <div className="mt-6">
        <AvailabilityPicker
          days={openDays}
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

      {/* SELECTIE */}
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
    </section>
  );
}