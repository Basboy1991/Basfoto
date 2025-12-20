"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const current = reviews[index];

  // fade
  const [fadeIn, setFadeIn] = useState(true);

  // adaptive height (meet ALLES: content + dots)
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [h, setH] = useState<number>(0);

  // auto-rotate
  useEffect(() => {
    if (reviews.length <= 1) return;

    const t = window.setInterval(() => {
      setFadeIn(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % reviews.length);
        setFadeIn(true);
      }, 240);
    }, 9000);

    return () => window.clearInterval(t);
  }, [reviews.length]);

  // height measure (smooth)
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => setH(el.scrollHeight + 1);
    measure();

    const ro = new ResizeObserver(() => measure());
    ro.observe(el);

    return () => ro.disconnect();
  }, [current?.quote, current?.name, current?.location, current?.stars, reviews.length]);

  const stars = useMemo(() => {
    const s = Math.max(0, Math.min(5, current?.stars ?? 0));
    if (!s) return null;
    return Array.from({ length: s }).map((_, i) => <span key={i}>★</span>);
  }, [current?.stars]);

  if (!reviews?.length) return null;

  return (
    <section className="mt-20">
      <header className="mb-10 text-center">
        <p className="text-sm font-medium text-[var(--accent-strong)]">Reviews</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Wat klanten zeggen</h2>
      </header>

      <div
        className="relative mx-auto max-w-3xl rounded-3xl bg-[var(--accent-soft)] px-8 py-10 text-center"
        style={{
          border: "1px solid var(--border)",
          height: h ? `${h}px` : undefined,
          transition: "height 320ms ease",
        }}
      >
        {/* quotation marks (decoratief) */}
        <span
          className="pointer-events-none absolute left-6 top-6 select-none text-7xl font-serif"
          style={{ color: "rgba(143,174,160,0.25)" }}
          aria-hidden
        >
          “
        </span>
        <span
          className="pointer-events-none absolute bottom-6 right-6 select-none text-7xl font-serif"
          style={{ color: "rgba(143,174,160,0.25)" }}
          aria-hidden
        >
          ”
        </span>

        {/* ✅ Alles wat hoogte bepaalt zit in deze wrapper */}
        <div ref={innerRef} className="relative">
          {/* Fade wrapper */}
          <div
            style={{
              opacity: fadeIn ? 1 : 0,
              transform: fadeIn ? "translateY(0px)" : "translateY(4px)",
              transition: "opacity 260ms ease, transform 260ms ease",
            }}
          >
            {/* sterren (groter) */}
            {stars && (
              <div className="mb-5 flex justify-center gap-1 text-4xl text-[#D4AF37]">
                {stars}
              </div>
            )}

            {/* quote */}
            <blockquote className="mx-auto max-w-xl text-[1.125rem] italic leading-relaxed text-[var(--text)]">
              {current.quote}
            </blockquote>

            {/* naam */}
            <p className="mt-6 text-sm font-medium text-[var(--text)]">
              {current.name}
              {current.location && (
                <span className="text-xs text-[var(--text-soft)]"> · {current.location}</span>
              )}
            </p>
          </div>

          {/* dots */}
          {reviews.length > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {reviews.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFadeIn(false);
                      window.setTimeout(() => {
                        setIndex(i);
                        setFadeIn(true);
                      }, 140);
                    }}
                    aria-label={`Ga naar review ${i + 1}`}
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: active ? "var(--accent-strong)" : "rgba(0,0,0,0.12)",
                      transform: active ? "scale(1.08)" : "scale(1)",
                      transition: "transform 200ms ease, background 200ms ease",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}