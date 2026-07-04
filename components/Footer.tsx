"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

export default function Footer() {
  const { t } = useSettings();
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;

  return (
    <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      © {new Date().getFullYear()} {t("site.title")}. {t("footer.rights")}
    </footer>
  );
}
