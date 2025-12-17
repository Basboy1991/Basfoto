import { defineField, defineType } from "sanity";

export default defineType({
  name: "sitePage",
  title: "Pagina",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel (intern)",
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
      name: "seoTitle",
      title: "SEO titel",
      type: "string",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO beschrijving",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "content",
      title: "Content",
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
      validation: (Rule) => Rule.required().min(1).error("Deze pagina moet content bevatten."),
    }),

    defineField({
      name: "media",
      title: "Afbeelding of slideshow",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: {
        layout: "grid",
      },
      description:
        "Sleep meerdere foto's tegelijk hierheen voor een slideshow. 1 foto = vaste header.",
    }),
  ],
});
