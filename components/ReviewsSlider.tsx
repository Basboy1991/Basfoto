"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  quote: string;
  name: string;
  location?: string;
  stars?: number;
};

function clampStars(n?: number) {
  return Math.max(1, Math.min(5, n ?? 5));
}

export default function ReviewsSlider({
  reviews,
  intervalMs = 9000,
  fadeMs = 700,
}: {
  reviews: Review[];
  intervalMs?: number;
  fadeMs?: number;
}) {
  const list = useMemo(() => reviews.filter((r) => r?.quote && r?.name), [reviews]);
  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (list.length <= 1) return;

    const timer = window.setInterval(() => {
      setFadeIn(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % list.length);
        setFadeIn(true);
      }, fadeMs);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [list.length, intervalMs, fadeMs]);

  if (list.length === 0) return null;

  const r = list[index];
  const stars = clampStars(r.stars);

  return (
    <section className="mt-16">
      <div className="rounded-2xl border bg-zinc-50 p-10 text-center">
        <div
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
        >
          <div className="flex justify-center gap-1 text-zinc-900" aria-label={`${stars} sterren`}>
            {Array.from({ length: stars }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-800">
            “{r.quote}”
          </p>

          <p className="mt-5 text-sm text-zinc-700">
            {r.name}
            {r.location ? ` · ${r.location}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}
