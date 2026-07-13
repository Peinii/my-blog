"use client";

// Polish pack ala originkit/pryzm: kursor custom + grain texture.
// Hanya di perangkat berkursor; hormat reduce-motion; toggle di Settings.
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

export default function FancyFx() {
  const { fancyFx, reduceMotion } = useSettings();
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const active =
    fancyFx && fine && !reduceMotion && !pathname?.startsWith("/studio");

  useEffect(() => {
    document.documentElement.classList.toggle("fancy-cursor", !!active);
    if (!active) return;

    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    let hovering = false;

    function onMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as HTMLElement;
      hovering = !!el.closest?.("a, button, [role='button'], input, select, label");
    }
    function tick() {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${rx - 14}px, ${ry - 14}px) scale(${hovering ? 1.6 : 1})`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("fancy-cursor");
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div className="grain-layer" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
