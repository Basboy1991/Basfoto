"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";

type SanityImage = {
  asset?: {
    _id: string;
    url: string;
    metadata?: { lqip?: string };
  };
};

type PortfolioCard = {
  title: string;
  text?: string;
  featured?: boolean;
  buttonLabel?: string;
  href: string;
  coverImage?: SanityImage;
};

export default function HomePortfolioBlock({
  title = "Portfolio",
  cards,
}: {
  title?: string;
  cards: PortfolioCard[];
}) {
  if (!cards?.length) return null;

  // 1 featured (of de eerste) + 2 klein
  const featured = cards.find((c) => c.featured) ?? cards[0];
  const rest = cards.filter((c) => c !== featured).slice(0, 2);

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-6">
        <h2 className="text-2xl font-semibold text-[var(--text)]">{title}</h2>

        <Link
          href="/portfolio"
          className="text-sm font-medium text-[var(--text-soft)] hover:text-[var(--text)]"
        >
          Alle albums →
        </Link>
      </div>

      <div className="grid gap-6">
        {/* FEATURED (groot) */}
        <PortfolioCardItem card={featured} size="featured" />

        {/* 2 klein naast elkaar */}
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((c) => (
            <PortfolioCardItem key={c.href} card={c} size="small" />
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioCardItem({ card, size }: { card: PortfolioCard; size: "featured" | "small" }) {
  const img = card.coverImage;

  const imgUrl = img?.asset?._id
    ? urlFor(img.asset).width(1600).height(2000).fit("crop").auto("format").quality(80).url()
    : null;

  return (
    <div className="group overflow-hidden rounded-3xl bg-[var(--surface-2)]">
      <div
        className={[
          "relative overflow-hidden",
          // vaste ratio’s => geen CLS
          size === "featured" ? "aspect-[16/10] md:aspect-[16/9]" : "aspect-[4/5]",
        ].join(" ")}
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={card.title}
            fill
            sizes={
              size === "featured"
                ? "(max-width: 768px) 100vw, 1100px"
                : "(max-width: 768px) 100vw, 520px"
            }
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
            placeholder={img?.asset?.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={img?.asset?.metadata?.lqip}
            priority={size === "featured"} // LCP-help
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--text-soft)]">
            Geen cover ingesteld
          </div>
        )}

        {/* subtiele overlay bij hover */}
        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
      </div>

      <div className={size === "featured" ? "p-8" : "p-6"}>
        <h3 className="text-lg font-semibold text-[var(--text)]">{card.title}</h3>

        {card.text ? (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--text-soft)]">{card.text}</p>
        ) : null}

        <div className="mt-5">
          <Link
            href={card.href}
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            {card.buttonLabel ?? "Bekijk portfolio"}
          </Link>
        </div>
      </div>
    </div>
  );
}
