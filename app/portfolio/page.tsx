import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity.client";
import { albumListQuery } from "@/lib/sanity.queries";
import { cloudinaryImg } from "@/lib/cloudinary";

export const revalidate = 60;

type Album = {
  title: string;
  slug: string;
  description?: string;
  cloudinaryFolder: string;
  coverPublicId?: string;
};

export default async function PortfolioPage() {
  const albums: Album[] = await sanityClient.fetch(albumListQuery);

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-[var(--text)] md:text-4xl">Portfolio</h1>
        <p className="mt-3 max-w-2xl text-[var(--text-soft)]">
          Albums met gezinnen, kinderen en huisdieren — puur en persoonlijk in het Westland.
        </p>
      </header>

      {albums.length === 0 ? (
        <p className="text-[var(--text-soft)]">
          Nog geen albums gevonden. Voeg een album toe in Sanity Studio en publiceer het.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => {
            const href = `/portfolio/${a.slug}`;
            const coverUrl = a.coverPublicId ? cloudinaryImg(a.coverPublicId, 1200, 1500) : null;

            return (
              <article key={a.slug} className="overflow-hidden rounded-2xl bg-[var(--surface-2)]">
                <Link href={href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[var(--text-soft)]">
                        Geen cover ingesteld
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-semibold text-[var(--text)]">{a.title}</h2>

                    {a.description ? (
                      <p className="mt-2 text-sm text-[var(--text-soft)]">{a.description}</p>
                    ) : null}

                    <div className="mt-5">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--text)] ring-1 ring-[var(--border)] transition group-hover:bg-white group-hover:ring-[var(--accent)]">
                        Bekijk album <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
