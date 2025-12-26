import { defineField, defineType } from "sanity";

export default defineType({
  name: "bookingRequest",
  title: "Boekingsaanvragen",
  type: "document",
  fields: [
    defineField({
      name: "createdAt",
      title: "Ontvangen op",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),

    // Status voor workflow in Studio
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "Nieuw", value: "new" },
          { title: "Bevestigd", value: "confirmed" },
          { title: "Afgehandeld", value: "done" },
          { title: "Geannuleerd", value: "cancelled" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),

    // Gekozen slot
    defineField({
      name: "date",
      title: "Datum",
      type: "date",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "time",
      title: "Starttijd",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "timezone",
      title: "Tijdzone",
      type: "string",
      initialValue: "Europe/Amsterdam",
      validation: (R) => R.required(),
    }),

    // Contact
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (R) =>
        R.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: "email",
          invert: false,
        }),
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
      initialValue: "whatsapp",
      options: {
        list: [
          { title: "WhatsApp", value: "whatsapp" },
          { title: "E-mail", value: "email" },
          { title: "Bellen", value: "phone" },
        ],
      },
    }),

    // Shoot info
    defineField({
      name: "shootType",
      title: "Type shoot",
      type: "string",
      options: {
        list: [
          { title: "Gezin", value: "Gezin" },
          { title: "Huisdier", value: "Huisdier" },
          { title: "Koppel", value: "Koppel" },
          { title: "Portret", value: "Portret" },
          { title: "Anders", value: "Anders" },
        ],
      },
    }),
    defineField({
      name: "location",
      title: "Locatie / plaats",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Opmerkingen / wensen",
      type: "text",
      rows: 6,
    }),

    // Privacy
    defineField({
      name: "consent",
      title: "Toestemming (privacy)",
      type: "boolean",
      initialValue: true,
      validation: (R) => R.required(),
    }),

    // Admin intern
    defineField({
      name: "adminNote",
      title: "Interne notitie",
      type: "text",
      rows: 3,
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
      const when = [date, time].filter(Boolean).join(" ");
      return {
        title: title || "Boekingsaanvraag",
        subtitle: `${subtitle || ""}${when ? ` • ${when}` : ""}${status ? ` • ${status}` : ""}`,
      };
    },
  },
});