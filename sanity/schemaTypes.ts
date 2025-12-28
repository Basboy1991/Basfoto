// sanity/schemaTypes.ts
import sitePage from "./schemaTypes/sitePage";
import album from "./schemaTypes/album";
import homePage from "./schemaTypes/homePage";
import portfolioItem from "./schemaTypes/portfolioItem";
import packageType from "./schemaTypes/package";
import availabilitySettings from "./schemaTypes/availabilitySettings";
import bookingRequest from "./schemaTypes/bookingRequest";
import contactRequest from "./schemaTypes/contactRequest"; // 👈 NIEUW
import faqPage from "./schemaTypes/faqPage";

export const schemaTypes = [
  sitePage,
  album,
  homePage,
  portfolioItem,
  packageType,
  availabilitySettings,
  bookingRequest,
  contactRequest,
faqPage, // 👈 TOEGEVOEGD
];

export default schemaTypes;