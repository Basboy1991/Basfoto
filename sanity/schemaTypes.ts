// sanity/schemaTypes.ts
import sitePage from "./schemaTypes/sitePage";
import album from "./schemaTypes/album";
import homePage from "./schemaTypes/homePage";
import portfolioItem from "./schemaTypes/portfolioItem";
import packageType from "./schemaTypes/package";
import availabilitySettings from "./schemaTypes/availabilitySettings";
import bookingRequest from "./schemaTypes/bookingRequest";

export const schemaTypes = [
  sitePage,
  album,
  homePage,
  portfolioItem,
  packageType,
  availabilitySettings,
  bookingRequest,
];

export default schemaTypes;