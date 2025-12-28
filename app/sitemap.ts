// app/sitemap.ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { sanityClient } from "@/lib/sanity.client";

type SlugRow = { slug: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  // ✅ haal slugs uit Sanity
  const [sitePages, portfolioItems, albums] = await Promise.all([
    sanityClient.fetch<SlugRow[]>(
      `*[_type == "sitePage" && defined(slug.current) && !(noIndex == true)]{ "slug": slug.current }`
    ),
    sanityClient.fetch<SlugRow[]>(
      `*[_type == "portfolioItem" && defined(slug.current)]{ "slug": slug.current }`
    ),
    sanityClient.fetch<SlugRow[]>(
      `*[_type == "album" && defined(slug.current)]{ "slug": slug.current }`
    ),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pakketten`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/boek`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const sitePageRoutes: MetadataRoute.Sitemap = (sitePages ?? []).map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = (portfolioItems ?? []).map((p) => ({
    url: `${base}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const albumRoutes: MetadataRoute.Sitemap = (albums ?? []).map((a) => ({
    url: `${base}/albums/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...sitePageRoutes, ...portfolioRoutes, ...albumRoutes];
}