// sanity.config.ts
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { projectId, dataset } from "./sanity/env";

export default defineConfig({
  name: "default",
  title: "Bas Fotografie",

  projectId,
  dataset,

  basePath: "/studio",

  schema: {
    types: schemaTypes,
  },

  plugins: [
    deskTool({ structure }),
    visionTool(),
  ],
});