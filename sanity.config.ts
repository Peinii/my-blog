"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./sanity/schemaTypes";
import { dataset, projectId } from "./lib/sanity.env";

export default defineConfig({
  name: "default",
  title: "Peini's Blog",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), codeInput()],
  schema: { types: schemaTypes },
});
