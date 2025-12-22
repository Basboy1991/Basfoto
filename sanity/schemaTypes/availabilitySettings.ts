import { defineField, defineType } from "sanity";

export default defineType({
  name: "availabilitySettings",
  title: "Beschikbaarheid (Boeken)",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      initialValue: "Beschikbaarheid",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "defaultClosed",
      title: "Standaard gesloten",
      type: "boolean",
      initialValue: true,
      description:
        "Als dit aan staat, is alles standaard gesloten tenzij je een Open range toevoegt.",
    }),

    defineField({
      name: "startTimes",
      title: "Standaard starttijden",
      type: "array",
      of: [{ type: "string" }],
      description:
        'Voorbeeld: ["10:00","13:00","15:00"]. Deze tijden verschijnen bij open dagen.',
    }),

    defineField({
      name: "openRanges",
      title: "Open ranges (periodes die boekbaar zijn)",
      type: "array",
      of: [
        {
          type: "object",
          name: "openRange",
          fields: [
            defineField({ name: "from", title: "Van", type: "date", validation: (Rule) => Rule.required() }),
            defineField({ name: "to", title: "Tot", type: "date", validation: (Rule) => Rule.required() }),
            defineField({
              name: "note",
              title: "Notitie",
              type: "string",
              description: "Optioneel (bijv. kerstvakantie open)",
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "closedDates",
      title: "Gesloten dagen (hele dag dicht)",
      type: "array",
      of: [{ type: "date" }],
      description: "Losse dagen die altijd dicht zijn.",
    }),

    defineField({
      name: "blockedSlots",
      title: "Geblokkeerde tijden (per dag)",
      type: "array",
      of: [
        {
          type: "object",
          name: "blockedSlot",
          fields: [
            defineField({ name: "date", title: "Datum", type: "date", validation: (Rule) => Rule.required() }),
            defineField({
              name: "times",
              title: "Geblokkeerde starttijden",
              type: "array",
              of: [{ type: "string" }],
              description: 'Voorbeeld: ["10:00","13:00"]',
            }),
            defineField({
              name: "reason",
              title: "Reden",
              type: "string",
              description: "Optioneel",
            }),
          ],
        },
      ],
    }),
  ],
});