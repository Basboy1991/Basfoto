// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";
import { CalendarIcon, DocumentIcon, HomeIcon, ImageIcon, TagIcon, CogIcon } from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Home (singleton)
      S.listItem()
        .title("Home")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage").title("Home")),

      // Pagina’s
      S.listItem()
        .title("Pagina’s")
        .icon(DocumentIcon)
        .child(S.documentTypeList("sitePage").title("Pagina’s")),

      // Portfolio
      S.listItem()
        .title("Portfolio")
        .icon(ImageIcon)
        .child(S.documentTypeList("portfolioItem").title("Portfolio")),

      // Albums
      S.listItem()
        .title("Albums")
        .icon(ImageIcon)
        .child(S.documentTypeList("album").title("Albums")),

      // Pakketten
      S.listItem()
        .title("Pakketten")
        .icon(TagIcon)
        .child(S.documentTypeList("package").title("Pakketten")),

      // Beschikbaarheid (settings)
      S.listItem()
        .title("Beschikbaarheid")
        .icon(CogIcon)
        .child(S.document().schemaType("availabilitySettings").documentId("availabilitySettings").title("Beschikbaarheid")),

      S.divider(),

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
                    .title("Nieuw")
                    .filter('_type == "bookingRequest" && status == "new"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.listItem()
                .title("Bevestigd")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Bevestigd")
                    .filter('_type == "bookingRequest" && status == "confirmed"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.listItem()
                .title("Afgerond")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Afgerond")
                    .filter('_type == "bookingRequest" && status == "done"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.listItem()
                .title("Geannuleerd")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Geannuleerd")
                    .filter('_type == "bookingRequest" && status == "cancelled"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.divider(),

              // Alle aanvragen
              S.listItem()
                .title("Alle aanvragen")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Alle aanvragen")
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
            ])
        ),

      S.divider(),

      // Alles wat je niet hierboven hebt gezet:
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "homePage",
            "sitePage",
            "portfolioItem",
            "album",
            "package",
            "availabilitySettings",
            "bookingRequest",
          ].includes(listItem.getId() as string)
      ),
    ]);