// Generator bunga deterministik: satu artikel = satu bunga unik.
// Seed dari slug → bentuk/warna selalu sama untuk artikel yang sama.

export interface FlowerSpec {
  petals: number; // 5–9 kelopak
  hue: number; // 0–359
  hue2: number; // warna pusat
  petalLen: number; // 26–40
  petalWidth: number; // 10–16
  stemHeight: number; // 60–100
  leafSide: 1 | -1;
  sway: number; // durasi goyang 4–8s
  round: boolean; // kelopak bulat vs lonjong
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function flowerFromSeed(seedStr: string): FlowerSpec {
  const h = hashString(seedStr);
  const pick = (shift: number, mod: number) => ((h >>> shift) % mod + mod) % mod;
  return {
    petals: 5 + pick(0, 5), // 5..9
    hue: pick(3, 360),
    hue2: (pick(3, 360) + 40 + pick(9, 60)) % 360,
    petalLen: 26 + pick(13, 15), // 26..40
    petalWidth: 10 + pick(17, 7), // 10..16
    stemHeight: 60 + pick(20, 41), // 60..100
    leafSide: pick(24, 2) === 0 ? 1 : -1,
    sway: 4 + pick(26, 5), // 4..8
    round: pick(29, 2) === 0,
  };
}

export const flowerColors = (f: FlowerSpec) => ({
  petal: `hsl(${f.hue} 70% 78%)`,
  petalEdge: `hsl(${f.hue} 60% 62%)`,
  center: `hsl(${f.hue2} 75% 62%)`,
  stem: "hsl(120 32% 45%)",
  leaf: "hsl(120 38% 55%)",
});
