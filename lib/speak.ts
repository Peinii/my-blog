// Text-to-speech via Web Speech API — gratis, tanpa file audio,
// tanpa layanan berbayar. Suara diambil dari perangkat pembaca.
export const TTS_LOCALE: Record<string, string> = {
  zh: "zh-CN",
  ja: "ja-JP",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  it: "it-IT",
  en: "en-US",
};

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(locale: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  const lang = locale.toLowerCase();
  const base = lang.split("-")[0];
  return (
    voices.find((v) => v.lang.toLowerCase() === lang) ||
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === lang) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(base))
  );
}

/** Apakah perangkat punya suara untuk bahasa ini? */
export function hasVoiceFor(langCode: string): boolean {
  if (!ttsSupported()) return false;
  return !!pickVoice(TTS_LOCALE[langCode] || langCode);
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}

export function speak(
  text: string,
  langCode = "zh",
  opts: { rate?: number; onEnd?: () => void; onError?: () => void } = {}
) {
  if (!ttsSupported() || !text.trim()) {
    opts.onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const locale = TTS_LOCALE[langCode] || langCode;
  u.lang = locale;
  const v = pickVoice(locale);
  if (v) u.voice = v;
  u.rate = opts.rate ?? 1;
  u.onend = () => opts.onEnd?.();
  u.onerror = () => (opts.onError ?? opts.onEnd)?.();
  synth.speak(u);
}

/**
 * Pecah teks jadi kalimat (mendukung tanda baca CJK).
 * Sengaja tanpa lookbehind regex agar tetap jalan di Safari lama.
 */
const CJK_END = "。！？；…";
const LATIN_END = ".!?;";
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let buf = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    buf += ch;
    const cjkEnd = CJK_END.indexOf(ch) >= 0;
    // titik/tanya/seru latin hanya memotong bila diikuti spasi atau akhir teks
    const latinEnd =
      LATIN_END.indexOf(ch) >= 0 &&
      (i + 1 >= text.length || /\s/.test(text[i + 1]));
    if (cjkEnd || latinEnd) {
      const t = buf.trim();
      if (t) out.push(t);
      buf = "";
    }
  }
  const rest = buf.trim();
  if (rest) out.push(rest);
  return out;
}
