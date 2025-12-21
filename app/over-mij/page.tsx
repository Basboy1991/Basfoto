export const dynamic = "force-dynamic";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import PageMedia from "@/components/PageMedia";
import { notFound } from "next/navigation";

export default async function OverMijPage() {
  const page = await sanityClient.fetch(pageBySlugQuery, { slug: "over-mij" });

  // ✅ echte 404 wanneer pagina niet bestaat
  if (!page) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl">
      {/* Media / slideshow */}
      {page.media?.length > 0 && (
        <div
          className="mb-10 overflow-hidden rounded-3xl bg-[var(--surface)] shadow-[var(--shadow-md)]"
          style={{ border: "1px solid var(--border)" }}
        >
          <PageMedia media={page.media} />
        </div>
      )}

      {/* Eyebrow (subtitel) */}
      <p className="text-sm italic tracking-wide text-[var(--text-soft)]">
        Wie is de fotograaf?
      </p>

      {/* Titel */}
      <h1
        className="mt-3 text-3xl font-semibold leading-tight text-[var(--text)] md:text-4xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        {page.title}
      </h1>

      {/* Intro (lead) */}
      {page.intro && (
        <p className="mt-5 text-[17px] leading-relaxed text-[var(--text-soft)] md:text-lg">
          {page.intro}
        </p>
      )}

      {/* Zachte divider */}
      <div
        className="my-8 h-px w-full"
        style={{ background: "var(--border)" }}
      />

      {/* Content */}
      {page.content && (
        <div className="prose prose-zinc max-w-none">
          <PortableText value={page.content} components={portableTextComponents} />
        </div>
      )}
    </article>
  );
}