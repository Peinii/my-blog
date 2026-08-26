"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity.client";
import { canvaEmbedUrl, isCanvaShortLink } from "@/lib/canva";
import { codepenEmbedUrl } from "@/lib/codepen";
import ZhAnnotated from "./ZhAnnotated";

/* ---------- Canva (mendukung short link canva.link) ---------- */
function CanvaEmbed({ url }: { url?: string }) {
  const direct = canvaEmbedUrl(url);
  const [src, setSrc] = useState<string | null>(direct);

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

/** Ambil teks polos satu blok. */
export function blockText(value: any): string {
  if (!value?.children) return "";
  return value.children.map((c: any) => c?.text ?? "").join("");
}

const CJK_TEST = /[㐀-䶿一-鿿]/;

export default function PostBody({
  body,
  annotate = false,
  pinyin = false,
  script = "simp",
}: {
  body: any[];
  /** aktifkan segmentasi + pinyin/简繁 (artikel 中文) */
  annotate?: boolean;
  pinyin?: boolean;
  script?: "simp" | "trad";
}) {
  // Bungkus tiap blok teks: tandai key (untuk sorotan saat dibacakan)
  // dan ganti isinya dengan versi beranotasi bila diminta.
  function wrap(Tag: "p" | "h2" | "h3" | "blockquote") {
    return ({ children, value }: { children?: ReactNode; value?: any }) => {
      const text = blockText(value);
      const hasMarks = value?.children?.some(
        (c: any) => Array.isArray(c?.marks) && c.marks.length > 0
      );
      const useAnnotated =
        annotate && !hasMarks && CJK_TEST.test(text) && text.length > 0;
      return (
        <Tag data-block-key={value?._key}>
          {useAnnotated ? (
            <ZhAnnotated text={text} pinyin={pinyin} script={script} />
          ) : (
            children
          )}
        </Tag>
      );
    };
  }

  const components: PortableTextComponents = useMemo(() => ({
    block: {
      normal: wrap("p"),
      h2: wrap("h2"),
      h3: wrap("h3"),
      blockquote: wrap("blockquote"),
    },
    types: {
      canvaEmbed: ({ value }) => <CanvaEmbed url={value?.url} />,
      codepenEmbed: ({ value }) => {
        const src = codepenEmbedUrl(value?.url);
        if (!src) return null;
        return (
          <div className="my-6 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
            <iframe
              src={src}
              loading="lazy"
              allowFullScreen
              style={{ width: "100%", height: 420 }}
              title="CodePen embed"
            />
          </div>
        );
      },
      grammarNote: ({ value }) => (
        <aside className="grammar-note my-6 rounded-xl p-4">
          <p className="mb-1 text-sm font-bold">
            📘 {value?.title || "Grammar note"}
          </p>
          {value?.pattern && (
            <p className="mb-2 font-mono text-sm text-accent">
              {value.pattern}
            </p>
          )}
          {value?.body && (
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {value.body}
            </p>
          )}
        </aside>
      ),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [annotate, pinyin, script]);

  return (
    <div className="prose-article">
      <PortableText value={body} components={components} />
    </div>
  );
}
