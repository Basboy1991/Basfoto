// app/faq/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { sanityClient } from "@/lib/sanity.client";
import { faqPageQuery, faqPageSeoQuery } from "@/lib/sanity.queries";
import { buildMetadataFromSeo } from "@/lib/seo";

import FaqAccordionLazy from "@/components/FaqAccordionLazy";

/** PortableText → plain text (voor JSON-LD Answer.text) */
function ptToPlainText(blocks: any[] = []) {
  return blocks
    .map((b) => {
      if (b?._type !== "block") return "";
      return (b.children ?? [])
        .map((c: any) => (c?._type === "span" ? c.text ?? "" : ""))
        .join("");
    })
    .join("\n")
    .replace(/\s+/g, " ")
    .trim();
}

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

  // Geen content in Sanity
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
          className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white/90"
          style={{ background: "var(--accent-strong)" }}
        >
          Stel je vraag via contact
        </Link>
      </section>
    );
  }

  const items = (faq.items ?? []).filter(
    (i: any) => String(i?.question ?? "").trim() && (i?.answer?.length ?? 0) > 0
  );

  // ✅ JSON-LD voor Google rich results
  const faqJsonLd =
    items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((i: any) => ({
            "@type": "Question",
            name: String(i.question).trim(),
            acceptedAnswer: {
              "@type": "Answer",
              text: ptToPlainText(i.answer),
            },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-3xl">
      {/* Structured data */}
      {faqJsonLd ? (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
          {faq.title ?? "Veelgestelde vragen"}
        </h1>

        {faq.intro ? (
          <p className="mt-3 text-sm italic text-[var(--text-soft)]">{faq.intro}</p>
        ) : null}

        <p className="mt-4 text-sm text-[var(--text-soft)]">
          Staat je vraag er niet bij?{" "}
          <Link href="/contact" className="underline underline-offset-4">
            Neem contact op
          </Link>
          .
        </p>
      </header>

      {/* FAQ accordion (lazy loaded) */}
      {items.length ? (
        <FaqAccordionLazy items={items} />
      ) : (
        <p className="mt-6 text-sm text-[var(--text-soft)]">
          Er staan nog geen vragen in de FAQ. Voeg items toe in Sanity.
        </p>
      )}

      {/* CTA card */}
      <div
        className="mt-12 rounded-2xl bg-[var(--surface-2)] p-6 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-sm text-[var(--text-soft)]">Staat je vraag er niet tussen?</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white/90"
            style={{ background: "var(--accent-strong)" }}
          >
            Stel je vraag via contact
          </Link>

          <Link
            href="/boek"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            Boek direct een shoot
          </Link>
        </div>
      </div>
    </article>
  );
}