"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { LANGS, type Lang } from "@/lib/i18n";

export default function Navbar() {
  const { t, ct, content, lang, mode, setLang, setMode } = useSettings();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Tutup menu setiap pindah halaman
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Sembunyikan navbar di halaman admin /studio
  if (pathname?.startsWith("/studio")) return null;

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/about", label: t("nav.about") },
    { href: "/settings", label: t("nav.settings") },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="safe-x sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-5">
        <Link
          href="/"
          className="min-w-0 truncate text-lg font-bold tracking-tight transition-colors hover:text-accent"
        >
          {ct(content?.siteName, "site.title")}
        </Link>

        {/* ===== Desktop (md ke atas) ===== */}
        <div className="hidden items-center gap-1 md:flex lg:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-2.5 py-1.5 text-sm transition-colors hover:text-accent ${
                isActive(l.href)
                  ? "font-semibold text-accent"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            aria-label={t("settings.language")}
            className="cursor-pointer rounded-md border border-gray-200 bg-transparent px-1.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300 dark:[&>option]:bg-gray-900"
          >
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
            className="rounded-md border border-gray-200 px-2 py-1 text-xs transition-colors hover:border-accent hover:text-accent dark:border-gray-700"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* ===== Mobile: tombol hamburger (area tap 44px) ===== */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={t("nav.menu")}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-md text-gray-700 transition-colors hover:text-accent dark:text-gray-200 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? (
              <>
                <path d="M6 6 L18 18" />
                <path d="M18 6 L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7 L20 7" />
                <path d="M4 12 L20 12" />
                <path d="M4 17 L20 17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* ===== Mobile: panel menu ===== */}
      {open && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 md:hidden">
          <div className="mx-auto max-w-4xl px-4 pb-4 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex min-h-[44px] items-center rounded-lg px-3 text-base transition-colors ${
                  isActive(l.href)
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-gray-700 hover:text-accent dark:text-gray-200"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="mt-2 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                aria-label={t("settings.language")}
                className="min-h-[44px] flex-1 cursor-pointer rounded-lg border border-gray-200 bg-transparent px-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200 dark:[&>option]:bg-gray-900"
              >
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>
                    🌐 {l.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-200"
              >
                {mode === "dark" ? "☀️ " + t("settings.light") : "🌙 " + t("settings.dark")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
