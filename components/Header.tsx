"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  // scroll lock wanneer menu open is
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{ borderBottom: "1px solid var(--border)", background: "rgba(250,250,248,0.85)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-semibold tracking-tight text-[var(--text)]"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--text-soft)] hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}

          {/* Mini CTA in header (desktop) */}
          <Link
            href="/boek-een-shoot"
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          >
            Boek een shoot
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
  type="button"
  onClick={() => setOpen(true)}
  aria-label="Open menu"
  className="inline-flex h-11 w-11 items-center justify-center rounded-xl md:hidden"
  style={{
    background: "rgba(255,255,255,0.7)",
    border: "1px solid var(--border)",
  }}
>
  <Menu size={22} color="var(--text)" />
</button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Sluit menu"
          />

          {/* panel */}
          <div
            className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-[var(--bg)] shadow-[var(--shadow-md)]"
            style={{ borderLeft: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <p className="text-sm font-semibold text-[var(--text)]">Menu</p>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/60"
                style={{ border: "1px solid var(--border)" }}
                onClick={() => setOpen(false)}
                aria-label="Sluit menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-5 pb-6">
              <div className="grid gap-2">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-white/60 px-4 py-4 text-[var(--text)]"
                    style={{ border: "1px solid var(--border)" }}
                  >
                    <span className="text-base font-semibold">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-[var(--surface-2)] p-5 text-center">
                <p className="text-sm font-semibold text-[var(--text)]">Klaar om te boeken?</p>
                <p className="mt-2 text-sm text-[var(--text-soft)]">
                  Stuur me gerust een bericht — meestal reactie dezelfde dag.
                </p>

                <Link
                  href="/boek"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-6 py-4 text-base font-semibold text-white hover:bg-[var(--accent-strong)]"
                >
                  Boek een shoot
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
