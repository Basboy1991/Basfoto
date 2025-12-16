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
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beschrijving",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "cloudinaryFolder",
      title: "Cloudinary folder (bijv. portfolio/gezinnen)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImagePublicId",
      title: "Cover public_id (optioneel)",
      type: "string",
    }),
    defineField({
      name: "isPrivate",
      title: "Privé album (later voor klanten)",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
