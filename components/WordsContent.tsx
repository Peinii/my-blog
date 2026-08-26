"use client";

import { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { speak } from "@/lib/speak";
import {
  BOX_DAYS,
  downloadCsv,
  dueWords,
  loadWords,
  makeQuiz,
  removeWord,
  reviewWord,
  type QuizQuestion,
  type SavedWord,
} from "@/lib/mywords";
import StrokeOrder from "./StrokeOrder";
import Reveal from "./Reveal";

type Tab = "list" | "study" | "quiz";

export default function WordsContent() {
  const { t, ttsRate } = useSettings();
  const [tab, setTab] = useState<Tab>("list");
  const [words, setWords] = useState<SavedWord[]>([]);
  const [stroke, setStroke] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setWords(loadWords());
    sync();
    window.addEventListener("peini-words-changed", sync);
    return () => window.removeEventListener("peini-words-changed", sync);
  }, []);

  const due = useMemo(() => dueWords(words), [words]);

  const btn = (active: boolean) =>
    `rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
      active
        ? "border-accent bg-accent-soft text-accent"
        : "border-gray-200 text-gray-600 hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300"
    }`;

  return (
    <div>
      <Reveal>
        <h1 className="text-3xl font-bold">📓 {t("words.title")}</h1>
        <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">
          {t("words.desc")}
        </p>
      </Reveal>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => setTab("list")} className={btn(tab === "list")}>
          📋 {t("words.tab.list")} ({words.length})
        </button>
        <button onClick={() => setTab("study")} className={btn(tab === "study")}>
          🎴 {t("words.tab.study")} ({due.length})
        </button>
        <button onClick={() => setTab("quiz")} className={btn(tab === "quiz")}>
          ❓ {t("words.tab.quiz")}
        </button>
      </div>

      {words.length === 0 ? (
        <p className="mt-8 rounded-lg bg-accent-soft p-6 text-sm text-gray-600 dark:text-gray-300">
          {t("words.empty")}
        </p>
      ) : (
        <div className="mt-6">
          {tab === "list" && (
            <WordList
              words={words}
              onRemove={(w) => setWords(removeWord(w))}
              onStroke={setStroke}
              rate={ttsRate}
            />
          )}
          {tab === "study" && (
            <StudyMode
              due={due}
              rate={ttsRate}
              onReview={(w, good) => setWords(reviewWord(w, good))}
            />
          )}
          {tab === "quiz" && <QuizMode words={words} />}
        </div>
      )}

      {stroke && <StrokeOrder word={stroke} onClose={() => setStroke(null)} />}
    </div>
  );
}

