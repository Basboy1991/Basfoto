export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { buildMetadataFromSeo } from "@/lib/seo";

import PageMedia from "@/components/PageMedia";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

import ContactForm from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityClient.fetch(pageBySlugQuery, { slug: "contact" });

  return buildMetadataFromSeo(page, {
    pathname: "/contact",
    fallbackTitle: "Contact | Bas Fotografie",
    fallbackDescription:
      "Neem contact op met Bas Fotografie voor gezins- en huisdierfotografie in Westland en omgeving.",
  });
}

export default async function ContactPage() {
  const page = await sanityClient.fetch(pageBySlugQuery, { slug: "contact" });
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      {page.media?.length ? (
        <div className="mb-8">
          <PageMedia media={page.media} />
        </div>
      ) : null}

      {page.intro ? (
        <p className="text-[13px] italic tracking-wide text-[var(--text-soft)]/80">
          {page.intro}
        </p>
      ) : null}

      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text)]">
        {page.title}
      </h1>

      {page.content?.length ? (
        <div className="prose prose-zinc mt-8 max-w-none">
          <PortableText value={page.content} components={portableTextComponents} />
        </div>
      ) : null}

      {/* Form */}
      <div className="mt-10">
        <ContactForm />
      </div>
    </article>
  );
}