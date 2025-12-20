import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

function SocialIcon({ type }: { type: "instagram" | "facebook" | "whatsapp" }) {
  if (type === "instagram") return <Instagram size={18} />;
  if (type === "facebook") return <Facebook size={18} />;
  return <MessageCircle size={18} />;
}

export default function Footer() {
  return (
    <footer className="mt-20" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-base font-semibold text-[var(--text)]">{siteConfig.name}</p>
            <p className="mt-2 text-sm text-[var(--text-soft)]">{siteConfig.tagline}</p>
            <p className="mt-4 text-xs text-[var(--text-soft)]">
              Fotograaf Westland — ouders & huisdieren.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Pagina’s</p>
            <div className="mt-3 grid gap-2">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[var(--text-soft)] hover:text-[var(--text)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Volg me</p>

            <div className="mt-3 flex flex-wrap gap-3">
              {siteConfig.socials.map((s) => (
                <Link
                  key={s.type}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60"
                  style={{ border: "1px solid var(--border)" }}
                  aria-label={s.label}
                  title={s.label}
                >
                  <SocialIcon type={s.type} />
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm text-[var(--text-soft)]">Meestal reactie dezelfde dag.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-[var(--text-soft)] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>
            Gemaakt met aandacht • <span className="text-[var(--text)]">Westland</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
