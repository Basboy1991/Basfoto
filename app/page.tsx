export const dynamic = "force-dynamic";
import { sanityClient } from "@/lib/sanity.client";
import { pageBySlugQuery } from "@/lib/sanity.queries";
import { PortableText } from "@portabletext/react";

export default async function HomePage() {
  const page = await sanityClient.fetch(pageBySlugQuery, {
    slug: "home",
  });

  return (
    <article className="prose prose-zinc max-w-none">
      <h1 className="sr-only">{page.title}</h1>
      {page?.content && <PortableText value={page.content} />}
    </article>
  );
}
