import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByShareToken } from "@/lib/queries";
import { readingTimeMinutes } from "@/lib/reading-time";
import PostView from "@/components/PostView";
import ProgressBar from "@/components/ProgressBar";

// Token tidak boleh di-prerender saat build: link bisa dibuat & dicabut
// kapan saja lewat Studio, jadi halaman ini selalu dirender saat diminta.
export const dynamic = "force-dynamic";

// CATATAN: jangan menambahkan `export const metadata` di file ini.
// Next.js menolak build bila sebuah route mengekspor `metadata` DAN
// `generateMetadata` sekaligus. Semua metadata diatur di fungsi di bawah.
export async function generateMetadata({
  params,
}: {
  params: { token: string };
}): Promise<Metadata> {
  const post = await getPostByShareToken(params.token);
  const title = post ? post.title : "Not found";
  // openGraph & twitter ditulis ulang secara eksplisit — kalau dibiarkan
  // kosong, Next mewarisi milik layout induk dan app/opengraph-image.tsx,
  // sehingga kartu preview link di WhatsApp/Slack menampilkan nama serta
  // gambar blog utama. images: [] mematikan warisan gambar itu.
  return {
    // Judul saja — tanpa template "· Peini's Blog", supaya halaman ini
    // tidak menunjukkan bahwa ada blog lain di baliknya.
    title: { absolute: title },
    description: post?.excerpt,
    openGraph: {
      title,
      description: post?.excerpt,
      type: "article",
      images: [],
    },
    twitter: { card: "summary", title, description: post?.excerpt, images: [] },
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
