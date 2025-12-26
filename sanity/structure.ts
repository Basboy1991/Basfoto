// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";
import { CalendarIcon, DocumentIcon, ImageIcon } from "@sanity/icons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Pagina’s
      S.listItem()
        .title("Pagina’s")
        .icon(DocumentIcon)
        .child(S.documentTypeList("sitePage").title("Pagina’s")),

      // Albums
      S.listItem()
        .title("Albums")
        .icon(ImageIcon)
        .child(S.documentTypeList("album").title("Albums")),

      S.divider(),

      // Boekingen (bookingRequest)
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

              // ✅ “Alle aanvragen” moet een listItem zijn (niet documentTypeList direct)
              S.documentTypeListItem("bookingRequest").title("Alle aanvragen"),
            ])
        ),

      S.divider(),

      // Alles wat je niet al bovenaan hebt gezet:
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "sitePage",
            "album",
            "bookingRequest",
            "homePage",
            "portfolioItem",
            "package",
            "availabilitySettings",
          ].includes(listItem.getId() as string)
      ),
    ]);