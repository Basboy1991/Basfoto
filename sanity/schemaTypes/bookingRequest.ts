import { defineField, defineType } from "sanity";

export default defineType({
  name: "bookingRequest",
  title: "Boekingsaanvraag",
  type: "document",

  fields: [
    defineField({
      name: "createdAt",
      title: "Ontvangen op",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "Nieuw", value: "new" },
          { title: "In behandeling", value: "in_progress" },
          { title: "Bevestigd", value: "confirmed" },
          { title: "Afgehandeld", value: "done" },
          { title: "Geannuleerd", value: "cancelled" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({ name: "date", title: "Datum", type: "string" }),
    defineField({ name: "time", title: "Tijd", type: "string" }),
    defineField({ name: "timezone", title: "Tijdzone", type: "string" }),

    defineField({ name: "shootType", title: "Type shoot", type: "string" }),
    defineField({ name: "package", title: "Pakket", type: "string" }),
    defineField({ name: "location", title: "Locatie", type: "string" }),

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

    defineField({
      name: "message",
      title: "Bericht / Opmerking",
      type: "text",
      rows: 5,
    }),

    defineField({
      name: "consent",
      title: "Toestemming gegeven",
      type: "boolean",
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "name",
      date: "date",
      time: "time",
      status: "status",
      email: "email",
    },
    prepare({ title, date, time, status, email }) {
      return {
        title: title || "(geen naam)",
        subtitle: `${date ?? "—"} ${time ?? ""} • ${status ?? "—"} • ${email ?? ""}`.trim(),
      };
    },
  },
});