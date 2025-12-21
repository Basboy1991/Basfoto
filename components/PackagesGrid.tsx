import Link from "next/link";
import { Check } from "lucide-react";

type PackageCard = {
  title: string;
  subtitle?: string;
  price: string;
  duration?: string;
  deliverables?: string;
  highlights?: string[];
  featured?: boolean;
  note?: string;
  ctaLabel?: string;
  ctaHref: string;
};

function formatPrice(price: string) {
  const cleaned = price.replace("€", "").trim();
  if (!cleaned) return "€";
  return `€${cleaned}`;
}

function normalizeDuration(duration?: string) {
  if (!duration) return null;
  return `Fotoshoot van circa ${duration}`;
}

export default function PackagesGrid({ items }: { items: PackageCard[] }) {
  return (
    <section className="mt-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const durationLine = normalizeDuration(p.duration);

          return (
            <article
              key={`${p.title}-${p.price}`}
              className={[
                "group relative overflow-hidden rounded-3xl bg-[var(--surface-2)] shadow-[var(--shadow-sm)]",
                p.featured ? "ring-1 ring-[var(--accent-strong)]" : "",
              ].join(" ")}
              style={{ border: "1px solid var(--border)" }}
            >
              {/* Featured badge */}
              {p.featured && (
                <div className="absolute right-5 top-5 z-10">
                  <span
                    className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold tracking-wide"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    Meest gekozen
                  </span>
                </div>
              )}

              <div className="p-7">
                {/* Title */}
                <h2 className="text-center text-2xl font-semibold text-[var(--text)]">
                  {p.title}
                </h2>

                {/* Subtitle */}
                {p.subtitle && (
                  <p className="mt-2 text-center text-sm italic text-[var(--text-soft)]/90">
                    {p.subtitle}
                  </p>
                )}

                {/* Price */}
                <div className="mt-6 text-center">
                  <p className="text-4xl font-semibold text-[var(--text)]">
                    {formatPrice(p.price)}
                  </p>

                  {durationLine && (
                    <p className="mt-2 text-sm text-[var(--text-soft)]">
                      {durationLine}
                    </p>
                  )}
                </div>

                {/* Highlights (deliverables eerst) */}
                {(p.deliverables || p.highlights?.length) && (
                  <ul className="mt-6 space-y-3">
                    {p.deliverables && (
                      <li className="flex items-start gap-3">
                        <span
                          className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/65"
                          style={{ border: "1px solid var(--border)" }}
                          aria-hidden
                        >
                          <Check size={16} color="var(--accent-strong)" />
                        </span>
                        <span className="text-sm font-medium text-[var(--text)]">
                          {p.deliverables}
                        </span>
                      </li>
                    )}

                    {p.highlights?.map((h) => (
                      <li key={h} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/65"
                          style={{ border: "1px solid var(--border)" }}
                          aria-hidden
                        >
                          <Check size={16} color="var(--accent-strong)" />
                        </span>
                        <span className="text-sm leading-relaxed text-[var(--text-soft)]">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Note / km-heffing */}
                {p.note && (
                  <p className="mt-6 text-center text-xs text-[var(--text-soft)]">
                    {p.note}
                  </p>
                )}

                {/* CTA */}
                <div className="mt-5">
                  <Link
                    href={p.ctaHref}
                    className="inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-semibold text-white transition hover:opacity-95"
                    style={{ background: "var(--accent-strong)" }}
                    aria-label={p.ctaLabel ?? `Boek ${p.title}`}
                  >
                    {p.ctaLabel ?? "Boek dit pakket"}
                  </Link>
                </div>
              </div>

              {/* Subtiele premium hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(143,174,160,0.10), rgba(255,255,255,0.0) 45%)",
                }}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}