// app/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity.client";
import { homePageQuery, homePageSeoQuery } from "@/lib/sanity.queries";
import { buildMetadataFromSeo } from "@/lib/seo";

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

import HeroSplit from "@/components/HeroSplit";
import PortfolioCards from "@/components/PortfolioCards";
import HomeCtaCard from "@/components/HomeCtaCard";
import ReviewsSlider from "@/components/ReviewsSlider";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityClient.fetch(homePageSeoQuery);

  return buildMetadataFromSeo(seo, {
    pathname: "/",
    fallbackTitle: "Bas Fotografie | Fotograaf Westland",
    fallbackDescription: "Gezins-, portret- en lifestylefotografie in Westland en omgeving.",
  });
}

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