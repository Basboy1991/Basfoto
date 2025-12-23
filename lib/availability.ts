// lib/availability.ts

export type DayAvailability = {
  date: string;       // YYYY-MM-DD
  isOpen: boolean;    // true/false
  times: string[];    // ["10:00", "13:00", ...]
  note?: string;
};

type AvailabilitySettings = {
  defaultClosed?: boolean;
  defaultStartTimes?: string[];
  openRanges?: Array<{
    from?: string;
    to?: string;
    days?: number[]; // 0=Sunday ... 6=Saturday (als je dit gebruikt)
    useDefaultTimes?: boolean;
    startTimes?: string[];
    label?: string;
  }>;
  exceptions?: Array<{
    date: string; // YYYY-MM-DD
    closed?: boolean;
    startTimes?: string[];
    note?: string;
  }>;
  blockedSlots?: Array<{
    date: string;      // YYYY-MM-DD
    startTime: string; // "10:00"
    reason?: string;
  }>;
};

// helper(s) (als je ze al hebt mag je deze laten staan)
function isWithinRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function uniqueSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort();
}

/**
 * Deze functie moet altijd DayAvailability[] teruggeven met:
 * { date, isOpen, times }
 */
export function getAvailabilityForRange(
  settings: AvailabilitySettings,
  from: string,
  to: string
): DayAvailability[] {
  const defaultClosed = Boolean(settings?.defaultClosed);
  const defaultTimes = settings?.defaultStartTimes ?? [];

  // Maak lijst van dagen (YYYY-MM-DD)
  const days: string[] = [];
  const start = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    days.push(`${yyyy}-${mm}-${dd}`);
  }

  return days.map((date) => {
    // 1) basis open/closed
    let isOpen = !defaultClosed;
    let times: string[] = isOpen ? [...defaultTimes] : [];

    // 2) openRanges (zet open + tijden voor ranges)
    const ranges = settings?.openRanges ?? [];
    for (const r of ranges) {
      if (!isWithinRange(date, r.from, r.to)) continue;

      // Als je "days" gebruikt: check dag van de week
      if (Array.isArray(r.days) && r.days.length) {
        const jsDay = new Date(date + "T00:00:00").getDay(); // 0-6
        if (!r.days.includes(jsDay)) continue;
      }

      isOpen = true;

      const rangeTimes =
        r.useDefaultTimes ? (defaultTimes ?? []) : (r.startTimes ?? []);

      times = [...rangeTimes];
    }

    // 3) exceptions (overschrijven per dag)
    const ex = (settings?.exceptions ?? []).find((e) => e.date === date);
    let note: string | undefined;

    if (ex) {
      if (typeof ex.closed === "boolean") isOpen = !ex.closed;
      if (Array.isArray(ex.startTimes)) {
        times = ex.startTimes;
        isOpen = true; // als je expliciet tijden zet is het open
      }
      if (ex.note) note = ex.note;
      if (!isOpen) times = [];
    }

    // 4) blockedSlots (verwijder losse startTime)
    const blocked = (settings?.blockedSlots ?? []).filter((b) => b.date === date);
    if (blocked.length && times.length) {
      const blockedTimes = new Set(blocked.map((b) => b.startTime));
      times = times.filter((t) => !blockedTimes.has(t));
    }

    return {
      date,
      isOpen,
      times: isOpen ? uniqueSorted(times) : [],
      ...(note ? { note } : {}),
    };
  });
}