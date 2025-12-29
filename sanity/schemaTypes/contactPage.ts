// sanity/schemaTypes/contactPage.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contactpagina",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Contact",
    }),

    defineField({
      name: "intro",
      title: "Intro (zichtbaar)",
      type: "text",
      rows: 3,
      description: "Korte intro boven het formulier.",
    }),

    defineField({
      name: "formTitle",
      title: "Titel boven formulier",
      type: "string",
      initialValue: "Stuur een bericht",
    }),

    defineField({
      name: "successTitle",
      title: "Success titel",
      type: "string",
      initialValue: "Gelukt! 🎉",
    }),
    defineField({
      name: "successText",
      title: "Success tekst",
      type: "text",
      rows: 2,
      initialValue: "Dankjewel voor je bericht. Ik neem snel contact met je op.",
    }),

    // =========================
    // SEO
    // =========================
    defineField({
      name: "seoTitle",
      title: "SEO titel",
      type: "string",
      validation: (Rule) => Rule.max(70).warning("Houd SEO titel liefst < 60-70 tekens."),
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
  ],

  preview: {
    prepare() {
      return { title: "Contactpagina" };
    },
  },
});