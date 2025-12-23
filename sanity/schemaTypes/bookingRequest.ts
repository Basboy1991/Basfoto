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

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "nieuw",
      options: {
        list: [
          { title: "Nieuw", value: "nieuw" },
          { title: "In behandeling", value: "in_behandeling" },
          { title: "Bevestigd", value: "bevestigd" },
          { title: "Afgewezen", value: "afgewezen" },
        ],
      },
    }),

    // ✅ keuze uit availability
    defineField({ name: "date", title: "Datum", type: "date", validation: (R) => R.required() }),
    defineField({
      name: "time",
      title: "Starttijd",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({ name: "timezone", title: "Timezone", type: "string" }),

    // ✅ shoot info
    defineField({
      name: "shootType",
      title: "Type shoot",
      type: "string",
      validation: (R) => R.required(),
      options: {
        list: [
          { title: "Gezin", value: "gezin" },
          { title: "Huisdieren", value: "huisdieren" },
          { title: "Zwangerschap", value: "zwangerschap" },
          { title: "Koppel", value: "koppel" },
          { title: "Anders", value: "anders" },
        ],
      },
    }),
    defineField({ name: "package", title: "Pakket (optioneel)", type: "string" }),
    defineField({ name: "location", title: "Locatie / omgeving", type: "string" }),

    // ✅ contact
    defineField({ name: "name", title: "Naam", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({ name: "phone", title: "Telefoon (optioneel)", type: "string" }),

    // ✅ inhoud
    defineField({
      name: "message",
      title: "Opmerkingen / wensen",
      type: "text",
      rows: 6,
      validation: (R) => R.required(),
    }),

    // ✅ marketing / privacy (optioneel)
    defineField({
      name: "consent",
      title: "Toestemming (privacy)",
      type: "boolean",
      initialValue: true,
    }),
  ],
});