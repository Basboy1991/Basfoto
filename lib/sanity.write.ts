// lib/sanity.write.ts
import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/sanity/env";

export function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId) throw new Error("Missing SANITY_PROJECT_ID (of NEXT_PUBLIC_SANITY_PROJECT_ID)");
  if (!dataset) throw new Error("Missing SANITY_DATASET (of NEXT_PUBLIC_SANITY_DATASET)");
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}