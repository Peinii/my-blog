"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";

export default function NotFound() {
  const { t } = useSettings();

  return (
    <div className="flex flex-col items-center py-16 text-center">
      {/* kucing bingung */}
      <svg viewBox="0 0 64 64" width="110" height="110" aria-hidden>
        <path d="M50 46 Q64 44 56 32" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="32" cy="48" rx="18" ry="12" fill="var(--accent)" />
        <circle cx="32" cy="28" r="15" fill="var(--accent)" />
        <path d="M20 20 L18 8 L28 15 Z" fill="var(--accent)" />
        <path d="M44 20 L46 8 L36 15 Z" fill="var(--accent)" />
        <path d="M21 17 L20 11 L25 14.5 Z" fill="#ffb6c1" />
        <path d="M43 17 L44 11 L39 14.5 Z" fill="#ffb6c1" />
        {/* mata bingung: satu bulat satu garis */}
        <circle cx="26" cy="27" r="2.6" fill="#1a1a2e" />
        <path d="M35 27 Q38 25.5 41 27" stroke="#1a1a2e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M31 33 L33 33 L32 34.6 Z" fill="#ffb6c1" />
        <path d="M32 34.6 Q32 36.5 29.5 36.8" stroke="#1a1a2e" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        {/* tanda tanya */}
        <text x="48" y="16" fontSize="13" fill="var(--accent)" fontWeight="bold">?</text>
      </svg>

      <h1 className="mt-6 text-5xl font-bold tracking-tight">404</h1>
      <h2 className="mt-2 text-xl font-semibold">{t("notfound.title")}</h2>
      <p className="mt-2 max-w-sm text-gray-600 dark:text-gray-400">
        {t("notfound.desc")}
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg px-5 py-2.5 font-medium text-white transition-opacity hover:opacity-85 dark:text-gray-900"
        style={{ backgroundColor: "var(--accent)" }}
      >
        🏠 {t("notfound.home")}
      </Link>
    </div>
  );
}
