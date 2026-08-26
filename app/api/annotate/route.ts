import { NextRequest, NextResponse } from "next/server";
import { annotate } from "@/lib/dict-server";

// Segmentasi + pinyin + bentuk tradisional untuk satu paragraf.
// POST { text } → { tokens: [{w, s?, t?, p?, h?}] }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = String(body?.text ?? "").slice(0, 4000);
    if (!text.trim()) return NextResponse.json({ tokens: [] });
    const tokens = await annotate(text);
    return NextResponse.json(
      { tokens },
      { headers: { "Cache-Control": "public, max-age=604800, immutable" } }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "annotate failed", detail: String(e).slice(0, 160) },
      { status: 500 }
    );
  }
}
