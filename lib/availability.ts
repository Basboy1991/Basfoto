type OpenRange = { from: string; to: string; note?: string };
type BlockedSlot = { date: string; times?: string[]; reason?: string };

export type AvailabilitySettings = {
  defaultClosed?: boolean;
  startTimes?: string[];
  openRanges?: OpenRange[];
  closedDates?: string[];
  blockedSlots?: BlockedSlot[];
};

export type AvailabilityDay = {
  date: string; // YYYY-MM-DD
  isOpen: boolean;
  times: { time: string; available: boolean }[];
  note?: string;
};

function toISODate(d: Date) {
  // UTC-safe-ish for day-level logic
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseISODate(s: string) {
  // "2025-01-05" -> Date in local timezone (ok voor day grid)
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function inRange(day: string, from: string, to: string) {
  const t = parseISODate(day).getTime();
  return t >= parseISODate(from).getTime() && t <= parseISODate(to).getTime();
}

export function getAvailabilityForRange(
  settings: AvailabilitySettings,
  from: string,
  to: string
): AvailabilityDay[] {
  const startTimes = (settings.startTimes ?? []).filter(Boolean);

  const openRanges = settings.openRanges ?? [];
  const closedDates = new Set((settings.closedDates ?? []).filter(Boolean));

  // map date -> blocked times set
  const blockedMap = new Map<string, Set<string>>();
  for (const b of settings.blockedSlots ?? []) {
    if (!b?.date) continue;
    const set = new Set((b.times ?? []).filter(Boolean));
    if (!blockedMap.has(b.date)) blockedMap.set(b.date, set);
    else {
      // merge
      const cur = blockedMap.get(b.date)!;
      for (const t of set) cur.add(t);
    }
  }

  const defaultClosed = Boolean(settings.defaultClosed);

  const out: AvailabilityDay[] = [];
  const fromD = parseISODate(from);
  const toD = parseISODate(to);

  for (let d = new Date(fromD); d.getTime() <= toD.getTime(); d.setDate(d.getDate() + 1)) {
    const day = toISODate(d);

    // note: eerste matchende range-note
    const rangeNote = openRanges.find((r) => r?.from && r?.to && inRange(day, r.from, r.to))?.note;

    // open/closed logic
    const isClosedByList = closedDates.has(day);

    const isInOpenRange = openRanges.some((r) => r?.from && r?.to && inRange(day, r.from, r.to));

    // Default: als defaultClosed=true -> alleen open als in open range
    // Als defaultClosed=false -> open, behalve closedDates
    let isOpen = defaultClosed ? isInOpenRange : true;

    if (isClosedByList) isOpen = false;

    const blocked = blockedMap.get(day) ?? new Set<string>();

    const times = startTimes.map((t) => ({
      time: t,
      available: isOpen && !blocked.has(t),
    }));

    out.push({
      date: day,
      isOpen,
      times,
      note: rangeNote,
    });
  }

  return out;
}