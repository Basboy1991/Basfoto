"use client";

import { useEffect, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

export default function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  if (!reviews?.length) return null;

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  const durationMs = 9000; // hoe lang een review blijft staan
  const animMs = 450; // fade/slide snelheid

  useEffect(() => {
    if (reviews.length <= 1) return;

    const timer = window.setInterval(() => {
      setPhase("out");

      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % reviews.length);
        setPhase("in");
      }, animMs);
    }, durationMs);

    return () => window.clearInterval(timer);
  }, [reviews.length]);

  const r = reviews[index];
  const stars = Math.min(5, Math.max(1, r.stars ?? 5));

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-[var(--accent-soft)] px-8 py-10 text-center">
        <div
          className="transition-all"
          style={{
            opacity: phase === "in" ? 1 : 0,
            transform: phase === "in" ? "translateY(0px)" : "translateY(6px)",
            transitionDuration: `${animMs}ms`,
            transitionTimingFunction: "ease",
          }}
        >
          {/* Sterren (groter + geel) */}
          <div className="mb-5 flex justify-center gap-1 text-[22px] text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} aria-hidden="true">
                {i < stars ? "★" : "☆"}
              </span>
            ))}
          </div>

          <blockquote className="text-lg italic text-[var(--text)]">“{r.quote}”</blockquote>

          <p className="mt-4 text-sm text-[var(--text-soft)]">
            {r.name}
            {r.location ? ` · ${r.location}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
