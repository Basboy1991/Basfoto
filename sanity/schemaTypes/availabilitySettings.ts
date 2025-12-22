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

const timeValidation = (Rule: any) =>
  Rule.regex(/^\d{2}:\d{2}$/, { name: "HH:MM", invert: false });

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
      initialValue: 60,
      validation: (Rule) => Rule.required().min(15).max(240),
    }),

    defineField({
      name: "advanceDays",
      title: "Hoeveel dagen vooruit boekbaar",
      type: "number",
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

    // ✅ NIEUW: standaard starttijden (globaal)
    defineField({
      name: "defaultStartTimes",
      title: "Standaard starttijden",
      type: "array",
      description:
        "Deze tijden worden gebruikt als default. Open ranges kunnen dit overnemen, of overrulen.",
      of: [
        {
          type: "string",
          validation: (Rule) => Rule.required().custom((v: string) => {
            if (!v) return true;
            return /^\d{2}:\d{2}$/.test(v) ? true : "Gebruik HH:MM (bijv. 10:00)";
          }),
        },
      ],
      initialValue: [],
    }),

    defineField({
      name: "openRanges",
      title: "Open ranges",
      type: "array",
      description:
        "Maak een periode open (datum van/tot), kies weekdagen en starttijden. Je kunt standaard tijden gebruiken.",
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

            // ✅ NIEUW: toggle voor default tijden
            defineField({
              name: "useDefaultTimes",
              title: "Gebruik standaard starttijden",
              type: "boolean",
              initialValue: true,
              description:
                "Aan = gebruikt ‘Standaard starttijden’ hierboven. Uit = kies starttijden speciaal voor deze range.",
            }),

            defineField({
              name: "startTimes",
              title: "Starttijden (override) (HH:MM)",
              type: "array",
              description: "Alleen invullen als je NIET de standaard tijden gebruikt.",
              of: [
                {
                  type: "string",
                  validation: (Rule) => timeValidation(Rule),
                },
              ],
              hidden: ({ parent }) => Boolean(parent?.useDefaultTimes),
            }),
          ],
          preview: {
            select: {
              label: "label",
              from: "from",
              to: "to",
              days: "days",
              useDefaultTimes: "useDefaultTimes",
              startTimes: "startTimes",
            },
            prepare({ label, from, to, days, useDefaultTimes, startTimes }) {
              const dayStr = Array.isArray(days) ? days.join(", ") : "";
              const timeStr = useDefaultTimes
                ? "Standaard tijden"
                : Array.isArray(startTimes)
                  ? startTimes.join(", ")
                  : "";
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
              title: "Starttijden (als OPEN) (HH:MM)",
              type: "array",
              of: [{ type: "string", validation: (Rule) => timeValidation(Rule) }],
              hidden: ({ parent }) => Boolean(parent?.closed),
            }),
            defineField({
              name: "note",
              title: "Notitie",
              type: "string",
            }),
          ],
          preview: {
            select: { date: "date", closed: "closed", startTimes: "startTimes", note: "note" },
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
      description: "Datum + starttijd die niet meer te boeken is.",
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
              validation: (Rule) => Rule.required().custom((v: string) => {
                if (!v) return true;
                return /^\d{2}:\d{2}$/.test(v) ? true : "Gebruik HH:MM (bijv. 10:00)";
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