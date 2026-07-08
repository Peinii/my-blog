// Registry semua jenis pet + ras/warnanya.
// Menambah pet/warna baru = tambah entri di sini (tanpa menyentuh komponen).

export type PetType =
  | "cat"
  | "bunny"
  | "blob"
  | "hamster"
  | "dog"
  | "turtle"
  | "capybara"
  | "horse"
  | "goat"
  | "seal"
  | "boy"
  | "chonk"
  | "hero"
  | "laugh";

export interface PetPalette {
  /** Warna badan. Boleh "var(--accent)" untuk ikut tema. */
  body: string;
  /** Telinga dalam / pipi / hidung. */
  ear: string;
  /** Telinga luar (default: warna badan). */
  earOuter?: string;
  /** Warna ekor (default: warna badan). */
  tailColor?: string;
  /** Bercak/corak tambahan (calico, belang, perut). */
  patchA?: string;
  patchB?: string;
}

export interface PetColorDef {
  id: string;
  en: string;
  zh: string;
  vars: PetPalette;
  /** Warna swatch di Settings (hex). Kosong = pakai var(--accent). */
  swatch?: string[];
}

export interface PetDef {
  id: PetType;
  emoji: string;
  en: string;
  zh: string;
  /** Teks gelembung saat diklik [en, zh]. */
  bubbles: [string, string];
  colors: PetColorDef[];
  /** Special companion: pakai gambar PNG, bukan SVG. */
  img?: string;
  special?: boolean;
}

const pink = "#ffb6c1";

