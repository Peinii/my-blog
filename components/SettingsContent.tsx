"use client";

import { useState } from "react";
import {
  useSettings,
  type Accent,
  type Mode,
  type TextSize,
  type ZhFont,
} from "@/lib/settings-context";
import { PETS, getPetDef, type PetType } from "@/lib/pets";
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
  const {
    t,
    lang,
    mode,
    accent,
    pet,
    petType,
    petColor,
    textSize,
    reduceMotion,
    zhFont,
    setLang,
    setMode,
    setAccent,
    setPet,
    setPetType,
    setPetColor,
    setTextSize,
    setReduceMotion,
    setZhFont,
    reset,
  } = useSettings();
  const [resetDone, setResetDone] = useState(false);

  const langs: { id: Lang; label: string }[] = [
    { id: "en", label: "English" },
    { id: "zh", label: "中文 (Mandarin)" },
  ];
  const modes: { id: Mode; label: string; icon: string }[] = [
    { id: "light", label: t("settings.light"), icon: "☀️" },
    { id: "dark", label: t("settings.dark"), icon: "🌙" },
    { id: "system", label: t("settings.system"), icon: "💻" },
  ];
  const sizes: { id: TextSize; label: string }[] = [
    { id: "s", label: t("settings.textSize.s") },
    { id: "m", label: t("settings.textSize.m") },
    { id: "l", label: t("settings.textSize.l") },
  ];
  const zhFonts: { id: ZhFont; sample: string; cls: string }[] = [
    { id: "kai", sample: "你好呀", cls: "zhfont-sample-kai" },
    { id: "hand", sample: "你好呀", cls: "zhfont-sample-hand" },
    { id: "cute", sample: "你好呀", cls: "zhfont-sample-cute" },
  ];
  const petDef = getPetDef(petType);
  const petTypes = Object.values(PETS) as (typeof petDef)[];

  function swatchStyle(c: (typeof petDef.colors)[number]): React.CSSProperties {
    if (!c.swatch || c.swatch.length === 0)
      return { backgroundColor: "var(--accent)" };
    if (c.swatch.length === 1) return { backgroundColor: c.swatch[0] };
    if (c.swatch.length === 2)
      return {
        backgroundImage: `linear-gradient(135deg, ${c.swatch[0]} 55%, ${c.swatch[1]} 55%)`,
      };
    return {
      backgroundImage: `linear-gradient(135deg, ${c.swatch[0]} 45%, ${c.swatch[1]} 45%, ${c.swatch[1]} 72%, ${c.swatch[2]} 72%)`,
    };
  }

  function onReset() {
    reset();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  }

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

          {/* Ukuran teks */}
          <Section
            title={t("settings.textSize")}
            desc={t("settings.textSize.desc")}
          >
            <div className="flex flex-wrap gap-3">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTextSize(s.id)}
                  className={btn(textSize === s.id)}
                >
                  <span
                    className={
                      s.id === "s"
                        ? "text-xs"
                        : s.id === "l"
                          ? "text-base"
                          : "text-sm"
                    }
                  >
                    A
                  </span>{" "}
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Kurangi animasi */}
          <Section title={t("settings.motion")} desc={t("settings.motion.desc")}>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setReduceMotion(false)}
                className={btn(!reduceMotion)}
              >
                ✨ {t("settings.motion.off")}
              </button>
              <button
                onClick={() => setReduceMotion(true)}
                className={btn(reduceMotion)}
              >
                {t("settings.motion.on")}
              </button>
            </div>
          </Section>

          {/* Pet */}
          <Section title={t("settings.pet")} desc={t("settings.pet.desc")}>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setPet(true)} className={btn(pet)}>
                🐱 {t("settings.pet.on")}
              </button>
              <button onClick={() => setPet(false)} className={btn(!pet)}>
                {t("settings.pet.off")}
              </button>
            </div>

            {pet && (
              <>
                {/* Jenis pet */}
                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {t("settings.petType")}{" "}
                    <span className="font-normal text-gray-400">
                      — {t("settings.petType.desc")}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {petTypes.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPetType(p.id as PetType)}
                        className={btn(petType === p.id)}
                      >
                        <span className="mr-1 text-base">{p.emoji}</span>
                        {lang === "zh" ? p.zh : p.en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Warna / ras */}
                <div className="mt-5">
                  <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {t("settings.petColor")}{" "}
                    <span className="font-normal text-gray-400">
                      — {t("settings.petColor.desc")}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {petDef.colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setPetColor(c.id)}
                        aria-label={c.en}
                        className="flex w-16 flex-col items-center gap-1.5"
                      >
                        <span
                          className={`h-9 w-9 rounded-full border border-black/5 transition-transform hover:scale-110 dark:border-white/10 ${
                            petColor === c.id
                              ? "ring-2 ring-accent ring-offset-2 dark:ring-offset-gray-900"
                              : ""
                          }`}
                          style={swatchStyle(c)}
                        />
                        <span className="text-center text-xs leading-tight text-gray-500 dark:text-gray-400">
                          {lang === "zh" ? c.zh : c.en}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Section>

          {/* Font Mandarin */}
          <Section title={t("settings.zhFont")} desc={t("settings.zhFont.desc")}>
            <div className="flex flex-wrap gap-3">
              {zhFonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setZhFont(f.id)}
                  className={btn(zhFont === f.id)}
                >
                  <span className={`${f.cls} mr-1.5 text-lg`}>{f.sample}</span>
                  {t(`settings.zhFont.${f.id}` as any)}
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

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={onReset}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 transition-colors hover:border-red-400 hover:text-red-500 dark:border-gray-700 dark:text-gray-400"
          >
            ↺ {t("settings.reset")}
          </button>
          <p className="text-sm text-gray-400">
            {resetDone ? t("settings.reset.done") : t("settings.saved")}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
