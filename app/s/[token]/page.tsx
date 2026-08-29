import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByShareToken } from "@/lib/queries";
import { readingTimeMinutes } from "@/lib/reading-time";
import PostView from "@/components/PostView";
import ProgressBar from "@/components/ProgressBar";

// Token tidak boleh di-prerender saat build: link bisa dibuat & dicabut
// kapan saja lewat Studio, jadi halaman ini selalu dirender saat diminta.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export async function generateMetadata({
  params,
}: {
  params: { token: string };
}): Promise<Metadata> {
  const post = await getPostByShareToken(params.token);
  return {
    // Judul saja — tanpa template "· Peini's Blog", supaya halaman ini
    // tidak menunjukkan bahwa ada blog lain di baliknya.
    title: post ? { absolute: post.title } : { absolute: "Not found" },
    description: post?.excerpt,
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function SharedPostPage({
  params,
}: {
  params: { token: string };
}) {
  const post = await getPostByShareToken(params.token);
  if (!post) notFound();

  return (
    <>
      <ProgressBar />
      <PostView post={post} minutes={readingTimeMinutes(post.body)} bare />
    </>
  );
}
