// sanity/schemaTypes/bookingRequest.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "bookingRequest",
  title: "Boekingsaanvraag",
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
          { title: "Bevestigd", value: "confirmed" },
          { title: "Afgerond", value: "done" },
          { title: "Geannuleerd", value: "cancelled" },
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
      name: "date",
      title: "Datum",
      type: "string",
      description: "YYYY-MM-DD",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "time",
      title: "Tijd",
      type: "string",
      description: "Bijv. 10:00",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "timezone",
      title: "Tijdzone",
      type: "string",
      initialValue: "Europe/Amsterdam",
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
    defineField({
      name: "phone",
      title: "Telefoon",
      type: "string",
    }),
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
      name: "shootType",
      title: "Type shoot",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Locatie / plaats",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Bericht",
      type: "text",
      rows: 5,
    }),

    defineField({
      name: "consent",
      title: "Toestemming",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitleDate: "date",
      subtitleTime: "time",
      status: "status",
    },
    prepare({ title, subtitleDate, subtitleTime, status }) {
      const s =
        status === "new"
          ? "Nieuw"
          : status === "confirmed"
          ? "Bevestigd"
          : status === "done"
          ? "Afgerond"
          : status === "cancelled"
          ? "Geannuleerd"
          : status;

      return {
        title: title ? `${title}` : "Boekingsaanvraag",
        subtitle: `${subtitleDate ?? ""} ${subtitleTime ?? ""} • ${s}`,
      };
    },
  },
});