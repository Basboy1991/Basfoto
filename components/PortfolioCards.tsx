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
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Portfolio</h2>

        <Link
          href="/portfolio"
          className="text-sm font-medium text-[var(--accent-strong)] hover:text-[var(--accent)]"
        >
          Bekijk alles →
        </Link>
      </div>

      <div className="grid gap-6">
        <CardItem card={featured} variant="featured" />
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((c) => (
            <CardItem key={c.href} card={c} variant="small" />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardItem({ card, variant }: { card: Card; variant: "featured" | "small" }) {
  const aspect = variant === "featured" ? "aspect-[16/9]" : "aspect-[4/5]";
  const sizes =
    variant === "featured" ? "(max-width: 768px) 100vw, 1024px" : "(max-width: 768px) 100vw, 520px";

  const imgUrl =
    variant === "featured"
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
    <div className="overflow-hidden rounded-2xl bg-[var(--surface-2)]">
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
      </Link>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-[var(--text)]">{card.title}</h3>

        {card.text && <p className="mt-1 text-sm text-[var(--text-soft)]">{card.text}</p>}

        <div className="mt-5">
          <Link
            href={card.href}
            className="inline-flex items-center rounded-xl bg-white/70 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-white"
            aria-label={`Bekijk ${card.title}`}
          >
            {card.buttonLabel ?? "Bekijk"}
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
