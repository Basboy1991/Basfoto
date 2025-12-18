"use client";

import Link from "next/link";
import PageMedia from "@/components/PageMedia";

export default function HeroSplit({
  hero,
}: {
  hero: {
    layout?: "left" | "right";
    headline: string;
    subline?: string;
    primaryCta?: { label?: string; href?: string };
    secondaryCta?: { label?: string; href?: string };
    media?: any[];
  };
}) {
  const imageFirst = hero.layout !== "right";

  const ImageBlock = (
    <div className="overflow-hidden rounded-2xl">
      {hero.media && hero.media.length > 0 && <PageMedia media={hero.media} />}
    </div>
  );

  const TextCard = (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <p className="text-sm text-zinc-600">Fotograaf Westland</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight">{hero.headline}</h2>

      {hero.subline && <p className="mt-4 text-zinc-700 leading-relaxed">{hero.subline}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        {hero.primaryCta?.href && (
          <Link
            href={hero.primaryCta.href}
            className="rounded-xl bg-zinc-900 px-5 py-3 text-white hover:bg-zinc-800"
          >
            {hero.primaryCta.label ?? "Boek een shoot"}
          </Link>
        )}

        {hero.secondaryCta?.href && (
          <Link
            href={hero.secondaryCta.href}
            className="rounded-xl border px-5 py-3 hover:bg-zinc-50"
          >
            {hero.secondaryCta.label ?? "Bekijk portfolio"}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section className="grid gap-8 lg:grid-cols-2 items-center">
      {imageFirst ? (
        <>
          {ImageBlock}
          {TextCard}
        </>
      ) : (
        <>
          {TextCard}
          {ImageBlock}
        </>
      )}
    </section>
  );
}
