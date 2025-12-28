// lib/seo.ts
import type { Metadata } from "next";
import { urlFor } from "@/lib/sanity.image";
import { siteConfig } from "@/config/site";

type SeoDoc = {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: any;
  canonicalUrl?: string;
  noIndex?: boolean;
};

function toAbsoluteUrl(urlOrPath: string) {
  // accepteert "https://..." én "/pad"
  try {
    return new URL(urlOrPath, siteConfig.url).toString();
  } catch {
    return undefined;
  }
}

export function buildMetadataFromSeo(
  doc: SeoDoc | null | undefined,
  opts?: { pathname?: string; fallbackTitle?: string; fallbackDescription?: string }
): Metadata {
  const fallbackTitle =
    opts?.fallbackTitle ?? `${siteConfig.name} | ${siteConfig.primaryKeyword}`;
  const fallbackDescription = opts?.fallbackDescription ?? siteConfig.description;

  const title = String(doc?.seoTitle || doc?.title || fallbackTitle).trim();
  const description = String(doc?.seoDescription || fallbackDescription).trim();

  const ogImageUrl = doc?.seoImage
    ? urlFor(doc.seoImage).width(1200).height(630).fit("crop").url()
    : undefined;

  const canonicalFromSanity = (doc?.canonicalUrl ?? "").trim();
  const canonicalFromPath = opts?.pathname
    ? new URL(opts.pathname, siteConfig.url).toString()
    : undefined;

  const canonical =
    (canonicalFromSanity ? toAbsoluteUrl(canonicalFromSanity) : undefined) ||
    canonicalFromPath;

  return {
    title,
    description,

    metadataBase: new URL(siteConfig.url),

    robots: doc?.noIndex ? { index: false, follow: false } : { index: true, follow: true },

    alternates: canonical ? { canonical } : undefined,

    openGraph: {
      title,
      description,
      type: "website",
      locale: "nl_NL",
      url: canonical ?? siteConfig.url,
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