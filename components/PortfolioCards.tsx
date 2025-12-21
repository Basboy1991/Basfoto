import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity.image";

type Card = {
  title: string;
  text?: string;
  featured?: boolean;
  buttonLabel?: string;
  href: string;
  coverImage: {
    asset: {
      _id: string;
      url: string;
      metadata?: { lqip?: string };
    };
  };
};

export default function PortfolioCards({ cards }: { cards: Card[] }) {
  if (!cards?.length) return null;

  const featured = cards.find((c) => c.featured) ?? cards[0];
  const rest = cards.filter((c) => c !== featured).slice(0, 2);

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Portfolio</h2>

        <Link
          href="/portfolio"
          className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--accent-soft)]"
        >
          Bekijk alles <span className="ml-2">→</span>
        </Link>
      </div>

      <div className="grid gap-6">
        <CardItem card={featured} variant="featured" />

        {rest.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((c) => (
              <CardItem key={c.href} card={c} variant="small" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CardItem({ card, variant }: { card: Card; variant: "featured" | "small" }) {
  const isFeatured = variant === "featured";
  const aspect = isFeatured ? "aspect-[16/9]" : "aspect-[4/5]";
  const sizes = isFeatured ? "(max-width: 768px) 100vw, 1024px" : "(max-width: 768px) 100vw, 520px";

  const imgUrl = isFeatured
    ? urlFor(card.coverImage.asset)
        .width(1800)
        .height(1013)
        .fit("crop")
        .auto("format")
        .quality(80)
        .url()
    : urlFor(card.coverImage.asset)
        .width(1400)
        .height(1750)
        .fit("crop")
        .auto("format")
        .quality(80)
        .url();

  return (
    <article
      className={`overflow-hidden rounded-2xl bg-[var(--surface-2)] ${
        isFeatured ? "shadow-[var(--shadow-md)]" : "shadow-[var(--shadow-sm)]"
      }`}
      style={{
        border: isFeatured
          ? "2px solid var(--accent-soft)" // ✅ saliegroen kader
          : "1px solid var(--border)",
      }}
    >
      <Link href={card.href} className="group block">
        <div className={`relative ${aspect} overflow-hidden`}>
          <Image
            src={imgUrl}
            alt={card.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
            placeholder={card.coverImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={card.coverImage.asset.metadata?.lqip}
          />
        </div>

        {/* Content */}
        <div className={`px-6 ${isFeatured ? "py-8" : "py-7"} text-center`}>
          <h3
            className={`font-semibold text-[var(--text)] ${
              isFeatured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
            style={{ letterSpacing: "-0.015em" }}
          >
            {card.title}
          </h3>

          {card.text && (
            <p className="mx-auto mt-2 max-w-[40ch] text-sm leading-relaxed text-[var(--text-soft)]">
              {card.text}
            </p>
          )}

          <div className="mt-5 flex justify-center">
            <span
              className="inline-flex items-center rounded-full px-6 py-2 text-sm font-medium transition"
              style={{
                background: isFeatured ? "var(--accent-strong)" : "rgba(255,255,255,0.7)",
                color: isFeatured ? "white" : "var(--text)",
              }}
            >
              {card.buttonLabel ?? "Bekijk"}
              <span className="ml-2">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
