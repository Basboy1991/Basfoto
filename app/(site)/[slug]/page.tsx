export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery, sitePageSeoQuery } from "@/lib/sanity.queries";

import PageMedia from "@/components/PageMedia";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import { urlFor } from "@/lib/sanity.image";

/* =========================
   Types
========================= */

type PageProps = {
  params: {
    slug: string;
  };
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

/* =========================
   SEO
========================= */

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = params;

  const seo = await sanityClient.fetch(sitePageSeoQuery, { slug });
  if (!seo) return {};

  const title = seo.seoTitle || seo.title;
  const description = seo.seoDescription || undefined;

  const ogImage =
    seo.seoImage
      ? urlFor(seo.seoImage)
          .width(1200)
          .height(630)
          .fit("crop")
          .url()
      : undefined;

  return {
    title,
    description,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    alternates: seo.canonicalUrl
      ? { canonical: seo.canonicalUrl }
      : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/* =========================
   PAGE
========================= */

export default async function SitePage({ params }: PageProps) {
  const { slug } = params;

  const page = await sanityClient.fetch(pageBySlugQuery, { slug });
  if (!page) notFound();

  let content = page.content ?? [];
  const intro = String(page.intro ?? "").trim();

  if (intro && content.length > 0) {
    const firstText = getPlainText(content[0]);
    if (firstText.toLowerCase() === intro.toLowerCase()) {
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

      {intro && (
        <p className="text-[13px] italic tracking-wide text-[var(--text-soft)]/80">
          {intro}
        </p>
      )}

      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text)]">
        {page.title}
      </h1>

      {content.length > 0 && (
        <div className="prose prose-zinc mt-8 max-w-none">
          <PortableText
            value={content}
            components={portableTextComponents}
          />
        </div>
      )}
    </article>
  );
}