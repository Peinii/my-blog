"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

// Partikel dekoratif per tema. Posisi/durasi ditulis tetap (bukan random)
// supaya render server & browser identik. Ringan: 10 elemen, animasi
// transform/opacity saja, mati otomatis saat "kurangi animasi".
const CONFIGS: Record<string, { char: string; mode: "fall" | "rise" | "twinkle" }> = {
  sakura: { char: "✿", mode: "fall" },
  matcha: { char: "❧", mode: "fall" },
  midnight: { char: "✦", mode: "twinkle" },
  ocean: { char: "○", mode: "rise" },
};

// [left %, delay s, durasi s, ukuran px, opacity]
const SLOTS: [number, number, number, number, number][] = [
  [6, 0, 13, 14, 0.5], [17, 4, 16, 10, 0.4], [28, 9, 12, 16, 0.55],
  [39, 2, 18, 11, 0.35], [50, 7, 14, 13, 0.5], [61, 11, 17, 9, 0.4],
  [71, 5, 13, 15, 0.55], [80, 1, 19, 10, 0.35], [88, 8, 15, 12, 0.45],
  [95, 3, 16, 14, 0.5],
];

export default function ThemeParticles() {
  const { theme, reduceMotion } = useSettings();
  const pathname = usePathname();

  const cfg = CONFIGS[theme];
  if (!cfg || reduceMotion || pathname?.startsWith("/studio")) return null;

  return (
    <div className="particles-layer" aria-hidden>
      {SLOTS.map(([left, delay, dur, size, op], i) => (
        <span
          key={`${theme}-${i}`}
          className={`particle particle-${cfg.mode}`}
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${dur}s`,
            fontSize: `${size}px`,
            ["--p-opacity" as string]: op,
            // untuk twinkle: sebar vertikal tetap
            top: cfg.mode === "twinkle" ? `${(i * 37) % 90 + 3}%` : undefined,
          }}
        >
          {cfg.char}
        </span>
      ))}
    </div>
  );
}