export const PETS: Record<PetType, PetDef> = {
  cat: {
    id: "cat",
    emoji: "🐱",
    en: "Cat",
    zh: "小猫",
    bubbles: ["meow~ ♡", "喵~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink } },
      { id: "orange", en: "Orange tabby", zh: "橘猫", swatch: ["#f59e42", "#e2822a"], vars: { body: "#f59e42", ear: "#ffd9b3", patchA: "#e2822a" } },
      { id: "black", en: "Black", zh: "黑猫", swatch: ["#4b4b57"], vars: { body: "#4b4b57", ear: pink } },
      { id: "white", en: "Angora", zh: "安哥拉白", swatch: ["#f6f1ea"], vars: { body: "#f6f1ea", ear: pink } },
      { id: "calico", en: "Calico", zh: "三花猫", swatch: ["#f7f2e8", "#f59e42", "#4b4b57"], vars: { body: "#f7f2e8", ear: pink, earOuter: "#f59e42", tailColor: "#f59e42", patchA: "#f59e42", patchB: "#4b4b57" } },
      { id: "siam", en: "Siamese", zh: "暹罗猫", swatch: ["#f0e4cf", "#7a6558"], vars: { body: "#f0e4cf", ear: "#d8a7b1", earOuter: "#7a6558", tailColor: "#7a6558" } },
      { id: "gray", en: "Gray", zh: "灰猫", swatch: ["#9aa2af"], vars: { body: "#9aa2af", ear: "#ffc9d4" } },
      { id: "pink", en: "Pink", zh: "粉色", swatch: ["#f6a5c0"], vars: { body: "#f6a5c0", ear: "#ffe0ea" } },
    ],
  },
  bunny: {
    id: "bunny",
    emoji: "🐰",
    en: "Bunny",
    zh: "兔兔",
    bubbles: ["squeak~ ♡", "蹦蹦~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink, tailColor: "#ffffff" } },
      { id: "snow", en: "Snow white", zh: "雪白", swatch: ["#f7f4ef"], vars: { body: "#f7f4ef", ear: "#ffc9d4", tailColor: "#ffffff" } },
      { id: "gray", en: "Gray", zh: "灰灰", swatch: ["#aab0bb"], vars: { body: "#aab0bb", ear: "#ffc9d4", tailColor: "#f0f0f2" } },
      { id: "choco", en: "Chocolate", zh: "巧克力", swatch: ["#a97c50"], vars: { body: "#a97c50", ear: "#e8c9a8", tailColor: "#e8c9a8" } },
      { id: "cream", en: "Cream", zh: "奶油", swatch: ["#eadbc3"], vars: { body: "#eadbc3", ear: "#f2b8c6", tailColor: "#ffffff" } },
      { id: "pink", en: "Pink", zh: "粉粉", swatch: ["#f6b8cd"], vars: { body: "#f6b8cd", ear: "#ffe3ee", tailColor: "#ffffff" } },
      { id: "black", en: "Black", zh: "黑黑", swatch: ["#4b4b57"], vars: { body: "#4b4b57", ear: "#b98fa4", tailColor: "#8b8b98" } },
      { id: "latte", en: "Latte", zh: "拿铁", swatch: ["#cbb59a"], vars: { body: "#cbb59a", ear: "#eedfcb", tailColor: "#f5ecdf" } },
    ],
  },
  blob: {
    id: "blob",
    emoji: "🫧",
    en: "Blob",
    zh: "小团子",
    bubbles: ["boing~ ♡", "啵嘤~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: "rgba(255,255,255,0.55)" } },
      { id: "mint", en: "Mint", zh: "薄荷", swatch: ["#7fd8c4"], vars: { body: "#7fd8c4", ear: "#d6f5ec" } },
      { id: "pink", en: "Peach pink", zh: "蜜桃粉", swatch: ["#f8a8c5"], vars: { body: "#f8a8c5", ear: "#ffe0ec" } },
      { id: "lilac", en: "Lilac", zh: "丁香紫", swatch: ["#c3a6f2"], vars: { body: "#c3a6f2", ear: "#eadcff" } },
      { id: "sky", en: "Sky", zh: "天蓝", swatch: ["#8ec9f5"], vars: { body: "#8ec9f5", ear: "#dceeff" } },
      { id: "lemon", en: "Lemon", zh: "柠檬", swatch: ["#f4d35e"], vars: { body: "#f4d35e", ear: "#fcefc0" } },
      { id: "matcha", en: "Matcha", zh: "抹茶", swatch: ["#a8c98a"], vars: { body: "#a8c98a", ear: "#dcedcd" } },
      { id: "cocoa", en: "Cocoa", zh: "可可", swatch: ["#b58a6d"], vars: { body: "#b58a6d", ear: "#e6cdbb" } },
    ],
  },
  hamster: {
    id: "hamster",
    emoji: "🐹",
    en: "Hamster",
    zh: "仓鼠",
    bubbles: ["piip~ ♡", "吱吱~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink, patchA: "#fff6e8" } },
      { id: "golden", en: "Golden", zh: "金丝熊", swatch: ["#e5a34e", "#f7ead6"], vars: { body: "#e5a34e", ear: "#f4c9a1", patchA: "#f7ead6" } },
      { id: "cream", en: "Cream", zh: "奶油", swatch: ["#eddcc2"], vars: { body: "#eddcc2", ear: "#f2b8c6", patchA: "#faf3e6" } },
      { id: "white", en: "Winter white", zh: "银狐", swatch: ["#f5f0e8"], vars: { body: "#f5f0e8", ear: pink, patchA: "#ffffff" } },
      { id: "gray", en: "Gray", zh: "灰灰", swatch: ["#a6a9b3"], vars: { body: "#a6a9b3", ear: "#ffc9d4", patchA: "#e9e6ee" } },
      { id: "choco", en: "Cocoa", zh: "可可", swatch: ["#8f6743"], vars: { body: "#8f6743", ear: "#d9c2a8", patchA: "#d9c2a8" } },
    ],
  },
  dog: {
    id: "dog",
    emoji: "🐶",
    en: "Puppy",
    zh: "小狗",
    bubbles: ["woof~ ♡", "汪汪~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink } },
      { id: "golden", en: "Golden", zh: "金毛", swatch: ["#e8b96a"], vars: { body: "#e8b96a", ear: "#f2d9ae", patchA: "#f2d9ae" } },
      { id: "husky", en: "Husky", zh: "哈士奇", swatch: ["#a9b2bd", "#f2f4f6"], vars: { body: "#a9b2bd", ear: "#d8dde3", patchA: "#f2f4f6" } },
      { id: "choco", en: "Chocolate", zh: "巧克力", swatch: ["#8f6743"], vars: { body: "#8f6743", ear: "#d9c2a8", patchA: "#d9c2a8" } },
      { id: "white", en: "White", zh: "白白", swatch: ["#f5f0e8"], vars: { body: "#f5f0e8", ear: pink, patchA: "#ffffff" } },
      { id: "black", en: "Black", zh: "黑黑", swatch: ["#4b4b57"], vars: { body: "#4b4b57", ear: pink, patchA: "#6a6a78" } },
      { id: "corgi", en: "Corgi", zh: "柯基", swatch: ["#f5a55a", "#ffffff"], vars: { body: "#f5a55a", ear: "#fbd6ae", patchA: "#ffffff" } },
      { id: "cream", en: "Cream", zh: "奶油", swatch: ["#eddcc2"], vars: { body: "#eddcc2", ear: "#f2b8c6", patchA: "#faf3e6" } },
    ],
  },
  turtle: {
    id: "turtle",
    emoji: "🐢",
    en: "Turtle",
    zh: "小乌龟",
    bubbles: ["slow n steady~ ♡", "慢慢来~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink, patchA: "rgba(26,26,46,0.28)", patchB: "rgba(255,255,255,0.3)" } },
      { id: "green", en: "Green", zh: "青草绿", swatch: ["#8fce7f", "#4e8f4a"], vars: { body: "#8fce7f", ear: "#c9ecc0", patchA: "#4e8f4a", patchB: "#6fae64" } },
      { id: "teal", en: "Sea teal", zh: "海水青", swatch: ["#7fd0c0", "#2e8b7a"], vars: { body: "#7fd0c0", ear: "#c8ede6", patchA: "#2e8b7a", patchB: "#57ab99" } },
      { id: "olive", en: "Olive", zh: "橄榄", swatch: ["#b9bd6f", "#7a7f3d"], vars: { body: "#b9bd6f", ear: "#e2e4b8", patchA: "#7a7f3d", patchB: "#999e52" } },
      { id: "brown", en: "Tortoise", zh: "陆龟棕", swatch: ["#d3b184", "#8a6a3f"], vars: { body: "#d3b184", ear: "#ecd9bd", patchA: "#8a6a3f", patchB: "#a98850" } },
      { id: "lavender", en: "Lavender", zh: "薰衣草", swatch: ["#c0aee6", "#7a63b8"], vars: { body: "#c0aee6", ear: "#e6dcf7", patchA: "#7a63b8", patchB: "#9b87d0" } },
    ],
  },
  capybara: {
    id: "capybara",
    emoji: "🦫",
    en: "Capybara",
    zh: "卡皮巴拉",
    bubbles: ["mlem~ ♡", "卡皮~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink, patchA: "rgba(26,26,46,0.18)" } },
      { id: "classic", en: "Classic", zh: "经典", swatch: ["#b98a5a"], vars: { body: "#b98a5a", ear: "#d9b68c", patchA: "#8a6540" } },
      { id: "yuzu", en: "With orange 🍊", zh: "头顶橘子", swatch: ["#b98a5a", "#f5a623"], vars: { body: "#b98a5a", ear: "#d9b68c", patchA: "#8a6540", patchB: "#f5a623" } },
      { id: "dark", en: "Dark brown", zh: "深棕", swatch: ["#8f6743"], vars: { body: "#8f6743", ear: "#b98f66", patchA: "#6d4c30" } },
      { id: "cream", en: "Cream", zh: "奶油", swatch: ["#d9c2a8"], vars: { body: "#d9c2a8", ear: "#eee0cd", patchA: "#b99f80" } },
    ],
  },
  horse: {
    id: "horse",
    emoji: "🐴",
    en: "Pony",
    zh: "小马",
    bubbles: ["neigh~ ♡", "嘶嘶~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink, patchA: "rgba(26,26,46,0.35)" } },
      { id: "bay", en: "Bay", zh: "枣红", swatch: ["#a56a3a", "#4a3020"], vars: { body: "#a56a3a", ear: "#c98f5f", patchA: "#4a3020" } },
      { id: "palomino", en: "Palomino", zh: "金黄", swatch: ["#dfb26a", "#f5e6c8"], vars: { body: "#dfb26a", ear: "#f0d1a0", patchA: "#f5e6c8" } },
      { id: "white", en: "White", zh: "白马", swatch: ["#f0ebe2", "#cfc8ba"], vars: { body: "#f0ebe2", ear: pink, patchA: "#cfc8ba" } },
      { id: "black", en: "Black", zh: "黑马", swatch: ["#4b4b57", "#2e2e38"], vars: { body: "#4b4b57", ear: "#8b8b98", patchA: "#2e2e38" } },
      { id: "dapple", en: "Dapple gray", zh: "花斑灰", swatch: ["#c9ccd4", "#8b8f99"], vars: { body: "#c9ccd4", ear: "#f0c9d4", patchA: "#8b8f99" } },
    ],
  },
  goat: {
    id: "goat",
    emoji: "🐐",
    en: "Goat",
    zh: "小山羊",
    bubbles: ["meee~ ♡", "咩~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink, patchA: "#d8cbb6" } },
      { id: "white", en: "White", zh: "小白羊", swatch: ["#f2ede3", "#cbbfa5"], vars: { body: "#f2ede3", ear: pink, patchA: "#cbbfa5" } },
      { id: "brown", en: "Brown", zh: "棕棕", swatch: ["#a97c50"], vars: { body: "#a97c50", ear: "#d3ac7f", patchA: "#7a5636" } },
      { id: "bw", en: "Black & white", zh: "黑白花", swatch: ["#f2ede3", "#4b4b57"], vars: { body: "#f2ede3", ear: pink, patchA: "#cbbfa5", patchB: "#4b4b57" } },
      { id: "gray", en: "Gray", zh: "灰灰", swatch: ["#a6a9b3"], vars: { body: "#a6a9b3", ear: "#d3d5db", patchA: "#84878f" } },
    ],
  },
  seal: {
    id: "seal",
    emoji: "🦭",
    en: "Seal",
    zh: "小海豹",
    bubbles: ["arf arf~ ♡", "嗷呜~ ♡"],
    colors: [
      { id: "theme", en: "Theme", zh: "跟随主题", vars: { body: "var(--accent)", ear: pink, patchA: "rgba(255,255,255,0.5)" } },
      { id: "gray", en: "Classic gray", zh: "经典灰", swatch: ["#b8c4cd", "#e6ecf1"], vars: { body: "#b8c4cd", ear: "#f0c9d4", patchA: "#e6ecf1" } },
      { id: "snow", en: "Snow pup", zh: "小白胖", swatch: ["#f4f6f8"], vars: { body: "#f4f6f8", ear: pink, patchA: "#ffffff" } },
      { id: "cream", en: "Cream", zh: "奶油", swatch: ["#e8dcc8"], vars: { body: "#e8dcc8", ear: "#f2b8c6", patchA: "#f7efe2" } },
      { id: "slate", en: "Deep slate", zh: "深灰蓝", swatch: ["#7e8a94"], vars: { body: "#7e8a94", ear: "#f0c9d4", patchA: "#a7b2bb" } },
      { id: "ice", en: "Ice blue", zh: "冰蓝", swatch: ["#a8cfe0"], vars: { body: "#a8cfe0", ear: "#f0c9d4", patchA: "#d8ecf5" } },
      { id: "pink", en: "Sakura", zh: "樱花粉", swatch: ["#f2b3c6"], vars: { body: "#f2b3c6", ear: "#ffe3ee", patchA: "#fbdce7" } },
    ],
  },
  // ===== Special companions (gambar) =====
  boy: {
    id: "boy",
    emoji: "🏃",
    en: "Mori",
    zh: "毛利",
    special: true,
    img: "/pets/boy.png",
    bubbles: ["yippee~ ♡", "耶嘿~ ♡"],
    colors: [{ id: "theme", en: "Original", zh: "原版", vars: { body: "var(--accent)", ear: pink } }],
  },
  chonk: {
    id: "chonk",
    emoji: "🍊",
    en: "Kayden",
    zh: "凯登",
    special: true,
    img: "/pets/chonk.png",
    bubbles: ["mrrp~ ♡", "咕噜~ ♡"],
    colors: [{ id: "theme", en: "Original", zh: "原版", vars: { body: "var(--accent)", ear: pink } }],
  },
  hero: {
    id: "hero",
    emoji: "🥋",
    en: "Cheongmyeong",
    zh: "青明",
    special: true,
    img: "/pets/hero.png",
    bubbles: ["hyah!~ ♡", "哈!~ ♡"],
    colors: [{ id: "theme", en: "Original", zh: "原版", vars: { body: "var(--accent)", ear: pink } }],
  },
  laugh: {
    id: "laugh",
    emoji: "😂",
    en: "Lloyd Frontera",
    zh: "劳埃德",
    special: true,
    img: "/pets/laugh.png",
    bubbles: ["HAHAHA~", "哈哈哈~"],
    colors: [{ id: "theme", en: "Original", zh: "原版", vars: { body: "var(--accent)", ear: pink } }],
  },
};

export function getPetDef(type: string | undefined): PetDef {
  return PETS[(type as PetType) || "cat"] ?? PETS.cat;
}

export function getPalette(type: string | undefined, colorId: string | undefined): PetColorDef {
  const def = getPetDef(type);
  return def.colors.find((c) => c.id === colorId) ?? def.colors[0];
}

/** CSS variables untuk wrapper pet. */
export function paletteVars(p: PetPalette): Record<string, string> {
  const vars: Record<string, string> = {
    "--pet-body": p.body,
    "--pet-ear": p.ear,
  };
  if (p.earOuter) vars["--pet-ear-outer"] = p.earOuter;
  if (p.tailColor) vars["--pet-tail-color"] = p.tailColor;
  if (p.patchA) vars["--pet-patch-a"] = p.patchA;
  if (p.patchB) vars["--pet-patch-b"] = p.patchB;
  return vars;
}
