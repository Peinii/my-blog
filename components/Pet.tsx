"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { getPalette, getPetDef, paletteVars, type PetType } from "@/lib/pets";
import CatSvg from "./pets/CatSvg";
import BunnySvg from "./pets/BunnySvg";
import BlobSvg from "./pets/BlobSvg";
import HamsterSvg from "./pets/HamsterSvg";
import DogSvg from "./pets/DogSvg";
import TurtleSvg from "./pets/TurtleSvg";
import CapybaraSvg from "./pets/CapybaraSvg";
import HorseSvg from "./pets/HorseSvg";
import GoatSvg from "./pets/GoatSvg";
import SealSvg from "./pets/SealSvg";

const SVGS: Partial<Record<PetType, (p: { className?: string }) => JSX.Element>> = {
  cat: CatSvg,
  bunny: BunnySvg,
  blob: BlobSvg,
  hamster: HamsterSvg,
  dog: DogSvg,
  turtle: TurtleSvg,
  capybara: CapybaraSvg,
  horse: HorseSvg,
  goat: GoatSvg,
  seal: SealSvg,
};

// ---------- suara unik per pet (Web Audio, tanpa file) ----------
let audioCtx: AudioContext | null = null;

function tone(
  ctx: AudioContext,
  {
    type = "sine" as OscillatorType,
    from = 440,
    to = 440,
    at = 0,
    dur = 0.2,
    vol = 0.15,
    filterFreq = 2200,
    vibrato = 0,
  }
) {
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t0 + dur);
  if (vibrato > 0) {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = vibrato;
    lfoGain.gain.value = from * 0.06;
    lfo.connect(lfoGain).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + dur);
  }
  filter.type = "lowpass";
  filter.frequency.value = filterFreq;
  filter.Q.value = 3;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(filter).connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function playSound(pet: PetType) {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    const ctx = audioCtx;
    if (ctx.state === "suspended") ctx.resume();

    switch (pet) {
      case "cat":
        tone(ctx, { type: "sawtooth", from: 620, to: 880, dur: 0.12, vol: 0.16, filterFreq: 1800 });
        tone(ctx, { type: "sawtooth", from: 880, to: 300, at: 0.12, dur: 0.33, vol: 0.16, filterFreq: 1800 });
        break;
      case "dog": // dua "woof" pendek rendah
        tone(ctx, { type: "square", from: 300, to: 140, dur: 0.09, vol: 0.14, filterFreq: 900 });
        tone(ctx, { type: "square", from: 330, to: 150, at: 0.16, dur: 0.1, vol: 0.15, filterFreq: 900 });
        break;
      case "bunny": // cicit imut dua kali
        tone(ctx, { type: "triangle", from: 950, to: 1400, dur: 0.08, vol: 0.12 });
        tone(ctx, { type: "triangle", from: 1000, to: 1500, at: 0.13, dur: 0.08, vol: 0.12 });
        break;
      case "blob": // "boing" kenyal
        tone(ctx, { type: "sine", from: 420, to: 130, dur: 0.22, vol: 0.18, filterFreq: 1200 });
        tone(ctx, { type: "sine", from: 130, to: 240, at: 0.22, dur: 0.12, vol: 0.1, filterFreq: 1200 });
        break;
      case "hamster": // tiga cit-cit cepat
        tone(ctx, { type: "square", from: 1300, to: 1700, dur: 0.05, vol: 0.09 });
        tone(ctx, { type: "square", from: 1250, to: 1650, at: 0.09, dur: 0.05, vol: 0.09 });
        tone(ctx, { type: "square", from: 1350, to: 1750, at: 0.18, dur: 0.05, vol: 0.09 });
        break;
      case "turtle": // gelembung pelan
        tone(ctx, { type: "sine", from: 300, to: 180, dur: 0.35, vol: 0.12, filterFreq: 800 });
        break;
      case "capybara": // "mlem" santai
        tone(ctx, { type: "sine", from: 520, to: 330, dur: 0.28, vol: 0.13, filterFreq: 1000 });
        break;
      case "horse": // ringkik bergetar turun
        tone(ctx, { type: "sawtooth", from: 950, to: 380, dur: 0.5, vol: 0.13, filterFreq: 2000, vibrato: 16 });
        break;
      case "goat": // embik bergetar
        tone(ctx, { type: "sawtooth", from: 600, to: 520, dur: 0.4, vol: 0.14, filterFreq: 1400, vibrato: 9 });
        break;
      case "seal": // "arf arf" khas anjing laut
        tone(ctx, { type: "square", from: 480, to: 260, dur: 0.11, vol: 0.13, filterFreq: 1100 });
        tone(ctx, { type: "square", from: 520, to: 280, at: 0.18, dur: 0.11, vol: 0.14, filterFreq: 1100 });
        break;
      case "boy": // "tada!" ceria naik
        tone(ctx, { type: "sine", from: 520, to: 780, dur: 0.1, vol: 0.13 });
        tone(ctx, { type: "sine", from: 700, to: 1050, at: 0.12, dur: 0.16, vol: 0.13 });
        break;
      case "chonk": // dengkuran berat kucing gendut
        tone(ctx, { type: "sawtooth", from: 210, to: 150, dur: 0.5, vol: 0.13, filterFreq: 700, vibrato: 22 });
        break;
      case "hero": // "hyah!" tegas
        tone(ctx, { type: "square", from: 750, to: 280, dur: 0.09, vol: 0.13, filterFreq: 1600 });
        tone(ctx, { type: "square", from: 500, to: 200, at: 0.1, dur: 0.12, vol: 0.11, filterFreq: 1400 });
        break;
      case "laugh": // "ha-ha-ha" tiga nada turun
        tone(ctx, { type: "triangle", from: 460, to: 400, dur: 0.09, vol: 0.14 });
        tone(ctx, { type: "triangle", from: 420, to: 360, at: 0.14, dur: 0.09, vol: 0.14 });
        tone(ctx, { type: "triangle", from: 380, to: 320, at: 0.28, dur: 0.11, vol: 0.14 });
        break;
    }
  } catch {
    /* tanpa audio: diam */
  }
}

