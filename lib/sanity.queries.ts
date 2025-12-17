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
