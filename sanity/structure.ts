import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // ✅ Homepage als "singleton"
      S.listItem()
        .title("Homepage")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
        ),

      S.divider(),

      S.documentTypeListItem("sitePage").title("Pagina’s"),
      S.documentTypeListItem("package").title("Pakketten"),
      S.documentTypeListItem("portfolioItem").title("Portfolio items"),
      S.documentTypeListItem("album").title("Albums"),
      S.documentTypeListItem("availabilitySettings").title("Beschikbaarheid"),
      S.documentTypeListItem("bookingRequest").title("Boekingen"),
    ]);