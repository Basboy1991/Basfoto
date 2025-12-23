// lib/availability.ts

export type DayAvailability = {
  date: string; // "YYYY-MM-DD"
  isOpen: boolean;
  times: string[]; // ["10:00","13:00"]
  note?: string;
};

export type AvailabilitySettings = {
  defaultClosed?: boolean;
  defaultStartTimes?: string[];

  // Ranges die open kunnen zetten (eventueel alleen bepaalde weekdagen)
  openRanges?: Array<{
    label?: string;
    from?: string; // "YYYY-MM-DD"
    to?: string; // "YYYY-MM-DD"
    days?: number[]; // 0=Sunday ... 6=Saturday
    useDefaultTimes?: boolean;
    startTimes?: string[];
  }>;

  // Exceptions per specifieke datum
  exceptions?: Array<{
    date: string; // "YYYY-MM-DD"
    closed?: boolean; // true = dicht, false = open
    startTimes?: string[]; // als gevuld -> override tijden
    note?: string;
  }>;

  // Losse blokkades (één starttijd op één datum blokkeren)
  blockedSlots?: Array<{
    date: string; // "YYYY-MM-DD"
    startTime: string; // "10:00"
    reason?: string;
  }>;
};

/* ---------------------------
   Helpers
--------------------------- */

function toIsoDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function listDates(from: string, to: string) {
  const res: string[] = [];
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    res.push(toIsoDate(d));
  }
  return res;
}

function isWithinRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function normalizeTimes(times?: string[]) {
  return (times ?? [])
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    .map((t) => t.trim())
    .filter((t) => /^\d{1,2}:\d{2}$/.test(t)); // basic sanity
}

function uniqueSorted(times: string[]) {
  return Array.from(new Set(times)).sort();
}

/* ---------------------------
   Main
--------------------------- */

/**
 * Berekent beschikbaarheid per dag voor een range.
 *
 * Gedrag:
 * - defaultClosed = true => alles standaard dicht, alleen ranges/exceptions kunnen openen
 * - defaultClosed = false => alles standaard open met defaultStartTimes
 * - openRanges: zet open + bepaalt tijden:
 *    - useDefaultTimes=true => defaultStartTimes
 *    - startTimes gevuld => startTimes
 *    - startTimes leeg + useDefaultTimes=false => fallback naar defaultStartTimes
 * - exceptions: overschrijven per dag (dicht/open + tijden + note)
 * - blockedSlots: verwijdert losse tijden
 */
export function getAvailabilityForRange(
  settings: AvailabilitySettings,
  from: string,
  to: string
): DayAvailability[] {
  const defaultClosed = Boolean(settings?.defaultClosed);

  const defaultTimes = normalizeTimes(settings?.defaultStartTimes);

  const dates = listDates(from, to);

  return dates.map((date) => {
    // 1) Basis toestand
    let isOpen = !defaultClosed;
    let times: string[] = isOpen ? [...defaultTimes] : [];
    let note: string | undefined;

    // 2) Open ranges (kunnen open zetten en tijden bepalen)
    const ranges = settings?.openRanges ?? [];
    for (const r of ranges) {
      if (!isWithinRange(date, r.from, r.to)) continue;

      // dag van de week filter (optioneel)
      if (Array.isArray(r.days) && r.days.length > 0) {
        const jsDay = new Date(`${date}T00:00:00`).getDay(); // 0-6
        if (!r.days.includes(jsDay)) continue;
      }

      isOpen = true;

      const rangeTimesRaw = r.useDefaultTimes
        ? defaultTimes
        : normalizeTimes(r.startTimes);

      // ✅ Belangrijk: als startTimes leeg is, fallback naar defaultTimes
      const rangeTimes =
        rangeTimesRaw.length > 0 ? rangeTimesRaw : defaultTimes;

      times = [...rangeTimes];
    }

    // 3) Exceptions (per datum, hoogste prioriteit)
    const ex = (settings?.exceptions ?? []).find((e) => e.date === date);
    if (ex) {
      if (typeof ex.closed === "boolean") {
        isOpen = !ex.closed;
      }

      const exTimes = normalizeTimes(ex.startTimes);

      // Als er expliciet tijden worden gezet -> open (tenzij closed=true)
      if (exTimes.length > 0) {
        times = [...exTimes];
        if (ex.closed !== true) isOpen = true;
      }

      if (ex.note) note = ex.note;

      if (!isOpen) times = [];
    }

    // 4) Blocked slots (verwijder losse startTime)
    if (isOpen && times.length > 0) {
      const blocked = (settings?.blockedSlots ?? []).filter(
        (b) => b.date === date
      );
      if (blocked.length) {
        const blockedSet = new Set(blocked.map((b) => b.startTime));
        times = times.filter((t) => !blockedSet.has(t));
      }
    }

    // 5) Final clean
    const finalTimes = isOpen ? uniqueSorted(times) : [];

    return {
      date,
      isOpen,
      times: finalTimes,
      ...(note ? { note } : {}),
    };
  });
}