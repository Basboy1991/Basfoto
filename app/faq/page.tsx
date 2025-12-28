// app/faq/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

import { sanityClient } from "@/lib/sanity.client";
import { faqPageQuery, faqPageSeoQuery } from "@/lib/sanity.queries";
import { buildMetadataFromSeo } from "@/lib/seo";

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityClient.fetch(faqPageSeoQuery);

  return buildMetadataFromSeo(seo, {
    pathname: "/faq",
    fallbackTitle: "FAQ | Bas Fotografie",
    fallbackDescription:
      "Veelgestelde vragen over fotoshoots, voorbereiding, locaties, kleding en levering.",
  });
}

export default async function FaqPage() {
  const faq = await sanityClient.fetch(faqPageQuery);

  // Als er nog niks in Sanity staat:
  if (!faq) {
    return (
      <section className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
          Veelgestelde vragen
        </h1>
        <p className="mt-4 text-[var(--text-soft)]">
          FAQ content ontbreekt nog in Sanity. Voeg een document toe van type{" "}
          <strong>FAQ pagina</strong>.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--accent-strong)" }}
        >
          Stel je vraag via contact
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
        {faq.title ?? "Veelgestelde vragen"}
      </h1>

      {faq.intro ? (
        <p className="mt-3 text-sm italic text-[var(--text-soft)]">
          {faq.intro}
        </p>
      ) : null}

      <div className="mt-8 grid gap-3">
        {(faq.items ?? []).map((item: any, idx: number) => (
          <details
            key={idx}
            className="group rounded-2xl bg-white/60 p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="text-base font-semibold text-[var(--text)]">
                {item.question}
              </span>
              <span className="select-none text-[var(--text-soft)] transition group-open:rotate-180">
                ▼
              </span>
            </summary>

            <div className="prose prose-zinc mt-4 max-w-none">
              <PortableText
                value={item.answer}
                components={portableTextComponents}
              />
            </div>
          </details>
        ))}
      </div>

      <div
        className="mt-10 rounded-2xl bg-[var(--surface-2)] p-6 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm text-[var(--text-soft)]">
          Staat je vraag er niet tussen?
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--accent-strong)" }}
          >
            Neem contact op
          </Link>
          <Link
            href="/boek"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            Boek een shoot
          </Link>
        </div>
      </div>
    </article>
  );
}