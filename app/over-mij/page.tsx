export const dynamic = "force-dynamic";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import PageMedia from "@/components/PageMedia";
import { notFound } from "next/navigation";

type PTBlock = {
  _type: string;
  children?: { _type: string; text?: string }[];
};

function getPlainText(block?: PTBlock) {
  if (!block || block._type !== "block") return "";
  return (block.children ?? [])
    .map((c) => (c?._type === "span" ? c.text ?? "" : ""))
    .join("")
    .trim();
}

export default async function OverMijPage() {
  const page = await sanityClient.fetch(pageBySlugQuery, { slug: "over-mij" });

  if (!page) notFound();

  // ✅ Als de eerste PortableText regel hetzelfde is als intro → wegfilteren
  let content = page.content ?? [];
  const intro = (page.intro ?? "").trim();

  if (intro && Array.isArray(content) && content.length > 0) {
    const first = content[0] as PTBlock;
    const firstText = getPlainText(first);

    if (firstText && firstText.toLowerCase() === intro.toLowerCase()) {
      content = content.slice(1);
    }
  }

  return (
    <article className="mx-auto max-w-3xl">
      {/* Media / slideshow */}
      {page.media && page.media.length > 0 && (
        <div className="mb-8">
          <PageMedia media={page.media} />
        </div>
      )}

      {/* Intro (cursief + lichter) */}
      {intro ? (
        <p className="text-[13px] italic tracking-wide text-[var(--text-soft)]/80">
          {intro}
        </p>
      ) : null}

      {/* Titel */}
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text)]">
        {page.title}
      </h1>

      {/* Content */}
      {content?.length ? (
        <div className="prose prose-zinc mt-8 max-w-none">
          <PortableText value={content} components={portableTextComponents} />
        </div>
      ) : null}
    </article>
  );
}