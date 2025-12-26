// sanity/schemaTypes.ts
import sitePage from "./schemas/sitePage";
import album from "./schemas/album";
import homePage from "./schemas/homePage";
import portfolioItem from "./schemas/portfolioItem";
import packageType from "./schemas/package";
import availabilitySettings from "./schemas/availabilitySettings";
import bookingRequest from "./schemas/bookingRequest";

export const schemaTypes = [
  // content
  homePage,
  sitePage,
  album,
  portfolioItem,
  packageType,

  // booking / settings
  availabilitySettings,
  bookingRequest,
];