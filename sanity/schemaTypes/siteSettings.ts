import { defineField, defineType } from "sanity";

// Teks-teks situs yang bisa diedit dari Studio tanpa menyentuh code.
// Cukup buat SATU dokumen tipe ini. Field yang kosong otomatis
// memakai teks bawaan blog.
const localeString = (name: string, title: string, rows?: number) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      {
        name: "en",
        title: "English",
        type: rows ? "text" : "string",
        ...(rows ? { rows } : {}),
      },
      {
        name: "zh",
        title: "中文",
        type: rows ? "text" : "string",
        ...(rows ? { rows } : {}),
      },
    ],
  });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings (teks situs)",
  type: "document",
  fields: [
    localeString("siteName", "Nama situs (navbar & footer)"),
    localeString("heroTitle", "Judul besar di Home"),
    localeString("heroIntro", "Kalimat intro di Home", 3),
    localeString("aboutBody", "Isi halaman About", 5),
    defineField({
      name: "contacts",
      title: "Tombol kontak (halaman About)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label (contoh: Email, GitHub)",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Link (https://… atau mailto:…)",
              type: "url",
              validation: (r) =>
                r.required().uri({ scheme: ["http", "https", "mailto"] }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "⚙️ Site Settings" }),
  },
});
