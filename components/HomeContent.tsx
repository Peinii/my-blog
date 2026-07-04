"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import PostCard from "./PostCard";
import Reveal from "./Reveal";
import type { Post } from "@/lib/queries";

export default function HomeContent({ posts }: { posts: Post[] }) {
  const { t } = useSettings();

  return (
    <div>
      {/* Hero */}
      <section className="py-12 text-center sm:py-16">
        <Reveal>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("home.hello")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-400">
            {t("home.intro")}
          </p>
        </Reveal>
      </section>

      {/* Latest posts */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("home.latest")}</h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-accent transition-opacity hover:opacity-75"
          >
            {t("home.viewAll")} →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-lg bg-accent-soft p-6 text-sm text-gray-600 dark:text-gray-300">
            {t("home.empty")}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {posts.map((post) => (
              <Reveal key={post._id}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
