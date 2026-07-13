// Mesin kamus sisi server.
// zh: CC-CEDICT (CC BY-SA 4.0) — longest match + pinyin
// ja: JMdict common (EDRDG) — longest match + deinfleksi ringan
// de/fr/es/it: Wiktionary REST API (definisi bahasa Inggris)
import fs from "fs";
import path from "path";
import zlib from "zlib";

export interface DictResult {
  word: string;
  reading?: string;
  alt?: string;
  defs: string[];
  source: string;
}

// ---------- loader (sekali per instance) ----------
let zhMap: Map<string, string[]> | null = null;
let jaMap: Map<string, string[]> | null = null;

function readTsvGz(name: string): string {
  const p = path.join(process.cwd(), "data", name);
  return zlib.gunzipSync(fs.readFileSync(p)).toString("utf-8");
}

function getZh(): Map<string, string[]> {
  if (zhMap) return zhMap;
  zhMap = new Map();
  for (const line of readTsvGz("cedict.tsv.gz").split("\n")) {
    const parts = line.split("\t");
    if (parts.length < 4) continue;
    for (const key of new Set([parts[0], parts[1]])) {
      const arr = zhMap.get(key);
      if (arr) {
        if (arr.length < 3) arr.push(line);
      } else zhMap.set(key, [line]);
    }
  }
  return zhMap;
}

function getJa(): Map<string, string[]> {
  if (jaMap) return jaMap;
  jaMap = new Map();
  for (const line of readTsvGz("jmdict.tsv.gz").split("\n")) {
    const parts = line.split("\t");
    if (parts.length < 3) continue;
    const arr = jaMap.get(parts[0]);
    if (arr) {
      if (arr.length < 3) arr.push(line);
    } else jaMap.set(parts[0], [line]);
  }
  return jaMap;
}

// ---------- zh: longest match ----------
export function lookupZh(ctx: string): DictResult | null {
  const dict = getZh();
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

export function lookupJa(ctx: string): DictResult | null {
  const dict = getJa();
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
