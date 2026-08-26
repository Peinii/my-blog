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

// ============ v2.0.0 Learning Mode ============

// ---------- pinyin bernomor (ka1 fei1) -> tanda nada (kā fēi) ----------
const TONE_MARKS: Record<string, string[]> = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
  "ü": ["ǖ", "ǘ", "ǚ", "ǜ"],
};

export function pinyinSyllable(raw: string): string {
  let s = raw.trim();
  if (!s) return "";
  const m = s.match(/^([A-Za-zü:]+)([0-5])?$/);
  if (!m) return s;
  let body = m[1];
  const tone = m[2] ? parseInt(m[2], 10) : 0;
  body = body.replace(/u:/g, "ü").replace(/v/g, "ü").replace(/U:/g, "Ü");
  if (tone < 1 || tone > 4) return body;

  const lower = body.toLowerCase();
  let idx = -1;
  if (lower.includes("a")) idx = lower.indexOf("a");
  else if (lower.includes("e")) idx = lower.indexOf("e");
  else if (lower.includes("ou")) idx = lower.indexOf("o");
  else {
    for (let i = lower.length - 1; i >= 0; i--) {
      if ("aeiouü".includes(lower[i])) {
        idx = i;
        break;
      }
    }
  }
  if (idx < 0) return body;
  const vowel = lower[idx];
  const marked = TONE_MARKS[vowel]?.[tone - 1];
  if (!marked) return body;
  const isUpper = body[idx] !== lower[idx];
  return (
    body.slice(0, idx) +
    (isUpper ? marked.toUpperCase() : marked) +
    body.slice(idx + 1)
  );
}

export function pinyinPretty(numbered: string): string {
  return numbered
    .split(/\s+/)
    .filter(Boolean)
    .map(pinyinSyllable)
    .join(" ");
}

// ---------- HSK ----------
let hskPromise: Promise<Map<string, string>> | null = null;

function getHsk(): Promise<Map<string, string>> {
  if (!hskPromise) {
    hskPromise = loadTsv("hsk.tsv.gz")
      .then((t) => {
        const m = new Map<string, string>();
        for (const line of t.split("\n")) {
          const i = line.indexOf("\t");
          if (i > 0) m.set(line.slice(0, i), line.slice(i + 1));
        }
        return m;
      })
      .catch(() => new Map<string, string>()); // HSK opsional
  }
  return hskPromise;
}

// ---------- segmentasi + anotasi ----------
export interface Token {
  /** teks apa adanya (sesuai sumber) */
  w: string;
  /** bentuk sederhana (kalau berbeda) */
  s?: string;
  /** bentuk tradisional (kalau berbeda) */
  t?: string;
  /** pinyin bertanda nada */
  p?: string;
  /** label HSK, mis. "HSK3" */
  h?: string;
}

const CJK_RE = /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/;

export async function annotate(text: string): Promise<Token[]> {
  const dict = await getZh();
  const hsk = await getHsk();
  const out: Token[] = [];
  let plain = "";

  const flush = () => {
    if (plain) {
      out.push({ w: plain });
      plain = "";
    }
  };

  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (!CJK_RE.test(ch)) {
      plain += ch;
      i++;
      continue;
    }
    flush();
    let matched = false;
    const maxLen = Math.min(8, text.length - i);
    for (let len = maxLen; len >= 1; len--) {
      const cand = text.slice(i, i + len);
      const lines = dict.get(cand);
      if (!lines) continue;
      const [simp, trad, py] = lines[0].split("\t");
      const tok: Token = { w: cand, p: pinyinPretty(py) };
      if (simp !== cand) tok.s = simp;
      if (trad !== cand) tok.t = trad;
      const level = hsk.get(cand) || hsk.get(simp);
      if (level) tok.h = level;
      out.push(tok);
      i += len;
      matched = true;
      break;
    }
    if (!matched) {
      out.push({ w: ch });
      i++;
    }
  }
  flush();
  return out;
}

/** Cari label HSK satu kata (dipakai popup kamus). */
export async function hskLevel(word: string): Promise<string | undefined> {
  const hsk = await getHsk();
  return hsk.get(word);
}
