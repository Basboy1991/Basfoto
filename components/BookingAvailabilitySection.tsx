"use client";

import { useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import type { DayAvailability } from "@/lib/availability";

export default function BookingAvailabilitySection({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  const sorted = useMemo(() => {
    const copy = [...(days ?? [])];
    copy.sort((a, b) => a.date.localeCompare(b.date));
    return copy;
  }, [days]);

  const firstSelectableDate = useMemo(() => {
    const first = sorted.find((d) => d.isOpen && (d.times?.length ?? 0) > 0);
    return first?.date ?? null;
  }, [sorted]);

  const [selectedDate, setSelectedDate] = useState<string | null>(firstSelectableDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectableCount = useMemo(
    () => sorted.filter((d) => d.isOpen && (d.times?.length ?? 0) > 0).length,
    [sorted]
  );

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return sorted.find((d) => d.date === selectedDate) ?? null;
  }, [sorted, selectedDate]);

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedTime(null); // reset tijd als je van dag wisselt
  }

  if (!selectableCount) {
    return (
      <div
        className="rounded-3xl bg-[var(--surface-2)] p-8 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm font-semibold text-[var(--text)]">Geen tijden beschikbaar</p>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Check in Sanity of <strong>defaultStartTimes</strong> gevuld is, en/of je{" "}
          <strong>openRanges</strong> de juiste periode dekt.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 1) Datum kiezen */}
      <AvailabilityPicker
        days={sorted}
        timezone={timezone}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      {/* 2) Tijden kiezen */}
      <div
        className="mt-6 rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-center text-sm font-semibold text-[var(--text)]">
          {selectedDate ? `Tijden op ${selectedDate}` : "Kies eerst een dag"}
        </p>

        {!selectedDay ? (
          <p className="mt-3 text-center text-sm text-[var(--text-soft)]">Geen dag geselecteerd.</p>
        ) : selectedDay.isOpen && (selectedDay.times?.length ?? 0) > 0 ? (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {selectedDay.times.map((t) => {
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
        ) : (
          <p className="mt-3 text-center text-sm text-[var(--text-soft)]">
            Geen tijden voor deze dag.
          </p>
        )}

        {/* Gekozen samenvatting */}
        {selectedDate && selectedTime ? (
          <div
            className="mt-6 rounded-2xl bg-white/60 p-4 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-semibold text-[var(--text)]">Gekozen:</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              {selectedDate} om <strong>{selectedTime}</strong>{" "}
              <span className="opacity-70">({timezone})</span>
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}