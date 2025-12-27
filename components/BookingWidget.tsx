"use client";

import { useEffect, useMemo, useState } from "react";
import BookingForm from "@/components/BookingForm";
import type { DayAvailability } from "@/lib/availability";

function normTime(s: string) {
  const t = String(s || "").trim();
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function formatDutchDayLabel(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map((x) => Number(x));
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const dayNames = ["zo", "ma", "di", "wo", "do", "vr", "za"];
  const day = dayNames[dt.getDay()] ?? "";
  const dd = String(d ?? "").padStart(2, "0");
  const mm = String(m ?? "").padStart(2, "0");
  const yyyy = String(y ?? "");
  return `${day} ${dd}-${mm}-${yyyy}`;
}

export default function BookingWidget({
  days,
  timezone,
}: {
  days: DayAvailability[];
  timezone: string;
}) {
  const [daysState, setDaysState] = useState<DayAvailability[]>(days);

  // ✅ resetKey force-remount dropdowns (fix: datum blijft staan)
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setDaysState(days);
  }, [days]);

  const openDays = useMemo(() => {
    return (daysState ?? []).filter((d) => d.isOpen && (d.times?.length ?? 0) > 0);
  }, [daysState]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const selectedDay = useMemo(() => {
    if (!selectedDate) return null;
    return openDays.find((d) => d.date === selectedDate) ?? null;
  }, [openDays, selectedDate]);

  const times = useMemo(() => (selectedDay?.times ?? []).map(normTime), [selectedDay]);

  // Als gekozen datum niet meer bestaat, reset selectie
  useEffect(() => {
    if (selectedDate && !openDays.some((d) => d.date === selectedDate)) {
      setSelectedDate("");
      setSelectedTime("");
      setResetKey((k) => k + 1);
    }
  }, [openDays, selectedDate]);

  // Als tijd niet meer bestaat, reset tijd
  useEffect(() => {
    if (selectedTime && !times.includes(normTime(selectedTime