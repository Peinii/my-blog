"use client";

import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { flowerFromSeed, flowerColors } from "@/lib/flower";
import { formatDate } from "./PostCard";
import Reveal from "./Reveal";
import type { Post } from "@/lib/queries";

function Flower({ post, index }: { post: Post; index: number }) {
  const { lang } = useSettings();
  const f = flowerFromSeed(post.slug);
  const c = flowerColors(f);
  const W = 96;
  const H = 40 + f.stemHeight + 52;
  const cx = W / 2;
  const cy = 40; // pusat kepala bunga

  const petals = Array.from({ length: f.petals }, (_, i) => {
    const angle = (360 / f.petals) * i;
    return (
      <ellipse
        key={i}
        cx={cx}
        cy={cy - f.petalLen / 2}
        rx={f.petalWidth / (f.round ? 1.2 : 1.7)}
        ry={f.petalLen / 2}
        fill={c.petal}
        stroke={c.petalEdge}
        strokeWidth="1"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    );
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="garden-flower group flex flex-col items-center"
      title={post.title}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="garden-sway"
        style={{
          animationDuration: `${f.sway}s`,
          animationDelay: `${(index % 5) * 0.6}s`,
          transformOrigin: `${cx}px ${H}px`,
        }}
      >
        {/* batang */}
        <path
          d={`M${cx} ${cy} Q ${cx + 6 * f.leafSide} ${cy + f.stemHeight / 2} ${cx} ${cy + f.stemHeight + 40}`}
          fill="none"
          stroke={c.stem}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* daun */}
        <ellipse
          cx={cx + 12 * f.leafSide}
          cy={cy + f.stemHeight * 0.55}
          rx="11"
          ry="5.5"
          fill={c.leaf}
          transform={`rotate(${28 * f.leafSide} ${cx + 12 * f.leafSide} ${cy + f.stemHeight * 0.55})`}
        />
        <ellipse
          cx={cx - 10 * f.leafSide}
          cy={cy + f.stemHeight * 0.8}
          rx="9"
          ry="4.5"
          fill={c.leaf}
          transform={`rotate(${-24 * f.leafSide} ${cx - 10 * f.leafSide} ${cy + f.stemHeight * 0.8})`}
        />
        {/* kelopak + pusat */}
        {petals}
        <circle cx={cx} cy={cy} r={f.petalWidth * 0.72} fill={c.center} />
        <circle cx={cx - 2} cy={cy - 2} r={f.petalWidth * 0.2} fill="rgba(255,255,255,0.55)" />
      </svg>
      <span className="mt-1 max-w-[110px] truncate text-center text-xs text-gray-500 transition-colors group-hover:text-accent dark:text-gray-400">
        {post.title}
      </span>
      <span className="text-[10px] text-gray-400">
        {formatDate(post.publishedAt, lang)}
      </span>
    </Link>
  );
}

export default function GardenContent({ posts }: { posts: Post[] }) {
  const { t } = useSettings();

  return (
    <div>
      <Reveal>
        <h1 className="text-3xl font-bold">🌷 {t("garden.title")}</h1>
        <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">
          {t("garden.desc")}
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-lg bg-accent-soft p-6 text-sm text-gray-600 dark:text-gray-300">
          {t("garden.empty")}
        </p>
      ) : (
        <Reveal>
          <div className="garden-ground mt-6 flex flex-wrap items-end justify-center gap-x-2 gap-y-8 pb-4 pt-10 sm:justify-start">
            {posts.map((p, i) => (
              <Flower key={p._id} post={p} index={i} />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-gray-400 sm:text-left">
            {t("garden.hint")}
          </p>
        </Reveal>
      )}
    </div>
  );
}
