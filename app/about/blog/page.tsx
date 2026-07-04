import type { Metadata } from "next";
import { getPosts } from "@/lib/queries";
import BlogContent from "@/components/BlogContent";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "All posts on Peini's Blog.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogContent posts={posts} />;
}
