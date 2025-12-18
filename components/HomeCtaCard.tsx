"use client";

import React from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";

type CtaData = {
  title: string;
  text?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  email?: string;
};

export default function HomeCtaCard({ cta }: { cta: CtaData }) {
  if (!cta?.title) return null;

  const whatsappText = encodeURIComponent(
    "Hoi Bas, ik wil graag een shoot boeken in het Westland. Kun je me helpen?"
  );

  const actions = [
    cta.whatsappNumber
      ? {
          label: "WhatsApp",
          href: `https://wa.me/${cta.whatsappNumber}?text=${whatsappText}`,
          icon: <MessageCircle size={18} />,
          external: true,
        }
      : null,
    cta.phoneNumber
      ? {
          label: "Bellen",
          href: `tel:${cta.phoneNumber}`,
          icon: <Phone size={18} />,
          external: false,
        }
      : null,
    cta.email
      ? {
          label: "E-mail",
          href: `mailto:${cta.email}`,
          icon: <Mail size={18} />,
          external: false,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: React.ReactNode;
    external: boolean;
  }[];

  return (
    <section className="mt-16">
      <div className="rounded-2xl border bg-white p-10 shadow-sm">
        <h2 className="text-2xl font-semibold">{cta.title}</h2>

        {cta.text && <p className="mt-3 max-w-2xl text-zinc-700">{cta.text}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target={a.external ? "_blank" : undefined}
              rel={a.external ? "noreferrer" : undefined}
              aria-label={a.label}
              title={a.label}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border transition hover:bg-zinc-50"
            >
              {a.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
