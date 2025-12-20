import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Star, Quote } from "lucide-react";

/**
 * @typedef {Object} Review
 * @property {string} quote
 * @property {string} name
 * @property {string} [location]
 * @property {number} [stars]
 */

const StarRating = ({ count = 5 }) => {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < Math.round(count) 
              ? "fill-amber-400 text-amber-400" 
              : "text-slate-200 fill-slate-100"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsSlider({ reviews = [] }) {
  const items = useMemo(() => 
    (reviews || []).filter((r) => r?.quote && r?.name), 
  [reviews]);

  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const intervalMs = 8000;

  const nextSlide = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % items.length);
      setIsVisible(true);
    }, 600); // Tijd voor fade-out
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(nextSlide, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, nextSlide]);

  if (!items || items.length === 0) return null;

  const currentReview = items[index];

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Subtiele Header */}
        <div className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            Reviews
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-slate-800 mt-3">
            Onze klantervaringen
          </h2>
        </div>

        {/* Review Container */}
        <div className="relative min-h-[300px] flex flex-col items-center">
          {/* Decoratief Quote Icoon */}
          <Quote 
            className="text-slate-100 absolute -top-12 left-1/2 -translate-x-1/2" 
            size={80} 
            strokeWidth={1} 
          />

          <div 
            className={`
              flex flex-col items-center text-center transition-all duration-1000 ease-in-out
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <div className="mb-10">
              <StarRating count={currentReview.stars || 5} />
            </div>

            <blockquote className="max-w-2xl">
              <p className="text-xl md:text-2xl leading-relaxed text-slate-700 font-serif italic">
                "{currentReview.quote}"
              </p>
            </blockquote>

            <div className="mt-10 flex flex-col items-center">
              <div className="h-px w-12 bg-amber-200 mb-6" />
              <p className="text-base font-semibold text-slate-900 tracking-tight">
                {currentReview.name}
              </p>
              {currentReview.location && (
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                  {currentReview.location}
                </p>
              )}
            </div>
          </div>

          {/* Subtiele voortgangsbalk (optioneel, zeer discreet) */}
          {items.length > 1 && (
            <div className="absolute bottom-0 w-full max-w-[100px] h-[2px] bg-slate-100 overflow-hidden">
              <div 
                key={index}
                className="h-full bg-amber-400/30 transition-all"
                style={{ 
                  animation: isVisible ? `progress ${intervalMs}ms linear forwards` : 'none'
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}

