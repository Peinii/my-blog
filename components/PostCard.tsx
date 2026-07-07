"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import { useSettings } from "@/lib/settings-context";
import type { Post } from "@/lib/queries";

export function formatDate(iso: string, lang: string) {
  try {
    return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso?.slice(0, 10) ?? "";
  }
}

export default function PostCard({ post }: { post: Post }) {
  const { t, lang } = useSettings();

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <Link href={`/blog/${post.slug}`}>
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden bg-accent-soft">
            <Image
              src={urlFor(post.coverImage).width(800).height(450).url()}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5">
          <time className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.publishedAt, lang)}
          </time>
          <h3 className="mt-1 text-lg font-semibold leading-snug transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {post.excerpt}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag.slug}
                className="tag-sticker rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <span className="mt-3 inline-block text-sm font-medium text-accent">
            {t("blog.readMore")} →
          </span>
        </div>
      </Link>
    </article>
  );
}
