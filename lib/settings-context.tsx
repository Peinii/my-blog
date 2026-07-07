"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dict, type DictKey, type Lang } from "./i18n";

export type Mode = "light" | "dark";
export type Accent = "blue" | "teal" | "amber" | "rose" | "mono";

interface Settings {
  lang: Lang;
  mode: Mode;
  accent: Accent;
  pet: boolean;
}

interface SettingsCtx extends Settings {
  t: (key: DictKey) => string;
  setLang: (l: Lang) => void;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
  setPet: (p: boolean) => void;
}

const DEFAULTS: Settings = { lang: "en", mode: "light", accent: "blue", pet: true };
const STORAGE_KEY = "peini-settings";

const Ctx = createContext<SettingsCtx>({
  ...DEFAULTS,
  t: (k) => dict.en[k],
  setLang: () => {},
  setMode: () => {},
  setAccent: () => {},
  setPet: () => {},
});

function apply(s: Settings) {
  const root = document.documentElement;
  root.classList.toggle("dark", s.mode === "dark");
  root.setAttribute("data-accent", s.accent);
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
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}
