// app/contact/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery, sitePageSeoQuery } from "@/lib/sanity.queries";
import { buildMetadataFromSeo } from "@/lib/seo";

import PageMedia from "@/components/PageMedia";
import ContactForm from "@/components/ContactForm";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityClient.fetch(sitePageSeoQuery, { slug: "contact" });

  return buildMetadataFromSeo(seo, {
    pathname: "/contact",
    fallbackTitle: "Contact | Bas Fotografie",
    fallbackDescription:
      "Neem contact op voor een shoot in Westland en omgeving. Appen, bellen of mailen — ik reageer meestal dezelfde dag.",
  });
}

export default async function ContactPage() {
  const page = await sanityClient.fetch(pageBySlugQuery, { slug: "contact" });
  if (!page) notFound();

  const intro = String(page.intro ?? "").trim();
  const content = page.content ?? [];

  return (
    <article className="mx-auto max-w-4xl">
      {page.media?.length ? (
        <div className="mb-6">
          <PageMedia media={page.media} />
        </div>
      ) : null}

      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)]">
          {page.title ?? "Contact"}
        </h1>

        {intro ? (
          <p className="mx-auto mt-2 max-w-2xl text-sm italic text-[var(--text-soft)]">
            {intro}
          </p>
        ) : null}
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Linker kolom: tekst uit Sanity */}
        <section
          className="rounded-3xl bg-[var(--surface-2)] p-5 md:p-6"
          style={{ border: "1px solid var(--border)" }}
        >
          {content?.length ? (
            <div className="prose prose-zinc max-w-none">
              <PortableText value={content} components={portableTextComponents} />
            </div>
          ) : (
            <p className="text-sm text-[var(--text-soft)]">
              Voeg content toe in Sanity (Site pagina → contact).
            </p>
          )}
        </section>

        {/* Rechter kolom: formulier */}
        <ContactForm />
      </div>
    </article>
  );
}