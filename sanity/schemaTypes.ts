// sanity/schemaTypes.ts
import sitePage from "./schemaTypes/sitePage";
import homePage from "./schemaTypes/homePage";
import portfolioItem from "./schemaTypes/portfolioItem";
import album from "./schemaTypes/album";
import packageType from "./schemaTypes/package";
import availabilitySettings from "./schemaTypes/availabilitySettings";
import bookingRequest from "./schemaTypes/bookingRequest";

// NIEUW (alleen laten staan als deze bestanden echt bestaan)
import contactRequest from "./schemaTypes/contactRequest";
import faqPage from "./schemaTypes/faqPage";

export const schemaTypes = [
  // Pages / content
  homePage,
  sitePage,
  faqPage,

  // Portfolio
  portfolioItem,
  album,
  packageType,

  // Booking
  availabilitySettings,
  bookingRequest,

  // Messages
  contactRequest,
];

export default schemaTypes;