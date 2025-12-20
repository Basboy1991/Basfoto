"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

/**
 * StarIcon: Iets groter en strakker (20x20)
 */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "#D4A62A" : "none"} // Goud
      stroke={filled ? "#D4A62A" : "var(--border)"} // Border kleur als hij leeg is
      strokeWidth="1.5" // Iets fijnere lijntjes voor premium gevoel
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
    // Gap verhoogd naar 1.5 voor meer lucht tussen de sterren
    <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} filled={i < count} />
      ))}
    </div>
  );
}

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  // Filter lege reviews eruit
  const items = useMemo(() => (reviews ?? []).filter((r) => r?.quote && r?.name), [reviews]);

  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const intervalMs = 9500;
  const fadeMs = 600; // Iets tragere fade voelt luxer

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
   * Dynamische font-size: Iets groter gemaakt voor impact
   */
  const getFontSizeClass = (text: string) => {
    if (text.length > 200) return "text-[16px] sm:text-[18px] leading-relaxed";
    if (text.length > 120) return "text-[18px] sm:text-[20px] leading-relaxed";
    return "text-[21px] sm:text-[24px] leading-relaxed";
  };

  return (
    <section className="mt-24 w-full overflow-hidden">
      <header className="mb-12 text-center px-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-soft)] opacity-60 font-semibold mb-3">
          Reviews
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text)] tracking-tight">
          Wat klanten zeggen
        </h2>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div
          className="relative flex min-h-[420px] sm:min-h-[380px] flex-col justify-center rounded-[3rem] bg-[var(--accent-soft)] px-6 py-16 sm:px-24 border border-[var(--border)] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)]"
        >
          {/* Quotation Marks - Subtieler en beter gepositioneerd */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-8 sm:left-10 sm:top-10 select-none font-serif text-[100px] leading-none opacity-5"
            style={{ color: 'var(--text)' }}
          >
            “
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-6 sm:bottom-8 sm:right-10 select-none font-serif text-[100px] leading-none opacity-5"
            style={{ color: 'var(--text)' }}
          >
            ”
          </span>

          {/* De Content */}
          <div
            className="relative flex flex-col items-center text-center z-10 h-full justify-between"
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0px) scale(1)" : "translateY(10px) scale(0.98)", // Subtiele scale voor premium feel
              transition: `opacity ${fadeMs}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${fadeMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {/* Sterren bovenaan */}
            <div className="mb-8">
              <StarRow count={stars} />
            </div>

            {/* Quote tekst */}
            <div className="mb-10 max-w-2xl mx-auto">
              <p 
                className={`font-serif italic text-[var(--text)] ${getFontSizeClass(r.quote)}`}
                style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 6, 
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {r.quote}
              </p>
            </div>

            {/* Auteur info */}
            <div className="flex flex-col items-center mt-auto">
              {/* Divider lijn iets dunner en zachter */}
              <div className="h-px w-12 bg-[var(--text)] mb-6 opacity-20" />
              
              <span className="text-[16px] font-semibold text-[var(--text)] tracking-wide">
                {r.name}
              </span>
              
              {r.location && (
                <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-soft)] font-medium opacity-80">
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

