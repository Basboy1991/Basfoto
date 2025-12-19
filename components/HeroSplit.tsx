"use client";

import Link from "next/link";
import PageMedia from "@/components/PageMedia";

type HeroData = {
  layout?: "left" | "right";
  headline: string;
  subline?: string;
  primaryCta?: {
    label?: string;
    href?: string;
  };
  secondaryCta?: {
    label?: string;
    href?: string;
  };
  media?: any[];
};

export default function HeroSplit({ hero }: { hero: HeroData }) {
  const imageFirst = hero.layout !== "right";

  const ImageBlock = (
    <div className="relative overflow-hidden rounded-3xl">
      {hero.media && hero.media.length > 0 && <PageMedia media={hero.media} priority />}
    </div>
  );

  const TextBlock = (
    <div className="flex flex-col justify-center rounded-3xl bg-[var(--surface-2)] p-10 lg:p-12">
      <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Fotograaf Westland</p>

      <h1 className="mt-4 text-3xl font-semibold leading-tight text-[var(--text)] lg:text-4xl">
        {hero.headline}
      </h1>

      {hero.subline && (
        <p className="mt-5 max-w-prose leading-relaxed text-[var(--text-soft)]">{hero.subline}</p>
      )}

      {/* CTA’s */}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        {hero.primaryCta?.href && (
          <Link
            href={hero.primaryCta.href}
            className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {hero.primaryCta.label ?? "Boek een shoot"}
          </Link>
        )}

        {hero.secondaryCta?.href && (
          <Link
            href={hero.secondaryCta.href}
            className="rounded-full border border-[var(--accent)] px-7 py-3 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
          >
            {hero.secondaryCta.label ?? "Bekijk portfolio"}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      {imageFirst ? (
        <>
          {ImageBlock}
          {TextBlock}
        </>
      ) : (
        <>
          {TextBlock}
          {ImageBlock}
        </>
      )}
    </section>
  );
}
