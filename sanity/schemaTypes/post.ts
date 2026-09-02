import { defineField, defineType } from "sanity";
import ShareLinkInput from "../components/ShareLinkInput";

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
      name: "shareToken",
      title: "Share link (situs terpisah)",
      description:
        "KOSONG = artikel ini tidak bisa dibagikan lewat situs share. Klik Generate untuk membuat kode acak, lalu bagikan alamat: https://NAMA-SITUS-SHARE.vercel.app/s/KODE — penerima hanya melihat artikel ini, tanpa jalan ke artikel lain. Hapus isinya kapan saja untuk mematikan link yang sudah tersebar.",
      type: "slug",
      // Tampilkan URL lengkap + tombol salin di bawah field ini.
      components: { input: ShareLinkInput },
      options: {
        // Tombol Generate membuat kode acak; judul sengaja TIDAK dipakai
        // agar alamatnya tidak bisa ditebak dari nama artikel.
        // 14 karakter dari 32 huruf/angka = ~10^21 kemungkinan.
        // Huruf yang mudah tertukar (0/O, 1/l/I) sengaja dibuang supaya
        // kodenya masih aman dibacakan lewat telepon.
        source: () => {
          const chars = "abcdefghijkmnpqrstuvwxyz23456789";
          let out = "";
          for (let i = 0; i < 14; i++) {
            out += chars[Math.floor(Math.random() * chars.length)];
          }
          return out;
        },
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .slice(0, 32),
      },
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
      name: "audio",
      title: "Voiceover (opsional)",
      description:
        "Rekaman suara untuk artikel ini (MP3/M4A). Muncul sebagai pemutar dengan kontrol kecepatan di atas artikel.",
      type: "file",
      options: { accept: "audio/*" },
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
          name: "grammarNote",
          title: "Grammar note (kotak tata bahasa)",
          fields: [
            defineField({ name: "title", title: "Judul", type: "string" }),
            defineField({
              name: "pattern",
              title: "Pola (mis. 虽然…但是…)",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Penjelasan",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "pattern" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: "📘 " + (title || "Grammar note"), subtitle };
            },
          },
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
