import { defineField, defineType } from "sanity";

export default defineType({
  name: "availabilitySettings",
  title: "Beschikbaarheid (Boekingen)",
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
      name: "unavailableDates",
      title: "Niet beschikbaar (datums)",
      type: "array",
      of: [{ type: "date" }],
      description: "Datums die niet boekbaar zijn (vakantie/vol).",
      options: { layout: "grid" },
    }),

    defineField({
      name: "timeSlots",
      title: "Tijdsloten (vaste tijden)",
      type: "array",
      of: [
        {
          name: "slot",
          title: "Tijdslot",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'Bijv. "09:00 – 10:00"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'Bijv. "09:00-10:00" (voor techniek/filters)',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
      description: "Deze tijden toon je in je formulier als dropdown.",
    }),

    defineField({
      name: "note",
      title: "Opmerking",
      type: "text",
      rows: 3,
      description: 'Bijv. "Avonden alleen in overleg".',
    }),
  ],

  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Beschikbaarheid" };
    },
  },
});