"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

/**
 * Kucing kecil yang mengikuti kursor. Murni CSS + sedikit JS (requestAnimationFrame),
 * tanpa library — sangat ringan dan tidak membebani hosting.
 * Bisa dimatikan lewat halaman Settings. Menghormati prefers-reduced-motion.
 */
export default function Pet() {
  const { pet, reduceMotion, t } = useSettings();
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [hearts, setHearts] = useState<number[]>([]);
  const [sleeping, setSleeping] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !pet) return;

    const reduced =
      reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    // Posisi awal: pojok kanan bawah
    let x = window.innerWidth - 90;
    let y = window.innerHeight - 90;
    let tx = x;
    let ty = y;
    let raf = 0;
    let lastMove = Date.now();
    let sleepTimer: ReturnType<typeof setInterval> | null = null;

    el.style.transform = `translate(${x}px, ${y}px)`;

    if (reduced || isTouch) {
      // Duduk manis di pojok, tidak mengejar kursor
      return;
    }

    function onMove(e: MouseEvent) {
      // Berdiri agak di belakang kursor supaya tidak menghalangi klik
      tx = e.clientX - 70;
      ty = e.clientY + 24;
      lastMove = Date.now();
      setSleeping(false);
    }

    function tick() {
      const dx = tx - x;
      x += dx * 0.06;
      y += (ty - y) * 0.06;
      // Jaga tetap di dalam layar
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
      if (sleepTimer) clearInterval(sleepTimer);
    };
  }, [pet, reduceMotion]);

  if (!pet || pathname?.startsWith("/studio")) return null;

  // Suara "meow" disintesis via Web Audio API — tanpa file audio.
  // Hanya berbunyi saat diklik (aturan autoplay browser terpenuhi).
  function meow() {
    try {
      const AC =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx: AudioContext =
        (meow as any)._ctx || ((meow as any)._ctx = new AC());
      if (ctx.state === "suspended") ctx.resume();

      const t0 = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      // kontur nada "me-oww": naik sebentar lalu turun melengkung
      osc.frequency.setValueAtTime(620, t0);
      osc.frequency.linearRampToValueAtTime(880, t0 + 0.12);
      osc.frequency.exponentialRampToValueAtTime(300, t0 + 0.45);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, t0);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.05);
      gain.gain.setValueAtTime(0.18, t0 + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);

      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.55);
    } catch {
      /* browser tanpa audio: diam saja */
    }
  }

  function onPetClick() {
    setBubble(Math.random() > 0.5 ? "meow~ ♡" : "喵~ ♡");
    setHearts((h) => [...h, Date.now()]);
    setSleeping(false);
    meow();
    setTimeout(() => setBubble(null), 1400);
    setTimeout(() => setHearts((h) => h.slice(1)), 1100);
  }

  return (
    <div
      ref={wrapRef}
      aria-label={t("pet.aria")}
      className="pet-wrap"
      onClick={onPetClick}
    >
      {bubble && <span className="pet-bubble">{bubble}</span>}
      {sleeping && <span className="pet-zzz">z Z</span>}
      {hearts.map((id) => (
        <span key={id} className="pet-heart">♥</span>
      ))}
      <svg
        viewBox="0 0 64 64"
        width="56"
        height="56"
        className={`pet-cat ${flip ? "pet-flip" : ""} ${sleeping ? "pet-sleep" : ""}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ekor */}
        <path
          className="pet-tail"
          d="M50 46 Q62 42 58 30"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* badan */}
        <ellipse cx="32" cy="48" rx="18" ry="12" fill="var(--accent)" />
        {/* kepala */}
        <circle cx="32" cy="28" r="15" fill="var(--accent)" />
        {/* telinga */}
        <path d="M20 20 L18 8 L28 15 Z" fill="var(--accent)" />
        <path d="M44 20 L46 8 L36 15 Z" fill="var(--accent)" />
        <path d="M21 17 L20 11 L25 14.5 Z" fill="#ffb6c1" />
        <path d="M43 17 L44 11 L39 14.5 Z" fill="#ffb6c1" />
        {/* mata */}
        <g className="pet-eyes">
          <circle cx="26" cy="27" r="2.6" fill="#1a1a2e" />
          <circle cx="38" cy="27" r="2.6" fill="#1a1a2e" />
          <circle cx="27" cy="26" r="0.9" fill="#fff" />
          <circle cx="39" cy="26" r="0.9" fill="#fff" />
        </g>
        {/* mata tidur */}
        <g className="pet-eyes-closed">
          <path d="M23 27 Q26 29 29 27" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M35 27 Q38 29 41 27" stroke="#1a1a2e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
        {/* hidung & mulut */}
        <path d="M31 32 L33 32 L32 33.6 Z" fill="#ffb6c1" />
        <path d="M32 33.6 Q32 35.5 29.5 35.8 M32 33.6 Q32 35.5 34.5 35.8" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        {/* kumis */}
        <g stroke="#1a1a2e" strokeWidth="0.9" strokeLinecap="round" opacity="0.65">
          <path d="M18 30 L10 29" /><path d="M18 33 L10.5 34.5" />
          <path d="M46 30 L54 29" /><path d="M46 33 L53.5 34.5" />
        </g>
        {/* kaki depan */}
        <ellipse cx="24" cy="57" rx="4.5" ry="3" fill="var(--accent)" />
        <ellipse cx="40" cy="57" rx="4.5" ry="3" fill="var(--accent)" />
      </svg>
    </div>
  );
}
