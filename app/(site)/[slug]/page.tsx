export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityClient } from "@/lib/sanity.client";
import {
  sitePageBySlugQuery,
  sitePageSeoQuery,
} from "@/lib/sanity.queries";

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import PageMedia from "@/components/PageMedia";
import { urlFor } from "@/lib/sanity.image";

/* =========================
   SEO
========================= */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const page = await sanityClient.fetch(sitePageSeoQuery, { slug });

  if (!page) {
    return {
      title: "Pagina niet gevonden | Bas Fotografie",
      robots: "noindex, nofollow",
    };
  }

  const title =
    page.seoTitle ?? `${page.title} | Bas Fotografie`;

  const description =
    page.seoDescription ??
    "Fotografie door Bas – actief in Westland en omgeving.";

  const ogImage = page.seoImage
    ? urlFor(page.seoImage).width(1200).height(630).url()
    : undefined;

  const canonical =
    page.canonicalUrl ??
    `https://basfoto.vercel.app/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: page.noIndex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title,
      description,
      type: "article",
      locale: "nl_NL",
      url: canonical,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

/* =========================
   PAGE
========================= */
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

export default async function SitePage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await sanityClient.fetch(sitePageBySlugQuery, {
    slug: params.slug,
  });

  if (!page) notFound();

  let content = page.content ?? [];
  const intro = (page.intro ?? "").trim();

  // voorkom dubbele intro
  if (intro && content.length > 0) {
    const first = content[0] as PTBlock;
    const firstText = getPlainText(first);

    if (
      firstText &&
      firstText.toLowerCase() === intro.toLowerCase()
    ) {
      content = content.slice(1);
    }
  }

  return (
    <article className="mx-auto max-w-3xl">
      {page.media?.length > 0 && (
        <div className="mb-8">
          <PageMedia media={page.media} />
        </div>
      )}

      {intro && (
        <p className="text-[13px] italic tracking-wide text-[var(--text-soft)]/80">
          {intro}
        </p>
      )}

      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text)]">
        {page.title}
      </h1>

      {content?.length ? (
        <div className="prose prose-zinc mt-8 max-w-none">
          <PortableText
            value={content}
            components={portableTextComponents}
          />
        </div>
      ) : null}
    </article>
  );
}