// sanity/schemaTypes/contactRequest.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactRequest",
  title: "Contactbericht",
  type: "document",
  fields: [
    defineField({ name: "createdAt", title: "Aangemaakt op", type: "datetime" }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Nieuw", value: "new" },
          { title: "Beantwoord", value: "replied" },
          { title: "Afgehandeld", value: "done" },
        ],
      },
      initialValue: "new",
    }),

    defineField({ name: "name", title: "Naam", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "email", title: "E-mail", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "phone", title: "Telefoon", type: "string" }),

    defineField({
      name: "subject",
      title: "Onderwerp",
      type: "string",
    }),

    defineField({
      name: "message",
      title: "Bericht",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required().min(5),
    }),

    defineField({
      name: "preferredContact",
      title: "Voorkeur",
      type: "string",
      options: {
        list: [
          { title: "WhatsApp", value: "whatsapp" },
          { title: "E-mail", value: "email" },
          { title: "Telefoon", value: "phone" },
        ],
        layout: "radio",
      },
      initialValue: "whatsapp",
    }),

    defineField({
      name: "consent",
      title: "Toestemming",
      type: "boolean",
      initialValue: false,
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "email" },
  },
});