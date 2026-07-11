import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Peini's Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Kartu preview per-artikel: judul + tanggal di atas gradien tema.
// (Kalau artikel punya Cover Image, cover-nya yang dipakai — ini fallback.)
export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  let title = "Peini's Blog";
  let date = "";
  try {
    const query = encodeURIComponent(
      `*[_type == "post" && slug.current == "${params.slug.replace(/"/g, "")}"][0]{title, publishedAt}`
    );
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2024-10-01/data/query/${dataset}?query=${query}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data?.result?.title) {
      title = data.result.title;
      date = (data.result.publishedAt || "").slice(0, 10);
    }
  } catch {
    /* pakai fallback */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #4361ee 0%, #7c93f5 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, opacity: 0.9 }}>
          🐱 Peini&apos;s Blog
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {title.length > 110 ? title.slice(0, 108) + "…" : title}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.8 }}>
          {date}
        </div>
      </div>
    ),
    size
  );
}
