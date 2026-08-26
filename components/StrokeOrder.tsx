"use client";

// Animasi urutan goresan hanzi (Hanzi Writer, MIT — dimuat dari CDN
// hanya saat dipakai; data karakter juga diambil per-karakter).
import { useEffect, useRef, useState } from "react";

const CDN =
  "https://cdn.jsdelivr.net/npm/hanzi-writer@3.7.0/dist/hanzi-writer.min.js";

function loadScript(): Promise<any> {
  const w = window as any;
  if (w.HanziWriter) return Promise.resolve(w.HanziWriter);
  if (w.__hwPromise) return w.__hwPromise;
  w.__hwPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CDN;
    s.async = true;
    s.onload = () => resolve((window as any).HanziWriter);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return w.__hwPromise;
}

export default function StrokeOrder({
  word,
  onClose,
}: {
  word: string;
  onClose: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const chars = Array.from(word).slice(0, 6);

  useEffect(() => {
    let writers: any[] = [];
    let cancelled = false;

    loadScript()
      .then((HanziWriter) => {
        if (cancelled || !boxRef.current) return;
        boxRef.current.innerHTML = "";
        chars.forEach((ch, i) => {
          const el = document.createElement("div");
          el.className = "stroke-cell";
          boxRef.current!.appendChild(el);
          const writer = HanziWriter.create(el, ch, {
            width: 96,
            height: 96,
            padding: 4,
            showOutline: true,
            strokeColor: getComputedStyle(document.documentElement)
              .getPropertyValue("--accent")
              .trim() || "#4361ee",
            outlineColor: "#d6d6de",
            delayBetweenStrokes: 180,
            strokeAnimationSpeed: 1.1,
            charDataLoader: (c: string, onComplete: any) => {
              fetch(
                `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(c)}.json`
              )
                .then((r) => (r.ok ? r.json() : Promise.reject()))
                .then(onComplete)
                .catch(() => setError(true));
            },
          });
          writers.push(writer);
          setTimeout(() => writer.loopCharacterAnimation(), i * 220);
        });
      })
      .catch(() => setError(true));

    return () => {
      cancelled = true;
      writers.forEach((w) => {
        try {
          w.cancelQuiz?.();
        } catch {
          /* abaikan */
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  return (
    <div className="stroke-backdrop" onClick={onClose} role="dialog">
      <div className="stroke-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-bold">{word}</span>
          <button
            onClick={onClose}
            aria-label="close"
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:text-accent"
          >
            ✕
          </button>
        </div>
        <div ref={boxRef} className="flex flex-wrap justify-center gap-2" />
        {error && (
          <p className="mt-3 text-center text-xs text-gray-400">
            Stroke data unavailable for this character.
          </p>
        )}
        <p className="mt-3 text-center text-[10px] text-gray-400">
          Hanzi Writer · data: Make Me a Hanzi
        </p>
      </div>
    </div>
  );
}
