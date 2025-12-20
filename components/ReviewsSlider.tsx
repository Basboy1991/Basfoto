"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

/**
 * StarIcon met strikte types voor Vercel
 */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? "#D4A62A" : "none"}
      stroke={filled ? "#D4A62A" : "var(--border)"}
      strokeWidth="2"
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
    <div className="flex items-center justify-center gap-1" aria-hidden="true">
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

  const intervalMs = 9500;
  const fadeMs = 500;

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

  /**
   * Dynamische font-size op basis van tekstlengte
   */
  const getFontSizeClass = (text: string) => {
    if (text.length > 200) return "text-[15px] sm:text-[16px]";
    if (text.length > 120) return "text-[17px] sm:text-[18px]";
    return "text-[19px] sm:text-[21px]";
  };

  return (
    <section className="mt-20 w-full overflow-hidden">
      <header className="mb-10 text-center px-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-soft)] opacity-70 font-bold">
          Reviews
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text)] tracking-tight">
          Wat klanten zeggen
        </h2>
      </header>

      <div className="mx-auto max-w-3xl px-6">
        <div
          className="relative flex min-h-[400px] sm:min-h-[350px] flex-col justify-center rounded-[2.5rem] bg-[var(--accent-soft)] px-8 py-14 sm:px-20 border border-[var(--border)]"
        >
          {/* Quotation Marks - Teruggeplaatst met correcte styling */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-8 top-8 select-none font-serif text-[120px] leading-none opacity-10"
            style={{ color: 'var(--text)' }}
          >
            “
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-10 select-none font-serif text-[120px] leading-none opacity-10"
            style={{ color: 'var(--text)' }}
          >
            ”
          </span>

          {/* De Content */}
          <div
            className="relative flex flex-col items-center text-center z-10"
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0px)" : "translateY(5px)",
              transition: `opacity ${fadeMs}ms ease, transform ${fadeMs}ms ease`,
            }}
          >
            <div className="mb-8 scale-110">
              <StarRow count={stars} />
            </div>

            <div className="mb-8">
              <p 
                className={`font-medium italic text-[var(--text)] leading-relaxed ${getFontSizeClass(r.quote)}`}
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 7, 
                  WebkitBoxOrient: 'vertical', // Nu correct als string voor TypeScript
                  overflow: 'hidden'
                }}
              >
                {r.quote}
              </p>
            </div>

            <div className="flex flex-col items-center mt-auto">
              <div className="h-px w-10 bg-[var(--border)] mb-5 opacity-60" />
              <span className="text-[15px] font-bold text-[var(--text)] tracking-tight">
                {r.name}
              </span>
              {r.location && (
                <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--text-soft)] font-medium">
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

