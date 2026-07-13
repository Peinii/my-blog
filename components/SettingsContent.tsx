"use client";

import { useState } from "react";
import {
  useSettings,
  type Accent,
  type Mode,
  type TextSize,
  type ZhFont,
  type EnFont,
  type Theme,
} from "@/lib/settings-context";
import { PETS, getPetDef, type PetType } from "@/lib/pets";
import { LANGS } from "@/lib/i18n";
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
    enFont,
    theme,
    dictEnabled,
    setDictEnabled,
    fancyFx,
    setFancyFx,
    uiStyle,
    setUiStyle,
    setLang,
    setMode,
    setAccent,
    setPet,
    setPetType,
    setPetColor,
    setTextSize,
    setReduceMotion,
    setZhFont,
    setEnFont,
    setTheme,
    reset,
  } = useSettings();
  const [resetDone, setResetDone] = useState(false);

  const langs = LANGS;
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
  const themes: { id: Theme; emoji: string; hex: string }[] = [
    { id: "classic", emoji: "🎨", hex: "" },
    { id: "sakura", emoji: "🌸", hex: "#e85d8a" },
    { id: "matcha", emoji: "🍵", hex: "#5f8d4e" },
    { id: "midnight", emoji: "🌙", hex: "#8b7ff5" },
    { id: "ocean", emoji: "🌊", hex: "#2d8fc4" },
  ];
  const enFonts: { id: EnFont; name: string; cls: string }[] = [
    { id: "default", name: "Default", cls: "enfont-sample-default" },
    { id: "cormorant", name: "Cormorant Garamond", cls: "enfont-sample-cormorant" },
    { id: "playfair", name: "Playfair Display", cls: "enfont-sample-playfair" },
    { id: "lora", name: "Lora", cls: "enfont-sample-lora" },
    { id: "comfortaa", name: "Comfortaa", cls: "enfont-sample-comfortaa" },
    { id: "parisienne", name: "Parisienne", cls: "enfont-sample-parisienne" },
    { id: "imfell", name: "IM Fell English SC", cls: "enfont-sample-imfell" },
    { id: "dancing", name: "Dancing Script", cls: "enfont-sample-dancing" },
    { id: "vibes", name: "Great Vibes", cls: "enfont-sample-vibes" },
    { id: "pacifico", name: "Pacifico", cls: "enfont-sample-pacifico" },
  ];
  const zhFonts: { id: ZhFont; sample: string; cls: string }[] = [
    { id: "kai", sample: "你好呀", cls: "zhfont-sample-kai" },
    { id: "hand", sample: "你好呀", cls: "zhfont-sample-hand" },
    { id: "cute", sample: "你好呀", cls: "zhfont-sample-cute" },
  ];
  const isZh = lang === "zh";
  const petDef = getPetDef(petType);
  const allPets = Object.values(PETS) as (typeof petDef)[];
  const normalPets = allPets.filter((p) => !p.special);
  const specialPets = allPets.filter((p) => p.special);

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

          {/* Theme pack */}
          <Section title={t("settings.theme")} desc={t("settings.theme.desc")}>
            <div className="flex flex-wrap gap-3">
              {themes.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={btn(theme === th.id)}
                >
                  <span className="mr-1.5">{th.emoji}</span>
                  {t(`settings.theme.${th.id}` as any)}
                  {th.hex && (
                    <span
                      className="ml-2 inline-block h-3 w-3 rounded-full align-middle"
                      style={{ backgroundColor: th.hex }}
                    />
                  )}
                </button>
              ))}
            </div>
            {theme !== "classic" && (
              <p className="mt-3 text-xs text-gray-400">
                {t("settings.theme.accentNote")}
              </p>
            )}
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

          {/* Design style: flat / claymorphism */}
          <Section
            title={t("settings.uistyle")}
            desc={t("settings.uistyle.desc")}
          >
            <div className="flex flex-wrap gap-3">
              {(
                [
                  { id: "flat", icon: "▭" },
                  { id: "clay", icon: "🏺" },
                  { id: "glass", icon: "🫧" },
                  { id: "brutal", icon: "⬛" },
                  { id: "neu", icon: "☁️" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setUiStyle(st.id)}
                  className={btn(uiStyle === st.id)}
                >
                  {st.icon} {t(`settings.uistyle.${st.id}` as any)}
                </button>
              ))}
            </div>
          </Section>

          {/* Efek premium */}
          <Section title={t("settings.fx")} desc={t("settings.fx.desc")}>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFancyFx(true)}
                className={btn(fancyFx)}
              >
                ✨ {t("settings.pet.on")}
              </button>
              <button
                onClick={() => setFancyFx(false)}
                className={btn(!fancyFx)}
              >
                {t("settings.pet.off")}
              </button>
            </div>
          </Section>

          {/* Kamus sentuh */}
          <Section title={t("settings.dict")} desc={t("settings.dict.desc")}>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setDictEnabled(true)}
                className={btn(dictEnabled)}
              >
                📖 {t("settings.pet.on")}
              </button>
              <button
                onClick={() => setDictEnabled(false)}
                className={btn(!dictEnabled)}
              >
                {t("settings.pet.off")}
              </button>
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
                    {normalPets.map((p) => (
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

                  {/* Special companions */}
                  {specialPets.length > 0 && (
                    <>
                      <p className="mb-2 mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t("settings.petType.special")}
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {specialPets.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setPetType(p.id as PetType)}
                            className={btn(petType === p.id)}
                          >
                            {p.img ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.img}
                                alt=""
                                className="mr-1.5 inline-block h-6 w-auto align-middle"
                              />
                            ) : (
                              <span className="mr-1 text-base">{p.emoji}</span>
                            )}
                            {lang === "zh" ? p.zh : p.en}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Warna / ras (disembunyikan utk special companion) */}
                {petDef.colors.length > 1 && (
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
                )}
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

          {/* Warna aksen (hanya saat tema Classic) */}
          {theme === "classic" && (
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
          )}

          {/* Font English */}
          <Section title={t("settings.enFont")} desc={t("settings.enFont.desc")}>
            <div className="flex flex-wrap gap-3">
              {enFonts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setEnFont(f.id)}
                  className={btn(enFont === f.id)}
                >
                  <span className={`${f.cls} mr-1.5 text-lg`}>Aa</span>
                  {f.name}
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
