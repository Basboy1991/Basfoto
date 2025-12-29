// sanity/structure.ts
import {
  CalendarIcon,
  DocumentIcon,
  HomeIcon,
  ImageIcon,
  TagIcon,
  CogIcon,
} from "@sanity/icons";

export const structure = (S: any) =>
  S.list()
    .title("Bas Fotografie")
    .items([
      /* =========================
         PAGINA'S
      ========================= */
      S.listItem()
        .title("Pagina’s")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Pagina’s")
            .items([
              // Homepage (singleton)
S.listItem()
  .title("Homepage")
  .icon(HomeIcon)
  .child(S.document().schemaType("homePage").documentId("homePage")),

// Contact (singleton)
S.listItem()
  .title("Contactpagina")
  .icon(DocumentIcon)
  .child(S.document().schemaType("contactPage").documentId("contactPage")),

// FAQ (singleton)
S.listItem()
  .title("FAQ")
  .icon(DocumentIcon)
  .child(S.document().schemaType("faqPage").documentId("faqPage")),
     
              S.divider(),

              // Overige losse pagina's
              S.documentTypeListItem("sitePage")
                .title("Overige pagina’s")
                .icon(DocumentIcon),
            ])
        ),

      /* =========================
         CONTENT
      ========================= */
      S.listItem()
        .title("Content")
        .icon(ImageIcon)
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("portfolioItem")
                .title("Portfolio items")
                .icon(TagIcon),

              S.documentTypeListItem("album").title("Albums").icon(ImageIcon),

              S.documentTypeListItem("package").title("Pakketten").icon(TagIcon),
            ])
        ),

      /* =========================
         BERICHTEN
      ========================= */
      S.listItem()
        .title("Berichten")
        .icon(CalendarIcon)
        .child(
          S.list()
            .title("Berichten")
            .items([
              // Boekingen
              S.listItem()
                .title("Boekingen")
                .icon(CalendarIcon)
                .child(
                  S.list()
                    .title("Boekingen")
                    .items([
                      S.listItem()
                        .title("Nieuw")
                        .child(
                          S.documentTypeList("bookingRequest")
                            .title("Nieuwe boekingen")
                            .filter('_type == "bookingRequest" && status == "new"')
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),

                      S.listItem()
                        .title("Bevestigd")
                        .child(
                          S.documentTypeList("bookingRequest")
                            .title("Bevestigde boekingen")
                            .filter(
                              '_type == "bookingRequest" && status == "confirmed"'
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),

                      S.listItem()
                        .title("Geannuleerd")
                        .child(
                          S.documentTypeList("bookingRequest")
                            .title("Geannuleerde boekingen")
                            .filter(
                              '_type == "bookingRequest" && status == "cancelled"'
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),

                      S.divider(),

                      S.listItem()
                        .title("Alles")
                        .child(
                          S.documentTypeList("bookingRequest")
                            .title("Alle boekingen")
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                    ])
                ),

              // Contactberichten
              S.listItem()
                .title("Contactberichten")
                .icon(DocumentIcon)
                .child(
                  S.list()
                    .title("Contactberichten")
                    .items([
                      S.listItem()
                        .title("Nieuw")
                        .child(
                          S.documentTypeList("contactRequest")
                            .title("Nieuwe berichten")
                            .filter('_type == "contactRequest" && status == "new"')
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),

                      S.listItem()
                        .title("Afgehandeld")
                        .child(
                          S.documentTypeList("contactRequest")
                            .title("Afgehandeld")
                            .filter(
                              '_type == "contactRequest" && status == "done"'
                            )
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),

                      S.divider(),

                      S.listItem()
                        .title("Alles")
                        .child(
                          S.documentTypeList("contactRequest")
                            .title("Alle contactberichten")
                            .defaultOrdering([
                              { field: "_createdAt", direction: "desc" },
                            ])
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      /* =========================
         INSTELLINGEN
      ========================= */
      S.listItem()
        .title("Instellingen")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Instellingen")
            .items([
              S.listItem()
                .title("Beschikbaarheid")
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType("availabilitySettings")
                    .documentId("availabilitySettings")
                ),
            ])
        ),
    ]);