// ---------- komponen ----------
export default function Pet() {
  const { pet, petType, petColor, reduceMotion, lang, t } = useSettings();
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [hearts, setHearts] = useState<number[]>([]);
  const [sleeping, setSleeping] = useState(false);
  const movedRef = useRef(false);

  // Sapaan kecil sesuai jam, sekali per kunjungan.
  useEffect(() => {
    if (!pet) return;
    try {
      if (sessionStorage.getItem("pet-greeted")) return;
      sessionStorage.setItem("pet-greeted", "1");
    } catch {
      /* private mode: sapa saja */
    }
    const h = new Date().getHours();
    const key =
      h >= 5 && h < 11
        ? "pet.greet.morning"
        : h >= 11 && h < 15
          ? "pet.greet.day"
          : h >= 15 && h < 19
            ? "pet.greet.evening"
            : "pet.greet.night";
    const show = setTimeout(() => setBubble(t(key as any)), 900);
    const hide = setTimeout(() => setBubble(null), 3400);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !pet) return;

    const reduced =
      reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let x = window.innerWidth - 90;
    let y = window.innerHeight - 90;
    let tx = x;
    let ty = y;
    let raf = 0;
    let lastMove = Date.now();
    let sleepTimer: ReturnType<typeof setInterval> | null = null;

    el.style.transform = `translate(${x}px, ${y}px)`;

    if (reduced || isTouch) {
      // Duduk manis di pojok — dan pindah ikut ukuran layar
      // saat HP diputar / foldable dibuka-tutup.
      const replace = () => {
        x = window.innerWidth - 90;
        y = window.innerHeight - 90;
        el.style.transform = `translate(${x}px, ${y}px)`;
      };
      window.addEventListener("resize", replace);
      window.addEventListener("orientationchange", replace);
      return () => {
        window.removeEventListener("resize", replace);
        window.removeEventListener("orientationchange", replace);
      };
    }

    function onMove(e: MouseEvent) {
      if (dragging) return;
      tx = e.clientX - 70;
      ty = e.clientY + 24;
      lastMove = Date.now();
      setSleeping(false);
    }

    // ===== Gendong pet (drag & drop) =====
    let dragging = false;
    let startX = 0;
    let startY = 0;

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      movedRef.current = false;
      el!.classList.add("pet-grabbing");
      el!.setPointerCapture?.(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      if (
        Math.abs(e.clientX - startX) > 6 ||
        Math.abs(e.clientY - startY) > 6
      ) {
        movedRef.current = true;
      }
      // pet menempel di tangan
      x = tx = e.clientX - 28;
      y = ty = e.clientY - 30;
      lastMove = Date.now();
      setSleeping(false);
    }
    function onPointerUp() {
      dragging = false;
      el!.classList.remove("pet-grabbing");
    }

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // kura-kura jalan lebih santai :)
    const speed = petType === "turtle" ? 0.03 : 0.06;

    function tick() {
      const dx = tx - x;
      x += dx * speed;
      y += (ty - y) * speed;
      x = Math.max(0, Math.min(window.innerWidth - 64, x));
      y = Math.max(0, Math.min(window.innerHeight - 64, y));
      el!.style.transform = `translate(${x}px, ${y}px)`;
      if (Math.abs(dx) > 2) setFlip(dx < 0);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    sleepTimer = setInterval(() => {
      if (Date.now() - lastMove > 8000) setSleeping(true);
    }, 2000);

    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (sleepTimer) clearInterval(sleepTimer);
    };
  }, [pet, petType, reduceMotion]);

  if (!pet || pathname?.startsWith("/studio")) return null;

  const def = getPetDef(petType);
  const palette = getPalette(petType, petColor);
  const PetSvg = SVGS[def.id] ?? CatSvg;

  function onPetClick() {
    // habis di-drag? itu bukan klik
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    setBubble(def.bubbles[lang === "zh" ? 1 : 0]);
    setHearts((h) => [...h, Date.now()]);
    setSleeping(false);
    playSound(def.id);
    setTimeout(() => setBubble(null), 1400);
    setTimeout(() => setHearts((h) => h.slice(1)), 1100);
  }

  return (
    <div
      ref={wrapRef}
      aria-label={t("pet.aria")}
      className="pet-wrap"
      onClick={onPetClick}
      style={paletteVars(palette.vars) as CSSProperties}
    >
      {bubble && <span className="pet-bubble">{bubble}</span>}
      {sleeping && <span className="pet-zzz">z Z</span>}
      {hearts.map((id) => (
        <span key={id} className="pet-heart">♥</span>
      ))}
      {def.img ? (
        <span
          className={sleeping ? "pet-sleep" : ""}
          style={{ display: "inline-block", transform: flip ? "scaleX(-1)" : undefined }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={def.img} alt="" draggable={false} className="pet-img" />
        </span>
      ) : (
        <PetSvg
          className={`pet-svg ${flip ? "pet-flip" : ""} ${sleeping ? "pet-sleep" : ""}`}
        />
      )}
    </div>
  );
}