/* ---------------- daftar kata ---------------- */
function WordList({
  words,
  onRemove,
  onStroke,
  rate,
}: {
  words: SavedWord[];
  onRemove: (w: string) => void;
  onStroke: (w: string) => void;
  rate: number;
}) {
  const { t } = useSettings();
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => downloadCsv(words)}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:text-gray-900"
          style={{ backgroundColor: "var(--accent)" }}
        >
          ⬇ {t("words.export")}
        </button>
      </div>
      <ul className="space-y-2">
        {words.map((w) => (
          <li
            key={w.w}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-gray-100 p-3 dark:border-gray-800"
          >
            <span className="text-lg font-bold">{w.w}</span>
            {w.p && <span className="text-sm text-accent">{w.p}</span>}
            {w.h && (
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
                {w.h}
              </span>
            )}
            <span className="min-w-0 flex-1 text-sm text-gray-600 dark:text-gray-400">
              {w.d}
            </span>
            <span className="text-[10px] text-gray-400">
              {t("words.box")} {w.box + 1}/{BOX_DAYS.length}
            </span>
            <button
              onClick={() => speak(w.w, w.lang, { rate })}
              aria-label="listen"
              className="rounded-md px-2 py-1 text-sm hover:text-accent"
            >
              🔊
            </button>
            {w.lang === "zh" && (
              <button
                onClick={() => onStroke(w.w)}
                aria-label="stroke order"
                className="rounded-md px-2 py-1 text-sm hover:text-accent"
              >
                ✍️
              </button>
            )}
            <button
              onClick={() => onRemove(w.w)}
              aria-label="remove"
              className="rounded-md px-2 py-1 text-sm text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- kartu hafalan (SRS) ---------------- */
function StudyMode({
  due,
  rate,
  onReview,
}: {
  due: SavedWord[];
  rate: number;
  onReview: (w: string, good: boolean) => void;
}) {
  const { t } = useSettings();
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = due[idx];

  useEffect(() => {
    setIdx(0);
    setRevealed(false);
  }, [due.length]);

  if (!card) {
    return (
      <p className="rounded-lg bg-accent-soft p-6 text-sm text-gray-600 dark:text-gray-300">
        🎉 {t("words.study.done")}
      </p>
    );
  }

  function rate_(good: boolean) {
    onReview(card.w, good);
    setRevealed(false);
    setIdx((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="mb-2 text-xs text-gray-400">
        {idx + 1} / {due.length}
      </p>
      <div className="rounded-2xl border border-gray-100 p-8 dark:border-gray-800">
        <p className="text-4xl font-bold">{card.w}</p>
        <button
          onClick={() => speak(card.w, card.lang, { rate })}
          className="mt-3 rounded-md px-2 py-1 text-lg hover:text-accent"
          aria-label="listen"
        >
          🔊
        </button>

        {revealed ? (
          <div className="mt-4">
            {card.p && <p className="text-lg text-accent">{card.p}</p>}
            <p className="mt-1 text-gray-700 dark:text-gray-300">{card.d}</p>
            {card.h && (
              <span className="mt-2 inline-block rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent">
                {card.h}
              </span>
            )}
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => rate_(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-red-400 hover:text-red-500 dark:border-gray-700"
              >
                😵 {t("words.again")}
              </button>
              <button
                onClick={() => rate_(true)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-white dark:text-gray-900"
                style={{ backgroundColor: "var(--accent)" }}
              >
                😊 {t("words.good")}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-5 rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium hover:border-accent hover:text-accent dark:border-gray-700"
          >
            {t("words.reveal")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- kuis pilihan ganda ---------------- */
function QuizMode({ words }: { words: SavedWord[] }) {
  const { t } = useSettings();
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuiz(makeQuiz(words));
    setIdx(0);
    setPicked(null);
    setScore(0);
  }, [words]);

  if (quiz.length === 0) {
    return (
      <p className="rounded-lg bg-accent-soft p-6 text-sm text-gray-600 dark:text-gray-300">
        {t("words.quiz.need")}
      </p>
    );
  }

  if (idx >= quiz.length) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-2xl font-bold">
          {score} / {quiz.length}
        </p>
        <button
          onClick={() => {
            setQuiz(makeQuiz(words));
            setIdx(0);
            setPicked(null);
            setScore(0);
          }}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white dark:text-gray-900"
          style={{ backgroundColor: "var(--accent)" }}
        >
          ↺ {t("words.quiz.again")}
        </button>
      </div>
    );
  }

  const q = quiz[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      setIdx((x) => x + 1);
    }, 1100);
  }

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-2 text-center text-xs text-gray-400">
        {idx + 1} / {quiz.length} · {score} ✓
      </p>
      <p className="text-center text-4xl font-bold">{q.word.w}</p>
      <div className="mt-5 space-y-2">
        {q.options.map((opt, i) => {
          const state =
            picked === null
              ? "idle"
              : i === q.answer
                ? "right"
                : i === picked
                  ? "wrong"
                  : "idle";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                state === "right"
                  ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : state === "wrong"
                    ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                    : "border-gray-200 hover:border-accent hover:text-accent dark:border-gray-700"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
