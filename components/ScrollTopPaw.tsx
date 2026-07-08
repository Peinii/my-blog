"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

/** Tombol 🐾 kembali ke atas — muncul setelah scroll cukup jauh. */
export default function ScrollTopPaw() {
  const { t, reduceMotion } = useSettings();
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/studio")) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
      }
      aria-label={t("scrolltop.aria")}
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        left: "max(1.25rem, env(safe-area-inset-left))",
      }}
      className={`fixed z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-accent dark:border-gray-700 dark:bg-gray-900 ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      🐾
    </button>
  );
}
