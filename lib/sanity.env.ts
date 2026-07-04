// Nilai diambil dari environment variables (lihat .env.local.example).
// Fallback "placeholder" hanya agar build tidak gagal sebelum env diisi.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-10-01";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://peini-blog.vercel.app";
