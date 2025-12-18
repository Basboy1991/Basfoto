export const pageBySlugQuery = `
  *[_type == "sitePage" && slug.current == $slug][0]{
    title,
    seoTitle,
    seoDescription,
    content,
    media[]{
      asset->{
        _id,
        url
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
      primaryCta{label, href},
      secondaryCta{label, href},
      media[]{asset->{_id,url}}
    },
    intro,
    portfolioCards[]{
      title,
      text,
      featured,
      buttonLabel,
      href,
      coverImage{asset->{_id,url}}
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
