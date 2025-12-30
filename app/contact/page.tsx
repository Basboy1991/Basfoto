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

  const telHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${siteConfig.contact.email}`;
  const waHref = `https://wa.me/${siteConfig.contact.whatsapp}`;

  const iconBtn =
    "group inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 transition outline-none focus-visible:ring-2 focus-visible:ring-black/25 hover:bg-white/80";

  return (
    <article className="mx-auto max-w-5xl">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">{title}</h1>
        <p className="mt-3 text-sm italic text-[var(--text-soft)]">{intro}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 font-semibold"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            Bekijk veelgestelde vragen
          </Link>

         <Link
  href="/boek"
  className="inline-flex items-center justify-center rounded-full px-5 py-2 font-semibold text-white/90"
  style={{ background: "var(--accent-strong)" }}
>
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
            <p className="text-sm font-semibold text-[var(--text)]">Direct contact</p>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              Meestal reactie: <strong>{siteConfig.contact.responseTime}</strong>
            </p>

            <div className="mt-4 flex gap-3">
              <a
                href={mailHref}
                className={iconBtn}
                style={{ border: "1px solid var(--border)" }}
                aria-label="Stuur een e-mail"
                title="E-mail"
              >
                <Mail className="h-5 w-5 text-[var(--text)] opacity-90 group-hover:opacity-100" />
              </a>

              <a
                href={telHref}
                className={iconBtn}
                style={{ border: "1px solid var(--border)" }}
                aria-label="Bel"
                title="Bellen"
              >
                <Phone className="h-5 w-5 text-[var(--text)] opacity-90 group-hover:opacity-100" />
              </a>

              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className={iconBtn}
                style={{ border: "1px solid var(--border)" }}
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-[var(--text)] opacity-90 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </aside>

        {/* Rechts: form */}
        <section className="md:col-span-3">
          <h2 className="sr-only">{page?.formTitle ?? "Stuur een bericht"}</h2>
          <ContactForm successTitle={page?.successTitle} successText={page?.successText} />
        </section>
      </div>
    </article>
  );
}