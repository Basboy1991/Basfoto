"use client";

import Link from "next/link";
import PageMedia from "@/components/PageMedia";

type HeroData = {
  layout?: "left" | "right";
  headline: string;
  subline?: string;
  primaryCta?: { label?: string; href?: string };
  secondaryCta?: { label?: string; href?: string };
  media?: any[];
};

export default function HeroSplit({ hero }: { hero: HeroData }) {
  const imageFirst = hero.layout !== "right";

  const ImageBlock = (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      {hero.media && hero.media.length > 0 && <PageMedia media={hero.media} />}
    </div>
  );

  const TextCard = (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-sm)] lg:p-10">
      {/* Eyebrow */}
      <p className="text-xs font-medium tracking-[0.14em] uppercase text-[var(--accent-strong)]">
        Fotograaf Westland
      </p>

      {/* Headline (editorial serif via globals) */}
      <h2 className="mt-4 text-3xl leading-tight text-[var(--text)] sm:text-4xl">
        {hero.headline}
      </h2>

      {/* Subline */}
      {hero.subline && (
        <p className="mt-4 max-w-prose text-[var(--text-soft)] leading-relaxed">{hero.subline}</p>
      )}

      {/* CTA's */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        {hero.primaryCta?.href && (
          <Link
            href={hero.primaryCta.href}
            className="rounded-xl bg-[var(--accent-strong)] px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent)]"
          >
            {hero.primaryCta.label ?? "Boek een shoot"}
          </Link>
        )}

        {hero.secondaryCta?.href && (
          <Link
            href={hero.secondaryCta.href}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-2)]"
          >
            {hero.secondaryCta.label ?? "Bekijk portfolio"}
          </Link>
        )}
      </div>

      {/* Subtle note (optioneel, maar vaak fijn) */}
      <p className="mt-5 text-xs text-[var(--text-soft)]">
        Persoonlijk, rustig en puur — met aandacht voor jouw moment.
      </p>
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
