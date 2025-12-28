// sanity/schemaTypes/faqPage.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "faqPage",
  title: "FAQ pagina",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      initialValue: "Veelgestelde vragen",
      validation: (Rule) => Rule.required().min(3),
    }),

    // SEO velden (zelfde patroon als sitePage/homePage)
    defineField({
      name: "seoTitle",
      title: "SEO titel",
      type: "string",
      description: "Titel voor Google (optioneel).",
      validation: (Rule) =>
        Rule.max(70).warning("Houd SEO titel liefst < 60-70 tekens."),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO beschrijving",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(170).warning("Houd meta description liefst rond 150-160 tekens."),
    }),
    defineField({
      name: "seoImage",
      title: "SEO / Social image (OG image)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (optioneel)",
      type: "url",
    }),
    defineField({
      name: "noIndex",
      title: "Niet indexeren (noindex)",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Korte intro boven de vragen.",
    }),

    defineField({
      name: "items",
      title: "Vragen",
      type: "array",
      of: [
        defineField({
          name: "faqItem",
          title: "FAQ item",
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Vraag",
              type: "string",
              validation: (Rule) => Rule.required().min(3),
            }),
            defineField({
              name: "answer",
              title: "Antwoord",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [
                    { title: "Normaal", value: "normal" },
                    { title: "Kop 3", value: "h3" },
                  ],
                  lists: [
                    { title: "Bullet", value: "bullet" },
                    { title: "Nummering", value: "number" },
                  ],
                  marks: {
                    decorators: [
                      { title: "Vet", value: "strong" },
                      { title: "Cursief", value: "em" },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "question" },
            prepare({ title }) {
              return { title: title ?? "FAQ item" };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],

  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "FAQ pagina" };
    },
  },
});