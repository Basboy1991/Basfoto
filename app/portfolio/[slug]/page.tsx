import Image from "next/image";
import { sanityClient } from "@/lib/sanity.client";
import { albumBySlugQuery } from "@/lib/sanity.queries";
import { cloudinaryImg, listImagesByFolder } from "@/lib/cloudinary";

export const revalidate = 60;

type ParamsShape = { slug?: string };

function isPromise<T>(v: any): v is Promise<T> {
  return v && typeof v.then === "function";
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<ParamsShape> | ParamsShape;
}) {
  // ✅ Next.js 16: params kan een Promise zijn → unwrap veilig
  const p = isPromise<ParamsShape>(params) ? await params : params;

  const slug = typeof p?.slug === "string" ? p.slug : "";

  if (!slug) {
    return (
      <div className="py-16">
        <h1 className="text-2xl font-semibold">Slug ontbreekt</h1>
        <p className="mt-2 text-zinc-600">
          Deze pagina verwacht een URL zoals <code>/portfolio/huisdieren</code>.
        </p>
      </div>
    );
  }

  const album = await sanityClient.fetch(albumBySlugQuery, { slug });

  if (!album) {
    return (
      <div className="py-16">
        <h1 className="text-2xl font-semibold">Album niet gevonden</h1>
        <p className="mt-2 text-zinc-600">
          Gezochte slug: <strong>{slug}</strong>
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Check in Sanity Studio: is het album gepubliceerd en is de slug exact hetzelfde?
        </p>
      </div>
    );
  }

  const images = await listImagesByFolder(album.cloudinaryFolder, 120);

  return (
    <article>
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-[var(--text)]">{album.title}</h1>
        {album.description && (
          <p className="mt-3 max-w-2xl text-[var(--text-soft)]">{album.description}</p>
        )}
      </header>

      {images.length === 0 ? (
        <p className="text-[var(--text-soft)]">
          Geen foto’s gevonden in Cloudinary folder: <strong>{album.cloudinaryFolder}</strong>
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((img: any, idx: number) => (
            <div key={img.public_id} className="overflow-hidden rounded-2xl bg-[var(--surface-2)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={cloudinaryImg(img.public_id, 1200, 1500)}
                  alt={album.title}
                  fill
                  priority={idx < 2}
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-[900ms] ease-out hover:scale-[1.02]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
