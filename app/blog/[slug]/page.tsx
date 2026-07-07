import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost, getRelatedPosts } from "@/lib/queries";
import { urlFor } from "@/lib/sanity.client";
import { readingTimeMinutes } from "@/lib/reading-time";
import PostView from "@/components/PostView";
import RelatedPosts from "@/components/RelatedPosts";
import ProgressBar from "@/components/ProgressBar";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: post.coverImage
        ? [{ url: urlFor(post.coverImage).width(1200).height(630).url() }]
        : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const related = await getRelatedPosts(
    post.slug,
    post.tags?.map((t) => t.slug) ?? []
  );
  const minutes = readingTimeMinutes(post.body);

  return (
    <>
      <ProgressBar />
      <PostView post={post} minutes={minutes} />
      <RelatedPosts posts={related} />
    </>
  );
}
