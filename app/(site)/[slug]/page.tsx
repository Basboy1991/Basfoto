// app/(site)/[slug]/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery, sitePageSeoQuery } from "@/lib/sanity.queries";
import { buildMetadataFromSeo } from "@/lib/seo";

import PageMedia from "@/components/PageMedia";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

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

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await sanityClient.fetch(sitePageSeoQuery, { slug: params.slug });

  return buildMetadataFromSeo(seo, {
    pathname: `/${params.slug}`,
    fallbackTitle: "Bas Fotografie",
    fallbackDescription: "Fotograaf in Westland en omgeving.",
  });
}

export default async function SitePage({ params }: Props) {
  const page = await sanityClient.fetch(pageBySlugQuery, { slug: params.slug });
  if (!page) notFound();

  let content = page.content ?? [];
  const intro = String(page.intro ?? "").trim();

  if (intro && Array.isArray(content) && content.length > 0) {
    const first = content[0] as PTBlock;
    const firstText = getPlainText(first);
    if (firstText && firstText.toLowerCase() === intro.toLowerCase()) {
      content = content.slice(1);
    }
  }

  return (
    <article className="mx-auto max-w-3xl">
      {page.media?.length ? (
        <div className="mb-8">
          <PageMedia media={page.media} />
        </div>
      ) : null}

      {intro ? (
        <p className="text-[13px] italic tracking-wide text-[var(--text-soft)]/80">{intro}</p>
      ) : null}

      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text)]">
        {page.title}
      </h1>

      {content?.length ? (
        <div className="prose prose-zinc mt-8 max-w-none">
          <PortableText value={content} components={portableTextComponents} />
        </div>
      ) : null}
    </article>
  );
}