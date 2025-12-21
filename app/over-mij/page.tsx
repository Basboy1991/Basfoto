export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";
import PageMedia from "@/components/PageMedia";

type SitePage = {
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  content?: any[];
  media?: any[];
};

export default async function OverMijPage() {
  const page = (await sanityClient.fetch(pageBySlugQuery, {
    slug: "over-mij",
  })) as SitePage | null;

  // ✅ echte 404 (dus ook consistent met /over-jou)
  if (!page) notFound();

  const hasMedia = Array.isArray(page.media) && page.media.length > 0;

  return (
    <article className="mx-auto max-w-6xl">
      <section className="grid items-start gap-10 lg:grid-cols-12">
        {/* MEDIA */}
        <div className="lg:col-span-5">
          {hasMedia ? (
            <div
              className="overflow-hidden rounded-3xl shadow-[var(--shadow-md)]"
              style={{ border: "1px solid var(--border)" }}
            >
              <PageMedia media={page.media!} />
            </div>
          ) : (
            <div
              className="rounded-3xl bg-[var(--accent-soft)] p-10 text-center"
              style={{ border: "1px solid var(--border)" }}
            >
              <p className="text-sm text-[var(--text-soft)]">
                Voeg (optioneel) een afbeelding of slideshow toe in Sanity.
              </p>
            </div>
          )}
        </div>

        {/* TEKST */}
        <div className="lg:col-span-7">
          <header className="text-center lg:text-left">
            {/* zichtbaar H1 (beter dan sr-only) */}
            <h1
              className="text-3xl font-semibold leading-tight text-[var(--text)] md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {page.title}
            </h1>

            {/* gebruikt seoDescription als nette intro (optioneel) */}
            {page.seoDescription ? (
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-soft)] lg:mx-0">
                {page.seoDescription}
              </p>
            ) : null}
          </header>

          <div className="mt-8">
            {page.content?.length ? (
              <div className="prose prose-zinc max-w-none">
                <PortableText value={page.content} components={portableTextComponents} />
              </div>
            ) : (
              <p className="text-[var(--text-soft)]">Nog geen tekst ingevuld.</p>
            )}
          </div>

          {/* subtiele CTA’s onderaan */}
          <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href="/portfolio"
              className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/60 px-6 py-3 text-sm font-medium text-[var(--text)] hover:bg-white"
            >
              Bekijk portfolio →
            </a>
            <a
              href="/boek"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
            >
              Boek een shoot
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}