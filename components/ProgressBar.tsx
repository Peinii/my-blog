"use client";

import { useEffect, useState } from "react";

/** Garis tipis di atas layar yang terisi seiring pembaca scroll artikel. */
export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    >
      <div
        className="h-full rounded-r-full transition-[width] duration-150"
        style={{ width: `${progress}%`, backgroundColor: "var(--accent)" }}
      />
    </div>
  );
}
