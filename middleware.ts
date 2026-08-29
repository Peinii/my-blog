import { NextResponse, type NextRequest } from "next/server";
import { SHARE_ALLOW, SHARE_MODE } from "@/lib/site-mode";

/**
 * Penjaga mode share.
 *
 * Deployment biasa: middleware ini tidak melakukan apa-apa.
 * Deployment share (NEXT_PUBLIC_SITE_MODE=share): tolak-secara-bawaan —
 * hanya jalur di SHARE_ALLOW yang dilayani, sisanya 404.
 *
 * Karena middleware berjalan di server (Edge) sebelum route mana pun
 * dieksekusi, halaman seperti /blog benar-benar tidak bisa dijangkau
 * di domain share — bukan sekadar disembunyikan dari tampilan.
 */
export function middleware(req: NextRequest) {
  if (!SHARE_MODE) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const allowed = SHARE_ALLOW.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
  if (allowed) return NextResponse.next();

  return new NextResponse("Not found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export const config = {
  // Aset statis dilewati supaya halaman share tetap tampil utuh
  // (termasuk file kamus .gz di /dict dan ikon di /icons).
  //
  // PENTING: .xml dan .txt sengaja TIDAK dilewati. /feed.xml dan
  // /sitemap.xml adalah route yang memuat daftar SELURUH artikel —
  // kalau dianggap aset statis, keduanya lolos dari penjaga dan
  // membocorkan isi blog di domain share. /robots.txt tetap terlayani
  // karena sudah terdaftar di SHARE_ALLOW.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/|dict/|fonts/|.*\\.(?:png|jpe?g|gif|svg|webp|ico|woff2?|css|js|gz|mp3|m4a)$).*)",
  ],
};
