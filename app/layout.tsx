import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/SiteHeader";
import { Instagram, Facebook, Linkedin, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.primaryKeyword}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

type SocialType = "instagram" | "facebook" | "linkedin" | "website";

function SocialIcon({ type }: { type: SocialType }) {
  const size = 18;
  switch (type) {
    case "instagram":
      return <Instagram size={size} />;
    case "facebook":
      return <Facebook size={size} />;
    case "linkedin":
      return <Linkedin size={size} />;
    case "website":
    default:
      return <Globe size={size} />;
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body
        className="min-h-screen"
        style={{
          background: "var(--bg)",
          color: "var(--text)",
        }}
      >
        {/* Wrapper zodat footer altijd onderaan blijft */}
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          {/* Main groeit mee */}
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">{children}</main>

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
                      {siteConfig.socials.map((s: any) => (
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
                          <SocialIcon type={(s.type as SocialType) ?? "website"} />
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

                    {siteConfig.contact?.phone ? (
                      <p className="text-[var(--text-soft)]">{siteConfig.contact.phone}</p>
                    ) : null}

                    {siteConfig.contact?.responseTime ? (
                      <p className="pt-2 text-xs text-[var(--text-soft)]">
                        {siteConfig.contact.responseTime}
                      </p>
                    ) : (
                      <p className="pt-2 text-xs text-[var(--text-soft)]">
                        Meestal reactie dezelfde dag.
                      </p>
                    )}
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
        </div>
      </body>
    </html>
  );
}
