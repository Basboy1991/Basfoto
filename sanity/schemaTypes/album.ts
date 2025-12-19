import { defineField, defineType } from "sanity";
import CloudinaryFolderInput from "../components/CloudinaryFolderInput";

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
      name: "cloudinaryFolder",
      title: "Cloudinary folder",
      type: "string",
      description: "Bijv: Portfolio/huisdieren (exact overnemen uit Cloudinary).",
      validation: (Rule) => Rule.required(),
      components: {
        input: CloudinaryFolderInput,
      },
    }),

    defineField({
      name: "coverPublicId",
      title: "Cover public_id (optioneel)",
      type: "string",
      description:
        "Optioneel: zet hier de public_id van de coverfoto. Laat leeg om de eerste foto uit de folder te gebruiken.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "cloudinaryFolder",
    },
  },
});
