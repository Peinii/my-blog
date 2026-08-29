"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { SHARE_MODE } from "@/lib/site-mode";

export default function Footer() {
  const { t, ct, content } = useSettings();
  const pathname = usePathname();
  // Ikut disembunyikan di /studio, di halaman share, dan di mode share
  // (footer memuat nama situs — itu saja sudah membocorkan blog utama).
  if (SHARE_MODE || pathname?.startsWith("/studio") || pathname?.startsWith("/s/"))
    return null;

  return (
    <footer className="safe-x safe-bottom border-t border-gray-100 py-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      © {new Date().getFullYear()} {ct(content?.siteName, "site.title")}.{" "}
      {t("footer.rights")}
    </footer>
  );
}
