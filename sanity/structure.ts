// sanity/structure.ts
import type { StructureResolver } from "sanity/desk";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Pagina’s / albums
      S.documentTypeListItem("sitePage").title("Pagina’s"),
      S.documentTypeListItem("album").title("Albums"),
      S.documentTypeListItem("homePage").title("Home"),
      S.documentTypeListItem("portfolioItem").title("Portfolio"),
      S.documentTypeListItem("package").title("Pakketten"),

      S.divider(),

      // Availability settings (singleton)
      S.listItem()
        .title("Beschikbaarheid (instellingen)")
        .id("availabilitySettingsSingleton")
        .child(
          S.editor()
            .id("availabilitySettings")
            .schemaType("availabilitySettings")
            .documentId("availabilitySettings")
            .title("Beschikbaarheid (instellingen)")
        ),

      S.divider(),

      // Boekingen / aanvragen
      S.listItem()
        .title("Boekingen")
        .id("bookingsRoot")
        .child(
          S.list()
            .title("Boekingen")
            .items([
              // ✅ Dit is nu WEL goed: ListItem -> child(DocumentList)
              S.listItem()
                .title("Nieuw")
                .id("bookingRequestsNew")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Nieuw")
                    .filter('_type == "bookingRequest" && (status == "new" || !defined(status))')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.listItem()
                .title("Bevestigd")
                .id("bookingRequestsConfirmed")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Bevestigd")
                    .filter('_type == "bookingRequest" && status == "confirmed"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.listItem()
                .title("Afgerond")
                .id("bookingRequestsDone")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Afgerond")
                    .filter('_type == "bookingRequest" && status == "done"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.listItem()
                .title("Spam / genegeerd")
                .id("bookingRequestsSpam")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Spam / genegeerd")
                    .filter('_type == "bookingRequest" && status == "spam"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.divider(),

              // ✅ “Alle aanvragen” – ook als ListItem met child()
              S.listItem()
                .title("Alle aanvragen")
                .id("bookingRequestsAll")
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Alle aanvragen")
                    .filter('_type == "bookingRequest"')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
            ])
        ),

      S.divider(),

      // Alles wat je verder nog hebt (behalve wat we al expliciet plaatsen)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "sitePage",
            "album",
            "homePage",
            "portfolioItem",
            "package",
            "availabilitySettings",
            "bookingRequest",
          ].includes(listItem.getId() as string)
      ),
    ]);