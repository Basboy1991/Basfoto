"use client";

import { useEffect, useMemo, useState } from "react";
import BookingForm from "@/components/BookingForm";
import type { DayAvailability } from "@/lib/availability";

function normTime(s: string) {
  const t = String(s || "").trim();
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function formatDutchDayLabel(isoDate: string) {
  // isoDate: YYYY-MM-DD
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);

  const dayNames = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const day = dayNames[dt.getDay()] ?? "";

  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");

  return `${day} ${dd}-${mm}-${y}`;
}

export default function BookingWidget({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  /**
   * ✅ Lokale kopie zodat we direct een tijdslot
   * uit de UI kunnen verwijderen na boeken
   */
  const [daysState, setDaysState] = useState<DayAvailability[]>(days);

  /**
   * ✅ Na router.refresh() syncen we opnieuw
   * naar de server-waarheid
   */
  useEffect(() => {
    setDaysState(days);
  }, [days]);

  const openDays = useMemo(() => {
    return (daysState ?? []).filter(
      (d) => d.isOpen && (d.times?.length ?? 0) > 0
    );
  }, [daysState]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return openDays.find((d) => d.date === selectedDate) ?? null;
  }, [openDays, selectedDate]);

  const times = useMemo(() => {
    return (selectedDay?.times ?? []).map(normTime);
  }, [selectedDay]);

  /**
   * ✅ Als datum verdwijnt (bijv. na refresh),
   * reset selectie
   */
  useEffect(() => {
    if (selectedDate && !openDays.some((d) => d.date === selectedDate)) {
      setSelectedDate("");
      setSelectedTime("");
    }
  }, [openDays, selectedDate]);

  /**
   * ✅ Als tijd verdwijnt bij gekozen datum,
   * reset alleen tijd
   */
  useEffect(() => {
    if (selectedTime && !times.includes(normTime(selectedTime))) {
      setSelectedTime("");
    }
  }, [times, selectedTime]);

  return (
    <section
      className="mx-auto mt-12 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-5 md:p-6"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          Beschikbaarheid
        </h2>
        <p className="mt-1 text-sm italic text-[var(--text-soft)]">
          Kies een datum en tijd. (Tijdzone: {timezone})
        </p>
      </div>

      {/* ✅ DROPDOWNS – mobiel 1 regel */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {/* DATUM */}
        <div>
          <label className="text-sm font-medium text-[var(--text)]">
            Datum
          </label>

          <div className="relative mt-2">
            <select
              className="w-full appearance-none rounded-2xl bg-white/70 px-4 py-3 pr-10 text-sm"
              style={{ border: "1px solid var(--border)" }}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
              }}
            >
              <option value="">
                {openDays.length ? "Selecteer…" : "Geen data"}
              </option>

              {openDays.map((d) => (
                <option key={d.date} value={d.date}>
                  {formatDutchDayLabel(d.date)}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--text-soft)]">
              ▼
            </span>
          </div>
        </div>

        {/* TIJD */}
        <div>
          <label className="text-sm font-medium text-[var(--text)]">
            Tijd
          </label>

          <div className="relative mt-2">
            <select
              className="w-full appearance-none rounded-2xl bg-white/70 px-4 py-3 pr-10 text-sm disabled:opacity-60"
              style={{ border: "1px solid var(--border)" }}
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDate || times.length === 0}
            >
              <option value="">
                {!selectedDate
                  ? "Kies datum…"
                  : times.length
                  ? "Selecteer…"
                  : "Geen tijden"}
              </option>

              {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--text-soft)]">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* SAMENVATTING */}
      <div className="mt-5">
        <div
          className="rounded-2xl bg-white/60 p-3 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-sm font-medium text-[var(--text)]">
            Jouw keuze
          </p>
          <p className="mt-1 text-sm text-[var(--text-soft)]">
            {selectedDate ? formatDutchDayLabel(selectedDate) : "—"}{" "}
            {selectedTime ? `om ${selectedTime}` : ""}
          </p>
        </div>
      </div>

      {/* FORM */}
      <BookingForm
        date={selectedDate || null}
        time={selectedTime || null}
        timezone={timezone}
        onSuccess={({ date, time }) => {
          const bookedDate = date;
          const bookedTime = normTime(time);

          /**
           * ✅ HIER ZIT DE FIX:
           * we verwijderen het slot op basis
           * van het échte geboekte resultaat
           */
          setDaysState((prev) =>
            prev.map((d) => {
              if (d.date !== bookedDate) return d;

              const newTimes = (d.times ?? [])
                .map(normTime)
                .filter((t) => t !== bookedTime);

              return {
                ...d,
                times: newTimes,
                isOpen: newTimes.length > 0,
              };
            })
          );

          // reset selectie
          setSelectedDate("");
          setSelectedTime("");
        }}
      />
    </section>
  );
}