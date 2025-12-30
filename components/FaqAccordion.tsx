"use client";

import { useMemo, useState } from "react";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

type Item = {
  _key?: string;
  question?: string;
  answer?: any[];
};

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const safeItems = useMemo(
    () =>
      (items ?? []).filter(
        (i) => String(i?.question ?? "").trim() && (i?.answer?.length ?? 0) > 0
      ),
    [items]
  );

  return (
    <div className="grid gap-3">
      {safeItems.map((item, idx) => {
        const open = openIndex === idx;

        return (
          <div
            key={item._key ?? `${idx}-${String(item.question ?? "")}`}
            className="rounded-2xl bg-white/60 p-5"
            style={{ border: "1px solid var(--border)" }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : idx)}
              className="flex w-full items-center justify-between gap-4 text-left rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-black/30"
              aria-expanded={open}
            >
              <span className="text-base font-semibold text-[var(--text)]">
                {item.question}
              </span>
              <span
                className={`select-none text-[var(--text-soft)] transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* smooth open/close */}
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="prose prose-zinc max-w-none">
                  <PortableText value={item.answer} components={portableTextComponents} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}