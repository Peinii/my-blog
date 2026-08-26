"use client";

// Baca artikel dengan suara (TTS bawaan perangkat).
// Kalimat yang sedang dibaca ditampilkan di bar + paragrafnya disorot.
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import {
  hasVoiceFor,
  speak,
  splitSentences,
  stopSpeaking,
  ttsSupported,
} from "@/lib/speak";

const RATES = [0.6, 0.8, 1];

export default function ReadAloud({
  blocks,
  lang,
}: {
  /** teks per paragraf beserta _key blok-nya (untuk menyorot paragraf) */
  blocks: { key: string; text: string }[];
  lang: string;
}) {
  const { t, ttsRate, setTtsRate } = useSettings();
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState<string>("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const queueRef = useRef<{ text: string; block: string }[]>([]);
  const posRef = useRef(0);

  useEffect(() => {
    if (!ttsSupported()) {
      setAvailable(false);
      return;
    }
    const check = () => setAvailable(hasVoiceFor(lang));
    check();
    // daftar suara kadang baru siap setelah event ini
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", check);
      stopSpeaking();
    };
  }, [lang]);

  function highlight(blockKey: string | null) {
    document
      .querySelectorAll(".block-speaking")
      .forEach((el) => el.classList.remove("block-speaking"));
    if (!blockKey) return;
    document
      .querySelector(`[data-block-key="${blockKey}"]`)
      ?.classList.add("block-speaking");
  }

  function playFrom(i: number) {
    const q = queueRef.current;
    if (i >= q.length) {
      stop();
      return;
    }
    posRef.current = i;
    setCurrent(q[i].text);
    highlight(q[i].block);
    speak(q[i].text, lang, {
      rate: ttsRate,
      onEnd: () => {
        if (posRef.current === i) playFrom(i + 1);
      },
    });
  }

  function start() {
    const q: { text: string; block: string }[] = [];
    blocks.forEach((b) =>
      splitSentences(b.text).forEach((s) => q.push({ text: s, block: b.key }))
    );
    if (q.length === 0) return;
    queueRef.current = q;
    setPlaying(true);
    playFrom(0);
  }

  function stop() {
    stopSpeaking();
    setPlaying(false);
    setCurrent("");
    highlight(null);
    posRef.current = -1;
  }

  if (available === false) {
    return (
      <p className="mt-4 text-xs text-gray-400">{t("post.tts.unavailable")}</p>
    );
  }

  return (
    <div className="readaloud mt-5 rounded-xl border border-gray-100 p-3 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={playing ? stop : start}
          className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:text-gray-900"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {playing ? `⏹ ${t("post.tts.stop")}` : `▶ ${t("post.tts.play")}`}
        </button>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t("post.tts.speed")}
        </span>
        {RATES.map((r) => (
          <button
            key={r}
            onClick={() => setTtsRate(r)}
            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
              ttsRate === r
                ? "border-accent text-accent"
                : "border-gray-200 text-gray-500 hover:border-accent dark:border-gray-700"
            }`}
          >
            {r}×
          </button>
        ))}
      </div>
      {playing && current && (
        <p className="mt-2 text-sm font-medium text-accent">🔊 {current}</p>
      )}
    </div>
  );
}
