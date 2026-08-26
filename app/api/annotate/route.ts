import { NextRequest, NextResponse } from "next/server";
import { annotate, type Token } from "@/lib/dict-server";

// Segmentasi + pinyin + bentuk tradisional.
// POST { text }            → { tokens: [...] }
// POST { texts: [...] }    → { results: [[...], [...]] }   (satu artikel = satu permintaan)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = {
      "Cache-Control": "public, max-age=604800, immutable",
    };

    if (Array.isArray(body?.texts)) {
      const texts: string[] = body.texts
        .slice(0, 60)
        .map((t: unknown) => String(t ?? "").slice(0, 4000));
      const results: Token[][] = [];
      for (const t of texts) {
        results.push(t.trim() ? await annotate(t) : []);
      }
      return NextResponse.json({ results }, { headers });
    }

    const text = String(body?.text ?? "").slice(0, 4000);
    if (!text.trim()) return NextResponse.json({ tokens: [] }, { headers });
    return NextResponse.json({ tokens: await annotate(text) }, { headers });
  } catch (e) {
    return NextResponse.json(
      { error: "annotate failed", detail: String(e).slice(0, 160) },
      { status: 500 }
    );
  }
}
