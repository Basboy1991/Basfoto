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
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.08)" }}
    >
      {/* ❌ geen priority prop meegeven — PageMedia ondersteunt dat niet */}
      {hero.media && hero.media.length > 0 && <PageMedia media={hero.media} />}
    </div>
  );

  const TextBlock = (
    <div className="flex flex-col justify-center rounded-3xl bg-[var(--surface-2)] p-10 lg:p-12">
      {/* label: rustiger + iets meer spacing */}
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-soft)]">
        Fotograaf Westland
      </p>

      <h1 className="text-3xl font-semibold leading-tight text-[var(--text)] lg:text-4xl">
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
            className="rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
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
    <section className="relative mb-20 grid items-center gap-10 lg:mb-28 lg:grid-cols-2">
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

      {/* Zachte overgang naar content eronder */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-24 bg-gradient-to-b from-transparent to-[var(--bg)]" />
    </section>
  );
}