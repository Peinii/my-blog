/**
 * Mode situs.
 *
 * Repo ini di-deploy DUA KALI ke Vercel dari satu sumber yang sama:
 *
 *   1. Blog utama  → tidak perlu env apa pun (mode "full")
 *   2. Situs share → set env NEXT_PUBLIC_SITE_MODE=share
 *
 * Di mode "share", middleware.ts hanya melayani /s/[token] dan API kamus.
 * Semua jalur lain (/blog, /words, /studio, /api/backup, …) dijawab 404,
 * jadi penerima link tidak punya jalan menuju artikel lain.
 */
export const SHARE_MODE = process.env.NEXT_PUBLIC_SITE_MODE === "share";

/**
 * Alamat situs share, dipakai untuk menyusun link yang bisa disalin
 * (di Studio maupun di halaman artikel blog).
 *
 * Kalau nanti nama project Vercel-nya berubah, cukup set env
 * NEXT_PUBLIC_SHARE_URL di project blog utama — tidak perlu ubah kode.
 */
export const SHARE_BASE = (
  process.env.NEXT_PUBLIC_SHARE_URL || "https://peini-share.vercel.app"
).replace(/\/+$/, "");

/** URL lengkap sebuah share token, atau null bila token kosong. */
export function shareUrl(token?: string | null): string | null {
  return token ? `${SHARE_BASE}/s/${token}` : null;
}

/** Jalur yang boleh dilayani saat mode share aktif. */
export const SHARE_ALLOW = [
  "/s/", // halaman artikel yang dibagikan
  "/api/dict", // kamus tap/hover
  "/api/annotate", // segmentasi, pinyin, 简/繁
  "/robots.txt",
];
