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
      groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${postFields}`
    );
  } catch {
    return [];
  }
}

export async function getLatestPosts(limit = 3): Promise<Post[]> {
  try {
    return await client.fetch(
      groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit] ${postFields}`,
      { limit }
    );
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    return await client.fetch(
      groq`*[_type == "post" && slug.current == $slug][0]{
        _id, title, "slug": slug.current, excerpt, coverImage, publishedAt,
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

export async function getAllSlugs(): Promise<string[]> {
  try {
    return await client.fetch(
      groq`*[_type == "post" && defined(slug.current)].slug.current`
    );
  } catch {
    return [];
  }
}
