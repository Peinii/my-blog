"use client";

// Pemutar voiceover rekaman (file audio yang di-upload di Studio),
// dengan kontrol kecepatan untuk latihan menyimak.
import { useRef, useState } from "react";
import { useSettings } from "@/lib/settings-context";

const RATES = [0.6, 0.8, 1, 1.25];

export default function AudioPlayer({ src }: { src: string }) {
  const { t } = useSettings();
  const ref = useRef<HTMLAudioElement>(null);
  const [rate, setRate] = useState(1);

  function changeRate(r: number) {
    setRate(r);
    if (ref.current) ref.current.playbackRate = r;
  }

  return (
    <div className="mt-5 rounded-xl border border-gray-100 p-3 dark:border-gray-800">
      <p className="mb-2 text-sm font-medium">🎧 {t("post.audio.title")}</p>
      <audio ref={ref} src={src} controls preload="none" className="w-full" />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t("post.tts.speed")}
        </span>
        {RATES.map((r) => (
          <button
            key={r}
            onClick={() => changeRate(r)}
            className={`rounded-md border px-2 py-1 text-xs transition-colors ${
              rate === r
                ? "border-accent text-accent"
                : "border-gray-200 text-gray-500 hover:border-accent dark:border-gray-700"
            }`}
          >
            {r}×
          </button>
        ))}
      </div>
    </div>
  );
}
