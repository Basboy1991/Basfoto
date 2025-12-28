export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery, sitePageSeoQuery } from "@/lib/sanity.queries";

import PageMedia from "@/components/PageMedia";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import { urlFor } from "@/lib/sanity.image";

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

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  const seo = await sanityClient.fetch(sitePageSeoQuery, { slug });
  if (!seo) return {};

  const title = String(seo.seoTitle || seo.title || "").trim() || undefined;
  const description = String(seo.seoDescription || "").trim() || undefined;

  const ogImageUrl = seo.seoImage
    ? urlFor(seo.seoImage).width(1200).height(630).fit("crop").url()
    : undefined;

  const canonical = seo.canonicalUrl ? String(seo.canonicalUrl) : undefined;

  return {
    title,
    description,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = params;

  const page = await sanityClient.fetch(pageBySlugQuery, { slug });
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
        <p className="text-[13px] italic tracking-wide text-[var(--text-soft)]/80">
          {intro}
        </p>
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