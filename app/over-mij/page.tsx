export const dynamic = "force-dynamic";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import PageMedia from "@/components/PageMedia";
import { notFound } from "next/navigation";

export default async function OverMijPage() {
  const page = await sanityClient.fetch(pageBySlugQuery, {
    slug: "over-mij",
  });

  // ✅ echte 404 wanneer pagina niet bestaat
  if (!page) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl">
      {/* Media / slideshow */}
      {page.media && page.media.length > 0 && (
        <div className="mb-10">
          <PageMedia media={page.media} />
        </div>
      )}

      {/* Titel (SEO, maar visueel ook logisch) */}
      <h1 className="text-3xl font-semibold text-[var(--text)]">
        {page.title}
      </h1>

      {/* Intro (zichtbaar, niet SEO) */}
      {page.intro && (
        <p className="mt-4 text-lg leading-relaxed text-[var(--text-soft)]">
          {page.intro}
        </p>
      )}

      {/* Content */}
      {page.content && (
        <div className="prose prose-zinc mt-8 max-w-none">
          <PortableText
            value={page.content}
            components={portableTextComponents}
          />
        </div>
      )}
    </article>
  );
}