// sanity/structure.ts
import {
  CalendarIcon,
  DocumentIcon,
  HomeIcon,
  ImageIcon,
  TagIcon,
  CogIcon,
  CommentIcon,
} from "@sanity/icons";

export const structure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      // =========================
      // WEBSITE
      // =========================
      S.listItem()
        .title("Website")
        .icon(HomeIcon)
        .child(
          S.list()
            .title("Website")
            .items([
              // Homepage (singleton)
              S.listItem()
                .title("Homepage")
                .icon(HomeIcon)
                .child(
                  S.editor()
                    .id("homePage")
                    .schemaType("homePage")
                    .documentId("homePage")
                ),

              S.divider(),

              // Site pagina's
              S.listItem()
                .title("Pagina’s")
                .icon(DocumentIcon)
                .child(S.documentTypeList("sitePage").title("Pagina’s")),
            ])
        ),

      // =========================
      // PORTFOLIO
      // =========================
      S.listItem()
        .title("Portfolio")
        .icon(ImageIcon)
        .child(
          S.list()
            .title("Portfolio")
            .items([
              S.listItem()
                .title("Portfolio items")
                .icon(ImageIcon)
                .child(
                  S.documentTypeList("portfolioItem")
                    .title("Portfolio items")
                    .defaultOrdering([{ field: "featured", direction: "desc" }])
                ),

              S.listItem()
                .title("Albums")
                .icon(ImageIcon)
                .child(S.documentTypeList("album").title("Albums")),
            ])
        ),

      // =========================
      // PAKKETTEN
      // =========================
      S.listItem()
        .title("Pakketten")
        .icon(TagIcon)
        .child(S.documentTypeList("package").title("Pakketten")),

      // =========================
      // BOEKEN / PLANNING
      // =========================
      S.listItem()
        .title("Boeken")
        .icon(CalendarIcon)
        .child(
          S.list()
            .title("Boeken")
            .items([
              // Beschikbaarheid (singleton)
              S.listItem()
                .title("Beschikbaarheid instellingen")
                .icon(CogIcon)
                .child(
                  S.editor()
                    .id("availabilitySettings")
                    .schemaType("availabilitySettings")
                    .documentId("availabilitySettings")
                ),

              S.divider(),

              // Boekingsaanvragen
              S.listItem()
                .title("Boekingsaanvragen")
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList("bookingRequest")
                    .title("Boekingsaanvragen")
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                ),
            ])
        ),

      // =========================
      // CONTACT
      // =========================
      S.listItem()
        .title("Contact")
        .icon(CommentIcon)
        .child(
          // LET OP: dit werkt pas als je ook echt een schema "contactMessage" hebt.
          // Als je die (nog) niet hebt, laat dit blokje staan maar verwacht dat hij
          // de type niet kan vinden. Dan kun je dit tijdelijk weghalen.
          S.documentTypeList("contactMessage").title("Contactberichten")
        ),

      S.divider(),

      // =========================
      // REST (alles dat je niet al ergens toont)
      // =========================
      ...S.documentTypeListItems().filter(
        (listItem: any) =>
          ![
            "homePage",
            "sitePage",
            "portfolioItem",
            "album",
            "package",
            "availabilitySettings",
            "bookingRequest",
            "contactMessage", // belangrijk: voorkomt dubbel item
          ].includes(listItem.getId() as string)
      ),
    ]);