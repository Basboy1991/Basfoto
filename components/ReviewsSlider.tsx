"use client";

import { useEffect, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const current = reviews[index];

  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 9000);
    return () => clearInterval(t);
  }, [reviews.length]);

  if (!reviews?.length) return null;

  return (
    <section className="mt-20">
      <header className="mb-10 text-center">
        <p className="text-sm font-medium text-[var(--accent-strong)]">Reviews</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
          Wat klanten zeggen
        </h2>
      </header>

      <div
        className="relative mx-auto max-w-3xl rounded-3xl bg-[var(--accent-soft)] px-8 py-12 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Quotation marks */}
        <span
          className="absolute left-6 top-6 select-none text-7xl font-serif"
          style={{ color: "rgba(143,174,160,0.25)" }}
          aria-hidden
        >
          “
        </span>
        <span
          className="absolute bottom-6 right-6 select-none text-7xl font-serif"
          style={{ color: "rgba(143,174,160,0.25)" }}
          aria-hidden
        >
          ”
        </span>

        {/* ⭐ Sterren */}
        {current.stars && (
          <div className="mb-5 flex justify-center gap-1 text-2xl text-[#D4AF37]">
            {Array.from({ length: current.stars }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        )}

        {/* Quote */}
        <blockquote className="mx-auto max-w-xl text-[1.125rem] md:text-[1.25rem] italic leading-relaxed text-[var(--text)]">
          {current.quote}
        </blockquote>

        {/* Naam */}
        <p className="mt-6 text-sm font-medium text-[var(--text)]">
          {current.name}
          {current.location && (
            <span className="text-xs text-[var(--text-soft)]"> · {current.location}</span>
          )}
        </p>

        {/* Navigatie */}
        {reviews.length > 1 && (
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() =>
                setIndex((i) => (i - 1 + reviews.length) % reviews.length)
              }
              className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 text-sm hover:bg-white"
            >
              ←
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % reviews.length)}
              className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 text-sm hover:bg-white"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}