// sanity/structure.ts
import type { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ✅ Boekingen (met filters)
      S.listItem()
        .title("Boekingen")
        .child(
          S.list()
            .title("Boekingen")
            .items([
              S.listItem()
                .title("Nieuw")
                .child(
                  S.documentList()
                    .title("Nieuwe aanvragen")
                    .filter('_type == "bookingRequest" && status == "new"')
                    .defaultOrdering([
                      { field: "_createdAt", direction: "desc" },
                    ])
                ),

              S.listItem()
                .title("Bevestigd")
                .child(
                  S.documentList()
                    .title("Bevestigd")
                    .filter('_type == "bookingRequest" && status == "confirmed"')
                    .defaultOrdering([
                      { field: "_createdAt", direction: "desc" },
                    ])
                ),

              S.listItem()
                .title("Afgewezen")
                .child(
                  S.documentList()
                    .title("Afgewezen")
                    .filter('_type == "bookingRequest" && status == "declined"')
                    .defaultOrdering([
                      { field: "_createdAt", direction: "desc" },
                    ])
                ),

              S.divider(),

              // Alles
              S.documentTypeList("bookingRequest").title("Alle aanvragen"),
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

      // ✅ Settings (singleton)
      S.listItem()
        .title("Beschikbaarheid (Settings)")
        .child(
          S.editor()
            .id("availabilitySettings")
            .schemaType("availabilitySettings")
            .documentId("availabilitySettings")
            .title("Beschikbaarheid")
        ),

      S.divider(),

      // ✅ Alles wat je niet expliciet hierboven toont
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() as string | undefined;
        return (
          id &&
          ![
            "bookingRequest",
            "homePage",
            "sitePage",
            "portfolioItem",
            "album",
            "package",
            "availabilitySettings",
          ].includes(id)
        );
      }),
    ]);