import { defineField, defineType } from "sanity";

export default defineType({
  name: "bookingRequest",
  title: "Boeking aanvragen",
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
          { title: "Bezig", value: "in_progress" },
          { title: "Bevestigd", value: "confirmed" },
          { title: "Afgewezen", value: "rejected" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({ name: "date", title: "Datum", type: "date", validation: (Rule) => Rule.required() }),
    defineField({ name: "time", title: "Starttijd", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "timezone", title: "Tijdzone", type: "string" }),

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
      validation: (Rule) => Rule.required().email(),
    }),
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

    defineField({ name: "shootType", title: "Type shoot", type: "string" }),
    defineField({ name: "location", title: "Locatie / plaats", type: "string" }),

    defineField({ name: "message", title: "Opmerking", type: "text" }),

    defineField({
      name: "consent",
      title: "Toestemming",
      type: "boolean",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "submittedAt",
      title: "Ingediend op",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "email",
      date: "date",
      time: "time",
      status: "status",
    },
    prepare({ title, subtitle, date, time, status }) {
      const statusLabel =
        status === "new"
          ? "Nieuw"
          : status === "in_progress"
          ? "Bezig"
          : status === "confirmed"
          ? "Bevestigd"
          : status === "rejected"
          ? "Afgewezen"
          : status;

      return {
        title: title || "Boeking aanvraag",
        subtitle: `${subtitle || ""} • ${date || ""} ${time || ""} • ${statusLabel}`,
      };
    },
  },
});