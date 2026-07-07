"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

export default function Navbar() {
  const { t, ct, content, lang, mode, setLang, setMode } = useSettings();
  const pathname = usePathname();

  // Sembunyikan navbar di halaman admin /studio
  if (pathname?.startsWith("/studio")) return null;

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/about", label: t("nav.about") },
    { href: "/settings", label: t("nav.settings") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight transition-colors hover:text-accent"
        >
          {ct(content?.siteName, "site.title")}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2.5 py-1.5 text-sm transition-colors hover:text-accent ${
                  active
                    ? "font-semibold text-accent"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Toggle bahasa cepat */}
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            aria-label="Toggle language"
            className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300"
          >
            {lang === "en" ? "中文" : "EN"}
          </button>

          {/* Toggle dark mode cepat */}
          <button
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
            className="rounded-md border border-gray-200 px-2 py-1 text-xs transition-colors hover:border-accent hover:text-accent dark:border-gray-700"
          >
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>
    </header>
  );
}
