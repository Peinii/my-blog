"use client";

import { useSettings } from "@/lib/settings-context";
import PostCard from "./PostCard";
import type { Post } from "@/lib/queries";

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  const { t } = useSettings();
  if (posts.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-5 text-xl font-bold">{t("post.related")}</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
