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
    from?: string; // YYYY-MM-DD (of datetime)
    to?: string; // YYYY-MM-DD (of datetime)
    days?: number[]; // 0=Sunday ... 6=Saturday (optioneel)
    useDefaultTimes?: boolean;
    startTimes?: string[];
  }>;

  exceptions?: Array<{
    date: string; // YYYY-MM-DD (of datetime)
    closed?: boolean;
    startTimes?: string[];
    note?: string;
  }>;

  blockedSlots?: Array<{
    date: string; // YYYY-MM-DD (of datetime)
    startTime: string; // "10:00"
    reason?: string;
  }>;
};

function toIsoDay(value?: string | null) {
  if (!value) return undefined;
  return value.slice(0, 10);
}

function isWithinRange(date: string, from?: string, to?: string) {
  const f = toIsoDay(from);
  const t = toIsoDay(to);
  if (f && date < f) return false;
  if (t && date > t) return false;
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

  const fromIso = toIsoDay(from);
  const toIso = toIsoDay(to);
  if (!fromIso || !toIso) return [];

  const dates = eachDayIso(fromIso, toIso);

  return dates.map((date) => {
    // 1) basis
    let isOpen = !defaultClosed;
    let times: string[] = isOpen ? [...defaultTimes] : [];
    let note: string | undefined;

    // 2) openRanges
    const ranges = settings?.openRanges ?? [];
    for (const r of ranges) {
      const rFrom = toIsoDay(r.from);
      const rTo = toIsoDay(r.to);
      if (!isWithinRange(date, rFrom, rTo)) continue;

      // optioneel: weekdag filter
      if (Array.isArray(r.days) && r.days.length) {
        const jsDay = new Date(date + "T00:00:00").getDay(); // 0-6
        if (!r.days.includes(jsDay)) continue;
      }

      isOpen = true;

      const hasStartTimes = (r.startTimes?.length ?? 0) > 0;

      if (r.useDefaultTimes === true) {
        times = [...defaultTimes];
      } else if (r.useDefaultTimes === false) {
        times = hasStartTimes ? [...(r.startTimes ?? [])] : [...defaultTimes];
      } else {
        // undefined => intuïtief: als range tijden heeft -> die, anders default
        times = hasStartTimes ? [...(r.startTimes ?? [])] : [...defaultTimes];
      }
    }

    // 3) exceptions per dag
    const ex = (settings?.exceptions ?? []).find(
      (e) => toIsoDay(e.date) === date
    );

    if (ex) {
      if (typeof ex.closed === "boolean") {
        isOpen = !ex.closed;
        if (!isOpen) times = [];
      }

      if (Array.isArray(ex.startTimes)) {
        isOpen = true;
        times = [...ex.startTimes];
      }

      if (ex.note) note = ex.note;
    }

    // 4) blockedSlots filteren
    const blocked = (settings?.blockedSlots ?? []).filter(
      (b) => toIsoDay(b.date) === date
    );

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