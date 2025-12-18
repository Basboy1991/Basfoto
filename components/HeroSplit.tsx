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
    supportingLine?: string;
    primaryCta?: { label?: string; href?: string };
    secondaryCta?: { label?: string; href?: string };
    media?: any[];
  };
}) {
  const imageFirst = hero.layout !== "right";

  const headlineLines = (hero.headline || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const ImageBlock = (
    <div className="overflow-hidden rounded-2xl">
      {hero.media && hero.media.length > 0 && <PageMedia media={hero.media} />}
    </div>
  );

  const TextCard = (
    <div className="rounded-2xl bg-[var(--surface-2)] p-8 md:p-10">
      <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">Fotograaf Westland</p>

      <h1 className="mt-3 text-3xl font-semibold leading-tight text-[var(--text)] md:text-4xl">
        {headlineLines.length > 0
          ? headlineLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))
          : hero.headline}
      </h1>

      {hero.subline && (
        <p className="mt-4 max-w-prose text-base leading-relaxed text-[var(--text-soft)] md:text-[17px]">
          {hero.subline}
        </p>
      )}

      {hero.supportingLine && (
        <p className="mt-6 text-sm text-[var(--text-soft)]">{hero.supportingLine}</p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {hero.primaryCta?.href && (
          <Link
            href={hero.primaryCta.href}
            className="w-full rounded-xl bg-[var(--accent-strong)] px-5 py-3 text-center text-white transition-colors hover:bg-[var(--accent)] sm:w-auto"
          >
            {hero.primaryCta.label ?? "Boek een shoot"}
          </Link>
        )}

        {hero.secondaryCta?.href && (
          <Link
            href={hero.secondaryCta.href}
            className="w-full rounded-xl border border-[var(--accent-strong)] px-5 py-3 text-center text-[var(--text)] transition-colors hover:bg-[var(--accent-soft)] sm:w-auto"
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
