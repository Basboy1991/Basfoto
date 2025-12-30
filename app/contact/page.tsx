// app/contact/page.tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

import { sanityClient } from "@/lib/sanity.client";
import { contactPageQuery, contactPageSeoQuery } from "@/lib/sanity.queries";
import { buildMetadataFromSeo } from "@/lib/seo";
import { siteConfig } from "@/config/site";

import ContactForm from "@/components/ContactForm";

import { Mail, Phone, MessageCircle } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityClient.fetch(contactPageSeoQuery);

  return buildMetadataFromSeo(seo, {
    pathname: "/contact",
    fallbackTitle: "Contact | Bas Fotografie",
    fallbackDescription:
      "Neem contact op voor vragen of het plannen van een fotoshoot in Westland en omgeving.",
  });
}

export default async function ContactPage() {
  const page = await sanityClient.fetch(contactPageQuery);

  const title = page?.title ?? "Contact";
  const intro =
    page?.intro ??
    "Heb je een vraag, wil je sparren over een shoot of alvast een datum prikken? Stuur gerust een bericht.";

  const responseTime =
    siteConfig.contact.responseTime ?? "Meestal reactie dezelfde dag";

  const mailto = `mailto:${siteConfig.contact.email}`;
  const tel = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
  const wa = `https://wa.me/${siteConfig.contact.whatsapp}`;

  return (
    <article className="mx-auto max-w-5xl">
      {/* Header */}
      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h1>
        <p className="mt-3 text-sm italic text-[var(--text-soft)]">{intro}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href="/faq" className="btn btn-secondary px-5 py-2">
            Bekijk veelgestelde vragen
          </Link>

          <Link href="/boek" className="btn btn-primary px-5 py-2">
            Boek een shoot
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-5">
        {/* Links: direct contact */}
        <aside className="md:col-span-2">
          <div
            className="rounded-3xl bg-[var(--surface-2)] p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-semibold text-[var(--text)]">
              Direct contact
            </p>

            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Meestal reactie: <strong>{responseTime}</strong>
            </p>

            {/* 3 uniforme icon buttons (zonder tekst) */}
            <div className="mt-4 flex items-center gap-3">
              <a
                href={mailto}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 transition"
                style={{ border: "1px solid var(--border)" }}
                aria-label="Stuur een e-mail"
                title="E-mail"
              >
                <Mail size={20} color="var(--text)" />
                <span className="sr-only">{siteConfig.contact.email}</span>
              </a>

              <a
                href={tel}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 transition"
                style={{ border: "1px solid var(--border)" }}
                aria-label="Bel"
                title="Telefoon"
              >
                <Phone size={20} color="var(--text)" />
                <span className="sr-only">{siteConfig.contact.phone}</span>
              </a>

              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60 transition"
                style={{ border: "1px solid var(--border)" }}
                aria-label="Chat via WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle size={20} color="var(--text)" />
                <span className="sr-only">WhatsApp</span>
              </a>
            </div>

            {/* Kleine helpertekst */}
            <p className="mt-4 text-xs text-[var(--text-soft)]">
              Tip: voor snelle vragen werkt WhatsApp vaak het snelst.
            </p>
          </div>
        </aside>

        {/* Rechts: form */}
        <section className="md:col-span-3">
          <h2 className="sr-only">{page?.formTitle ?? "Stuur een bericht"}</h2>
          <ContactForm
            successTitle={page?.successTitle}
            successText={page?.successText}
          />
        </section>
      </div>
    </article>
  );
}