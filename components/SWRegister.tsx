"use client";

import { useEffect } from "react";

/** Daftarkan service worker (untuk install PWA / Add to Home Screen). */
export default function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
