// app/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity.client";
import { homePageQuery, homePageSeoQuery } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";

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
  const home = await sanityClient.fetch(homePageSeoQuery);

  if (!home) {
    return {
      title: "Bas Fotografie | Fotograaf Westland",
      description: "Professionele fotograaf in Westland en omgeving.",
    };
  }

  const title =
    home.seoTitle ||
    "Bas Fotografie | Fotograaf in Westland & omgeving";

  const description =
    home.seoDescription ||
    "Gezins-, portret- en lifestylefotografie in Westland en omgeving.";

  const ogImage = home.seoImage
    ? urlFor(home.seoImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,

    robots: home.noIndex ? "noindex, nofollow" : "index, follow",

    openGraph: {
      title,
      description,
      type: "website",
      locale: "nl_NL",
      url: "https://basfoto.vercel.app",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
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
export default async function HomePage() {
  const home = await sanityClient.fetch(homePageQuery);

  if (!home) return <p>Homepage content ontbreekt in Sanity.</p>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* SEO fallback H1 (screen readers) */}
      <h1 className="sr-only">Bas Fotografie – Fotograaf Westland</h1>

      <HeroSplit hero={home.hero} />

      <section className="mt-16 max-w-3xl">
        <div className="prose prose-zinc max-w-none">
          <PortableText
            value={home.intro}
            components={portableTextComponents}
          />
        </div>
      </section>

      <PortfolioCards cards={home.portfolioCards ?? []} />

      {home.reviews?.length > 0 && (
        <ReviewsSlider reviews={home.reviews} />
      )}

      <HomeCtaCard cta={home.cta} />
    </main>
  );
}