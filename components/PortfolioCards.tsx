import { urlFor } from "@/lib/sanity.image";
import Image from "next/image";
import Link from "next/link";

export default function PortfolioCards({
  cards,
}: {
  cards: {
    title: string;
    text?: string;
    buttonLabel?: string;
    href: string;
    featured?: boolean;
    coverImage?: { asset?: { url?: string } };
  }[];
}) {
  if (!cards?.length) return null;

  const featured = cards.find((c) => c.featured) ?? cards[0];
  const rest = cards.filter((c) => c !== featured).slice(0, 2);

  const Card = ({ c, ratio, sizes }: { c: any; ratio: string; sizes: string }) => (
    <div className="group rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-500 ease-out hover:-translate-y-[2px] hover:shadow-md">
      <div className={`relative ${ratio} overflow-hidden`}>
        {c.coverImage?.asset?.url && (
          <Image
            src={urlFor(c.coverImage.asset)
              .width(1400)
              .height(1750) // 4:5 exact
              .fit("crop")
              .auto("format")
              .quality(80)
              .url()}
            alt={c.title}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
            sizes={sizes}
            placeholder={c.coverImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={c.coverImage.asset.metadata?.lqip}
          />
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{c.title}</h3>
        {c.text && <p className="mt-2 text-sm text-zinc-700">{c.text}</p>}

        <Link
          href={c.href}
          className="mt-4 inline-flex rounded-xl border px-4 py-2 text-sm transition-all duration-300 group-hover:translate-x-[2px] hover:bg-zinc-50"
        >
          {c.buttonLabel ?? "Bekijk"}
        </Link>
      </div>
    </div>
  );

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold">Portfolio</h2>
        <Link href="/portfolio" className="text-sm text-zinc-700 hover:text-zinc-900">
          Bekijk alles →
        </Link>
      </div>

      {/* 1 grote kaart boven */}
      <Card c={featured} ratio="aspect-[16/9]" sizes="(max-width: 1024px) 100vw, 100vw" />

      {/* 2 kleinere kaarten eronder naast elkaar */}
      {rest.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((c) => (
            <Card key={c.title} c={c} ratio="aspect-[4/5]" sizes="(max-width: 768px) 100vw, 50vw" />
          ))}
        </div>
      )}
    </section>
  );
}
