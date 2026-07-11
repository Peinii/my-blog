import { NextResponse } from "next/server";
import { client } from "@/lib/sanity.client";

export const dynamic = "force-dynamic";

// BACKUP 1-KLIK: buka /api/backup di browser → file JSON berisi seluruh
// konten terpublikasi (artikel, tag, author, site settings) ter-download.
// Simpan file ini sesekali (misal sebulan sekali) sebagai cadangan.
// Catatan: gambar tidak ikut (tersimpan aman di CDN Sanity); backup ini
// untuk teks & struktur konten.
export async function GET() {
  try {
    const docs = await client.fetch(
      `*[_type in ["post", "tag", "author", "siteSettings"]]`
    );
    const payload = {
      exportedAt: new Date().toISOString(),
      documentCount: Array.isArray(docs) ? docs.length : 0,
      documents: docs,
    };
    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="peini-blog-backup-${date}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "backup failed" }, { status: 500 });
  }
}
