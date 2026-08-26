"use client";

import { useEffect, useState } from "react";

export interface Token {
  w: string;
  s?: string;
  t?: string;
  p?: string;
  h?: string;
}

// Cache + penggabungan permintaan: semua paragraf yang muncul dalam
// jendela 40 ms dikirim dalam SATU permintaan ke /api/annotate.
const cache = new Map<string, Token[]>();
type Waiter = { text: string; resolve: (t: Token[]) => void };
let pending: Waiter[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

async function flush() {
  const batch = pending;
  pending = [];
  timer = null;
  const texts = Array.from(new Set(batch.map((b) => b.text)));
  try {
    const res = await fetch("/api/annotate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts }),
    });
    const data = res.ok ? await res.json() : null;
    const results: Token[][] = data?.results ?? [];
    const map = new Map<string, Token[]>();
    texts.forEach((t, i) => map.set(t, results[i] ?? []));
    for (const w of batch) {
      const toks = map.get(w.text) ?? [];
      if (toks.length) cache.set(w.text, toks);
      w.resolve(toks);
    }
  } catch {
    batch.forEach((w) => w.resolve([]));
  }
}

function fetchTokens(text: string): Promise<Token[]> {
  const hit = cache.get(text);
  if (hit) return Promise.resolve(hit);
  return new Promise<Token[]>((resolve) => {
    pending.push({ text, resolve });
    if (!timer) timer = setTimeout(flush, 40);
  });
}

/**
 * Teks Mandarin dengan pinyin ruby dan/atau bentuk tradisional.
 * Sebelum data anotasi tiba, teks asli tetap tampil (tidak ada kedipan kosong).
 */
export default function ZhAnnotated({
  text,
  pinyin,
  script,
}: {
  text: string;
  pinyin: boolean;
  script: "simp" | "trad";
}) {
  const [tokens, setTokens] = useState<Token[] | null>(
    cache.get(text) ?? null
  );

  useEffect(() => {
    let alive = true;
    fetchTokens(text).then((t) => {
      if (alive) setTokens(t);
    });
    return () => {
      alive = false;
    };
  }, [text]);

  if (!tokens || tokens.length === 0) return <>{text}</>;

  return (
    <>
      {tokens.map((tok, i) => {
        const shown =
          script === "trad" ? tok.t || tok.w : tok.s || tok.w;
        if (!tok.p) return <span key={i}>{shown}</span>;
        return (
          <ruby
            key={i}
            className="zh-tok"
            data-w={shown}
            data-py={tok.p}
            data-hsk={tok.h || ""}
          >
            {shown}
            <rt>{pinyin ? tok.p : ""}</rt>
          </ruby>
        );
      })}
    </>
  );
}
