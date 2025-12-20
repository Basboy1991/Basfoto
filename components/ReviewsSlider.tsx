"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

function clampStars(n?: number) {
  const v = typeof n === "number" ? n : 5;
  return Math.min(5, Math.max(1, Math.round(v)));
}

function StarRow({ count }: { count: number }) {
  // Groot + goud (met iets warmere tint, maar nog steeds premium)
  return (
    <div
      className="flex items-center justify-center gap-1"
      aria-label={`${count} van 5 sterren`}
      title={`${count} van 5 sterren`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < count;
        return (
          <span
            key={i}
            className="text-[22px] leading-none sm:text-[24px]"
            style={{
              color: filled ? "#D4A62A" : "rgba(0,0,0,0.12)",
              filter: filled ? "drop-shadow(0 1px 0 rgba(0,0,0,0.06))" : "none",
            }}
            aria-hidden
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const items = useMemo(() => (reviews ?? []).filter((r) => r?.quote && r?.name), [reviews]);

  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const intervalMs = 9500; // rustig
  const fadeMs = 450;

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      // fade out -> switch -> fade in
      setFadeIn(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setFadeIn(true);
      }, fadeMs);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const r = items[index];
  const stars = clampStars(r.stars);

  return (
    <section className="mt-16">
      <header className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-soft)]">Reviews</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Wat klanten zeggen</h2>
      </header>

      <div className="mx-auto max-w-3xl">
        <div
          className="relative overflow-hidden rounded-3xl bg-[var(--accent-soft)] px-6 py-10 sm:px-10"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Grote quotation marks */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-5 top-4 select-none font-serif"
            style={{
              fontSize: "88px", // ✅ groter
              lineHeight: 1,
              color: "rgba(0,0,0,0.08)",
            }}
          >
            “
          </span>

          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2 right-6 select-none font-serif"
            style={{
              fontSize: "88px", // ✅ groter
              lineHeight: 1,
              color: "rgba(0,0,0,0.08)",
            }}
          >
            ”
          </span>

          {/* Content (adaptive hoogte, gecentreerd) */}
          <div
            className="relative mx-auto flex max-w-2xl flex-col items-center text-center"
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0px)" : "translateY(6px)",
              transition: `opacity ${fadeMs}ms ease, transform ${fadeMs}ms ease`,
            }}
          >
            <StarRow count={stars} />

            {/* Quote — groter, en NIET meer naar onder gedrukt */}
            <p
              className="mt-5 text-[15px] italic text-[var(--text)] sm:text-[16px]"
              style={{ fontWeight: 500 }}
            >
              {r.quote}
            </p>

            {/* Naam/plaats altijd zichtbaar */}
            <p className="mt-5 text-[12px] text-[var(--text-soft)]">
              <span className="font-medium text-[var(--text)]">{r.name}</span>
              {r.location ? <span className="text-[var(--text-soft)]"> · {r.location}</span> : null}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}