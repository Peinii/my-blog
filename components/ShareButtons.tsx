"use client";

import { useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { siteUrl } from "@/lib/sanity.env";

export default function ShareButtons({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const { t } = useSettings();
  const [copied, setCopied] = useState(false);
  const url = `${siteUrl}/blog/${slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* abaikan */
    }
  }

  const cls =
    "rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent dark:border-gray-700";

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6 dark:border-gray-800">
      <span className="mr-1 text-sm font-medium text-gray-500 dark:text-gray-400">
        {t("post.share")}:
      </span>
      <button onClick={copy} className={cls}>
        {copied ? t("post.share.copied") : `🔗 ${t("post.share.copy")}`}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        WhatsApp
      </a>
      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        X
      </a>
    </div>
  );
}
