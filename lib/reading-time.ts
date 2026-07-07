// Hitung estimasi waktu baca dari isi Portable Text.
// Latin: ±200 kata/menit. Karakter CJK (中文): ±400 karakter/menit.
export function readingTimeMinutes(body?: any[]): number {
  if (!body || !Array.isArray(body)) return 1;

  let text = "";
  for (const block of body) {
    if (block?._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child?.text === "string") text += child.text + " ";
      }
    }
    if (block?._type === "code" && typeof block.code === "string") {
      text += block.code + " ";
    }
  }

  const cjk = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
  const words = text
    .replace(/[一-鿿㐀-䶿]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = words / 200 + cjk / 400;
  return Math.max(1, Math.round(minutes));
}
