"use client";

// Photo Lab — efek gambar retro ala ditther.com, 100% di browser.
// Tidak ada upload ke server: file dibaca lokal, diproses di canvas.
import { useCallback, useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import Reveal from "./Reveal";

type Effect = "dither" | "bayer" | "halftone" | "pixel" | "ascii";

const EFFECTS: { id: Effect; label: string }[] = [
  { id: "dither", label: "Dither" },
  { id: "bayer", label: "Bayer" },
  { id: "halftone", label: "Halftone" },
  { id: "pixel", label: "Pixel" },
  { id: "ascii", label: "ASCII" },
];

const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const ASCII_CHARS = "@%#*+=-:. ";

function luminance(d: Uint8ClampedArray, i: number) {
  return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
}

export default function PhotoLab() {
  const { t } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [effect, setEffect] = useState<Effect>("dither");
  const [cell, setCell] = useState(6); // ukuran pixel/dot/karakter
  const [dragOver, setDragOver] = useState(false);

  function loadFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => setImg(image);
    image.src = url;
  }

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const maxW = 900;
    const scale = Math.min(1, maxW / img.width);
    const W = Math.round(img.width * scale);
    const H = Math.round(img.height * scale);
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;

    if (effect === "pixel") {
      const w = Math.max(2, Math.round(W / cell / 4));
      const h = Math.max(2, Math.round((H / W) * w));
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d")!;
      octx.drawImage(img, 0, 0, w, h);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, W, H);
      return;
    }

    if (effect === "dither" || effect === "bayer") {
      // proses di resolusi kecil biar cepat & butirannya terlihat
      const w = Math.max(24, Math.round(W / (cell / 2)));
      const h = Math.max(24, Math.round((H / W) * w));
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d")!;
      octx.drawImage(img, 0, 0, w, h);
      const id = octx.getImageData(0, 0, w, h);
      const d = id.data;

      if (effect === "bayer") {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const g = luminance(d, i);
            const thr = ((BAYER4[y % 4][x % 4] + 0.5) / 16) * 255;
            const v = g > thr ? 255 : 0;
            d[i] = d[i + 1] = d[i + 2] = v;
          }
        }
      } else {
        // Floyd–Steinberg
        const gray = new Float32Array(w * h);
        for (let p = 0; p < w * h; p++) gray[p] = luminance(d, p * 4);
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const p = y * w + x;
            const old = gray[p];
            const nv = old > 127 ? 255 : 0;
            const err = old - nv;
            gray[p] = nv;
            if (x + 1 < w) gray[p + 1] += (err * 7) / 16;
            if (y + 1 < h) {
              if (x > 0) gray[p + w - 1] += (err * 3) / 16;
              gray[p + w] += (err * 5) / 16;
              if (x + 1 < w) gray[p + w + 1] += (err * 1) / 16;
            }
          }
        }
        for (let p = 0; p < w * h; p++) {
          d[p * 4] = d[p * 4 + 1] = d[p * 4 + 2] = gray[p];
        }
      }
      octx.putImageData(id, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, W, H);
      return;
    }

    // halftone & ascii: sampling per sel
    const cols = Math.max(8, Math.round(W / cell));
    const rows = Math.max(8, Math.round(H / cell));
    const off = document.createElement("canvas");
    off.width = cols;
    off.height = rows;
    const octx = off.getContext("2d")!;
    octx.drawImage(img, 0, 0, cols, rows);
    const d = octx.getImageData(0, 0, cols, rows).data;

    ctx.fillStyle = effect === "ascii" ? "#f8f7f2" : "#faf6ef";
    ctx.fillRect(0, 0, W, H);
    const cw = W / cols;
    const chh = H / rows;

    if (effect === "halftone") {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const dark = 1 - luminance(d, i) / 255;
          const r = (Math.min(cw, chh) / 2) * Math.sqrt(dark) * 1.15;
          if (r < 0.3) continue;
          ctx.fillStyle = `rgb(${d[i] * 0.35}, ${d[i + 1] * 0.35}, ${d[i + 2] * 0.35})`;
          ctx.beginPath();
          ctx.arc(x * cw + cw / 2, y * chh + chh / 2, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      ctx.fillStyle = "#2b2b36";
      ctx.font = `${Math.ceil(chh)}px ui-monospace, Menlo, monospace`;
      ctx.textBaseline = "top";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const g = luminance(d, i);
          const ch =
            ASCII_CHARS[
              Math.min(
                ASCII_CHARS.length - 1,
                Math.floor((g / 255) * ASCII_CHARS.length)
              )
            ];
          if (ch !== " ") ctx.fillText(ch, x * cw, y * chh);
        }
      }
    }
  }, [img, effect, cell]);

  useEffect(() => {
    render();
  }, [render]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `peini-lab-${effect}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  const btn = (active: boolean) =>
    `rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-all ${
      active
        ? "border-accent bg-accent-soft text-accent"
        : "border-gray-200 text-gray-600 hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300"
    }`;

  return (
    <div>
      <Reveal>
        <h1 className="text-3xl font-bold">📷 {t("lab.title")}</h1>
        <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">
          {t("lab.desc")}
        </p>
      </Reveal>

      {/* dropzone / hasil */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) loadFile(f);
        }}
        className={`mt-6 rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
          dragOver
            ? "border-accent bg-accent-soft"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {img ? (
          <canvas
            ref={canvasRef}
            className="mx-auto h-auto max-w-full rounded-lg"
          />
        ) : (
          <label className="block cursor-pointer py-14">
            <span className="text-4xl">🖼️</span>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {t("lab.drop")}
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) loadFile(f);
              }}
            />
          </label>
        )}
      </div>

      {img && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {EFFECTS.map((ef) => (
              <button
                key={ef.id}
                onClick={() => setEffect(ef.id)}
                className={btn(effect === ef.id)}
              >
                {ef.label}
              </button>
            ))}
          </div>

          <label className="flex max-w-sm items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            {t("lab.size")}
            <input
              type="range"
              min={3}
              max={16}
              value={cell}
              onChange={(e) => setCell(Number(e.target.value))}
              className="flex-1 accent-[var(--accent)]"
            />
            <span className="w-6 text-right text-gray-400">{cell}</span>
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={download}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:text-gray-900"
              style={{ backgroundColor: "var(--accent)" }}
            >
              ⬇ {t("lab.download")}
            </button>
            <label className={btn(false) + " cursor-pointer"}>
              {t("lab.change")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) loadFile(f);
                }}
              />
            </label>
          </div>

          <p className="text-xs text-gray-400">{t("lab.note")}</p>
        </div>
      )}
    </div>
  );
}
