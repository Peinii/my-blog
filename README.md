# Peini's Blog

Personal blog built with Next.js 14, Tailwind CSS, and Sanity CMS.

- **Multilingual UI**: English / 中文 (toggle in navbar or Settings page)
- **Dark mode** and **5 accent color themes** — see `/settings`
- **Admin dashboard** at `/studio` (Sanity Studio) — write & publish posts from the browser, no redeploy needed (ISR, 60s)
- SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt`, RSS at `/feed.xml`

## Environment variables

| Name | Example |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `abc12345` (from sanity.io/manage) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://peini-blog.vercel.app` |

See `.env.local.example`. On Vercel, set these in **Project → Settings → Environment Variables**.

> Setup guide (Bahasa Indonesia): see `PANDUAN.md` in the docs folder.
