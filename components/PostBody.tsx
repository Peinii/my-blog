"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity.client";
import { canvaEmbedUrl, isCanvaShortLink } from "@/lib/canva";

function CanvaEmbed({ url }: { url?: string }) {
  const direct = canvaEmbedUrl(url);
  const [src, setSrc] = useState<string | null>(direct);

  // Short link (canva.link) di-resolve lewat API kecil di server.
  useEffect(() => {
    if (direct || !isCanvaShortLink(url)) return;
    let cancelled = false;
    fetch(`/api/canva?u=${encodeURIComponent(url!)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.embed) setSrc(d.embed);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url, direct]);

  if (!src) {
    // placeholder saat short link sedang di-resolve / link tidak valid
    return isCanvaShortLink(url) ? (
      <div className="my-6 flex aspect-video items-center justify-center rounded-lg bg-accent-soft text-sm text-gray-500">
        Loading Canva…
      </div>
    ) : null;
  }

  return (
    <div className="relative my-6 aspect-video overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
      <iframe
        src={src}
        loading="lazy"
        allowFullScreen
        allow="fullscreen"
        className="absolute inset-0 h-full w-full"
        title="Canva embed"
      />
    </div>
  );
}

const components: PortableTextComponents = {
  types: {
    canvaEmbed: ({ value }) => <CanvaEmbed url={value?.url} />,
    image: ({ value }) =>
      value?.asset ? (
        <div className="relative my-6 aspect-video overflow-hidden rounded-lg">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            fill
            sizes="(max-width: 768px) 100vw, 680px"
            className="object-cover"
          />
        </div>
      ) : null,
    code: ({ value }) => (
      <pre>
        <code>{value?.code}</code>
      </pre>
    ),
  },
};

export default function PostBody({ body }: { body: any[] }) {
  return (
    <div className="prose-article">
      <PortableText value={body} components={components} />
    </div>
  );
}
