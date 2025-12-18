import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { portfolioBySlugQuery } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

type PageProps = { params: { slug: string } };

export default async function PortfolioDetailPage({ params }: PageProps) {
  const item = await sanityClient.fetch(portfolioBySlugQuery, {
    slug: params.slug,
  });

  if (!item) return notFound();

  const coverUrl = urlFor(item.coverImage.asset)
    .width(2000)
    .height(1200)
    .fit("crop")
    .auto("format")
    .quality(82)
    .url();

  return (
    <article>
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wide text-[var(--text-soft)]">{item.category}</p>

        <h1 className="mt-2 text-3xl font-semibold text-[var(--text)] md:text-4xl">{item.title}</h1>

        {item.excerpt && <p className="mt-3 max-w-2xl text-[var(--text-soft)]">{item.excerpt}</p>}
      </header>

      <div className="overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/9]">
          <Image
            src={coverUrl}
            alt={item.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            placeholder={item.coverImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={item.coverImage.asset.metadata?.lqip}
          />
        </div>
      </div>

      {item.body?.length ? (
        <div className="prose mt-10 prose-p:text-[var(--text-soft)] prose-headings:text-[var(--text)]">
          <PortableText value={item.body} />
        </div>
      ) : null}

      {/* Gallery */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--text)]">Galerij</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {item.gallery?.map((img: any) => {
            const url = urlFor(img.asset)
              .width(1400)
              .height(1750)
              .fit("crop")
              .auto("format")
              .quality(80)
              .url();

            return (
              <div
                key={img.asset._id}
                className="overflow-hidden rounded-2xl bg-[var(--surface-2)]"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={url}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.02]"
                    placeholder={img.asset.metadata?.lqip ? "blur" : "empty"}
                    blurDataURL={img.asset.metadata?.lqip}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
