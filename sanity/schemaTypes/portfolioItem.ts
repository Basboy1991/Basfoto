import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolioItem",
  title: "Portfolio item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "string",
      options: {
        list: [
          { title: "Gezin", value: "gezin" },
          { title: "Huisdieren", value: "huisdieren" },
          { title: "Portret", value: "portret" },
          { title: "Newborn", value: "newborn" },
          { title: "Zwangerschap", value: "zwangerschap" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Uitgelicht",
      type: "boolean",
      initialValue: false,
      description: "Wordt gebruikt voor homepage/portfolio highlights.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover afbeelding",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Galerij (meerdere foto's)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
      description: "Sleep meerdere foto’s tegelijk.",
      validation: (Rule) => Rule.min(1).error("Voeg minimaal 1 foto toe."),
    }),
    defineField({
      name: "excerpt",
      title: "Korte intro (optioneel)",
      type: "text",
      rows: 3,
      description: "Komt onder titel op de detailpagina.",
    }),
    defineField({
      name: "body",
      title: "Verhaal (optioneel)",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normaal", value: "normal" },
            { title: "Kop 2", value: "h2" },
            { title: "Kop 3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Vet", value: "strong" },
              { title: "Cursief", value: "em" },
            ],
          },
          lists: [{ title: "Bullet", value: "bullet" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
