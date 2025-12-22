import Link from "next/link";
import { siteConfig } from "@/config/site";

type SocialType = "instagram" | "facebook" | "mail" | "phone" | "whatsapp";

function SocialIcon({ type }: { type: SocialType | string }) {
  // Simpel & dependency-free (geen extra packages nodig)
  switch (type) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.6-2.15a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
          />
        </svg>
      );

    case "facebook":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3H10v8h3.5Z"
          />
        </svg>
      );

    case "mail":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z"
          />
        </svg>
      );

    case "phone":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2a1.5 1.5 0 0 1 1.6-.3c1 .4 2 .6 3.1.7a1.5 1.5 0 0 1 1.4 1.5V20a2 2 0 0 1-2 2C10.8 22 2 13.2 2 2a2 2 0 0 1 2-2h3.3A1.5 1.5 0 0 1 8.8 1.4c.1 1.1.3 2.1.7 3.1.2.6.1 1.2-.3 1.6l-2 2Z"
          />
        </svg>
      );

    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.04 2C6.56 2 2.1 6.35 2.1 11.72c0 1.93.58 3.81 1.68 5.42L2 22l5.05-1.67a10.3 10.3 0 0 0 4.99 1.26c5.48 0 9.94-4.35 9.94-9.72C21.98 6.35 17.52 2 12.04 2Zm0 17.8c-1.6 0-3.17-.41-4.55-1.18l-.33-.19-2.99.99.99-2.85-.21-.34a7.86 7.86 0 0 1-1.26-4.32c0-4.35 3.62-7.89 8.35-7.89 4.73 0 8.35 3.54 8.35 7.89 0 4.35-3.62 7.89-8.35 7.89Zm4.74-5.9c-.26-.13-1.52-.73-1.75-.82-.23-.09-.4-.13-.57.13-.17.26-.65.82-.8.99-.15.17-.29.19-.55.06-.26-.13-1.08-.39-2.06-1.25-.76-.65-1.27-1.45-1.42-1.71-.15-.26-.02-.4.11-.53.11-.11.26-.28.38-.41.13-.13.17-.21.26-.34.09-.13.04-.26-.02-.39-.06-.13-.57-1.35-.78-1.85-.2-.48-.4-.41-.57-.41h-.49c-.17 0-.44.06-.67.32-.23.26-.88.86-.88 2.1s.9 2.44 1.03 2.6c.13.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.44.52.6.19 1.15.16 1.58.1.48-.07 1.52-.61 1.74-1.2.21-.58.21-1.08.15-1.2-.06-.11-.23-.17-.49-.3Z"
          />
        </svg>
      );

    default:
      return <span className="text-sm">↗</span>;
  }
}

function SocialButton({
  href,
  label,
  type,
}: {
  href: string;
  label: string;
  type: string;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/65 text-[var(--text)] shadow-[var(--shadow-sm)] transition hover:bg-white"
      style={{ border: "1px solid var(--border)" }}
    >
      <SocialIcon type={type as SocialType} />
    </a>
  );
}

export default function SiteFooter() {
  const nav = siteConfig.nav ?? [];
  const socials = siteConfig.socials ?? [];
  const contact = siteConfig.contact ?? {};

  // ✅ Mobiel: alleen 3 kernlinks (rustig) — let op: jouw boek pagina is /boek
  const mobileLinks = nav.filter((i) => ["/", "/portfolio", "/boek"].includes(i.href));

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--accent-soft)]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* =========================
            MOBILE (compact premium)
           ========================= */}
        <div className="md:hidden">
          {/* Brand + socials */}
          <div className="text-center">
            <p
              className="text-lg font-semibold text-[var(--text)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {siteConfig.name}
            </p>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-soft)]">
              {siteConfig.tagline}
            </p>

            {socials.length ? (
              <div className="mt-5 flex items-center justify-center gap-3">
                {socials.map((s: any) => (
                  <SocialButton key={s.type} href={s.href} label={s.label} type={s.type} />
                ))}
              </div>
            ) : null}
          </div>

          {/* Compact links row */}
          {mobileLinks.length ? (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {mobileLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full bg-white/65 px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-white"
                  style={{ border: "1px solid var(--border)" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}

          {/* Contact mini */}
          <div
            className="mt-10 rounded-3xl bg-white/55 p-6 text-center"
            style={{ border: "1px solid var(--border)" }}
          >
            <p className="text-sm font-semibold text-[var(--text)]">Contact</p>

            <div className="mt-3 space-y-2 text-sm text-[var(--text-soft)]">
              {contact.email ? (
                <p>
                  <a
                    className="transition hover:text-[var(--text)]"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                </p>
              ) : null}

              {contact.phone ? <p>{contact.phone}</p> : null}

              {contact.responseTime ? (
                <p className="pt-1 text-xs text-[var(--text-soft)]">{contact.responseTime}</p>
              ) : null}
            </div>
          </div>

          <div
            className="mt-10 border-t pt-6 text-center text-xs text-[var(--text-soft)]"
            style={{ borderColor: "var(--border)" }}
          >
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. Alle rechten voorbehouden.
            </p>
          </div>
        </div>

        {/* =========================
            DESKTOP (3 kolommen)
           ========================= */}
        <div className="hidden md:block">
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

              {socials.length ? (
                <div className="mt-5 flex items-center gap-3">
                  {socials.map((s: any) => (
                    <SocialButton key={s.type} href={s.href} label={s.label} type={s.type} />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Snelle links */}
            <div>
              <p className="text-sm font-semibold tracking-wide text-[var(--text)]">Snelle links</p>
              <ul className="mt-4 space-y-2 text-sm">
                {nav.map((item) => (
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
                {contact.email ? (
                  <p>
                    <a
                      className="transition hover:text-[var(--text)]"
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </a>
                  </p>
                ) : null}

                {contact.phone ? <p>{contact.phone}</p> : null}

                {contact.responseTime ? (
                  <p className="pt-2 text-xs text-[var(--text-soft)]">{contact.responseTime}</p>
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
      </div>
    </footer>
  );
}