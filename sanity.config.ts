"use client";

import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "./sanity/schemaTypes";
import { dataset, projectId } from "./lib/sanity.env";

// Susunan menu Studio: rapi, berikon, dan Site Settings dibuat
// "singleton" (satu dokumen tetap — tidak bisa dibuat dobel).
const structure = (S: StructureBuilder) =>
  S.list()
    .title("Konten")
    .items([
      S.documentTypeListItem("post").title("📝 Post — artikel"),
      S.documentTypeListItem("tag").title("🏷️ Tag"),
      S.documentTypeListItem("author").title("👤 Author — penulis"),
      S.divider(),
      S.listItem()
        .title("⚙️ Site Settings — teks situs")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
    ]);

export default defineConfig({
  name: "default",
  title: "Peini's Blog",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), codeInput()],
  schema: { types: schemaTypes },
  document: {
    // Site Settings tidak muncul di tombol "buat dokumen baru" —
    // cukup lewat menu ⚙️ di daftar kiri.
    newDocumentOptions: (prev) =>
      prev.filter((t) => t.templateId !== "siteSettings"),
  },
});
