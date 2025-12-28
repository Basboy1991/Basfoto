// sanity/schemaTypes/sitePage.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "sitePage",
  title: "Site pagina",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required().min(3),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    // =========================
    // SEO
    // =========================
    defineField({
      name: "seoTitle",
      title: "SEO titel",
      type: "string",
      description:
        "Titel voor Google (optioneel). Als leeg: gebruikt de paginatitel.",
      validation: (Rule) =>
        Rule.max(70).warning("Houd SEO titel liefst < 60-70 tekens."),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO beschrijving",
      type: "text",
      rows: 3,
      description: "Korte beschrijving voor Google (optioneel).",
      validation: (Rule) =>
        Rule.max(170).warning(
          "Houd meta description liefst rond 150-160 tekens."
        ),
    }),

    defineField({
      name: "seoImage",
      title: "SEO / Social image (OG image)",
      type: "image",
      options: { hotspot: true },
      description:
        "Wordt gebruikt als Open Graph afbeelding (delen op WhatsApp/Facebook/LinkedIn).",
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

    // =========================
    // CONTENT
    // =========================
    defineField({
      name: "media",
      title: "Header media",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    }),

    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "content",
      title: "Inhoud",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normaal", value: "normal" },
            { title: "Kop 2", value: "h2" },
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
    }),
  ],

  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title: title ?? "Site pagina",
        subtitle: slug ? `/${slug}` : "(geen slug)",
      };
    },
  },
});