// sanity/schemaTypes/booking.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "booking",
  title: "Boeking",
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
          { title: "Afgewezen", value: "rejected" },
          { title: "Afgehandeld", value: "done" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "createdAt",
      title: "Aangemaakt op",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),

    defineField({
      name: "slot",
      title: "Gekozen moment",
      type: "object",
      fields: [
        defineField({
          name: "date",
          title: "Datum",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "time",
          title: "Tijd",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: "timezone", title: "Tijdzone", type: "string" }),
      ],
    }),

    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      fields: [
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
      ],
    }),

    defineField({
      name: "shoot",
      title: "Shoot",
      type: "object",
      fields: [
        defineField({ name: "shootType", title: "Type shoot", type: "string" }),
        defineField({ name: "location", title: "Locatie / plaats", type: "string" }),
        defineField({ name: "message", title: "Opmerking", type: "text" }),
      ],
    }),

    defineField({
      name: "meta",
      title: "Meta",
      type: "object",
      fields: [
        defineField({ name: "source", title: "Bron", type: "string" }),
        defineField({ name: "ip", title: "IP", type: "string" }),
        defineField({ name: "userAgent", title: "User-Agent", type: "string" }),
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],

  preview: {
    select: {
      title: "contact.name",
      date: "slot.date",
      time: "slot.time",
      status: "status",
    },
    prepare({ title, date, time, status }) {
      const statusMap: Record<string, string> = {
        new: "🟡 Nieuw",
        confirmed: "🟢 Bevestigd",
        rejected: "🔴 Afgewezen",
        done: "✅ Afgehandeld",
      };
      return {
        title: title || "Boeking",
        subtitle: `${statusMap[status] ?? status} • ${date ?? ""} ${time ?? ""}`.trim(),
      };
    },
  },
});
