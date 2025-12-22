import { defineField, defineType } from "sanity";

const DAYS = [
  { title: "Maandag", value: "mon" },
  { title: "Dinsdag", value: "tue" },
  { title: "Woensdag", value: "wed" },
  { title: "Donderdag", value: "thu" },
  { title: "Vrijdag", value: "fri" },
  { title: "Zaterdag", value: "sat" },
  { title: "Zondag", value: "sun" },
];

export default defineType({
  name: "availabilitySettings",
  title: "Beschikbaarheid",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      initialValue: "Beschikbaarheid",
      readOnly: true,
    }),

    defineField({
      name: "timezone",
      title: "Tijdzone",
      type: "string",
      description: "Voor NL meestal Europe/Amsterdam",
      initialValue: "Europe/Amsterdam",
    }),

    defineField({
      name: "slotMinutes",
      title: "Slot duur (minuten)",
      type: "number",
      description:
        "Wordt later gebruikt om te checken of een starttijd nog past. Laat op 60 staan als je 1 uur blokken wil.",
      initialValue: 60,
      validation: (Rule) => Rule.required().min(15).max(240),
    }),

    defineField({
      name: "advanceDays",
      title: "Hoeveel dagen vooruit boekbaar",
      type: "number",
      description: "Bijv. 60 = de komende 60 dagen zichtbaar/boekbaar",
      initialValue: 60,
      validation: (Rule) => Rule.required().min(7).max(365),
    }),

    defineField({
      name: "defaultClosed",
      title: "Default gesloten",
      type: "boolean",
      description: "Aan = alles is dicht tenzij je open ranges instelt.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "openRanges",
      title: "Open ranges",
      type: "array",
      description:
        "Maak een periode open (datum van/tot), kies weekdagen en starttijden (bijv. 10:00, 13:00, 16:00).",
      of: [
        {
          type: "object",
          name: "openRange",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Bijv. 'Zaterdag ochtenden' of 'Voorjaarsactie'",
            }),
            defineField({
              name: "from",
              title: "Vanaf (datum)",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "to",
              title: "Tot (datum)",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "days",
              title: "Weekdagen",
              type: "array",
              of: [{ type: "string" }],
              options: { list: DAYS },
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "startTimes",
              title: "Starttijden (HH:MM)",
              type: "array",
              description: "Voorbeeld: 10:00, 13:00, 16:00",
              of: [
                {
                  type: "string",
                  validation: (Rule) =>
                    Rule.regex(/^\d{2}:\d{2}$/, {
                      name: "HH:MM",
                      invert: false,
                    }),
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              label: "label",
              from: "from",
              to: "to",
              days: "days",
              startTimes: "startTimes",
            },
            prepare({ label, from, to, days, startTimes }) {
              const dayStr = Array.isArray(days) ? days.join(", ") : "";
              const timeStr = Array.isArray(startTimes) ? startTimes.join(", ") : "";
              return {
                title: label || "Open range",
                subtitle: `${from || "?"} → ${to || "?"} | ${dayStr} | ${timeStr}`,
              };
            },
          },
        },
      ],
      initialValue: [],
    }),

    defineField({
      name: "exceptions",
      title: "Uitzonderingen (specifieke datum)",
      type: "array",
      description:
        "Gebruik dit om 1 dag dicht te zetten of juist extra open te zetten met eigen starttijden.",
      of: [
        {
          type: "object",
          name: "exception",
          fields: [
            defineField({
              name: "date",
              title: "Datum",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "closed",
              title: "Gesloten op deze datum",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "startTimes",
              title: "Starttijden (alleen als NIET gesloten)",
              type: "array",
              of: [
                {
                  type: "string",
                  validation: (Rule) =>
                    Rule.regex(/^\d{2}:\d{2}$/, {
                      name: "HH:MM",
                      invert: false,
                    }),
                },
              ],
              hidden: ({ parent }) => Boolean(parent?.closed),
            }),
            defineField({
              name: "note",
              title: "Notitie",
              type: "string",
              description: "Bijv. 'Alleen ochtend' / 'Privé' / 'Kerst'",
            }),
          ],
          preview: {
            select: {
              date: "date",
              closed: "closed",
              startTimes: "startTimes",
              note: "note",
            },
            prepare({ date, closed, startTimes, note }) {
              const t = Array.isArray(startTimes) ? startTimes.join(", ") : "";
              return {
                title: `${date || "Datum"} — ${closed ? "GESLOTEN" : "OPEN"}`,
                subtitle: closed ? note || "" : `${t}${note ? ` · ${note}` : ""}`,
              };
            },
          },
        },
      ],
      initialValue: [],
    }),

    defineField({
      name: "blockedSlots",
      title: "Geblokkeerde starttijden",
      type: "array",
      description:
        "Als er al iets staat (of je wil een tijd blokkeren): kies datum + starttijd. Wordt later door het formulier uitgesloten.",
      of: [
        {
          type: "object",
          name: "blockedSlot",
          fields: [
            defineField({
              name: "date",
              title: "Datum",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "startTime",
              title: "Starttijd (HH:MM)",
              type: "string",
              validation: (Rule) =>
                Rule.required().regex(/^\d{2}:\d{2}$/, {
                  name: "HH:MM",
                  invert: false,
                }),
            }),
            defineField({
              name: "reason",
              title: "Reden",
              type: "string",
            }),
          ],
          preview: {
            select: { date: "date", startTime: "startTime", reason: "reason" },
            prepare({ date, startTime, reason }) {
              return {
                title: `${date || "Datum"} — ${startTime || ""}`,
                subtitle: reason || "Geblokkeerd",
              };
            },
          },
        },
      ],
      initialValue: [],
    }),
  ],
});