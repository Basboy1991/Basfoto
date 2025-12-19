import Link from "next/link";
import Image from "next/image";

import { sanityClient } from "@/lib/sanity.client";
import { albumsQuery } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity.image";

export const revalidate = 60;

type AlbumCard = {
  title: string;
  slug: string;
  description?: string;
  coverImage?: any;
};

export default async function PortfolioPage() {
  const albums = (await sanityClient.fetch(albumsQuery)) as AlbumCard[];

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <Link
              key={a.slug}
              href={`/portfolio/${a.slug}`}
              className="group overflow-hidden rounded-2xl bg-[var(--surface-2)] shadow-[var(--shadow-sm)]"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                {a.coverImage ? (
                  <Image
                    src={urlFor(a.coverImage)
                      .width(1200)
                      .height(1500)
                      .fit("crop")
                      .auto("format")
                      .quality(80)
                      .url()}
                    alt={a.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[var(--text-soft)]">
                    Geen cover ingesteld
                  </div>
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
          ))}
        </div>
      )}
    </>
  );
}
