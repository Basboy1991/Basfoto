import type { StructureBuilder } from "sanity/structure";

const SINGLETONS = ["availabilitySettings"] as const;

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ✅ Boekingen bovenaan
      S.listItem()
        .title("Boekingsaanvragen")
        .id("bookingRequests")
        .child(
          S.list()
            .title("Boekingsaanvragen")
            .items([
              S.listItem()
                .title("Nieuw")
                .id("bookingRequest-new")
                .child(
                  S.documentList()
                    .title("Nieuw")
                    .schemaType("bookingRequest")
                    .filter('_type == "bookingRequest" && handled != true')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.listItem()
                .title("Afgehandeld")
                .id("bookingRequest-handled")
                .child(
                  S.documentList()
                    .title("Afgehandeld")
                    .schemaType("bookingRequest")
                    .filter('_type == "bookingRequest" && handled == true')
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),

              S.divider(),

              S.documentTypeList("bookingRequest")
                .title("Alle aanvragen")
                .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
            ])
        ),

      S.divider(),

      // ✅ Singleton: Availability Settings
      S.listItem()
        .title("Beschikbaarheid (instellingen)")
        .id("availabilitySettings")
        .child(
          S.document()
            .schemaType("availabilitySettings")
            .documentId("availabilitySettings")
            .title("Beschikbaarheid (instellingen)")
        ),

      S.divider(),

      // ✅ Content
      S.documentTypeListItem("homePage").title("Home"),
      S.documentTypeListItem("sitePage").title("Pagina’s"),
      S.documentTypeListItem("portfolioItem").title("Portfolio"),
      S.documentTypeListItem("album").title("Albums"),
      S.documentTypeListItem("package").title("Pakketten"),

      S.divider(),

      // ✅ Alles wat overblijft (behalve bovenstaande + singletons)
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() as string | null;
        if (!id) return false;

        const hidden = new Set([
          "homePage",
          "sitePage",
          "portfolioItem",
          "album",
          "package",
          "bookingRequest",
          ...SINGLETONS,
        ]);

        return !hidden.has(id);
      }),
    ]);
