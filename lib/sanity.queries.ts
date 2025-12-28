// lib/sanity.queries.ts

/* =========================
   HOME
========================= */

export const homePageQuery = /* groq */ `
  *[_type == "homePage"][0]{
    hero{
      layout,
      headline,
      subline,
      primaryCta{label, href},
      secondaryCta{label, href},
      media[]{
        asset,
        crop,
        hotspot,
        "lqip": asset->metadata.lqip
      }
    },
    intro,
    portfolioCards[]{
      title,
      text,
      featured,
      buttonLabel,
      href,
      coverImage{
        asset,
        crop,
        hotspot,
        "lqip": asset->metadata.lqip
      }
    },
    reviews[]{
      quote,
      name,
      location,
      stars
    },
    cta{
      title,
      text,
      whatsappNumber,
      phoneNumber,
      email
    }
  }
`;

export const homePageSeoQuery = /* groq */ `
  *[_type == "homePage"][0]{
    seoTitle,
    seoDescription,
    seoImage,
    noIndex
  }
`;

/* =========================
   PORTFOLIO ITEMS
========================= */

export const portfolioListQuery = /* groq */ `
  *[_type == "portfolioItem"] | order(featured desc, _createdAt desc){
    title,
    "slug": slug.current,
    category,
    featured,
    excerpt,
    coverImage{
      asset,
      crop,
      hotspot,
      "lqip": asset->metadata.lqip
    }
  }
`;

export const portfolioBySlugQuery = /* groq */ `
  *[_type == "portfolioItem" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    category,
    featured,
    excerpt,
    body,
    coverImage{
      asset,
      crop,
      hotspot,
      "lqip": asset->metadata.lqip
    },
    gallery[]{
      asset,
      crop,
      hotspot,
      "lqip": asset->metadata.lqip
    }
  }
`;

/* =========================
   ALBUMS
========================= */

export const albumsQuery = /* groq */ `
  *[_type == "album" && defined(slug.current)] | order(_createdAt desc){
    title,
    "slug": slug.current,
    description,
    cloudinaryFolder,
    coverPublicId,
    coverImage{
      asset->{
        _id,
        url,
        metadata{
          lqip,
          dimensions{
            width,
            height,
            aspectRatio
          }
        }
      }
    }
  }
`;

export const albumListQuery = /* groq */ `
  *[_type == "album"] | order(_createdAt desc){
    title,
    "slug": slug.current,
    description,
    cloudinaryFolder,
    coverPublicId
  }
`;

export const albumBySlugQuery = /* groq */ `
  *[_type == "album" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    description,
    cloudinaryFolder,
    coverPublicId
  }
`;

/* =========================
   GENERIC SITE PAGES
========================= */

export const pageBySlugQuery = /* groq */ `
  *[_type == "sitePage" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    intro,
    content,
    media[]{
      asset->{
        _id,
        url,
        metadata{
          lqip,
          dimensions{
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    seoTitle,
    seoDescription,
    seoImage,
    canonicalUrl,
    noIndex
  }
`;

export const sitePageSeoQuery = /* groq */ `
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
   PACKAGES
========================= */

export const packagesQuery = /* groq */ `
  *[_type == "package"] | order(featured desc, order asc, _createdAt desc){
    title,
    subtitle,
    price,
    duration,
    deliverables,
    highlights,
    featured,
    note,
    ctaLabel,
    ctaHref
  }
`;

export const packagesPageIntroQuery = /* groq */ `
  *[_type == "sitePage" && slug.current == "pakketten"][0]{
    title,
    intro
  }
`;

/* =========================
   AVAILABILITY / BOEKEN
========================= */

export const availabilitySettingsQuery = /* groq */ `
  *[_type == "availabilitySettings"][0]{
    title,
    timezone,
    slotMinutes,
    advanceDays,
    defaultClosed,
    defaultStartTimes,
    openRanges[]{
      label,
      from,
      to,
      days,
      useDefaultTimes,
      startTimes
    },
    exceptions[]{
      date,
      closed,
      startTimes,
      note
    },
    blockedSlots[]{
      date,
      startTime,
      reason
    }
  }
`;

export const bookingRequestsForRangeQuery = /* groq */ `
  *[
    _type == "bookingRequest" &&
    date >= $from && date <= $to &&
    status != "cancelled"
  ]{
    _id,
    date,
    time,
    status
  }
`;