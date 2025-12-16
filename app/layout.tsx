import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/config/site";

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
      <body className="min-h-screen bg-white text-zinc-900">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              {siteConfig.name}
            </Link>

            <nav className="hidden gap-6 md:flex">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-zinc-700 hover:text-zinc-900">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600">
            <p className="font-medium text-zinc-800">{siteConfig.tagline}</p>
            <p className="mt-2">© {new Date().getFullYear()} {siteConfig.name}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
