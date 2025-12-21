import { defineField, defineType } from "sanity";

export default defineType({
  name: "package",
  title: "Pakket",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "subtitle",
      title: "Subtitel",
      type: "string",
      description: "Kleine ondertitel (bijv. 'perfect voor snel het perfecte plaatje')",
    }),

    defineField({
      name: "price",
      title: "Prijs",
      type: "string",
      description: "Bijv: 35 of 35,- (€ wordt automatisch toegevoegd op de site)",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "duration",
      title: "Duur",
      type: "string",
      description: "Bijv: 1 uur (wordt op site: 'Circa 1 uur fotoshoot')",
    }),

    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "string",
      description: "Bijv: 10 foto’s in hoge resolutie (komt als eerste bullet en is iets vetter)",
    }),

    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullets onder deliverables (bijv. 1 kledingwissel, studioshot, buitenshot in overleg)",
    }),

    defineField({
      name: "note",
      title: "Kleine noot (onder bullets)",
      type: "string",
      description: "Bijv: vanaf 5 km 0,23 per km (komt vlak boven de knop)",
    }),

    defineField({
      name: "featured",
      title: "Meest gekozen",
      type: "boolean",
      initialValue: false,
      description: "Toont badge ‘Meest gekozen’ op de kaart",
    }),

    defineField({
      name: "ctaLabel",
      title: "Knoptekst",
      type: "string",
      initialValue: "Boek dit pakket",
    }),

    defineField({
      name: "ctaHref",
      title: "Knop link",
      type: "string",
      description: "Bijv: /boek of /boek?pakket=lite",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "order",
      title: "Volgorde",
      type: "number",
      description: "Lager = hoger in lijst (bijv. 1,2,3). Laat leeg voor automatisch.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      featured: "featured",
      price: "price",
    },
    prepare({ title, subtitle, featured, price }) {
      const badge = featured ? "★ Meest gekozen" : "";
      const priceLabel = price ? `€${String(price).replace("€", "")}` : "";
      return {
        title: [title, badge].filter(Boolean).join(" "),
        subtitle: [subtitle, priceLabel].filter(Boolean).join(" · "),
      };
    },
  },
});