import { defineField, defineType } from "sanity";

export default defineType({
  name: "faqPage",
  title: "FAQ pagina",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Paginatitel",
      type: "string",
      initialValue: "Veelgestelde vragen",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "intro",
      title: "Intro (optioneel)",
      type: "string",
      description: "Korte inleidende tekst boven de vragen",
    }),

    defineField({
      name: "items",
      title: "Vragen & antwoorden",
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
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Antwoord",
              type: "array",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.min(1).error("Voeg minimaal één vraag toe"),
    }),

    /* =========================
       SEO
       ========================= */
    defineField({
      name: "seoTitle",
      title: "SEO titel",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO beschrijving",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "seoImage",
      title: "SEO afbeelding",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
    }),
    defineField({
      name: "noIndex",
      title: "Niet indexeren (noindex)",
      type: "boolean",
      initialValue: false,
    }),
  ],
});