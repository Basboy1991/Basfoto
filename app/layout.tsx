import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Inter, Playfair_Display } from "next/font/google";
import { Instagram, Facebook } from "lucide-react";

/* =========================
   FONTS
   ========================= */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

/* =========================
   METADATA (SEO basis)
   ========================= */
export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.primaryKeyword}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.seo.locale,
    type: siteConfig.seo.type,
  },
};

function SocialIcon({ type }: { type: string }) {
  // lucide-react icons — consistent en premium
  const cls = "h-5 w-5";
  if (type === "instagram") return <Instagram className={cls} />;
  if (type === "facebook") return <Facebook className={cls} />;
  return null;
}

/* =========================
   ROOT LAYOUT
   ========================= */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased`}
      >
        {/* =========================
            HEADER
            ========================= */}
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link
              href="/"
              className="font-semibold tracking-tight text-[var(--text)] hover:opacity-90"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {siteConfig.name}
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[var(--text-soft)] transition-colors hover:text-[var(--text)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobiel menu placeholder (komt later) */}
            <div className="md:hidden">{/* hamburger komt later */}</div>
          </div>
        </header>

        {/* =========================
            MAIN
            ========================= */}
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {/* =========================
            FOOTER (premium salie)
            ========================= */}
        <footer className="border-t border-[var(--border)] bg-[var(--accent-soft)]">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-10 md:grid-cols-3 md:items-start">
              {/* Brand */}
              <div>
                <p
                  className="text-lg font-semibold text-[var(--text)]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {siteConfig.name}
                </p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-soft)]">
                  {siteConfig.tagline}
                </p>

                {/* Socials */}
                {siteConfig.socials?.length ? (
                  <div className="mt-5 flex items-center gap-3">
                    {siteConfig.socials.map((s) => (
                      <a
                        key={s.type}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/65 text-[var(--text)] shadow-[var(--shadow-sm)] transition hover:bg-white"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <SocialIcon type={s.type} />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Snelle links */}
              <div>
                <p className="text-sm font-semibold tracking-wide text-[var(--text)]">
                  Snelle links
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {siteConfig.nav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[var(--text-soft)] transition hover:text-[var(--text)]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <p className="text-sm font-semibold tracking-wide text-[var(--text)]">Contact</p>

                <div className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
                  {siteConfig.contact?.email ? (
                    <p>
                      <a
                        className="transition hover:text-[var(--text)]"
                        href={`mailto:${siteConfig.contact.email}`}
                      >
                        {siteConfig.contact.email}
                      </a>
                    </p>
                  ) : null}

                  {siteConfig.contact?.phone ? <p>{siteConfig.contact.phone}</p> : null}

                  {siteConfig.contact?.responseTime ? (
                    <p className="pt-2 text-xs text-[var(--text-soft)]">
                      {siteConfig.contact.responseTime}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Onderbalk */}
            <div
              className="mt-10 flex flex-col gap-3 border-t pt-6 text-xs text-[var(--text-soft)] md:flex-row md:items-center md:justify-between"
              style={{ borderColor: "var(--border)" }}
            >
              <p>
                © {new Date().getFullYear()} {siteConfig.name}. Alle rechten voorbehouden.
              </p>

              <p className="opacity-80">Fotograaf Westland · Gezinnen · Huisdieren</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
