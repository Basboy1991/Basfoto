// lib/availability.ts

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  isOpen: boolean;
  times: string[]; // ["10:00", "13:00", ...]
  note?: string;
};

export type AvailabilitySettings = {
  timezone?: string;
  slotMinutes?: number;
  advanceDays?: number;

  defaultClosed?: boolean;
  defaultStartTimes?: string[];

  openRanges?: Array<{
    label?: string;
    from?: string; // YYYY-MM-DD
    to?: string; // YYYY-MM-DD
    days?: number[]; // 0=Sunday ... 6=Saturday (optioneel)
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
    startTime: string; // "10:00"
    reason?: string;
  }>;
};

function isWithinRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function uniqueSorted(arr: string[]) {
  return Array.from(new Set(arr)).sort();
}

function eachDayIso(from: string, to: string) {
  const out: string[] = [];
  const start = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    out.push(`${yyyy}-${mm}-${dd}`);
  }
  return out;
}

export function getAvailabilityForRange(
  settings: AvailabilitySettings,
  from: string,
  to: string
): DayAvailability[] {
  const defaultClosed = Boolean(settings?.defaultClosed);
  const defaultTimes = settings?.defaultStartTimes ?? [];

  const dates = eachDayIso(from, to);

  return dates.map((date) => {
    // 1) basis
    let isOpen = !defaultClosed;
    let times: string[] = isOpen ? [...defaultTimes] : [];

    // 2) openRanges: zet open + tijden volgens range
    const ranges = settings?.openRanges ?? [];
    for (const r of ranges) {
      if (!isWithinRange(date, r.from, r.to)) continue;

      // optioneel: filter op weekdag
      if (Array.isArray(r.days) && r.days.length) {
        const jsDay = new Date(date + "T00:00:00").getDay(); // 0-6
        if (!r.days.includes(jsDay)) continue;
      }

      isOpen = true;

      const rangeTimes = r.useDefaultTimes
        ? defaultTimes
        : (r.startTimes ?? []);

      times = [...rangeTimes];
    }

    // 3) exceptions: per dag overschrijven
    const ex = (settings?.exceptions ?? []).find((e) => e.date === date);
    let note: string | undefined;

    if (ex) {
      if (typeof ex.closed === "boolean") {
        isOpen = !ex.closed;
        if (!isOpen) times = [];
      }

      if (Array.isArray(ex.startTimes)) {
        // als startTimes expliciet gezet zijn, is het open
        isOpen = true;
        times = ex.startTimes;
      }

      if (ex.note) note = ex.note;
    }

    // 4) blockedSlots: verwijder losse tijden
    const blocked = (settings?.blockedSlots ?? []).filter((b) => b.date === date);
    if (blocked.length && times.length) {
      const blockedTimes = new Set(blocked.map((b) => b.startTime));
      times = times.filter((t) => !blockedTimes.has(t));
    }

    const finalTimes = isOpen ? uniqueSorted(times) : [];

    return {
      date,
      isOpen,
      times: finalTimes,
      ...(note ? { note } : {}),
    };
  });
}