import Link from "next/link";

export type PackageCard = {
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

export default function PackagesGrid({ items }: { items: PackageCard[] }) {
  if (!items?.length) return null;

  return (
    <section className="mt-12">
      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((p) => (
          <article
            key={`${p.title}-${p.price}`}
            className="relative overflow-hidden rounded-3xl bg-[var(--surface-2)] shadow-[var(--shadow-sm)]"
            style={{
              border: p.featured
                ? "1px solid rgba(126,162,148,0.55)"
                : "1px solid var(--border)",
            }}
          >
            {p.featured && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--accent-soft)] to-transparent" />
            )}

            <div className="relative p-8 text-center">
              {p.featured && (
                <p
                  className="mx-auto mb-3 inline-flex rounded-full bg-white/70 px-4 py-1 text-xs font-medium text-[var(--text)]"
                  style={{ border: "1px solid var(--border)" }}
                >
                  Meest gekozen
                </p>
              )}

              <h2 className="text-xl font-semibold text-[var(--text)]">{p.title}</h2>

              {p.subtitle && (
                <p className="mt-2 text-sm italic text-[var(--text-soft)]">{p.subtitle}</p>
              )}

              <div className="mt-6">
                <p className="text-3xl font-semibold text-[var(--text)]">{p.price}</p>

                {(p.duration || p.deliverables) && (
                  <p className="mt-2 text-sm text-[var(--text-soft)]">
                    {p.duration ? p.duration : null}
                    {p.duration && p.deliverables ? " • " : null}
                    {p.deliverables ? p.deliverables : null}
                  </p>
                )}
              </div>

              {p.highlights?.length ? (
                <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm text-[var(--text-soft)]">
                  {p.highlights.map((h, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-[var(--accent-strong)]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-8 flex justify-center">
                <Link
                  href={p.ctaHref}
                  className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {p.ctaLabel ?? "Boek dit pakket"}
                  <span className="ml-2">→</span>
                </Link>
              </div>

              {p.note && <p className="mt-4 text-xs text-[var(--text-soft)] opacity-90">{p.note}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}