// Mesin kamus sisi server — loader ANTI-GAGAL 3 lapis:
//   1) baca file lokal ./public/dict (ikut deploy sebagai aset statis)
//   2) baca ./data (lokasi lama, kalau masih ada)
//   3) fetch dari CDN sendiri (${NEXT_PUBLIC_SITE_URL}/dict/…) — jalan
//      di mana pun, bahkan bila file tracing serverless meleset.
// zh: CC-CEDICT (CC BY-SA 4.0) · ja: JMdict (EDRDG) · de/fr/es/it: Wiktionary
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { siteUrl } from "./sanity.env";

export interface DictResult {
  word: string;
  reading?: string;
  alt?: string;
  defs: string[];
  source: string;
}

let zhPromise: Promise<Map<string, string[]>> | null = null;
let jaPromise: Promise<Map<string, string[]>> | null = null;
export const loadInfo: Record<string, string> = {};

async function loadTsv(name: string): Promise<string> {
  const candidates = [
    path.join(process.cwd(), "public", "dict", name),
    path.join(process.cwd(), "data", name),
  ];
  for (const p of candidates) {
    try {
      const text = zlib.gunzipSync(fs.readFileSync(p)).toString("utf-8");
      loadInfo[name] = `fs:${p}`;
      return text;
    } catch {
      /* coba kandidat berikutnya */
    }
  }
  // Lapis 3: ambil dari CDN sendiri
  const res = await fetch(`${siteUrl}/dict/${name}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`dict fetch ${name}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const text = zlib.gunzipSync(buf).toString("utf-8");
  loadInfo[name] = "cdn";
  return text;
}

function parseTsv(text: string, minCols: number): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const line of text.split("\n")) {
    const parts = line.split("\t");
    if (parts.length < minCols) continue;
    const keys = minCols >= 4 ? new Set([parts[0], parts[1]]) : [parts[0]];
    for (const key of keys) {
      const arr = map.get(key);
      if (arr) {
        if (arr.length < 3) arr.push(line);
      } else map.set(key, [line]);
    }
  }
  return map;
}

function getZh(): Promise<Map<string, string[]>> {
  if (!zhPromise) {
    zhPromise = loadTsv("cedict.tsv.gz")
      .then((t) => parseTsv(t, 4))
      .catch((e) => {
        zhPromise = null; // biar dicoba ulang di request berikutnya
        throw e;
      });
  }
  return zhPromise;
}

function getJa(): Promise<Map<string, string[]>> {
  if (!jaPromise) {
    jaPromise = loadTsv("jmdict.tsv.gz")
      .then((t) => parseTsv(t, 3))
      .catch((e) => {
        jaPromise = null;
        throw e;
      });
  }
  return jaPromise;
}

// Untuk /api/dict?diag=1 — cek kesehatan kamus dalam sekali buka.
export async function diagnose() {
  const out: Record<string, unknown> = {};
  try {
    const zh = await getZh();
    out.zh = { entries: zh.size, loadedFrom: loadInfo["cedict.tsv.gz"] };
  } catch (e) {
    out.zh = { error: String(e).slice(0, 160) };
  }
  try {
    const ja = await getJa();
    out.ja = { entries: ja.size, loadedFrom: loadInfo["jmdict.tsv.gz"] };
  } catch (e) {
    out.ja = { error: String(e).slice(0, 160) };
  }
  out.euro = "via Wiktionary (tanpa file lokal)";
  out.siteUrl = siteUrl;
  return out;
}

// ---------- zh: longest match ----------
export async function lookupZh(ctx: string): Promise<DictResult | null> {
  const dict = await getZh();
  const max = Math.min(ctx.length, 8);
  for (let len = max; len >= 1; len--) {
    const cand = ctx.slice(0, len);
    const lines = dict.get(cand);
    if (!lines) continue;
    const defs: string[] = [];
    const pinyins: string[] = [];
    let alt = "";
    for (const line of lines.slice(0, 2)) {
      const [simp, trad, pinyin, d] = line.split("\t");
      if (!pinyins.includes(pinyin)) pinyins.push(pinyin);
      if (trad !== simp) alt = trad;
      defs.push(d);
    }
    return {
      word: cand,
      alt: alt || undefined,
      reading: pinyins.join(" / "),
      defs: defs.slice(0, 4),
      source: "CC-CEDICT",
    };
  }
  return null;
}

