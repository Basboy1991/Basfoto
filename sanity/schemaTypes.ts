// sanity/schemaTypes.ts
import sitePage from "./schemaTypes/sitePage";
import album from "./schemaTypes/album";
import homePage from "./schemaTypes/homePage";
import portfolioItem from "./schemaTypes/portfolioItem";
import packageType from "./schemaTypes/package";
import availabilitySettings from "./schemaTypes/availabilitySettings";
import bookingRequest from "./schemaTypes/bookingRequest";

// ✅ nieuw
import contactPage from "./schemaTypes/contactPage";
import contactRequest from "./schemaTypes/contactRequest";
import faqPage from "./schemaTypes/faqPage";

export const schemaTypes = [
  // Pagina’s / content
  homePage,
  contactPage,
  faqPage,
  sitePage,

  // Content
  portfolioItem,
  album,
  packageType,
  availabilitySettings,

  // Berichten
  bookingRequest,
  contactRequest,
];

export default schemaTypes;