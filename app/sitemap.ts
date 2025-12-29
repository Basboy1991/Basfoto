// app/sitemap.ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { sanityClient } from "@/lib/sanity.client";

const base = siteConfig.url.replace(/\/$/, "");

// ✅ sitePages behalve home/homepage + noIndex
const sitePagesForSitemapQuery = /* groq */ `
  *[
    _type == "sitePage" &&
    defined(slug.current) &&
    slug.current != "home" &&
    slug.current != "homepage" &&
    noIndex != true
  ]{
    "slug": slug.current,
    _updatedAt
  }
`;

const albumsForSitemapQuery = /* groq */ `
  *[
    _type == "album" &&
    defined(slug.current)
  ]{
    "slug": slug.current,
    _updatedAt
  }
`;

// ✅ FAQ: check noIndex (optioneel)
const faqSitemapCheckQuery = /* groq */ `
  *[_type == "faqPage"][0]{
    noIndex,
    _updatedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, albums, faq] = await Promise.all([
    sanityClient.fetch<Array<{ slug: string; _updatedAt?: string }>>(sitePagesForSitemapQuery),
    sanityClient.fetch<Array<{ slug: string; _updatedAt?: string }>>(albumsForSitemapQuery),
    sanityClient.fetch<{ noIndex?: boolean; _updatedAt?: string } | null>(faqSitemapCheckQuery),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/portfolio`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pakketten`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/boek`, changeFrequency: "weekly", priority: 0.8 },

    // ✅ FAQ in sitemap (alleen als hij bestaat en niet op noIndex staat)
    ...(faq && !faq.noIndex
      ? [
          {
            url: `${base}/faq`,
            lastModified: faq._updatedAt ? new Date(faq._updatedAt) : new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
          },
        ]
      : []),
  ];

  const pageRoutes: MetadataRoute.Sitemap = (pages ?? []).map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const albumRoutes: MetadataRoute.Sitemap = (albums ?? []).map((a) => ({
    url: `${base}/albums/${a.slug}`,
    lastModified: a._updatedAt ? new Date(a._updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...pageRoutes, ...albumRoutes];
}