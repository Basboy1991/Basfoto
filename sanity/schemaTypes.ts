// sanity/schemaTypes.ts

import sitePage from "./schemaTypes/sitePage";
import album from "./schemaTypes/album";
import homePage from "./schemaTypes/homePage";
import portfolioItem from "./schemaTypes/portfolioItem";
import packageType from "./schemaTypes/package";
import availabilitySettings from "./schemaTypes/availabilitySettings";
import bookingRequest from "./schemaTypes/bookingRequest";

// (optioneel) als je ze gebruikt:
import blockContentType from "./schemaTypes/blockContentType";
import postType from "./schemaTypes/postType";
import authorType from "./schemaTypes/authorType";
import categoryType from "./schemaTypes/categoryType";

export const schemaTypes = [
  sitePage,
  album,
  homePage,
  portfolioItem,
  packageType,
  availabilitySettings,
  bookingRequest,

  // optioneel (laat staan als ze in je studio gebruikt worden)
  blockContentType,
  postType,
  authorType,
  categoryType,
];

