// sanity/env.server.ts
export const projectId = process.env.SANITY_PROJECT_ID || "";
export const dataset = process.env.SANITY_DATASET || "";

// altijd geldige apiVersion
export const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";

export const writeToken = process.env.SANITY_API_WRITE_TOKEN || "";

if (!projectId) throw new Error("Missing SANITY_PROJECT_ID");
if (!dataset) throw new Error("Missing SANITY_DATASET");
if (!writeToken) throw new Error("Missing SANITY_API_WRITE_TOKEN");