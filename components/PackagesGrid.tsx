import Link from "next/link";

type PackageCard = {
  title: string;
  subtitle?: string;
  price?: string;
  duration?: string;
  deliverables?: string;
  highlights?: string[];
  featured?: boolean;
  note?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function PackagesGrid({ items }: { items: PackageCard[] }) {
  const featured = items.find((p) => p.featured);

  return (
    <section className="mt-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const isFeatured = featured && p === featured;

          return (
            <article
              key={p.title}
              className="relative overflow-hidden rounded-3xl bg-[var(--surface-2)] p-8 shadow-[var(--shadow-sm)]"
              style={{
                border: isFeatured ? "1px solid rgba(126,162,148,0.65)" : "1px solid var(--border)",
                boxShadow: isFeatured ? "var(--shadow-md)" : "var(--shadow-sm)",
              }}
            >
              {isFeatured ? (
                <span className="absolute right-6 top-6 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--text)]">
                  Meest gekozen
                </span>
              ) : null}

              <h2 className="text-xl font-semibold text-[var(--text)]">{p.title}</h2>

              {p.subtitle ? (
                <p className="mt-2 text-sm italic text-[var(--text-soft)]">{p.subtitle}</p>
              ) : null}

              {(p.price || p.duration) && (
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-center md:justify-start md:text-left">
                  {p.price ? (
                    <p className="text-2xl font-semibold text-[var(--text)]">{p.price}</p>
                  ) : null}
                  {p.duration ? (
                    <p className="text-sm text-[var(--text-soft)]">{p.duration}</p>
                  ) : null}
                </div>
              )}

              {p.deliverables ? (
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-soft)]">{p.deliverables}</p>
              ) : null}

              {p.highlights?.length ? (
                <ul className="mt-6 space-y-2 text-sm text-[var(--text-soft)]">
                  {p.highlights.map((h, i) => (
                    <li key={`${p.title}-h-${i}`} className="flex gap-2">
                      <span className="mt-[2px] text-[var(--accent-strong)]">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {p.note ? (
                <p className="mt-5 text-xs text-[var(--text-soft)] opacity-90">{p.note}</p>
              ) : null}

              <div className="mt-8">
                <Link
                  href={p.ctaHref || "/boek"}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
                >
                  {p.ctaLabel || "Boek dit pakket"}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}