import { defineField, defineType } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description:
        "Rename di sini → semua artikel yang memakai tag ini otomatis ikut berubah.",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "Setelah rename, klik Generate kalau mau slug ikut nama baru (opsional).",
      type: "slug",
      options: { source: "name", maxLength: 48 },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
