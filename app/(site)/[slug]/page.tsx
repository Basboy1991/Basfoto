// app/(site)/[slug]/page.tsx
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery, sitePageSeoQuery } from "@/lib/sanity.queries";

import PageMedia from "@/components/PageMedia";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

import { urlFor } from "@/lib/sanity.image";

type Props = {
  params: { slug: string };
};

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

function getBaseUrl() {
  // zet in Vercel: NEXT_PUBLIC_SITE_URL=https://basfoto.vercel.app
  return process.env.NEXT_PUBLIC_SITE_URL || "https://basfoto.vercel.app";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await sanityClient.fetch(sitePageSeoQuery, { slug: params.slug });

  if (!seo) return {};

  const baseUrl = getBaseUrl();
  const title = seo?.seoTitle || seo?.title || "Bas-fotografie";
  const description = seo?.seoDescription || undefined;

  const canonical =
    seo?.canonicalUrl?.trim() ||
    `${baseUrl}/${encodeURIComponent(params.slug)}`;

  const ogImage =
    seo?.seoImage
      ? urlFor(seo.seoImage).width(1200).height(630).fit("crop").url()
      : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function SitePage({ params }: Props) {
  const page = await sanityClient.fetch(pageBySlugQuery, { slug: params.slug });
  if (!page) notFound();

  // Intro duplication filter (zelfde als je Over-mij logic)
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
      {page.media && page.media.length > 0 && (
        <div className="mb-8">
          <PageMedia media={page.media} />
        </div>
      )}

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