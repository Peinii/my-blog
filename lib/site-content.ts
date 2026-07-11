import { groq } from "next-sanity";
import { client } from "./sanity.client";
import type { Lang } from "./i18n";

export interface LocalizedString {
  en?: string;
  zh?: string;
}

export interface ContactLink {
  _key?: string;
  label: string;
  url: string;
}

export interface SiteContent {
  siteName?: LocalizedString;
  heroTitle?: LocalizedString;
  heroIntro?: LocalizedString;
  aboutBody?: LocalizedString;
  contacts?: ContactLink[];
}

// Ambil dokumen Site Settings (kalau ada). Gagal/kosong = null,
// dan blog memakai teks bawaan — tidak akan pernah error.
export async function getSiteContent(): Promise<SiteContent | null> {
  try {
    // Utamakan dokumen singleton (_id "siteSettings"); kalau belum ada,
    // pakai dokumen siteSettings apa pun yang pernah dibuat sebelumnya.
    const doc = await client.fetch(
      groq`coalesce(
        *[_id == "siteSettings"][0],
        *[_type == "siteSettings"][0]
      ){
        siteName, heroTitle, heroIntro, aboutBody,
        contacts[]{_key, label, url}
      }`
    );
    return doc ?? null;
  } catch {
    return null;
  }
}

// Pilih teks sesuai bahasa aktif.
// Urutan: bahasa aktif → English → undefined (biar pemanggil pakai default).
export function pickLocalized(
  value: LocalizedString | undefined | null,
  lang: Lang
): string | undefined {
  if (!value) return undefined;
  const chosen = value[lang]?.trim() || value.en?.trim();
  return chosen || undefined;
}
