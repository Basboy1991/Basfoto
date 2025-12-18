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

  const [i, setI] = useState(0);

  // subtiele auto-rotatie (later kunnen we animaties uitbreiden)
  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = window.setInterval(() => {
      setI((prev) => (prev + 1) % reviews.length);
    }, 9000);
    return () => window.clearInterval(t);
  }, [reviews.length]);

  const r = reviews[i];
  const stars = Math.min(5, Math.max(1, r.stars ?? 5));

  return (
    <section className="mt-16">
      <div className="mx-auto max-w-3xl rounded-2xl bg-[var(--accent-soft)] px-8 py-10 text-center">
        <div className="mb-4 flex justify-center gap-1 text-[var(--accent-strong)]">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx} aria-hidden="true">
              {idx < stars ? "★" : "☆"}
            </span>
          ))}
        </div>

        <blockquote className="text-lg italic text-[var(--text)]">“{r.quote}”</blockquote>

        <p className="mt-4 text-sm text-[var(--text-soft)]">
          {r.name}
          {r.location ? ` · ${r.location}` : ""}
        </p>
      </div>
    </section>
  );
}
