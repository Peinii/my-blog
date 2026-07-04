"use client";

import { useSettings, type Accent, type Mode } from "@/lib/settings-context";
import type { Lang } from "@/lib/i18n";
import Reveal from "./Reveal";

const ACCENTS: { id: Accent; hex: string }[] = [
  { id: "blue", hex: "#4361ee" },
  { id: "teal", hex: "#0d9488" },
  { id: "amber", hex: "#d97706" },
  { id: "rose", hex: "#e11d48" },
  { id: "mono", hex: "#111827" },
];

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function SettingsContent() {
  const { t, lang, mode, accent, setLang, setMode, setAccent } = useSettings();

  const langs: { id: Lang; label: string }[] = [
    { id: "en", label: "English" },
    { id: "zh", label: "中文 (Mandarin)" },
  ];
  const modes: { id: Mode; label: string; icon: string }[] = [
    { id: "light", label: t("settings.light"), icon: "☀️" },
    { id: "dark", label: t("settings.dark"), icon: "🌙" },
  ];

  const btn = (active: boolean) =>
    `rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
      active
        ? "border-accent bg-accent-soft text-accent"
        : "border-gray-200 text-gray-600 hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300"
    }`;

  return (
    <div className="mx-auto max-w-content">
      <Reveal>
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("settings.desc")}
        </p>

        <div className="mt-8 space-y-6">
          {/* Bahasa */}
          <Section
            title={t("settings.language")}
            desc={t("settings.language.desc")}
          >
            <div className="flex flex-wrap gap-3">
              {langs.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={btn(lang === l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Light / dark */}
          <Section
            title={t("settings.appearance")}
            desc={t("settings.appearance.desc")}
          >
            <div className="flex flex-wrap gap-3">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={btn(mode === m.id)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Warna aksen */}
          <Section title={t("settings.accent")} desc={t("settings.accent.desc")}>
            <div className="flex flex-wrap gap-4">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  aria-label={a.id}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`h-9 w-9 rounded-full transition-transform hover:scale-110 ${
                      accent === a.id
                        ? "ring-2 ring-accent ring-offset-2 dark:ring-offset-gray-900"
                        : ""
                    }`}
                    style={{ backgroundColor: a.hex }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t(`settings.accent.${a.id}` as any)}
                  </span>
                </button>
              ))}
            </div>
          </Section>
        </div>

        <p className="mt-6 text-sm text-gray-400">{t("settings.saved")}</p>
      </Reveal>
    </div>
  );
}
