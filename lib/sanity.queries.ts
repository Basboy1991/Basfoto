export const pageBySlugQuery = `
  *[_type == "sitePage" && slug.current == $slug][0]{
    title,
    slug,
    seoTitle,
    seoDescription,

    // ✅ zichtbare intro (nieuw veld)
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
  *[_type == "album" && defined(slug.current)] | order(_createdAt desc) {
    title,
    "slug": slug.current,
    description,
    coverImage{
      asset->{
        _id,
        url,
        metadata{
          lqip,
          dimensions{width,height,aspectRatio}
        }
      }
    }
  }
`;
