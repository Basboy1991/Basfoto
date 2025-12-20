import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";

type CtaData = {
  title: string;
  text?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  email?: string;
};

function clean(value?: string) {
  return value?.replace(/\s+/g, "").trim() || "";
}

export default function HomeCtaCard({ cta }: { cta: CtaData }) {
  if (!cta?.title) return null;

  const email = clean(cta.email);
  const phone = clean(cta.phoneNumber);
  const whatsapp = clean(cta.whatsappNumber);

  const mailHref = email ? `mailto:${email}` : "";
  const phoneHref = phone ? `tel:${phone}` : "";
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        "Hoi Bas, ik wil graag een shoot boeken."
      )}`
    : "";

  return (
    <section className="mt-20">
      <div
        className="mx-auto max-w-3xl rounded-3xl bg-[var(--surface-2)] px-6 py-12 text-center shadow-[var(--shadow-sm)] sm:px-10"
        style={{ border: "1px solid var(--border)" }}
      >
        {/* Titel */}
        <h2 className="text-3xl font-semibold text-[var(--text)]">
          {cta.title}
        </h2>

        {/* Tekst */}
        {cta.text && (
          <p className="mx-auto mt-4 max-w-xl text-[var(--text-soft)]">
            {cta.text}
          </p>
        )}

        {/* Primaire CTA – MAIL */}
        {mailHref && (
          <div className="mt-8">
            <Link
              href={mailHref}
              className="
                inline-flex w-full items-center justify-center gap-2
                rounded-2xl bg-[var(--accent)] px-8 py-4
                text-base font-semibold text-white
                transition hover:bg-[var(--accent-strong)]
                sm:w-auto
              "
            >
              <Mail size={18} />
              Stuur een e-mail
            </Link>
          </div>
        )}

        {/* Secundaire knoppen */}
        <div className="mt-5 flex justify-center gap-3">
          {whatsappHref && (
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="
                inline-flex h-14 w-14 items-center justify-center
                rounded-2xl bg-white/70
                transition hover:bg-white
              "
              style={{ border: "1px solid var(--border)" }}
            >
              <MessageCircle size={22} />
            </Link>
          )}

          {phoneHref && (
            <Link
              href={phoneHref}
              aria-label="Bellen"
              className="
                inline-flex h-14 w-14 items-center justify-center
                rounded-2xl bg-white/70
                transition hover:bg-white
              "
              style={{ border: "1px solid var(--border)" }}
            >
              <Phone size={22} />
            </Link>
          )}
        </div>

        {/* Trust text */}
        <p className="mt-4 text-sm text-[var(--text-soft)]">
          Meestal reactie dezelfde dag
        </p>
      </div>
    </section>
  );
}