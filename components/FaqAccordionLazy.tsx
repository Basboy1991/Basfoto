"use client";

import dynamic from "next/dynamic";

type Item = {
  _key?: string;
  question?: string;
  answer?: any[];
};

function Skeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/60 p-5"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="h-4 w-3/4 rounded bg-black/10" />
          <div className="mt-3 h-3 w-1/2 rounded bg-black/5" />
        </div>
      ))}
    </div>
  );
}

const FaqAccordion = dynamic(() => import("@/components/FaqAccordion"), {
  ssr: false,
  loading: () => <Skeleton />,
});

export default function FaqAccordionLazy({ items }: { items: Item[] }) {
  return <FaqAccordion items={items} />;
}