import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Inter, Playfair_Display } from "next/font/google";

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

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.primaryKeyword}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased`}
      >
        <header className="border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link
              href="/"
              className="font-semibold tracking-tight text-[var(--text)] hover:opacity-90"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {siteConfig.name}
            </Link>

            <nav className="hidden gap-6 md:flex">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[var(--text-soft)] hover:text-[var(--text)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        <footer className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[var(--text-soft)]">
            <p className="font-medium text-[var(--text)]">{siteConfig.tagline}</p>
            <p className="mt-2">
              © {new Date().getFullYear()} {siteConfig.name}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
