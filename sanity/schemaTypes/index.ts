// sanity/schemaTypes/index.ts
import sitePage from "./sitePage";
import album from "./album";
import homePage from "./homePage";
import portfolioItem from "./portfolioItem";
import packageType from "./package";
import availabilitySettings from "./availabilitySettings";
import bookingRequest from "./bookingRequest";

// ✅ Dit is wat sanity.config.ts verwacht te importeren:
export const schemaTypes = [
  sitePage,
  album,
  homePage,
  portfolioItem,
  packageType,
  availabilitySettings,
  bookingRequest,
];