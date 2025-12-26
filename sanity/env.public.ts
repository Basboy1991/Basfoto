// lib/sanity.client.ts
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env.public";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion, // altijd geldig
  useCdn: true,
});