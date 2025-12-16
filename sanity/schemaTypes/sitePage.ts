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
    defineField({ name: "seoTitle", title: "SEO titel", type: "string" }),
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
      of: [{ type: "block" }],
    }),
  ],
});
