export const dynamic = "force-dynamic";
import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import PageMedia from "@/components/PageMedia";

export default async function OverMijPage() {
  const page = await sanityClient.fetch(pageBySlugQuery, {
    slug: "over-mij",
  });

  if (!page) {
    return <p>Pagina niet gevonden.</p>;
  }

  return (
    <article className="max-w-none">
      {/* Afbeelding of slideshow */}
      {page.media && page.media.length > 0 && <PageMedia media={page.media} />}

      {/* Tekst */}
      <div className="prose prose-zinc max-w-none">
        <h1 className="sr-only">{page.title}</h1>

        {page.content && <PortableText value={page.content} components={portableTextComponents} />}
      </div>
    </article>
  );
}
