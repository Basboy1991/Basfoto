import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactRequest",
  title: "Contactberichten",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "Nieuw", value: "new" },
          { title: "Beantwoord", value: "replied" },
          { title: "Afgerond", value: "done" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Ingestuurd op",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "phone", title: "Telefoon", type: "string" }),
    defineField({ name: "subject", title: "Onderwerp", type: "string" }),
    defineField({
      name: "message",
      title: "Bericht",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "consent",
      title: "Toestemming",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subject: "subject", status: "status" },
    prepare({ title, subject, status }) {
      return {
        title: title ? String(title) : "Contactbericht",
        subtitle: `${subject ?? ""} • ${status ?? ""}`.trim(),
      };
    },
  },
});