/* =========================
   HOME PAGE
========================= */
export const homePageQuery = `
*[_type == "homePage"][0]{
  hero,
  intro,
  portfolioCards,
  reviews,
  cta
}
`;

export const homePageSeoQuery = `
*[_type == "homePage"][0]{
  seoTitle,
  seoDescription,
  seoImage,
  canonicalUrl,
  noIndex
}
`;

/* =========================
   SITE PAGES
========================= */
export const sitePageBySlugQuery = `
*[_type == "sitePage" && slug.current == $slug][0]{
  title,
  slug,
  intro,
  content,
  media
}
`;

export const sitePageSeoQuery = `
*[_type == "sitePage" && slug.current == $slug][0]{
  title,
  seoTitle,
  seoDescription,
  seoImage,
  canonicalUrl,
  noIndex
}
`;

/* =========================
   PACKAGES (voorbeeld)
========================= */
export const packagesQuery = `
*[_type == "packageType"] | order(order asc){
  title,
  price,
  description,
  features
}
`;