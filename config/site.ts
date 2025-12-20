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
    { label: "Boek een shoot", href: "/boek" },
  ],

  /* =========================
     SOCIALS (footer + header)
     ========================= */
  socials: [
    {
      label: "Instagram",
      href: "https://instagram.com/",
      type: "instagram",
    },
    {
      label: "Facebook",
      href: "https://facebook.com/",
      type: "facebook",
    },
    // Optioneel later:
    // {
    //   label: "WhatsApp",
    //   href: "https://wa.me/31612345678",
    //   type: "whatsapp",
    // },
  ],

  /* =========================
     CONTACT INFO (voor CTA / footer)
     ========================= */
  contact: {
    email: "Basvanderscheer@gmail.com",
    phone: "06-44733404",
    whatsapp: "31612345678",
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
