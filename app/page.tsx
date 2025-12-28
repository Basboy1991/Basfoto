// app/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity.client";
import { homePageQuery, homePageSeoQuery } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import { siteConfig } from "@/config/site";

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

import HeroSplit from "@/components/HeroSplit";
import PortfolioCards from "@/components/PortfolioCards";
import HomeCtaCard from "@/components/HomeCtaCard";
import ReviewsSlider from "@/components/ReviewsSlider";

/* =========================
   SEO
========================= */
export async function generateMetadata(): Promise<Metadata> {
  const homeSeo = await sanityClient.fetch(homePageSeoQuery);

  const fallbackTitle = "Bas Fotografie | Fotograaf Westland";
  const fallbackDesc = "Gezins-, portret- en lifestylefotografie in Westland en omgeving.";

  const title = String(homeSeo?.seoTitle ?? fallbackTitle).trim();
  const description = String(homeSeo?.seoDescription ?? fallbackDesc).trim();

  const ogImageUrl = homeSeo?.seoImage
    ? urlFor(homeSeo.seoImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,

    // ✅ Next Metadata prefers object
    robots: homeSeo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },

    openGraph: {
      title,
      description,
      type: "website",
      locale: "nl_NL",
      url: siteConfig.url,
      ...(ogImageUrl
        ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }
        : {}),
    },

    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function HomePage() {
  const home = await sanityClient.fetch(homePageQuery);

  if (!home) return <p>Homepage content ontbreekt in Sanity.</p>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="sr-only">Bas Fotografie – Fotograaf Westland</h1>

      <HeroSplit hero={home.hero} />

      <section className="mt-16 max-w-3xl">
        <div className="prose prose-zinc max-w-none">
          <PortableText value={home.intro} components={portableTextComponents} />
        </div>
      </section>

      <PortfolioCards cards={home.portfolioCards ?? []} />

      {home.reviews?.length > 0 && <ReviewsSlider reviews={home.reviews} />}

      <HomeCtaCard cta={home.cta} />
    </main>
  );
}