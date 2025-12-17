import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("sitePage").title("Pagina’s"),
      S.documentTypeListItem("album").title("Albums"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !["sitePage", "album"].includes(listItem.getId() as string)
      ),
    ]);
