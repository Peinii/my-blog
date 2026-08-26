// "My Words" — kosakata tersimpan + kartu hafalan (SRS Leitner).
// Semua di localStorage pembaca: tidak ada server, tidak ada akun.
export interface SavedWord {
  w: string; // kata
  p?: string; // pinyin / bacaan
  d: string; // arti (English)
  h?: string; // level HSK
  lang: string; // bahasa sumber (zh/ja/de/…)
  added: number;
  box: number; // 0..4 (Leitner)
  due: number; // timestamp berikutnya
  seen: number; // berapa kali diulang
}

const KEY = "peini-words";
/** Jeda per kotak Leitner (hari). Kotak 0 = ulangi hari ini juga. */
export const BOX_DAYS = [0, 1, 3, 7, 21];
const DAY = 86400000;

export function loadWords(): SavedWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? (arr as SavedWord[]) : [];
  } catch {
    return [];
  }
}

function persist(words: SavedWord[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(words));
    window.dispatchEvent(new Event("peini-words-changed"));
  } catch {
    /* storage penuh / private mode */
  }
}

export function isSaved(word: string): boolean {
  return loadWords().some((x) => x.w === word);
}

export function addWord(
  entry: Omit<SavedWord, "added" | "box" | "due" | "seen">
): SavedWord[] {
  const words = loadWords();
  if (words.some((x) => x.w === entry.w)) return words;
  const now = Date.now();
  words.push({ ...entry, added: now, box: 0, due: now, seen: 0 });
  persist(words);
  return words;
}

export function removeWord(word: string): SavedWord[] {
  const words = loadWords().filter((x) => x.w !== word);
  persist(words);
  return words;
}

export function clearWords() {
  persist([]);
}

/** Kartu yang jatuh tempo hari ini (paling lama menunggu lebih dulu). */
export function dueWords(words = loadWords()): SavedWord[] {
  const now = Date.now();
  return words.filter((x) => x.due <= now).sort((a, b) => a.due - b.due);
}

/** Nilai satu kartu: ingat (good) atau lupa (again). */
export function reviewWord(word: string, good: boolean): SavedWord[] {
  const words = loadWords();
  const w = words.find((x) => x.w === word);
  if (w) {
    w.seen += 1;
    w.box = good ? Math.min(BOX_DAYS.length - 1, w.box + 1) : 0;
    w.due = Date.now() + BOX_DAYS[w.box] * DAY + (good ? 0 : 60000);
  }
  persist(words);
  return words;
}

/** File CSV siap diimpor ke Anki (Front,Back,Reading,Level). */
export function toCsv(words = loadWords()): string {
  const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
  const rows = [
    "Front,Back,Reading,Level",
    ...words.map((w) =>
      [esc(w.w), esc(w.d), esc(w.p || ""), esc(w.h || "")].join(",")
    ),
  ];
  return rows.join("\n");
}

export function downloadCsv(words = loadWords()) {
  const blob = new Blob(["﻿" + toCsv(words)], {
    type: "text/csv;charset=utf-8",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `peini-words-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/** Soal pilihan ganda: 1 jawaban benar + 3 pengecoh dari kata lain. */
export interface QuizQuestion {
  word: SavedWord;
  options: string[];
  answer: number;
}

export function makeQuiz(words = loadWords(), count = 10): QuizQuestion[] {
  const pool = words.filter((w) => w.d);
  if (pool.length < 2) return [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((word) => {
    const distractors = pool
      .filter((x) => x.w !== word.w)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((x) => x.d);
    const options = [...distractors, word.d].sort(() => Math.random() - 0.5);
    return { word, options, answer: options.indexOf(word.d) };
  });
}
