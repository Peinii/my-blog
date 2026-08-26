"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSettings } from "@/lib/settings-context";
import { speak } from "@/lib/speak";
import { addWord, isSaved, removeWord } from "@/lib/mywords";
import StrokeOrder from "./StrokeOrder";

interface DictData {
  word?: string;
  reading?: string;
  alt?: string;
  hsk?: string;
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

const CJK = /[㐀-䶿一-鿿豈-﫿]/;
const KANA = /[぀-ヿ]/;
const EURO_CHAR = /[\p{L}\p{M}'’-]/u;

const cache = new Map<string, DictData>();

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

/** Bungkus isi artikel: tap/hover kata → popup arti, dengar, simpan. */
export default function TapDict({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  const { t, ttsRate } = useSettings();
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [saved, setSaved] = useState(false);
  const [stroke, setStroke] = useState<string | null>(null);

  const isCjkLang = lang === "zh" || lang === "ja";

  const runLookup = useCallback(
    async (key: string, params: string, px: number, py: number) => {
      const cached = cache.get(key);
      if (cached) {
        setPopup({ x: px, y: py, status: "done", data: cached });
        setSaved(cached.word ? isSaved(cached.word) : false);
        return;
      }
      setPopup({ x: px, y: py, status: "loading" });
      try {
        const res = await fetch(`/api/dict?${params}`);
        const data: DictData = res.ok ? await res.json() : { notFound: true };
        cache.set(key, data);
        setSaved(data.word ? isSaved(data.word) : false);
        setPopup((p) => (p ? { ...p, status: "done", data } : null));
      } catch {
        setPopup((p) =>
          p ? { ...p, status: "done", data: { notFound: true } } : null
        );
      }
    },
    []
  );

  const lookup = useCallback(
    async (clientX: number, clientY: number, target?: HTMLElement) => {
      const px = Math.min(clientX, window.innerWidth - 300);
      const py = Math.min(clientY + 18, window.innerHeight - 220);

      // 1) Kata sudah tersegmentasi (pinyin ruby) → pakai langsung
      const tokEl = target?.closest?.("[data-w]") as HTMLElement | null;
      if (tokEl?.dataset.w) {
        const w = tokEl.dataset.w;
        return runLookup(
          `${lang}:${w}`,
          `lang=${lang}&ctx=${encodeURIComponent(w)}`,
          px,
          py
        );
      }

      // 2) Deteksi dari posisi kursor/jari
      const caret = caretAt(clientX, clientY);
      if (!caret) return;
      const text = caret.node.textContent || "";
      let key = "";
      let params = "";

      if (isCjkLang) {
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
      return runLookup(key, params, px, py);
    },
    [lang, isCjkLang, runLookup]
  );

  function skip(el: HTMLElement) {
    return !!el.closest("a, code, pre, iframe, img, button, .dict-popup");
  }

  function onClick(e: React.MouseEvent) {
    const el = e.target as HTMLElement;
    if (skip(el)) return;
    lookup(e.clientX, e.clientY, el);
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    const { clientX, clientY } = e;
    const el = e.target as HTMLElement;
    if (skip(el)) return;
    hoverTimer.current = setTimeout(() => lookup(clientX, clientY, el), 550);
  }

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

  const d = popup?.data;

  function toggleSave() {
    if (!d?.word || !d.defs) return;
    if (saved) {
      removeWord(d.word);
      setSaved(false);
    } else {
      addWord({
        w: d.word,
        p: d.reading,
        d: d.defs.slice(0, 2).join("; "),
        h: d.hsk,
        lang,
      });
      setSaved(true);
    }
  }

  return (
    <div
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
          ) : d?.notFound || !d?.defs ? (
            <p className="text-sm text-gray-500">{t("post.dict.notFound")}</p>
          ) : (
            <>
              <p className="flex flex-wrap items-center gap-x-2 text-base font-bold leading-snug">
                {d.word}
                {d.alt && (
                  <span className="font-normal text-gray-400">({d.alt})</span>
                )}
                {d.hsk && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
                    {d.hsk}
                  </span>
                )}
              </p>
              {d.reading && (
                <p className="mt-0.5 text-sm text-accent">{d.reading}</p>
              )}
              <ul className="mt-1.5 space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
                {d.defs.slice(0, 4).map((def, i) => (
                  <li key={i}>• {def}</li>
                ))}
              </ul>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-2 dark:border-gray-800">
                <button
                  onClick={() =>
                    d.word && speak(d.word, lang, { rate: ttsRate })
                  }
                  className="rounded-md border border-gray-200 px-2 py-1 text-xs transition-colors hover:border-accent hover:text-accent dark:border-gray-700"
                >
                  🔊 {t("post.dict.listen")}
                </button>
                <button
                  onClick={toggleSave}
                  className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                    saved
                      ? "border-accent text-accent"
                      : "border-gray-200 hover:border-accent hover:text-accent dark:border-gray-700"
                  }`}
                >
                  {saved ? `✓ ${t("post.dict.saved")}` : `＋ ${t("post.dict.save")}`}
                </button>
                {lang === "zh" && d.word && (
                  <button
                    onClick={() => setStroke(d.word!)}
                    className="rounded-md border border-gray-200 px-2 py-1 text-xs transition-colors hover:border-accent hover:text-accent dark:border-gray-700"
                  >
                    ✍️ {t("post.dict.strokes")}
                  </button>
                )}
              </div>
              <p className="mt-2 text-[10px] text-gray-400">{d.source}</p>
            </>
          )}
        </div>
      )}

      {stroke && <StrokeOrder word={stroke} onClose={() => setStroke(null)} />}
    </div>
  );
}
