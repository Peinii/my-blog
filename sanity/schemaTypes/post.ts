import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      description:
        "Alamat artikel. Setelah me-rename Title, slug TIDAK ikut berubah — klik Generate kalau mau URL baru (link lama akan mati). Biarkan kalau ingin URL tetap.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt (ringkasan singkat)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      description:
        "JADWAL PUBLISH: set ke tanggal/jam depan, artikel otomatis tampil saat waktunya tiba (maks. telat 1 menit). Tetap klik Publish setelah mengisi.",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "language",
      title: "Language (kamus sentuh)",
      description:
        "Bahasa isi artikel. Selain English: pembaca bisa tap/hover kata untuk melihat artinya (English). 中文 = pinyin + arti · 日本語 = kana + arti · de/fr/es/it via Wiktionary.",
      type: "string",
      initialValue: "en",
      options: {
        list: [
          { title: "English (tanpa kamus)", value: "en" },
          { title: "中文 (Mandarin)", value: "zh" },
          { title: "日本語 (Japanese)", value: "ja" },
          { title: "Deutsch (German)", value: "de" },
          { title: "Français (French)", value: "fr" },
          { title: "Español (Spanish)", value: "es" },
          { title: "Italiano (Italian)", value: "it" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "code",
        },
        {
          type: "object",
          name: "codepenEmbed",
          title: "CodePen (demo kode)",
          fields: [
            defineField({
              name: "url",
              title: "Link CodePen (codepen.io/user/pen/…)",
              type: "url",
              validation: (r) =>
                r.required().custom((val: string | undefined) =>
                  val && val.includes("codepen.io/")
                    ? true
                    : "Harus link CodePen (codepen.io/…)"
                ),
            }),
          ],
          preview: {
            select: { url: "url" },
            prepare({ url }: { url?: string }) {
              return { title: "🖥️ CodePen embed", subtitle: url };
            },
          },
        },
        {
          type: "object",
          name: "canvaEmbed",
          title: "Canva (slide/desain)",
          fields: [
            defineField({
              name: "url",
              title:
                "Link Canva — Share → set 'Anyone with the link can view' → salin link",
              type: "url",
              validation: (r) =>
                r.required().custom((val: string | undefined) =>
                  val &&
                  (val.includes("canva.com/design/") ||
                    val.includes("canva.link/"))
                    ? true
                    : "Harus link Canva (canva.com/design/… atau canva.link/…)"
                ),
            }),
          ],
          preview: {
            select: { url: "url" },
            prepare({ url }: { url?: string }) {
              return { title: "🎨 Canva embed", subtitle: url };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "publishedAt" },
  },
});
