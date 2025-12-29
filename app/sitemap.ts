"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // ✅ voorkom dubbel: items met hidden=true niet tonen in menu (bv. /boek)
  const navItems = useMemo(() => {
    return (siteConfig.nav ?? []).filter((i) => !i.hidden);
  }, []);

  // sluit menu bij navigatie
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock scroll wanneer menu open is
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* LEFT */}
        <Link href="/" className="font-semibold tracking-tight text-[var(--text)]">
          {siteConfig.name}
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--text-soft)] hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}

          {/* Desktop CTA */}
          <Link
            href={siteConfig.cta.href}
            className="ml-2 inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition"
            style={{ background: "var(--accent-strong)" }}
          >
            {siteConfig.cta.label}
          </Link>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl md:hidden"
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid var(--border)",
          }}
        >
          <Menu size={22} color="var(--text)" />
        </button>
      </div>

      {/* MOBILE OVERLAY + DRAWER */}
      {open && (
        <div className="md:hidden">
          {/* overlay */}
          <button
            type="button"
            aria-label="Sluit menu"
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* drawer */}
          <div
            className="fixed right-0 top-0 z-[60] h-full w-[85%] max-w-sm p-5 shadow-xl"
            style={{ background: "var(--bg)", borderLeft: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--text)]">Menu</p>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluit menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid var(--border)",
                }}
              >
                <X size={22} color="var(--text)" />
              </button>
            </div>

            <nav className="mt-6 grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-[var(--text)]"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobiele CTA */}
            <div className="mt-6">
              <Link
                href={siteConfig.cta.href}
                className="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white"
                style={{ background: "var(--accent-strong)" }}
              >
                {siteConfig.cta.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}