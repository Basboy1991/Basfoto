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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO titel",
      type: "string",
      description: "Titel voor Google (optioneel).",
    }),

    defineField({
      name: "seoDescription",
      title: "SEO beschrijving",
      type: "text",
      rows: 3,
      description: "Korte beschrijving voor Google (optioneel).",
    }),

    defineField({
      name: "media",
      title: "Header media (afbeelding/slideshow)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
      description:
        "Sleep meerdere foto's tegelijk hierheen voor een slideshow. 1 foto = vaste header.",
    }),

    // ✅ NIEUW: zichtbare intro (los van SEO)
    defineField({
      name: "intro",
      title: "Intro (zichtbaar op pagina)",
      type: "text",
      rows: 3,
      description: "Korte intro onder de titel (niet de SEO description).",
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
});