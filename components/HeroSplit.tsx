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
    <div className="rounded-2xl bg-[var(--surface-2)] p-8">
      <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Fotograaf Westland</p>

      <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--text)]">
        {hero.headline}
      </h2>

      {hero.subline && (
        <p className="mt-4 max-w-prose leading-relaxed text-[var(--text-soft)]">{hero.subline}</p>
      )}

      {/* Supporting line boven de knoppen (rustiger op mobiel) */}
      <p className="mt-6 text-sm text-[var(--text-soft)]">
        Persoonlijk, rustig en puur — met aandacht voor jouw moment.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {hero.primaryCta?.href && (
          <Link
            href={hero.primaryCta.href}
            className="rounded-xl bg-[var(--accent-strong)] px-5 py-3 text-white transition-colors hover:bg-[var(--accent)]"
          >
            {hero.primaryCta.label ?? "Boek een shoot"}
          </Link>
        )}

        {hero.secondaryCta?.href && (
          <Link
            href={hero.secondaryCta.href}
            className="rounded-xl border border-[var(--accent-strong)] px-5 py-3 text-[var(--text)] transition-colors hover:bg-[var(--accent-soft)]"
          >
            {hero.secondaryCta.label ?? "Portfolio"}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <section className="grid items-center gap-8 lg:grid-cols-2">
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
