import { defineField, defineType } from "sanity";

export default defineType({
  name: "package",
  title: "Pakket",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Naam",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "subtitle",
      title: "Subtitel (kort)",
      type: "string",
      description: "Bijv. 'Perfect voor gezinnen'",
    }),

    defineField({
      name: "price",
      title: "Prijs",
      type: "string",
      description: "Bijv. '€ 189' of 'Vanaf € 189'",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "duration",
      title: "Duur",
      type: "string",
      description: "Bijv. '60 minuten'",
    }),

    defineField({
      name: "deliverables",
      title: "Oplevering",
      type: "string",
      description: "Bijv. '15 foto's in hoge resolutie'",
    }),

    defineField({
      name: "highlights",
      title: "Highlights (bullet points)",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(3).max(10),
    }),

    defineField({
      name: "featured",
      title: "Meest gekozen (uitlichten)",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "note",
      title: "Kleine opmerking (optioneel)",
      type: "string",
      description: "Bijv. 'Reiskosten in overleg' of 'Weekend +€25'",
    }),

    defineField({
      name: "ctaLabel",
      title: "Knoptekst",
      type: "string",
      initialValue: "Boek dit pakket",
    }),

    defineField({
      name: "ctaHref",
      title: "Knop link",
      type: "string",
      description: "Bijv. '/boek' of '/boek?pakket=mini'",
      initialValue: "/boek",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "order",
      title: "Volgorde",
      type: "number",
      initialValue: 10,
    }),
  ],
});