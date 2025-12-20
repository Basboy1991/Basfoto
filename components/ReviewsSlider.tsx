"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * @typedef {Object} Review
 * @property {string} quote
 * @property {string} name
 * @property {string} [location]
 * @property {number} [stars]
 */

function StarIcon({ filled }) {
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

function StarRow({ count }) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < count} />
      ))}
    </div>
  );
}

export default function ReviewsSlider({ reviews }) {
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
          {/* Subtiel Quote symbool boven de tekst */}
          <div 
            className="mb-8 flex justify-center opacity-10 pointer-events-none" 
            style={{ color: 'var(--text)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017V4H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.0166 21L3.0166 18C3.0166 16.8954 3.91203 16 5.0166 16H8.0166C8.56888 16 9.0166 15.5523 9.0166 15V9C9.0166 8.44772 8.56888 8 8.0166 8H4.0166C3.46432 8 3.0166 8.44772 3.0166 9V12C3.0166 12.5523 2.56888 13 2.0166 13H1.0166V4H10.0166V15C10.0166 18.3137 7.33031 21 4.0166 21H3.0166Z" />
            </svg>
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
                "{r.quote}"
              </p>
            </blockquote>

            <div className="mt-8 flex flex-col items-center">
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

