// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Bas Fotografie")
    .items([
      // =========================
      // PAGINA'S
      // =========================
      S.listItem()
        .title("Pagina’s")
        .child(
          S.list()
            .title("Pagina’s")
            .items([
              // Homepage singleton
              S.listItem()
                .title("Homepage")
                .child(S.document().schemaType("homePage").documentId("homePage")),

              // Statische / generieke pagina's
              S.documentTypeListItem("sitePage").title("Site pagina’s"),

              // FAQ singleton (als je faqPage hebt)
              S.listItem()
                .title("FAQ")
                .child(S.document().schemaType("faqPage").documentId("faqPage")),

              // Contact pagina (optioneel: als jij contact als sitePage doet, kun je dit weglaten)
              // S.listItem()
              //   .title("Contact pagina")
              //   .child(S.document().schemaType("contactPage").documentId("contactPage")),
            ])
        ),

      S.divider(),

      // =========================
      // CONTENT
      // =========================
      S.listItem()
        .title("Content")
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("portfolioItem").title("Portfolio"),
              S.documentTypeListItem("album").title("Albums"),
              S.documentTypeListItem("package").title("Pakketten"),
              S.documentTypeListItem("availabilitySettings").title("Beschikbaarheid"),
            ])
        ),

      S.divider(),

      // =========================
      // AANVRAGEN
      // =========================
      S.listItem()
        .title("Aanvragen")
        .child(
          S.list()
            .title("Aanvragen")
            .items([
              S.documentTypeListItem("bookingRequest").title("Boekingen"),
              S.documentTypeListItem("contactRequest").title("Contactberichten"),
            ])
        ),
    ]);