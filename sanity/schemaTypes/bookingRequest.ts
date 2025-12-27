import { defineField, defineType } from "sanity";

export default defineType({
  name: "bookingRequest",
  title: "Boekingsaanvraag",
  type: "document",

  fields: [
    // =========================
    // STATUS & META
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

    // =========================
    // DATUM & TIJD
    // =========================
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
      title: "E-mail",
      type: "string",
      validation: (Rule) =>
        Rule.required().email().error("Vul een geldig e-mailadres in"),
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

    // =========================
    // SHOOT INFO
    // =========================
    defineField({
      name: "shootType",
      title: "Type shoot",
      type: "string",
    }),

    defineField({
      name: "count",
      title: "Aantal personen / huisdieren",
      type: "number",
      description: "Bijv. aantal personen of dieren",
      validation: (Rule) => Rule.min(1).integer(),
    }),

    defineField({
      name: "location",
      title: "Locatie / plaats",
      type: "string",
    }),

    defineField({
      name: "message",
      title: "Opmerking",
      type: "text",
      rows: 4,
    }),

    // =========================
    // TOESTEMMING
    // =========================
    defineField({
      name: "consent",
      title: "Toestemming gegevensgebruik",
      type: "boolean",
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value === true ? true : "Toestemming is verplicht"
        ),
    }),
  ],

  // =========================
  // PREVIEW IN SANITY STUDIO
  // =========================
  preview: {
    select: {
      name: "name",
      date: "date",
      time: "time",
      status: "status",
    },
    prepare({ name, date, time, status }) {
      const statusLabel =
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
        title: name || "Boekingsaanvraag",
        subtitle: `${date ?? ""} ${time ?? ""} • ${statusLabel}`,
      };
    },
  },
});