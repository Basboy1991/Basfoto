// sanity/schemaTypes/homePage.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",

  fields: [
    /* =========================
       SEO
    ========================= */
    defineField({
      name: "seoTitle",
      title: "SEO titel",
      type: "string",
      description:
        "Titel voor Google (optioneel). Als leeg: fallback naar site default.",
      validation: (Rule) =>
        Rule.max(70).warning("Houd SEO titel liefst < 60-70 tekens."),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO beschrijving",
      type: "text",
      rows: 3,
      description:
        "Korte omschrijving voor Google (optioneel). Als leeg: fallback naar site default.",
      validation: (Rule) =>
        Rule.max(170).warning("Houd meta description liefst rond 150-160 tekens."),
    }),

    defineField({
      name: "seoImage",
      title: "SEO / Social image (OG image)",
      type: "image",
      options: { hotspot: true },
      description:
        "Afbeelding voor delen op WhatsApp/Facebook/LinkedIn (1200x630 werkt top).",
    }),

    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (optioneel)",
      type: "url",
      description:
        "Meestal leeg laten. Alleen invullen als je een afwijkende canonical wil forceren.",
    }),

    defineField({
      name: "noIndex",
      title: "Niet indexeren (noindex)",
      type: "boolean",
      initialValue: false,
      description:
        "Zet aan als je deze pagina niet in Google wilt (bijv. tijdelijke test-home).",
    }),

    /* =========================
       HERO
    ========================= */
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "layout",
          title: "Afbeelding positie",
          type: "string",
          options: {
            list: [
              { title: "Links", value: "left" },
              { title: "Rechts", value: "right" },
            ],
            layout: "radio",
          },
          initialValue: "left",
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "media",
          title: "Hero afbeeldingen",
          type: "array",
          of: [
            defineField({
              name: "image",
              title: "Afbeelding",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          options: { layout: "grid" },
          validation: (Rule) =>
            Rule.min(1).error("Voeg minimaal 1 hero-afbeelding toe."),
        }),

        defineField({
          name: "headline",
          title: "Kopregel (gebruik Enter voor nieuwe regel)",
          type: "text",
          rows: 2,
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: "subline",
          title: "Subregel",
          type: "text",
          rows: 3,
        }),

        defineField({
          name: "supportingLine",
          title: "Ondersteunende zin (kort, optioneel)",
          type: "string",
          description:
            "Bijv: Persoonlijk, rustig en puur — met aandacht voor jouw moment.",
        }),

        defineField({
          name: "primaryCta",
          title: "Primaire knop",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Tekst", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
        }),

        defineField({
          name: "secondaryCta",
          title: "Secundaire knop",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Tekst", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
        }),
      ],
    }),

    /* =========================
       INTRO
    ========================= */
    defineField({
      name: "intro",
      title: "Intro tekst",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normaal", value: "normal" },
            { title: "Kop 2", value: "h2" },
          ],
          lists: [{ title: "Bullet", value: "bullet" }],
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

    /* =========================
       PORTFOLIO CARDS
    ========================= */
    defineField({
      name: "portfolioCards",
      title: "Portfolio kaarten",
      type: "array",
      validation: (Rule) => Rule.max(3),
      of: [
        defineField({
          name: "portfolioCard",
          title: "Portfolio kaart",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titel",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "text", title: "Korte tekst", type: "string" }),
            defineField({
              name: "featured",
              title: "Featured (groter tonen)",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "coverImage",
              title: "Cover afbeelding",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "buttonLabel",
              title: "Knoptekst",
              type: "string",
              initialValue: "Bekijk",
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),

    /* =========================
       REVIEWS
    ========================= */
    defineField({
      name: "reviews",
      title: "Reviews (uitgelicht)",
      type: "array",
      of: [
        defineField({
          name: "review",
          title: "Review",
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "name",
              title: "Naam",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "location", title: "Plaats", type: "string" }),
            defineField({
              name: "stars",
              title: "Aantal sterren (1-5)",
              type: "number",
              validation: (Rule) => Rule.min(1).max(5),
              initialValue: 5,
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),

    /* =========================
       CTA CARD
    ========================= */
    defineField({
      name: "cta",
      title: "Boek een shoot kaart",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Titel",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: "text", title: "Tekst", type: "text", rows: 2 }),
        defineField({
          name: "whatsappNumber",
          title: "WhatsApp nummer (bijv. 31612345678)",
          type: "string",
        }),
        defineField({
          name: "phoneNumber",
          title: "Telefoonnummer (bijv. 0612345678)",
          type: "string",
        }),
        defineField({ name: "email", title: "E-mail", type: "string" }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: "Homepage",
        subtitle: "Singleton document",
      };
    },
  },
});