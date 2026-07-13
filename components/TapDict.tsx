"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSettings } from "@/lib/settings-context";

interface DictData {
  word?: string;
  reading?: string;
  alt?: string;
  defs?: string[];
  source?: string;
  notFound?: boolean;
}

interface PopupState {
  x: number;
  y: number;
  status: "loading" | "done";
  data?: DictData;
}

const CJK = /[㐀-鿿豈-﫿]/;
const KANA = /[぀-ヿ]/;
const EURO_CHAR = /[\p{L}\p{M}'’-]/u;

const cache = new Map<string, DictData>();

// Ambil posisi teks di bawah kursor/jari (lintas browser).
function caretAt(x: number, y: number): { node: Text; offset: number } | null {
  const d = document as any;
  if (d.caretRangeFromPoint) {
    const r = d.caretRangeFromPoint(x, y);
    if (r && r.startContainer?.nodeType === Node.TEXT_NODE)
      return { node: r.startContainer as Text, offset: r.startOffset };
  } else if (d.caretPositionFromPoint) {
    const p = d.caretPositionFromPoint(x, y);
    if (p && p.offsetNode?.nodeType === Node.TEXT_NODE)
      return { node: p.offsetNode as Text, offset: p.offset };
  }
  return null;
}

/** Bungkus isi artikel: tap/hover kata → popup arti (English). */
export default function TapDict({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  const { t } = useSettings();
  const boxRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);

  const isCjkLang = lang === "zh" || lang === "ja";

  const lookup = useCallback(
    async (clientX: number, clientY: number) => {
      const caret = caretAt(clientX, clientY);
      if (!caret) return;
      const text = caret.node.textContent || "";
      let key = "";
      let params = "";

      if (isCjkLang) {
        // mundur 1 kalau jatuh tepat setelah karakter
        let i = caret.offset;
        if (i >= text.length || !(CJK.test(text[i]) || KANA.test(text[i]))) {
          i = Math.max(0, i - 1);
        }
        const ch = text[i] || "";
        if (!(CJK.test(ch) || (lang === "ja" && KANA.test(ch)))) return;
        const ctx = text.slice(i, i + 12);
        key = `${lang}:${ctx}`;
        params = `lang=${lang}&ctx=${encodeURIComponent(ctx)}`;
      } else {
        // Eropa: perluas ke batas kata
        let s = caret.offset;
        if (s >= text.length || !EURO_CHAR.test(text[s])) s = Math.max(0, s - 1);
        if (!EURO_CHAR.test(text[s] || "")) return;
        let e = s;
        while (s > 0 && EURO_CHAR.test(text[s - 1])) s--;
        while (e < text.length && EURO_CHAR.test(text[e])) e++;
        const word = text.slice(s, e).replace(/^['’-]+|['’-]+$/g, "");
        if (word.length < 2) return;
        key = `${lang}:${word.toLowerCase()}`;
        params = `lang=${lang}&word=${encodeURIComponent(word)}`;
      }

      const px = Math.min(clientX, window.innerWidth - 300);
      const py = Math.min(clientY + 18, window.innerHeight - 180);

      const cached = cache.get(key);
      if (cached) {
        setPopup({ x: px, y: py, status: "done", data: cached });
        return;
      }
      setPopup({ x: px, y: py, status: "loading" });
      try {
        const res = await fetch(`/api/dict?${params}`);
        const data: DictData = res.ok ? await res.json() : { notFound: true };
        cache.set(key, data);
        setPopup((p) =>
          p ? { ...p, status: "done", data } : null
        );
      } catch {
        setPopup((p) =>
          p ? { ...p, status: "done", data: { notFound: true } } : null
        );
      }
    },
    [lang, isCjkLang]
  );

  function onClick(e: React.MouseEvent) {
    const el = e.target as HTMLElement;
    if (el.closest("a, code, pre, iframe, img, button")) return;
    lookup(e.clientX, e.clientY);
  }

  function onMouseMove(e: React.MouseEvent) {
    // hover-intent hanya untuk perangkat berkursor
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    const { clientX, clientY, target } = e;
    if ((target as HTMLElement).closest("a, code, pre, iframe, img, button"))
      return;
    hoverTimer.current = setTimeout(() => lookup(clientX, clientY), 550);
  }

  // Tutup popup saat klik di luar / scroll / Esc
  useEffect(() => {
    if (!popup) return;
    const close = () => setPopup(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [popup]);

  return (
    <div
      ref={boxRef}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
      }}
    >
      {children}

      {popup && (
        <div
          className="dict-popup"
          style={{ left: popup.x, top: popup.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {popup.status === "loading" ? (
            <p className="text-sm text-gray-500">{t("post.dict.loading")}</p>
          ) : popup.data?.notFound || !popup.data?.defs ? (
            <p className="text-sm text-gray-500">{t("post.dict.notFound")}</p>
          ) : (
            <>
              <p className="text-base font-bold leading-snug">
                {popup.data.word}
                {popup.data.alt && (
                  <span className="ml-1.5 font-normal text-gray-400">
                    ({popup.data.alt})
                  </span>
                )}
              </p>
              {popup.data.reading && (
                <p className="mt-0.5 text-sm text-accent">
                  {popup.data.reading}
                </p>
              )}
              <ul className="mt-1.5 space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
                {popup.data.defs.slice(0, 4).map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] text-gray-400">
                {popup.data.source}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
