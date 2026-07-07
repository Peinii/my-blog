"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type DictKey, type Lang } from "./i18n";

export type Mode = "light" | "dark" | "system";
export type Accent = "blue" | "teal" | "amber" | "rose" | "mono";
export type TextSize = "s" | "m" | "l";

interface Settings {
  lang: Lang;
  mode: Mode;
  accent: Accent;
  pet: boolean;
  textSize: TextSize;
  reduceMotion: boolean;
}

interface SettingsCtx extends Settings {
  t: (key: DictKey) => string;
  setLang: (l: Lang) => void;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setPet: (p: boolean) => void;
  setTextSize: (s: TextSize) => void;
  setReduceMotion: (r: boolean) => void;
  reset: () => void;
}

const DEFAULTS: Settings = {
  lang: "en",
  mode: "system",
  accent: "blue",
  pet: true,
  textSize: "m",
  reduceMotion: false,
};
const STORAGE_KEY = "peini-settings";

const Ctx = createContext<SettingsCtx>({
  ...DEFAULTS,
  t: (k) => dict.en[k],
  setLang: () => {},
  setMode: () => {},
  setAccent: () => {},
  setPet: () => {},
  setTextSize: () => {},
  setReduceMotion: () => {},
  reset: () => {},
});

function apply(s: Settings) {
  const root = document.documentElement;
  const dark =
    s.mode === "dark" ||
    (s.mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  root.classList.toggle("reduce-motion", s.reduceMotion);
  root.setAttribute("data-accent", s.accent);
  root.setAttribute("data-textsize", s.textSize);
  root.setAttribute("lang", s.lang === "zh" ? "zh-CN" : "en");
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  // Muat pilihan tersimpan saat pertama kali render di browser.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = { ...DEFAULTS, ...JSON.parse(raw) } as Settings;
        setSettings(saved);
        apply(saved);
      }
    } catch {
      /* abaikan */
    }
  }, []);

  // Kalau mode "system": ikuti perubahan tema OS secara live.
  useEffect(() => {
    if (settings.mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply(settings);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [settings]);

  function update(patch: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      apply(next);
      return next;
    });
  }

  const value: SettingsCtx = {
    ...settings,
    t: (key) => dict[settings.lang][key] ?? dict.en[key],
    setLang: (lang) => update({ lang }),
    setMode: (mode) => update({ mode }),
    setAccent: (accent) => update({ accent }),
    setPet: (pet) => update({ pet }),
    setTextSize: (textSize) => update({ textSize }),
    setReduceMotion: (reduceMotion) => update({ reduceMotion }),
    reset: () => update({ ...DEFAULTS }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}
