import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactMessage",
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
          { title: "Afgehandeld", value: "done" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({ name: "createdAt", title: "Ontvangen op", type: "datetime", readOnly: true }),

    defineField({ name: "name", title: "Naam", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "email", title: "E-mail", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "phone", title: "Telefoon", type: "string" }),

    defineField({
      name: "preferredContact",
      title: "Voorkeur contact",
      type: "string",
      options: {
        list: [
          { title: "WhatsApp", value: "whatsapp" },
          { title: "E-mail", value: "email" },
          { title: "Bellen", value: "phone" },
        ],
      },
    }),

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
    select: { title: "name", subtitle: "email", status: "status" },
    prepare({ title, subtitle, status }) {
      return {
        title: title ?? "Contactbericht",
        subtitle: `${subtitle ?? ""} • ${status ?? ""}`,
      };
    },
  },
});