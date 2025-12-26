// sanity/env.ts
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2025-12-16";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "";

// Optioneel helper als je wél hard wilt falen op plekken waar het móét:
export function requireSanityConfig() {
  if (!projectId) throw new Error("Missing SANITY projectId (NEXT_PUBLIC_SANITY_PROJECT_ID).");
  if (!dataset) throw new Error("Missing SANITY dataset (NEXT_PUBLIC_SANITY_DATASET).");
  return { projectId, dataset, apiVersion };
}