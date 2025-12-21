export const dynamic = "force-dynamic";

import Link from "next/link";
import { sanityClient } from "@/lib/sanity.client";
import { packagesQuery, homePageQuery } from "@/lib/sanity.queries";
import PackagesGrid from "@/components/PackagesGrid";
import HomeCtaCard from "@/components/HomeCtaCard";

export const revalidate = 60;

type PackageCard = {
  title: string;
  subtitle?: string;
  price: string;
  duration?: string;
  deliverables?: string;
  highlights?: string[];
  featured?: boolean;
  note?: string;
  ctaLabel?: string;
  ctaHref: string;
};

type HomeData = {
  cta?: {
    title: string;
    text?: string;
    whatsappNumber?: string;
    phoneNumber?: string;
    email?: string;
  };
};

export default async function PackagesPage() {
  const [items, home] = await Promise.all([
    sanityClient.fetch(packagesQuery) as Promise<PackageCard[]>,
    sanityClient.fetch(homePageQuery) as Promise<HomeData>,
  ]);

  return (
    <>
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-[var(--text)]">Pakketten</h1>
        <p className="mx-auto mt-3 max-w-2xl text-[var(--text-soft)]">
          Duidelijke opties, zonder gedoe. Kies wat bij je past, ik help je graag als je twijfelt.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/portfolio"
            className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/60 px-6 py-3 text-sm font-medium text-[var(--text)] hover:bg-white"
          >
            Bekijk portfolio
          </Link>
          <Link
            href="/boek"
            className="inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Boek een shoot
          </Link>
        </div>
      </header>

      {!items?.length ? (
        <div
          className="mt-12 rounded-3xl bg-[var(--surface-2)] p-10 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-[var(--text-soft)]">Nog geen pakketten gevonden.</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            Voeg pakketten toe in Sanity (type: <code>package</code>).
          </p>
        </div>
      ) : (
        <PackagesGrid items={items} />
      )}

      {/* Extra trust / premium reassurance */}
      <section
        className="mt-14 rounded-3xl bg-[var(--surface-2)] p-10 text-center"
        style={{ border: "1px solid var(--border)" }}
      >
        <h2 className="text-xl font-semibold text-[var(--text)]">Wat je altijd kunt verwachten</h2>
        <p className="mx-auto mt-3 max-w-3xl text-[var(--text-soft)]">
          Rustige shoot, heldere begeleiding en foto’s die echt voelen. Geen stijve poses maar wel
          een fijne ervaring.
        </p>

        <div className="mx-auto mt-7 grid max-w-4xl gap-4 md:grid-cols-3">
          <div
            className="rounded-2xl bg-white/60 p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-medium text-[var(--text)]">Relaxed</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Zonder druk, op jouw tempo.</p>
          </div>
          <div
            className="rounded-2xl bg-white/60 p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-medium text-[var(--text)]">Oog voor detail</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Licht, timing en echte momenten.</p>
          </div>
          <div
            className="rounded-2xl bg-white/60 p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-medium text-[var(--text)]">Snel contact</p>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Meestal reactie dezelfde dag.</p>
          </div>
        </div>
      </section>

      {/* CTA uit Sanity (home.cta) */}
      {home?.cta?.title ? <HomeCtaCard cta={home.cta} /> : null}
    </>
  );
}
