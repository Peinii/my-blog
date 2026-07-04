"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/lib/settings-context";
import { urlFor } from "@/lib/sanity.client";
import { formatDate } from "./PostCard";
import PostBody from "./PostBody";
import Reveal from "./Reveal";
import type { Post } from "@/lib/queries";

export default function PostView({ post }: { post: Post }) {
  const { t, lang } = useSettings();

  return (
    <article className="mx-auto max-w-content">
      <Link
        href="/blog"
        className="text-sm font-medium text-accent transition-opacity hover:opacity-75"
      >
        ← {t("post.back")}
      </Link>

      <Reveal>
        <header className="mt-6">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <time>{formatDate(post.publishedAt, lang)}</time>
            {post.authorName && (
              <span>
                · {t("post.by")} {post.authorName}
              </span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={urlFor(post.coverImage).width(1400).url()}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8">
          {post.body && <PostBody body={post.body} />}
        </div>
      </Reveal>
    </article>
  );
}
