/* =========================
   HOME
========================= */

export const homePageQuery = `
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
export const homePageSeoQuery = `
*[_type == "homePage"][0]{
  seoTitle,
  seoDescription,
  seoImage,
  noIndex
}
`;
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

/* =========================
   PORTFOLIO
========================= */

export const portfolioListQuery = `
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

export const portfolioBySlugQuery = `
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

export const albumListQuery = `
  *[_type == "album"] | order(_createdAt desc){
    title,
    "slug": slug.current,
    description,
    cloudinaryFolder,
    coverPublicId
  }
`;

export const albumBySlugQuery = `
  *[_type == "album" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    description,
    cloudinaryFolder
  }
`;

export const albumsQuery = `
  *[_type == "album" && defined(slug.current)] | order(_createdAt desc){
    title,
    "slug": slug.current,
    description,
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

/* =========================
   GENERIC SITE PAGES
========================= */

export const pageBySlugQuery = `
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
    }
  }
`;

/* =========================
   PACKAGES
========================= */

export const packagesQuery = `
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

export const packagesPageIntroQuery = `
  *[_type == "sitePage" && slug.current == "pakketten"][0]{
    title,
    intro
  }
`;

/* =========================
   AVAILABILITY / BOEKEN
========================= */

export const availabilitySettingsQuery = `
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