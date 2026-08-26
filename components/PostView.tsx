"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/lib/settings-context";
import { urlFor } from "@/lib/sanity.client";
import { formatDate } from "./PostCard";
import PostBody, { blockText } from "./PostBody";
import ReadAloud from "./ReadAloud";
import AudioPlayer from "./AudioPlayer";
import Reveal from "./Reveal";
import ShareButtons from "./ShareButtons";
import TapDict from "./TapDict";
import type { Post } from "@/lib/queries";

export default function PostView({
  post,
  minutes,
}: {
  post: Post;
  minutes?: number;
}) {
  const {
    t,
    lang,
    dictEnabled,
    pinyin,
    script,
    setPinyin,
    setScript,
  } = useSettings();

  const learning = !!post.language && post.language !== "en";
  const isZh = post.language === "zh";
  // minta anotasi hanya bila memang dipakai (hemat kuota fungsi)
  const needAnnotate = isZh && (pinyin || script === "trad");
  const speakBlocks = (post.body || [])
    .filter((b: any) => b?._type === "block")
    .map((b: any) => ({ key: b._key as string, text: blockText(b) }))
    .filter((b: { text: string }) => b.text.trim().length > 0);

  const learnBtn = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
      active
        ? "border-accent bg-accent-soft text-accent"
        : "border-gray-200 text-gray-600 hover:border-accent hover:text-accent dark:border-gray-700 dark:text-gray-300"
    }`;

  return (
    <article className="mx-auto max-w-content">
      <Link
        href="/blog"
        className="text-sm font-medium text-accent transition-opacity hover:opacity-75"
      >
        ← {t("post.back")}
      </Link>

      <Reveal>
        <header className="mt-6">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <time>{formatDate(post.publishedAt, lang)}</time>
            {minutes ? (
              <span>
                · ⏱ {minutes} {t("post.minRead")}
              </span>
            ) : null}
            {post.authorName && (
              <span>
                · {t("post.by")} {post.authorName}
              </span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="tag-sticker rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
            <Image
              src={urlFor(post.coverImage).width(1400).url()}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover"
            />
          </div>
        )}

        {learning ? (
          <>
            {/* Panel belajar */}
            <div className="dict-hint mt-6 rounded-lg px-3 py-2.5">
              {dictEnabled && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("post.dict.hint")}
                </p>
              )}
              {isZh && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPinyin(!pinyin)}
                    className={learnBtn(pinyin)}
                  >
                    拼 {t("post.pinyin")} {pinyin ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => setScript(script === "simp" ? "trad" : "simp")}
                    className={learnBtn(script === "trad")}
                  >
                    {script === "trad" ? "繁體" : "简体"}
                  </button>
                </div>
              )}
            </div>

            {post.audioUrl && <AudioPlayer src={post.audioUrl} />}
            {speakBlocks.length > 0 && (
              <ReadAloud blocks={speakBlocks} lang={post.language!} />
            )}

            {dictEnabled ? (
              <TapDict lang={post.language!}>
                <div className="mt-6">
                  {post.body && (
                    <PostBody
                      body={post.body}
                      annotate={needAnnotate}
                      pinyin={isZh && pinyin}
                      script={script}
                    />
                  )}
                </div>
              </TapDict>
            ) : (
              <div className="mt-6">
                {post.body && (
                  <PostBody
                    body={post.body}
                    annotate={needAnnotate}
                    pinyin={isZh && pinyin}
                    script={script}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mt-8">
            {post.body && <PostBody body={post.body} />}
          </div>
        )}

        <ShareButtons slug={post.slug} title={post.title} />
      </Reveal>
    </article>
  );
}
