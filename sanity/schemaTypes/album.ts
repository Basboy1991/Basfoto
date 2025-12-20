import { defineField, defineType } from "sanity";

export default defineType({
  name: "album",
  title: "Album",
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
      name: "description",
      title: "Omschrijving",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "coverImage",
      title: "Cover afbeelding (voor portfolio overzicht)",
      type: "image",
      options: { hotspot: true },
      description: "Deze afbeelding zie je op /portfolio als cover van dit album.",
    }),

    defineField({
      name: "cloudinaryFolder",
      title: "Cloudinary folder",
      type: "string",
      description: "Bijv: Portfolio/huisdieren (exact overnemen uit Cloudinary).",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "coverPublicId",
      title: "Optioneel: Cloudinary cover public_id",
      type: "string",
      description:
        "Alleen als je de cover liever uit Cloudinary wil laden (laat leeg als je coverImage gebruikt).",
    }),
  ],
});
