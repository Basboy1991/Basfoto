// sanity/structure.ts
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = new Set(["homePage", "availabilitySettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // =========================
      // SINGLETONS
      // =========================
      S.listItem()
        .title("Homepage")
        .schemaType("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),

      S.listItem()
        .title("Beschikbaarheid")
        .schemaType("availabilitySettings")
        .child(
          S.document()
            .schemaType("availabilitySettings")
            .documentId("availabilitySettings")
        ),

      S.divider(),

      // =========================
      // CONTENT TYPES
      // =========================
      S.listItem()
        .title("Pagina’s")
        .schemaType("sitePage")
        .child(S.documentTypeList("sitePage").title("Pagina’s")),

      S.listItem()
        .title("Portfolio items")
        .schemaType("portfolioItem")
        .child(S.documentTypeList("portfolioItem").title("Portfolio items")),

      S.listItem()
        .title("Albums")
        .schemaType("album")
        .child(S.documentTypeList("album").title("Albums")),

      S.listItem()
        .title("Pakketten")
        .schemaType("package")
        .child(S.documentTypeList("package").title("Pakketten")),

      S.divider(),

      // =========================
      // BOOKINGS
      // =========================
      S.listItem()
        .title("Boekingsaanvragen")
        .schemaType("bookingRequest")
        .child(
          S.documentTypeList("bookingRequest")
            .title("Boekingsaanvragen")
            .defaultOrdering([{ field: "createdAt", direction: "desc" }])
        ),

      S.divider(),

      // =========================
      // EVERYTHING ELSE (auto)
      // =========================
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        if (!id) return true;
        if (SINGLETONS.has(id)) return false;

        return ![
          "sitePage",
          "portfolioItem",
          "album",
          "package",
          "bookingRequest",
        ].includes(id);
      }),
    ]);

export default structure;