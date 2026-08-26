"use client";

import { useEffect, useState } from "react";

export interface Token {
  w: string;
  s?: string;
  t?: string;
  p?: string;
  h?: string;
}

// cache antar-komponen supaya paragraf yang sama tidak diminta dua kali
const cache = new Map<string, Token[]>();
const inflight = new Map<string, Promise<Token[]>>();

async function fetchTokens(text: string): Promise<Token[]> {
  const hit = cache.get(text);
  if (hit) return hit;
  const running = inflight.get(text);
  if (running) return running;
  const p = fetch("/api/annotate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
    .then((r) => (r.ok ? r.json() : { tokens: [] }))
    .then((d) => {
      const toks: Token[] = d?.tokens ?? [];
      cache.set(text, toks);
      inflight.delete(text);
      return toks;
    })
    .catch(() => {
      inflight.delete(text);
      return [] as Token[];
    });
  inflight.set(text, p);
  return p;
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
