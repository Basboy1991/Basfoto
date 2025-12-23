import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  // In development is dit superhandig om meteen te zien
  // In production crasht het alleen als je de API route gebruikt zonder token
  console.warn("SANITY_API_WRITE_TOKEN ontbreekt. Booking requests kunnen niet opgeslagen worden.");
}

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});