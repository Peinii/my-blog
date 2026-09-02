import { groq } from "next-sanity";
import { client } from "./sanity.client";

export interface Tag {
  name: string;
  slug: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: any;
  publishedAt: string;
  tags?: Tag[];
  authorName?: string;
  body?: any[];
  language?: string;
  audioUrl?: string;
}

const postFields = groq`{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "tags": tags[]->{name, "slug": slug.current},
  "authorName": author->name,
}`;

// Semua fetch dibungkus try/catch supaya build & halaman tetap jalan
// walaupun Sanity belum dikonfigurasi / belum ada artikel.
export async function getPosts(): Promise<Post[]> {
  try {
    return await client.fetch(
      groq`*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) ${postFields}`
    );
  } catch {
    return [];
  }
}

export async function getLatestPosts(limit = 3): Promise<Post[]> {
  try {
    return await client.fetch(
      groq`*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)[0...$limit] ${postFields}`,
      { limit }
    );
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    return await client.fetch(
      groq`*[_type == "post" && slug.current == $slug && publishedAt <= now()][0]{
        _id, title, "slug": slug.current, excerpt, coverImage, publishedAt, language,
        "audioUrl": audio.asset->url,
        "tags": tags[]->{name, "slug": slug.current},
        "authorName": author->name,
        body
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

/**
 * Artikel yang dibagikan lewat situs share.
 *
 * Dicari dari field shareToken, BUKAN dari slug — jadi tidak ada cara
 * menebak alamatnya dari judul artikel. Mengosongkan field itu di Studio
 * langsung mematikan link yang sudah terlanjur disebar.
 */
export async function getPostByShareToken(token: string): Promise<Post | null> {
  if (!token || token.length < 6) return null;
  try {
    return await client.fetch(
      // Parameter GROQ-nya bernama $code, BUKAN $token: di tipe QueryParams
      // milik @sanity/client, kunci "token" sengaja dilarang (bertipe never)
      // agar orang tidak keliru mengirim token autentikasi sebagai parameter
      // query. Memakai $token membuat build gagal dengan error TS2769.
      groq`*[_type == "post" && shareToken.current == $code && publishedAt <= now()][0]{
        _id, title, "slug": slug.current, excerpt, coverImage, publishedAt, language,
        "audioUrl": audio.asset->url,
        "tags": tags[]->{name, "slug": slug.current},
        "authorName": author->name,
        body
      }`,
      { code: token }
    );
  } catch {
    return null;
  }
}

// Artikel dengan tag yang sama (untuk "You might also like").
// Kalau tidak ada yang cocok, isi dengan artikel terbaru lain.
export async function getRelatedPosts(
  slug: string,
  tagSlugs: string[],
  limit = 3
): Promise<Post[]> {
  try {
    let related: Post[] = [];
    if (tagSlugs.length > 0) {
      related = await client.fetch(
        groq`*[_type == "post" && slug.current != $slug && defined(slug.current)
          && publishedAt <= now()
          && count((tags[]->slug.current)[@ in $tagSlugs]) > 0]
          | order(publishedAt desc)[0...$limit] ${postFields}`,
        { slug, tagSlugs, limit }
      );
    }
    if (related.length < limit) {
      const fill: Post[] = await client.fetch(
        groq`*[_type == "post" && slug.current != $slug && defined(slug.current) && publishedAt <= now()]
          | order(publishedAt desc)[0...$limit] ${postFields}`,
        { slug, limit }
      );
      const seen = new Set(related.map((p) => p._id));
      for (const p of fill) {
        if (related.length >= limit) break;
        if (!seen.has(p._id)) related.push(p);
      }
    }
    return related;
  } catch {
    return [];
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    return await client.fetch(
      groq`*[_type == "post" && defined(slug.current) && publishedAt <= now()].slug.current`
    );
  } catch {
    return [];
  }
}
