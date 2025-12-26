// sanity/env.ts
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "";

if (!projectId) {
  throw new Error("Missing Sanity projectId (NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID)");
}

if (!dataset) {
  throw new Error("Missing Sanity dataset (NEXT_PUBLIC_SANITY_DATASET or SANITY_DATASET)");
}