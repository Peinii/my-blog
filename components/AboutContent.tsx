"use client";

import { useSettings } from "@/lib/settings-context";
import Reveal from "./Reveal";

// Daftar bawaan — dipakai kalau kontak belum diisi di Studio (Site Settings).
const defaultSocials = [
  { label: "Email", url: "mailto:anselsioul@gmail.com" },
  { label: "GitHub", url: "https://github.com/" },
  { label: "Instagram", url: "https://instagram.com/" },
];

export default function AboutContent() {
  const { t, ct, content } = useSettings();
  const socials =
    content?.contacts && content.contacts.length > 0
      ? content.contacts
      : defaultSocials;

  return (
    <div className="mx-auto max-w-content">
      <Reveal>
        <h1 className="text-3xl font-bold">{t("about.title")}</h1>
        <p className="mt-5 whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
          {ct(content?.aboutBody, "about.body")}
        </p>

        <h2 className="mt-10 text-xl font-semibold">{t("about.contact")}</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent dark:border-gray-700"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
