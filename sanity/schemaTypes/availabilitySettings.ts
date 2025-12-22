import { defineField, defineType } from "sanity";

export default defineType({
  name: "availabilitySettings",
  title: "Beschikbaarheid (instellingen)",
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
      initialValue: "Europe/Amsterdam",
      description: "Laat dit meestal staan.",
    }),

    defineField({
      name: "defaultClosed",
      title: "Standaard dicht",
      type: "boolean",
      initialValue: true,
      description:
        "Aan = alle dagen zijn dicht tenzij je ze open zet (handigste start).",
    }),

    defineField({
      name: "defaultStartTimes",
      title: "Standaard starttijden",
      type: "array",
      of: [{ type: "string" }],
      description:
        'Welke tijden zijn standaard boekbaar (bv. "10:00", "13:00", "16:00").',
      initialValue: ["10:00", "13:00", "16:00"],
    }),

    defineField({
      name: "closedDates",
      title: "Gesloten dagen (losse datums)",
      type: "array",
      of: [{ type: "date" }],
      description: "Bijv. vakanties / privé / volgeboekt.",
    }),

    defineField({
      name: "openRanges",
      title: "Open ranges",
      type: "array",
      description:
        "Zet een periode open + optioneel specifieke starttijden (laat leeg = standaard tijden).",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "from",
              title: "Van",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "to",
              title: "Tot",
              type: "date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "startTimes",
              title: "Starttijden (optioneel)",
              type: "array",
              of: [{ type: "string" }],
              description:
                'Laat leeg = gebruikt "Standaard starttijden".',
            }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Beschikbaarheid" };
    },
  },
});