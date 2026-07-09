import { NextRequest, NextResponse } from "next/server";
import { canvaEmbedUrl, isCanvaLink } from "@/lib/canva";

// Resolve short link canva.link -> canva.com/design/... (ikuti redirect
// di sisi server, karena browser tidak boleh lintas-domain).
// Hanya menerima host canva.link / canva.com — bukan proxy umum.
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("u") || "";

  if (!isCanvaLink(raw)) {
    return NextResponse.json({ error: "not a canva link" }, { status: 400 });
  }

  // Sudah bentuk final? Langsung normalisasi.
  const direct = canvaEmbedUrl(raw);
  if (direct) {
    return NextResponse.json(
      { embed: direct },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  }

  try {
    const res = await fetch(raw, { redirect: "follow", method: "GET" });
    const finalUrl = res.url || "";
    const embed = canvaEmbedUrl(finalUrl);
    if (!embed) {
      return NextResponse.json({ error: "cannot resolve" }, { status: 422 });
    }
    return NextResponse.json(
      { embed },
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
