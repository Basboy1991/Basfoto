export const pageBySlugQuery = `
  *[_type == "sitePage" && slug.current == $slug][0]{
    title,
    seoTitle,
    seoDescription,
    content,
    media[]{
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

export const homePageQuery = `
  *[_type == "homePage"] | order(_updatedAt desc)[0]{
    hero{
      layout,
      headline,
      subline,
      supportingLine,
      primaryCta{label, href},
      secondaryCta{label, href},
      media[]{
        asset->{
          _id,
          url,
          metadata{
            lqip,
            dimensions{width,height,aspectRatio}
          }
        }
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
        asset->{
          _id,
          url,
          metadata{
            lqip,
            dimensions{width,height,aspectRatio}
          }
        }
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
    slug,
    category,
    featured,
    excerpt,
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

export const portfolioBySlugQuery = `
  *[_type == "portfolioItem" && slug.current == $slug][0]{
    title,
    slug,
    category,
    featured,
    excerpt,
    body,
    coverImage{
      asset->{
        _id,
        url,
        metadata{
          lqip,
          dimensions{width,height,aspectRatio}
        }
      }
    },
    gallery[]{
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
