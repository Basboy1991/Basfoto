import type { Metadata } from "next";
import "./globals.css";

import { siteConfig } from "@/config/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.primaryKeyword}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

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
        {/* Wrapper houdt footer onderaan */}
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          {/* Main groeit mee */}
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">
            {children}
          </main>

          <SiteFooter />
        </div>
      </body>
    </html>
  );
}