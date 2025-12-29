// app/sitemap.ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { sanityClient } from "@/lib/sanity.client";

const base = siteConfig.url.replace(/\/$/, "");

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/portfolio`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pakketten`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/boek`, changeFrequency: "weekly", priority: 0.8 },
  
{ url: `${base}/faq`, changeFrequency: "monthly", priority: 0.6 },
];
  const [pages, albums] = await Promise.all([
    sanityClient.fetch<Array<{ slug: string; _updatedAt?: string }>>(
      sitePagesForSitemapQuery
    ),
    sanityClient.fetch<Array<{ slug: string; _updatedAt?: string }>>(
      albumsForSitemapQuery
    ),
  ]);

  const pageRoutes: MetadataRoute.Sitemap =
    (pages ?? []).map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const albumRoutes: MetadataRoute.Sitemap =
    (albums ?? []).map((a) => ({
      url: `${base}/albums/${a.slug}`,
      lastModified: a._updatedAt ? new Date(a._updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...pageRoutes, ...albumRoutes];
}