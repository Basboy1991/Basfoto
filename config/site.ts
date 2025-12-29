// config/site.ts

export type NavItem = {
  label: string;
  href: string;
  /** Optioneel: laat dit item niet in header nav zien (bijv. als je een aparte CTA-knop hebt) */
  hidden?: boolean;
};

export type SocialItem = {
  label: string;
  href: string;
  type: "instagram" | "facebook" | "whatsapp" | "tiktok" | "linkedin";
};

export const siteConfig = {
  /* =========================
     BASIS
     ========================= */
  name: "Bas-fotografie",
  tagline: "Warme fotografie voor gezinnen & huisdieren in het Westland",
  primaryKeyword: "Fotograaf Westland",
  description:
    "Bas-fotografie is jouw fotograaf in het Westland voor gezinsfoto’s en huisdieren. Persoonlijk, rustig en met oog voor echte momenten.",

  /**
   * Basis URL (voor sitemap, canonical, robots)
   * ✅ Voor nu je Vercel URL, later je eigen domein.
   */
  url: "https://basfoto.vercel.app",

  /* =========================
     NAVIGATIE
     ========================= */
  nav: [
    { label: "Home", href: "/" },
    { label: "Over mij", href: "/over-mij" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pakketten", href: "/pakketten" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },

    /**
     * ✅ CTA route blijft bestaan als pad, maar wordt meestal als knop gerenderd.
     * Zet hidden: true zodat je niet dubbel in het menu krijgt.
     * (Header kan dit gebruiken: siteConfig.nav.filter(i => !i.hidden))
     */
    { label: "Boek een shoot", href: "/boek", hidden: true },
  ] satisfies NavItem[],

  /** Header CTA (los van nav) */
  cta: {
    label: "Boek een shoot",
    href: "/boek",
  },

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
  ] satisfies SocialItem[],

  /* =========================
     CONTACT INFO (voor CTA / footer)
     ========================= */
  contact: {
    email: "Basvanderscheer@gmail.com",
    phone: "06-44733404",
    whatsapp: "31644733404",
    responseTime: "Meestal reactie dezelfde dag",
    region: "Westland en omgeving (ca. 10 km)",
  },

  /* =========================
     SEO DEFAULTS
     ========================= */
  seo: {
    locale: "nl_NL",
    type: "website" as const,

    /**
     * Optioneel: default OG image pad (als je later een vaste og-image hebt)
     * Bijvoorbeeld: "/og.jpg"
     */
    defaultOgImagePath: undefined as string | undefined,
  },

  /* =========================
     TECH / ANALYTICS
     ========================= */
  analytics: {
    gaId: "G-ZTKBMGXLDK",
  },
} as const;

/** Handige helper: base url zonder trailing slash */
export const siteBaseUrl = siteConfig.url.replace(/\/$/, "");

/** Handige helper: nav items die je wél wilt tonen in menu */
export const visibleNav = siteConfig.nav.filter((i) => !i.hidden);