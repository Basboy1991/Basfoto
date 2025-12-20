"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

/**
 * StarIcon: Aangepast naar 18x18 voor een compacter maar premium gevoel
 */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? "#D4A62A" : "none"} // Goud
      stroke={filled ? "#D4A62A" : "var(--border)"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block" }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    // Gap iets verkleind (1) voor compactheid
    <div className="flex items-center justify-center gap-1" aria-hidden="true">
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

  /**
   * Dynamische font-size: Iets verkleind t.o.v. vorige versie voor betere balans
   */
  const getFontSizeClass = (text: string) => {
    if (text.length > 200) return "text-[15px] sm:text-[16px] leading-relaxed";
    if (text.length > 120) return "text-[16px] sm:text-[18px] leading-relaxed";
    return "text-[19px] sm:text-[22px] leading-relaxed";
  };

  return (
    <section className="mt-20 w-full overflow-hidden">
      <header className="mb-10 text-center px-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-soft)] opacity-60 font-semibold mb-3">
          Reviews
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text)] tracking-tight">
          Wat klanten zeggen
        </h2>
      </header>

      {/* Max-width verkleind naar 3xl voor compacter geheel */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative flex min-h-[350px] sm:min-h-[300px] flex-col justify-center rounded-[2.5rem] bg-[var(--accent-soft)] px-6 py-12 sm:px-16 border border-[var(--border)] shadow-[0_2px_40px_-12px_rgba(0,0,0,0.05)]">
          {/* Quotation Marks - Kleiner (80px) en strakker gepositioneerd */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-6 top-6 sm:left-8 sm:top-8 select-none font-serif text-[80px] leading-none opacity-5"
            style={{ color: "var(--text)" }}
          >
            “
          </span>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-6 sm:bottom-6 sm:right-8 select-none font-serif text-[80px] leading-none opacity-5"
            style={{ color: "var(--text)" }}
          >
            ”
          </span>

          {/* De Content */}
          <div
            className="relative flex flex-col items-center text-center z-10 h-full justify-between"
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0px) scale(1)" : "translateY(10px) scale(0.98)",
              transition: `opacity ${fadeMs}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${fadeMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          >
            {/* Sterren - minder margin bottom */}
            <div className="mb-6">
              <StarRow count={stars} />
            </div>

            {/* Quote tekst - px-2 toegevoegd zodat italic letters niet afgekapt worden */}
            <div className="mb-8 max-w-2xl mx-auto px-2">
              <p
                className={`font-serif italic text-[var(--text)] ${getFontSizeClass(r.quote)}`}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {r.quote}
              </p>
            </div>

            {/* Auteur info */}
            <div className="flex flex-col items-center mt-auto">
              <div className="h-px w-10 bg-[var(--text)] mb-5 opacity-20" />

              <span className="text-[15px] font-semibold text-[var(--text)] tracking-wide">
                {r.name}
              </span>

              {r.location && (
                <span className="mt-1.5 text-[10px] uppercase tracking-[0.25em] text-[var(--text-soft)] font-medium opacity-80">
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
