"use client";

import { useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { shareUrl } from "@/lib/site-mode";

/**
 * Kotak "salin link share" di halaman artikel blog utama.
 *
 * Sengaja TIDAK tampil secara bawaan. Kalau selalu terlihat, setiap
 * pengunjung blog jadi tahu bahwa situs share itu ada — padahal seluruh
 * gunanya justru memisahkan keduanya. Nyalakan sekali lewat
 * Settings → Share links di perangkatmu sendiri (tersimpan di browser).
 */
export default function ShareLinkBox({ token }: { token?: string }) {
  const { t, showShareLinks } = useSettings();
  const [copied, setCopied] = useState(false);
  const url = shareUrl(token);

  if (!showShareLinks || !url) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url!);
    } catch {
      return; // browser menolak akses clipboard — biarkan teksnya bisa diblok manual
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="mt-8 rounded-xl border border-dashed border-gray-300 p-3 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          🔗 share
        </span>
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-md bg-accent-soft px-2.5 py-1.5 text-xs text-accent">
          {url}
        </code>
        <button
          onClick={copy}
          className="shrink-0 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent hover:text-accent dark:border-gray-700"
        >
          {copied ? `✓ ${t("share.copied")}` : t("share.copy")}
        </button>
      </div>
    </div>
  );
}
