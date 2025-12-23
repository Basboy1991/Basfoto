"use client";

import { useEffect, useMemo, useState } from "react";
import AvailabilityPicker from "@/components/AvailabilityPicker";
import type { DayAvailability } from "@/lib/availability";

export default function BookingWidget({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  // ✅ Alleen dagen tonen die echt boekbaar zijn
  const openDays = useMemo(() => {
    return (days ?? []).filter((d) => d.isOpen && (d.times?.length ?? 0) > 0);
  }, [days]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // ✅ Auto-selecteer eerste open dag + houd selectie geldig bij updates
  useEffect(() => {
    if (!openDays.length) {
      setSelectedDate(null);
      setSelectedTime(null);
      return;
    }

    // Als er nog niks geselecteerd is: pak eerste open dag
    if (!selectedDate) {
      setSelectedDate(openDays[0].date);
      setSelectedTime(null);
      return;
    }

    // Als geselecteerde dag niet meer bestaat in openDays: reset naar eerste
    const stillExists = openDays.some((d) => d.date === selectedDate);
    if (!stillExists) {
      setSelectedDate(openDays[0].date);
      setSelectedTime(null);
    }
  }, [openDays, selectedDate]);

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return openDays.find((d) => d.date === selectedDate) ?? null;
  }, [openDays, selectedDate]);

  const times = selectedDay?.times ?? [];

  // ✅ Als dag wisselt, en de tijd bestaat niet meer: reset tijd
  useEffect(() => {
    if (!selectedTime) return;
    if (!times.includes(selectedTime)) setSelectedTime(null);
  }, [times, selectedTime]);

  if (!openDays.length) {
    return (
      <section
        className="mx-auto mt-12 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-6 text-center md:p-8"
        style={{ border: "1px solid var(--border)" }}
      >
        <h2 className="text-xl font-semibold text-[var(--text)]">Beschikbaarheid</h2>
        <p className="mt-3 text-sm text-[var(--text-soft)]">
          Er zijn nu geen boekbare dagen/tijden beschikbaar.
        </p>
        <p className="mt-2 text-xs text-[var(--text-soft)]">
          Check in Sanity: <strong>defaultStartTimes</strong> of je <strong>openRanges</strong> met tijden.
        </p>
      </section>
    );
  }

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

      {/* DATUM PICKER (alleen open dagen) */}
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

          {selectedDate && selectedTime ? (
            <p className="mt-2 text-xs text-[var(--text-soft)]">
              Tip: kopieer dit straks in je bericht/mail zodat ik ‘m direct kan vastzetten.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}