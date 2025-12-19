import Link from "next/link";

import { sanityClient } from "@/lib/sanity.client";
import { albumBySlugQuery } from "@/lib/sanity.queries";
import { listImagesByFolder } from "@/lib/cloudinary.server";
import LightboxGallery from "@/components/LightboxGallery";

export const revalidate = 60;

type Album = {
  title: string;
  slug: string;
  description?: string;
  cloudinaryFolder?: string;
};

type ParamsShape = { slug: string };

// ✅ Next.js 16: params kan een Promise zijn → daarom awaiten we params
export default async function PortfolioDetailPage({ params }: { params: Promise<ParamsShape> }) {
  const { slug } = await params;

  // 1) Guard: slug moet bestaan
  if (!slug) {
    return (
      <section className="py-16">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Slug ontbreekt</h1>
        <p className="mt-2 text-[var(--text-soft)]">
          Deze pagina verwacht een URL zoals <code>/portfolio/huisdieren</code>.
        </p>
        <Link
          href="/portfolio"
          className="mt-6 inline-flex items-center rounded-full border border-[var(--border)] bg-white/60 px-6 py-3 text-sm font-medium text-[var(--text)] hover:bg-white"
        >
          ← Terug naar portfolio
        </Link>
      </section>
    );
  }

  // 2) Album ophalen uit Sanity
  const album = (await sanityClient.fetch(albumBySlugQuery, { slug })) as Album | null;

  if (!album) {
    return (
      <section className="py-16">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Album niet gevonden</h1>
        <p className="mt-2 text-[var(--text-soft)]">
          Gezochte slug: <strong>{slug}</strong>
        </p>
        <p className="mt-2 text-sm text-[var(--text-soft)]">
          Check in Sanity Studio of het album <strong>gepubliceerd</strong> is en of de slug exact
          klopt.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/portfolio"
            className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
          >
            Naar portfolio
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/60 px-6 py-3 text-sm font-medium text-[var(--text)] hover:bg-white"
          >
            Naar homepage
          </Link>
        </div>
      </section>
    );
  }

  // 3) Cloudinary folder guard
  const folder = (album.cloudinaryFolder || "").trim();
  if (!folder) {
    return (
      <section className="py-16">
        <div
          className="rounded-3xl bg-[var(--surface-2)] p-10 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <h1 className="text-2xl font-semibold text-[var(--text)]">{album.title}</h1>
          {album.description && (
            <p className="mx-auto mt-3 max-w-2xl text-[var(--text-soft)]">{album.description}</p>
          )}
          <p className="mt-6 text-sm text-[var(--text-soft)]">
            Dit album heeft nog geen <strong>Cloudinary folder</strong>. Voeg in Sanity bij dit
            album het veld <code>cloudinaryFolder</code> toe (bijv.{" "}
            <code>Portfolio/huisdieren</code>).
          </p>

          <Link
            href="/portfolio"
            className="mt-8 inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
          >
            ← Terug naar portfolio
          </Link>
        </div>
      </section>
    );
  }

  // 4) Images ophalen uit Cloudinary (nu inclusief caption/alt via context)
  const images = await listImagesByFolder(folder, 120);

  return (
    <article>
      {/* Header */}
      <header className="mb-10">
        <Link
          href="/portfolio"
          className="inline-flex items-center text-sm font-medium text-[var(--accent-strong)] hover:text-[var(--accent)]"
        >
          ← Terug naar portfolio
        </Link>

        <h1 className="mt-4 text-3xl font-semibold text-[var(--text)]">{album.title}</h1>

        {album.description && (
          <p className="mt-3 max-w-3xl leading-relaxed text-[var(--text-soft)]">
            {album.description}
          </p>
        )}
      </header>

      {/* Empty state */}
      {images.length === 0 ? (
        <div
          className="rounded-3xl bg-[var(--surface-2)] p-10 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-[var(--text-soft)]">
            Geen foto’s gevonden in Cloudinary folder: <strong>{folder}</strong>
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Check in Cloudinary of de foldernaam exact overeenkomt (hoofdletters / slashes).
          </p>
        </div>
      ) : (
        <>
          {/* ✅ Lightbox gallery (klik = groot) */}
          <LightboxGallery images={images} titleFallback={album.title} />

          {/* Onder info / CTA */}
          <div
            className="mt-12 rounded-3xl bg-[var(--surface-2)] p-10 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <h2 className="text-xl font-semibold text-[var(--text)]">Ook zo’n shoot?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--text-soft)]">
              Stuur me gerust een bericht. Dan plannen we iets dat bij jou past — ontspannen en
              zonder gedoe.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/boek-een-shoot"
                className="inline-flex items-center rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
              >
                Boek een shoot
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/60 px-7 py-3 text-sm font-medium text-[var(--text)] hover:bg-white"
              >
                Bekijk meer albums
              </Link>
            </div>
          </div>
        </>
      )}
    </article>
  );
}
