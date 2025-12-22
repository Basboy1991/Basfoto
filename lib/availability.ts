// lib/availability.ts

export type AvailabilitySettings = {
  timezone?: string;
  advanceDays?: number;

  defaultClosed?: boolean;
  defaultStartTimes?: string[];

  openRanges?: Array<{
    label?: string;
    from: string; // YYYY-MM-DD
    to: string;   // YYYY-MM-DD
    days?: string[]; // ["mon","tue",...]
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
    date: string;      // YYYY-MM-DD
    startTime: string; // "10:00"
    reason?: string;
  }>;
};

export type DayAvailability = {
  date: string;           // YYYY-MM-DD
  closed: boolean;        // true = dicht
  startTimes: string[];   // ["10:00","13:00"]
};

function toDate(d: string) {
  // d = YYYY-MM-DD
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}
function toIsoDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function inRange(date: string, from: string, to: string) {
  return date >= from && date <= to;
}
function weekdayKey(date: string) {
  // NL week: mon..sun
  const d = toDate(date);
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  return map[d.getDay()];
}

export function getAvailabilityForRange(
  settings: AvailabilitySettings,
  from: string,
  to: string
): DayAvailability[] {
  const defaultClosed = Boolean(settings?.defaultClosed ?? false);
  const defaultStartTimes = (settings?.defaultStartTimes ?? []).filter(Boolean);

  const openRanges = settings?.openRanges ?? [];
  const exceptions = settings?.exceptions ?? [];
  const blocked = settings?.blockedSlots ?? [];

  // Loop days
  const start = toDate(from);
  const end = toDate(to);

  const out: DayAvailability[] = [];
  for (let cur = new Date(start); cur <= end; cur = addDays(cur, 1)) {
    const date = toIsoDate(cur);
    const dayKey = weekdayKey(date);

    // 1) start with defaults
    let closed = defaultClosed;
    let startTimes = [...defaultStartTimes];

    // 2) apply openRanges (kan default openzetten + tijden geven)
    // Als defaultClosed=true, dan moet een openRange die dag "open" maken.
    const matchingRanges = openRanges.filter((r) => {
      if (!r?.from || !r?.to) return false;
      if (!inRange(date, r.from, r.to)) return false;
      if (r.days?.length) return r.days.includes(dayKey);
      return true;
    });

    if (matchingRanges.length) {
      // Als er een range matcht: open (tenzij je bewust dicht wilt via exception)
      closed = false;

      // kies tijden: als range useDefaultTimes → defaultStartTimes, anders range.startTimes
      // bij meerdere ranges: neem de eerste met expliciete startTimes, anders default
      const withCustomTimes = matchingRanges.find((r) => r.startTimes?.length && !r.useDefaultTimes);

      if (withCustomTimes?.startTimes?.length) {
        startTimes = [...withCustomTimes.startTimes];
      } else {
        // als ten minste één range zegt "useDefaultTimes" of er zijn geen custom tijden:
        startTimes = [...defaultStartTimes];
      }
    }

    // 3) apply exception for exact date (override)
    const ex = exceptions.find((e) => e.date === date);
    if (ex) {
      if (typeof ex.closed === "boolean") closed = ex.closed;
      if (ex.startTimes) startTimes = [...ex.startTimes];
    }

    // 4) remove blocked slots for that date
    const blockedTimes = blocked.filter((b) => b.date === date).map((b) => b.startTime);
    startTimes = startTimes.filter((t) => !blockedTimes.includes(t));

    // 5) if no times => treat as closed for UI purposes
    if (!startTimes.length) closed = true;

    out.push({ date, closed, startTimes });
  }

  return out;
}