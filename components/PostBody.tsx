"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity.client";

const components: PortableTextComponents = {
  types: {
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
