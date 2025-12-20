import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";

type CtaData = {
  title: string;
  text?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  email?: string;

  // optioneel: als je later een custom whatsapp bericht wil instellen vanuit Sanity
  whatsappMessage?: string;
};

function cleanPhone(value?: string) {
  if (!value) return "";
  return value.replace(/\s+/g, "").trim();
}

export default function HomeCtaCard({ cta }: { cta: CtaData }) {
  if (!cta?.title) return null;

  const whatsappNumber = cleanPhone(cta.whatsappNumber);
  const phoneNumber = cleanPhone(cta.phoneNumber);
  const email = (cta.email || "").trim();

  const whatsappText = encodeURIComponent(
    cta.whatsappMessage ||
      "Hoi Bas, ik wil graag een shoot boeken in het Westland. Kun je me helpen?"
  );

  // Links
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${whatsappText}`
    : "";

  const phoneHref = phoneNumber ? `tel:${phoneNumber}` : "";
  const mailHref = email ? `mailto:${email}` : "";

  // Primaire CTA: voorkeur WhatsApp, anders mail, anders bellen
  const primary =
    whatsappHref
      ? { label: "Boek via WhatsApp", href: whatsappHref, external: true, icon: <MessageCircle size={18} /> }
      : mailHref
      ? { label: "Stuur een e-mail", href: mailHref, external: false, icon: <Mail size={18} /> }
      : phoneHref
      ? { label: "Bel me", href: phoneHref, external: false, icon: <Phone size={18} /> }
      : null;

  const iconActions = [
    whatsappHref
      ? { label: "WhatsApp", href: whatsappHref, external: true, icon: <MessageCircle size={20} /> }
      : null,
    phoneHref
      ? { label: "Bellen", href: phoneHref, external: false, icon: <Phone size={20} /> }
      : null,
    mailHref
      ? { label: "Mail", href: mailHref, external: false, icon: <Mail size={20} /> }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    external: boolean;
    icon: React.ReactNode;
  }[];

  return (
    <section className="mt-16">
      <div
        className="overflow-hidden rounded-3xl bg-[var(--surface-2)] shadow-[var(--shadow-sm)]"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="px-6 py-10 sm:px-10">
          {/* Headline */}
          <h2 className="text-3xl font-semibold text-[var(--text)]">Boek een shoot</h2>

          {/* Subtext */}
          <p className="mt-3 max-w-2xl text-[var(--text-soft)]">
            {cta.text?.trim()
              ? cta.text
              : "Heb je nog vragen of wil je meteen een afspraak maken? Neem snel contact op."}
          </p>

          {/* Primary CTA */}
          {primary && (
            <div className="mt-7">
              <Link
                href={primary.href}
                target={primary.external ? "_blank" : undefined}
                rel={primary.external ? "noreferrer" : undefined}
                className="
                  inline-flex w-full items-center justify-center gap-2
                  rounded-2xl bg-[var(--accent)] px-6 py-4
                  text-base font-semibold text-white
                  transition hover:bg-[var(--accent-strong)]
                  sm:w-auto
                "
                aria-label={primary.label}
                title={primary.label}
              >
                {primary.icon}
                {primary.label}
              </Link>
            </div>
          )}

          {/* Secondary icon actions (duimvriendelijk) */}
          {iconActions.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-start gap-3">
              {iconActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  target={a.external ? "_blank" : undefined}
                  rel={a.external ? "noreferrer" : undefined}
                  aria-label={a.label}
                  title={a.label}
                  className="
                    inline-flex h-14 w-14 items-center justify-center
                    rounded-2xl bg-white/70
                    transition hover:bg-white
                  "
                  style={{ border: "1px solid var(--border)" }}
                >
                  {a.icon}
                </Link>
              ))}

              {/* mini trust line (subtiel) */}
              <p className="ml-1 text-sm text-[var(--text-soft)]">
                Antwoord meestal dezelfde dag.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}