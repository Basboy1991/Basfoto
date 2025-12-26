import { defineType, defineField } from "sanity";

export default defineType({
  name: "bookingRequest",
  title: "Boekingsaanvraag",
  type: "document",

  fields: [
    // =========================
    // STATUS & PLANNING
    // =========================
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "Nieuw", value: "new" },
          { title: "Bevestigd", value: "confirmed" },
          { title: "Afgewezen", value: "rejected" },
          { title: "Afgehandeld", value: "done" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "date",
      title: "Datum",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "time",
      title: "Starttijd",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "timezone",
      title: "Tijdzone",
      type: "string",
      initialValue: "Europe/Amsterdam",
    }),

    // =========================
    // CONTACTGEGEVENS
    // =========================
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "email",
      title: "E-mailadres",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: "phone",
      title: "Telefoonnummer",
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

    // =========================
    // SHOOT INFORMATIE
    // =========================
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
      title: "Opmerking van klant",
      type: "text",
      rows: 4,
    }),

    // =========================
    // META / TECHNISCH
    // =========================
    defineField({
      name: "consent",
      title: "Toestemming gegeven",
      type: "boolean",
      readOnly: true,
    }),

    defineField({
      name: "resendId",
      title: "Resend mail ID",
      type: "string",
      readOnly: true,
    }),

    defineField({
      name: "createdAt",
      title: "Aangemaakt op",
      type: "datetime",
      readOnly: true,
    }),
  ],

  // =========================
  // PREVIEW IN LIJST
  // =========================
  preview: {
    select: {
      name: "name",
      date: "date",
      time: "time",
      status: "status",
    },
    prepare({ name, date, time, status }) {
      return {
        title: name || "Onbekende aanvraag",
        subtitle: `${date ?? "?"} • ${time ?? "?"} • ${status ?? "new"}`,
      };
    },
  },
});