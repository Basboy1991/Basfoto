// sanity/env.ts
export const projectId = process.env.SANITY_PROJECT_ID!;
export const dataset = process.env.SANITY_DATASET!;
export const apiVersion =
  process.env.SANITY_API_VERSION || "2024-01-01";

if (!projectId) throw new Error("Missing SANITY_PROJECT_ID");
if (!dataset) throw new Error("Missing SANITY_DATASET");