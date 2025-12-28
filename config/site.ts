export const siteConfig = {
  /* =========================
     BASIS
     ========================= */
  name: "Bas-fotografie",
  tagline: "Warme fotografie voor gezinnen & huisdieren in het Westland",
  primaryKeyword: "Fotograaf Westland",
  description:
    "Bas-fotografie is jouw fotograaf in het Westland voor gezinsfoto’s en huisdieren. Persoonlijk, rustig en met oog voor echte momenten.",
  url: "https://basfoto.vercel.app",

  /* =========================
     NAVIGATIE
     ========================= */
  nav: [
    { label: "Home", href: "/" },
    { label: "Over mij", href: "/over-mij" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pakketten", href: "/pakketten" },
    { label: "Contact", href: "/contact" },
{ label: "FAQ", href: "/faq" },
  ],

  /* =========================
     SOCIALS (footer + header)
     ========================= */
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/basvdscheer_fotografie?igsh=c2l0ZWh5Mnh1OXoy",
      type: "instagram",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/1JuhXNDpZ9/",
      type: "facebook",
    },
    // Optioneel later:
    // {
    //   label: "WhatsApp",
    //   href: "https://wa.me/31644733404",
    //   type: "whatsapp",
    // },
  ],

  /* =========================
     CONTACT INFO (voor CTA / footer)
     ========================= */
  contact: {
    email: "Basvanderscheer@gmail.com",
    phone: "06-44733404",
    whatsapp: "31644733404",
    responseTime: "Meestal reactie dezelfde dag",
  },

  /* =========================
     SEO DEFAULTS
     ========================= */
  seo: {
    locale: "nl_NL",
    type: "website",
  },
} as const;
