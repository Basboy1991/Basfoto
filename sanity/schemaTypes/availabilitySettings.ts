import { defineField, defineType } from "sanity";

export default defineType({
  name: "availabilitySettings",
  title: "Beschikbaarheid (instellingen)",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      initialValue: "Beschikbaarheid",
      readOnly: true,
    }),

    // ✅ Default closed (B)
    defineField({
      name: "defaultClosed",
      title: "Standaard: alles gesloten",
      type: "boolean",
      initialValue: true,
      description:
        "Als dit aan staat, zijn alleen dagen in 'Open dagen' boekbaar (behalve als ze in een gesloten periode vallen).",
    }),

    // ✅ Open dagen (B)
    defineField({
      name: "openDates",
      title: "Open dagen (losse datums)",
      type: "array",
      of: [{ type: "date" }],
      options: { layout: "grid" },
      description:
        "Voeg hier alleen de dagen toe die je wél wil aanbieden. (Handig: plan bijv. 2 maanden vooruit.)",
    }),

    // ✅ Extra dicht periodes (ranges)
    defineField({
      name: "closedRanges",
      title: "Gesloten periodes (ranges)",
      type: "array",
      of: [
        {
          type: "object",
          name: "range",
          fields: [
            defineField({
              name: "from",
              title: "Van",
              type: "date",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "to",
              title: "Tot",
              type: "date",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "reason",
              title: "Reden (optioneel)",
              type: "string",
            }),
          ],
          preview: {
            select: { from: "from", to: "to", reason: "reason" },
            prepare({ from, to, reason }) {
              return {
                title: `${from} → ${to}`,
                subtitle: reason || "Gesloten",
              };
            },
          },
        },
      ],
      description:
        "Handig voor vakantie/drukte. Deze ranges winnen altijd, ook als een dag in 'Open dagen' staat.",
    }),

    // ✅ Tijdsloten (basis die we straks gebruiken in je formulier)
    defineField({
      name: "timeSlots",
      title: "Tijdsloten",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"],
      description:
        "De mogelijke starttijden. (Later koppelen we dit aan 'bezet/vrij'.)",
    }),

    // ✅ Optioneel: dagen van de week die je überhaupt aanbiedt (extra filter)
    defineField({
      name: "allowedWeekdays",
      title: "Toegestane dagen (optioneel)",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Maandag", value: "1" },
          { title: "Dinsdag", value: "2" },
          { title: "Woensdag", value: "3" },
          { title: "Donderdag", value: "4" },
          { title: "Vrijdag", value: "5" },
          { title: "Zaterdag", value: "6" },
          { title: "Zondag", value: "0" },
        ],
        layout: "grid",
      },
      description:
        "Als je dit invult, zijn alleen deze weekdagen überhaupt selecteerbaar (bovenop open/closed logic).",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Beschikbaarheid (instellingen)" };
    },
  },
});