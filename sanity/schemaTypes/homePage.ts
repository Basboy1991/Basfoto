import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
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
          validation: (Rule) => Rule.min(1).error("Voeg minimaal 1 hero-afbeelding toe."),
        }),
        defineField({
          name: "headline",
          title: "Kopregel",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "subline",
          title: "Subregel",
          type: "text",
          rows: 2,
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

    defineField({
      name: "portfolioCards",
      title: "Portfolio kaarten",
      type: "array",
      validation: (Rule) => Rule.max(3),
      of: [
        defineField({
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

    defineField({
      name: "reviews",
      title: "Reviews (uitgelicht)",
      type: "array",
      of: [
        defineField({
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
});
