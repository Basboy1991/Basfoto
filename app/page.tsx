export const dynamic = "force-dynamic";

import { sanityClient } from "@/lib/sanity.client";
import { homePageQuery } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

import HeroSplit from "@/components/HeroSplit";
import PortfolioCards from "@/components/PortfolioCards";
import HomeCtaCard from "@/components/HomeCtaCard";
import ReviewsSlider from "@/components/ReviewsSlider";

export default async function HomePage() {
  const home = await sanityClient.fetch(homePageQuery);

  if (!home) return <p>Homepage content ontbreekt in Sanity.</p>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* SEO H1 – visueel verborgen */}
      <h1 className="sr-only">Bas-fotografie | Fotograaf Westland</h1>

      {/* HERO */}
      <HeroSplit hero={home.hero} />

      {/* INTRO */}
      <section className="mt-16 max-w-3xl">
        <div className="prose prose-zinc max-w-none">
          <PortableText value={home.intro} components={portableTextComponents} />
        </div>
      </section>

      {/* PORTFOLIO */}
      <PortfolioCards cards={home.portfolioCards ?? []} />

      {/* REVIEWS (dynamisch / slider) */}
      {home.reviews?.length > 0 && <ReviewsSlider reviews={home.reviews} />}

      {/* CTA */}
      <HomeCtaCard cta={home.cta} />
    </main>
  );
}
