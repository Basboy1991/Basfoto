"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "#D4A62A" : "none"}
      stroke={filled ? "#D4A62A" : "var(--border)"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block' }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < count} />
      ))}
    </div>
  );
}

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const items = useMemo(() => (reviews ?? []).filter((r) => r?.quote && r?.name), [reviews]);

  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const intervalMs = 9000;
  const fadeMs = 600;

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
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
  const stars = typeof r.stars === "number" ? Math.min(5, Math.max(1, Math.round(r.stars))) : 5;

  return (
    <section className="mt-16 w-full">
      <header className="mb-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-soft)] opacity-80">
          Reviews
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--text)] tracking-tight">
          Wat klanten zeggen
        </h2>
      </header>

      <div className="mx-auto max-w-3xl px-4">
        <div
          className="relative overflow-hidden rounded-[2.5rem] bg-[var(--accent-soft)] px-8 py-16 sm:px-16"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Subtiel decoratief element */}
          <div 
            className="mb-8 flex justify-center opacity-10 pointer-events-none text-[40px] leading-none" 
            style={{ color: 'var(--text)', fontFamily: 'serif' }}
          >
            “
          </div>

          <div
            className="relative flex flex-col items-center text-center"
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0px)" : "translateY(8px)",
              transition: `opacity ${fadeMs}ms ease-out, transform ${fadeMs}ms ease-out`,
            }}
          >
            <StarRow count={stars} />

            <blockquote className="mt-8 max-w-lg">
              <p className="text-lg md:text-xl font-medium leading-relaxed italic text-[var(--text)]">
                {r.quote}
              </p>
            </blockquote>

            <div className="mt-10 flex flex-col items-center">
              <div className="h-px w-8 bg-[var(--border)] mb-6 opacity-50" />
              <span className="text-sm font-bold text-[var(--text)] tracking-tight">
                {r.name}
              </span>
              {r.location && (
                <span className="mt-1 text-[11px] uppercase tracking-widest text-[var(--text-soft)] opacity-70">
                  {r.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

