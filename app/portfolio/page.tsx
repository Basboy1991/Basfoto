import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity.client";
import { portfolioListQuery } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";

export const revalidate = 60;

type Item = {
  title: string;
  slug: { current: string };
  category: string;
  excerpt?: string;
  coverImage: { asset: { _id: string; metadata?: { lqip?: string } } };
};

export default async function PortfolioPage() {
  const items: Item[] = await sanityClient.fetch(portfolioListQuery);

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-[var(--text)] md:text-4xl">Portfolio</h1>
        <p className="mt-3 max-w-2xl text-[var(--text-soft)]">
          Een selectie van gezinnen, huisdieren en portretten – puur en persoonlijk vastgelegd in
          het Westland.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const href = `/portfolio/${item.slug.current}`;
          const imgUrl = urlFor(item.coverImage.asset)
            .width(1400)
            .height(1750) // 4:5
            .fit("crop")
            .auto("format")
            .quality(80)
            .url();

          return (
            <Link
              key={href}
              href={href}
              className="group overflow-hidden rounded-2xl bg-[var(--surface-2)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
                  placeholder={item.coverImage.asset.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={item.coverImage.asset.metadata?.lqip}
                />
              </div>

              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">
                  {item.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--text)]">{item.title}</h2>
                {item.excerpt && (
                  <p className="mt-2 text-sm text-[var(--text-soft)]">{item.excerpt}</p>
                )}
                <div className="mt-5">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--text)] ring-1 ring-[var(--border)] transition group-hover:bg-white group-hover:ring-[var(--accent)]">
                    Bekijk
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