// ---------- ja: deinfleksi ringan + longest match ----------
const JA_RULES: [string, string[]][] = [
  ["しました", ["する"]], ["します", ["する"]], ["しない", ["する"]],
  ["して", ["する"]], ["した", ["する"]],
  ["きました", ["くる"]], ["きます", ["くる"]],
  ["いました", ["う"]], ["きます", ["く"]], ["ぎます", ["ぐ"]],
  ["います", ["う"]], ["ちます", ["つ"]], ["にます", ["ぬ"]],
  ["びます", ["ぶ"]], ["みます", ["む"]], ["ります", ["る"]],
  ["ました", ["る"]], ["ます", ["る"]],
  ["わない", ["う"]], ["かない", ["く"]], ["がない", ["ぐ"]],
  ["さない", ["す"]], ["たない", ["つ"]], ["ばない", ["ぶ"]],
  ["まない", ["む"]], ["らない", ["る"]], ["ない", ["る"]],
  ["った", ["う", "つ", "る"]], ["いた", ["く"]], ["いだ", ["ぐ"]],
  ["んだ", ["ぬ", "ぶ", "む"]], ["した", ["す"]],
  ["って", ["う", "つ", "る"]], ["いて", ["く"]], ["いで", ["ぐ"]],
  ["んで", ["ぬ", "ぶ", "む"]], ["して", ["す"]],
  ["くなかった", ["い"]], ["くない", ["い"]], ["かった", ["い"]],
  ["た", ["る"]], ["て", ["る"]],
];

function jaCandidates(surface: string): string[] {
  const out = [surface];
  for (const [suffix, bases] of JA_RULES) {
    if (surface.length > suffix.length && surface.endsWith(suffix)) {
      const stem = surface.slice(0, -suffix.length);
      for (const b of bases) out.push(stem + b);
    }
  }
  return out;
}

export async function lookupJa(ctx: string): Promise<DictResult | null> {
  const dict = await getJa();
  const max = Math.min(ctx.length, 10);
  for (let len = max; len >= 1; len--) {
    const surface = ctx.slice(0, len);
    for (const cand of jaCandidates(surface)) {
      const lines = dict.get(cand);
      if (!lines) continue;
      const [, reading, defs] = lines[0].split("\t");
      return {
        word: cand === surface ? surface : `${surface} → ${cand}`,
        reading,
        defs: defs.split("; ").slice(0, 4),
        source: "JMdict (EDRDG)",
      };
    }
  }
  return null;
}

// ---------- de/fr/es/it: Wiktionary ----------
const EURO_LANGS = new Set(["de", "fr", "es", "it"]);

export async function lookupEuro(
  lang: string,
  word: string
): Promise<DictResult | null> {
  if (!EURO_LANGS.has(lang) || !word) return null;
  const tryWords = [word, word.toLowerCase()];
  for (const w of Array.from(new Set(tryWords))) {
    try {
      const res = await fetch(
        `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`,
        {
          headers: { accept: "application/json" },
          next: { revalidate: 86400 },
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const sections = data?.[lang];
      if (!Array.isArray(sections)) continue;
      const defs: string[] = [];
      for (const sec of sections) {
        for (const d of sec?.definitions || []) {
          const clean = String(d?.definition || "")
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
          if (clean && !defs.includes(clean)) defs.push(clean);
          if (defs.length >= 4) break;
        }
        if (defs.length >= 4) break;
      }
      if (defs.length > 0) {
        return { word: w, defs, source: "Wiktionary (CC BY-SA)" };
      }
    } catch {
      /* coba kandidat berikutnya */
    }
  }
  return null;
}
