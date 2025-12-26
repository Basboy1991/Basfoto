import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ✅ BOOKING REQUESTS (met handige filters)
      S.listItem()
        .title("Boekingen")
        .child(
          S.list()
            .title("Boekingen")
            .items([
              S.listItem()
                .title("Alle aanvragen")
                .child(S.documentTypeList("bookingRequest").title("Alle aanvragen")),

              S.listItem()
                .title("Nieuw")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Nieuw")
                    .filter('_type == "bookingRequest" && status == "new"')
                ),

              S.listItem()
                .title("In behandeling")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("In behandeling")
                    .filter('_type == "bookingRequest" && status == "in_progress"')
                ),

              S.listItem()
                .title("Bevestigd")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Bevestigd")
                    .filter('_type == "bookingRequest" && status == "confirmed"')
                ),

              S.listItem()
                .title("Afgehandeld")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Afgehandeld")
                    .filter('_type == "bookingRequest" && status == "done"')
                ),

              S.listItem()
                .title("Geannuleerd")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Geannuleerd")
                    .filter('_type == "bookingRequest" && status == "cancelled"')
                ),
            ])
        ),

      S.divider(),

      // ✅ Content
      S.documentTypeListItem("homePage").title("Home"),
      S.documentTypeListItem("sitePage").title("Pagina’s"),
      S.documentTypeListItem("portfolioItem").title("Portfolio"),
      S.documentTypeListItem("album").title("Albums"),
      S.documentTypeListItem("package").title("Pakketten"),

      S.divider(),

      // ✅ Singleton instellingen (availability)
      S.listItem()
        .title("Beschikbaarheid")
        .child(
          S.editor()
            .id("availabilitySettings")
            .schemaType("availabilitySettings")
            .documentId("availabilitySettings")
            .title("Beschikbaarheid instellingen")
        ),

      S.divider(),

      // ✅ Alles wat je niet al handmatig hierboven zet
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