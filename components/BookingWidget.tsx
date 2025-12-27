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
  const dd = String(d ?? "").padStart(