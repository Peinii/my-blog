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
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
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
