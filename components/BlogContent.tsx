"use client";

import { useSettings } from "@/lib/settings-context";
import PostList from "./PostList";
import type { Post } from "@/lib/queries";

export default function BlogContent({ posts }: { posts: Post[] }) {
  const { t } = useSettings();
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t("blog.title")}</h1>
      <PostList posts={posts} />
    </div>
  );
}
