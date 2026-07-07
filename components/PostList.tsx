"use client";

import { useMemo, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import PostCard from "./PostCard";
import Reveal from "./Reveal";
import type { Post } from "@/lib/queries";

const PER_PAGE = 6;

export default function PostList({ posts }: { posts: Post[] }) {
  const { t } = useSettings();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const tags = useMemo(() => {
    const map = new Map<string, string>();
    posts.forEach((p) => p.tags?.forEach((tg) => map.set(tg.slug, tg.name)));
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  }, [posts]);

  const byTag = activeTag
    ? posts.filter((p) => p.tags?.some((tg) => tg.slug === activeTag))
    : posts;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? byTag.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.tags?.some((tg) => tg.name.toLowerCase().includes(q))
      )
    : byTag;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function pickTag(slug: string | null) {
    setActiveTag(slug);
    setPage(1);
  }

  if (posts.length === 0) {
    return (
      <p className="rounded-lg bg-accent-soft p-6 text-sm text-gray-600 dark:text-gray-300">
        {t("home.empty")}
      </p>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder={`🔍 ${t("blog.search")}`}
          className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-accent dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      {/* Filter tag */}
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => pickTag(null)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              activeTag === null
                ? "bg-accent text-white dark:text-gray-900"
                : "bg-accent-soft text-gray-700 hover:text-accent dark:text-gray-300"
            }`}
          >
            {t("blog.filterAll")}
          </button>
          {tags.map((tag) => (
            <button
              key={tag.slug}
              onClick={() => pickTag(tag.slug)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                activeTag === tag.slug
                  ? "bg-accent text-white dark:text-gray-900"
                  : "bg-accent-soft text-gray-700 hover:text-accent dark:text-gray-300"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-sm text-gray-500">
          {q ? `${t("blog.noResults")} “${query.trim()}”` : t("blog.empty")}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {shown.map((post) => (
            <Reveal key={post._id}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-gray-200 px-3 py-1.5 transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40 dark:border-gray-700"
          >
            ← {t("blog.prev")}
          </button>
          <span className="text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-gray-200 px-3 py-1.5 transition-colors enabled:hover:border-accent enabled:hover:text-accent disabled:opacity-40 dark:border-gray-700"
          >
            {t("blog.next")} →
          </button>
        </div>
      )}
    </div>
  );
}
