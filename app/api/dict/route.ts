import { NextRequest, NextResponse } from "next/server";
import { lookupZh, lookupJa, lookupEuro, diagnose } from "@/lib/dict-server";

// Kamus sentuh: /api/dict?lang=zh&ctx=汉字…  |  ?lang=de&word=Haus
// Cek kesehatan: /api/dict?diag=1
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lang = sp.get("lang") || "";
  const ctx = (sp.get("ctx") || "").slice(0, 16);
  const word = (sp.get("word") || "").slice(0, 40);

  if (sp.get("diag")) {
    return NextResponse.json(await diagnose(), {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const headers = { "Cache-Control": "public, max-age=604800, immutable" };

  try {
    if (lang === "zh" && ctx) {
      const r = await lookupZh(ctx);
      return NextResponse.json(r ?? { notFound: true }, { headers });
    }
    if (lang === "ja" && ctx) {
      const r = await lookupJa(ctx);
      return NextResponse.json(r ?? { notFound: true }, { headers });
    }
    if (["de", "fr", "es", "it"].includes(lang) && word) {
      const r = await lookupEuro(lang, word);
      return NextResponse.json(r ?? { notFound: true }, { headers });
    }
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: "lookup failed", detail: String(e).slice(0, 160) },
      { status: 500 }
    );
  }
}
