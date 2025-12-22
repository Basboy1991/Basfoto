export type AvailabilitySettings = {
  timezone?: string;
  slotMinutes?: number;
  advanceDays?: number;
  defaultClosed: boolean;
  defaultStartTimes?: string[];
  openRanges?: Array<{
    label?: string;
    from: string; // YYYY-MM-DD
    to: string; // YYYY-MM-DD
    days: Array<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun">;
    useDefaultTimes?: boolean;
    startTimes?: string[];
  }>;
  exceptions?: Array<{
    date: string; // YYYY-MM-DD
    closed?: boolean;
    startTimes?: string[];
    note?: string;
  }>;
  blockedSlots?: Array<{
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    reason?: string;
  }>;
};

const DAY_MAP: Record<number, "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

function isValidTime(t: string) {
  return /^\d{2}:\d{2}$/.test(t);
}

function sortTimes(times: string[]) {
  return [...times].sort((a, b) => a.localeCompare(b));
}

function parseISODateToUTC(dateISO: string) {
  // dateISO = YYYY-MM-DD
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatUTCToISODate(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysUTC(d: Date, days: number) {
  const copy = new Date(d.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function inRange(dateISO: string, from: string, to: string) {
  return dateISO >= from && dateISO <= to; // werkt goed op YYYY-MM-DD strings
}

function weekdayKey(dateISO: string) {
  const dt = parseISODateToUTC(dateISO);
  return DAY_MAP[dt.getUTCDay()];
}

/**
 * Berekent beschikbare starttijden voor 1 datum (YYYY-MM-DD)
 * Volgorde:
 * 1) exceptions (overrulet alles)
 * 2) defaultClosed:
 *    - true -> alleen open via openRanges
 *    - false -> standaard open met defaultStartTimes + aanvullingen vanuit openRanges
 * 3) blockedSlots eraf
 */
export function getAvailableStartTimesForDate(
  settings: AvailabilitySettings,
  dateISO: string
): string[] {
  const defaultTimes = (settings.defaultStartTimes ?? []).filter(isValidTime);

  // 1) Exception?
  const ex = (settings.exceptions ?? []).find((e) => e.date === dateISO);
  if (ex) {
    if (ex.closed) return [];
    const exTimes = (ex.startTimes ?? []).filter(isValidTime);
    const times = exTimes.length ? exTimes : defaultTimes;
    return applyBlocked(settings, dateISO, sortTimes(uniq(times)));
  }

  const day = weekdayKey(dateISO);

  // ranges die matchen
  const matchingRanges = (settings.openRanges ?? []).filter(
    (r) =>
      r?.from &&
      r?.to &&
      inRange(dateISO, r.from, r.to) &&
      Array.isArray(r.days) &&
      r.days.includes(day)
  );

  let times: string[] = [];

  if (settings.defaultClosed) {
    // alleen open via ranges
    for (const r of matchingRanges) {
      const rangeTimes = r.useDefaultTimes
        ? defaultTimes
        : (r.startTimes ?? []).filter(isValidTime);
      times = times.concat(rangeTimes);
    }
  } else {
    // standaard open + ranges kunnen extra tijden toevoegen/overrulen
    times = defaultTimes.slice();
    for (const r of matchingRanges) {
      const rangeTimes = r.useDefaultTimes
        ? defaultTimes
        : (r.startTimes ?? []).filter(isValidTime);
      times = times.concat(rangeTimes);
    }
  }

  times = sortTimes(uniq(times));
  return applyBlocked(settings, dateISO, times);
}

function applyBlocked(settings: AvailabilitySettings, dateISO: string, times: string[]) {
  const blocked = (settings.blockedSlots ?? [])
    .filter((b) => b.date === dateISO)
    .map((b) => b.startTime);

  if (!blocked.length) return times;
  const blockedSet = new Set(blocked);
  return times.filter((t) => !blockedSet.has(t));
}

/**
 * Helper: geeft een lijst [{date, times[]}] voor een datumbereik (inclusief)
 */
export function getAvailabilityForRange(
  settings: AvailabilitySettings,
  fromISO: string,
  toISO: string
): Array<{ date: string; times: string[] }> {
  const start = parseISODateToUTC(fromISO);
  const end = parseISODateToUTC(toISO);

  const out: Array<{ date: string; times: string[] }> = [];
  let cursor = start;

  while (cursor.getTime() <= end.getTime()) {
    const dateISO = formatUTCToISODate(cursor);
    const times = getAvailableStartTimesForDate(settings, dateISO);
    out.push({ date: dateISO, times });
    cursor = addDaysUTC(cursor, 1);
  }

  return out;
}