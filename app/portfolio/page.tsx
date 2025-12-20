import Link from "next/link";
import Image from "next/image";

import { sanityClient } from "@/lib/sanity.client";
import { albumsQuery, homePageQuery } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";

import HomeCtaCard from "@/components/HomeCtaCard";

export const revalidate = 60;

type AlbumCard = {
  title: string;
  slug: string;
  description?: string;
  coverImage?: {
    asset?: {
      _id?: string;
      url?: string;
      metadata?: {
        lqip?: string;
        dimensions?: { width: number; height: number; aspectRatio: number };
      };
    };
    crop?: any;
    hotspot?: any;
  };
};

type HomeData = {
  cta?: {
    title: string;
    text?: string;
    whatsappNumber?: string;
    phoneNumber?: string;
    email?: string;
  };
};

function CoverPlaceholder({ title }: { title: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* saliegroene premium placeholder */}
      <div className="absolute inset-0 bg-[var(--accent-soft)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />

      <div className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70"
          style={{ border: "1px solid var(--border)" }}
          aria-hidden
        >
          <span className="text-lg">✦</span>
        </div>

        <p className="text-sm font-medium text-[var(--text)]">{title}</p>
        <p className="mt-1 text-xs text-[var(--text-soft)]">Cover volgt</p>
      </div>
    </div>
  );
}

export default async function PortfolioPage() {
  const [albums, home] = await Promise.all([
    sanityClient.fetch(albumsQuery) as Promise<AlbumCard[]>,
    sanityClient.fetch(homePageQuery) as Promise<HomeData>,
  ]);

  return (
    <>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Portfolio</h1>
        <p className="mx-auto mt-3 max-w-2xl text-[var(--text-soft)]">
          Kies een album en bekijk de foto’s.
        </p>
      </header>

      {!albums?.length ? (
        <div
          className="rounded-3xl bg-[var(--surface-2)] p-10 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-[var(--text-soft)]">Nog geen albums gevonden.</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Voeg albums toe in Sanity (type: <code>album</code>).
          </p>
          <Link
            href="/studio"
            className="mt-6 inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
          >
            Naar Studio
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((a) => {
              // ✅ jouw query levert asset->{_id,url,metadata...} dus check op _id
              const hasCover = Boolean(a.coverImage?.asset?._id);

              const coverUrl = hasCover
                ? urlFor(a.coverImage!)
                    .width(1200)
                    .height(1500)
                    .fit("crop")
                    .auto("format")
                    .quality(80)
                    .url()
                : null;

              const lqip = a.coverImage?.asset?.metadata?.lqip;

              return (
                <Link
                  key={a.slug}
                  href={`/portfolio/${a.slug}`}
                  className="group overflow-hidden rounded-2xl bg-[var(--surface-2)] shadow-[var(--shadow-sm)]"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        placeholder={lqip ? "blur" : "empty"}
                        blurDataURL={lqip}
                      />
                    ) : (
                      <CoverPlaceholder title={a.title} />
                    )}
                  </div>

                  <div className="p-6 text-center">
                    <h2 className="text-lg font-semibold text-[var(--text)]">{a.title}</h2>

                    {a.description && (
                      <p className="mt-2 text-sm text-[var(--text-soft)] line-clamp-2">
                        {a.description}
                      </p>
                    )}

                    <div className="mt-5 flex justify-center">
                      <span className="inline-flex items-center rounded-full bg-white/70 px-6 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-white">
                        Bekijk
                        <span className="ml-2">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {home?.cta?.title ? <HomeCtaCard cta={home.cta} /> : null}

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--accent-strong)] hover:text-[var(--accent)]"
            >
              ← Terug naar de homepage
            </Link>
          </div>
        </>
      )}
    </>
  );
}
