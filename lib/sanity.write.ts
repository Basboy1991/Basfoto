// lib/sanity.write.ts
import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // 👈 ALLEEN write token
});