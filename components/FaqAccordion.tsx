"use client";

import { useMemo, useState } from "react";

type Item = {
  _key?: string;
  question?: string;
  answer?: any[]; // PortableText blocks
};
"use client";

import { useMemo, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableTextComponents";

type FaqItem = {
  _key?: string;
  question?: string;
  answer?: any[];
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const cleaned = useMemo(
    () =>
      (items ?? []).filter(
        (i) => String(i?.question ?? "").trim() && (i?.answer?.length ?? 0) > 0
      ),
    [items]
  );

  const [openKey, setOpenKey] = useState<string | null>(cleaned[0]?._key ?? null);

  if (!cleaned.length) return null;

  return (
    <div className="mt-8 grid gap-3">
      {cleaned.map((item, idx) => {
        const key = item._key ?? String(idx);
        const isOpen = openKey === key;

        return (
          <AccordionRow
            key={key}
            isOpen={isOpen}
            onToggle={() => setOpenKey(isOpen ? null : key)}
            title={String(item.question ?? "").trim()}
            answer={item.answer ?? []}
          />
        );
      })}
    </div>
  );
}

function AccordionRow({
  isOpen,
  onToggle,
  title,
  answer,
}: {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  answer: any[];
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  // animatie: maxHeight naar scrollHeight wanneer open
  const maxH = isOpen ? contentRef.current?.scrollHeight ?? 9999 : 0;

  return (
    <div
      className="rounded-2xl bg-white/60 p-5"
      style={{ border: "1px solid var(--border)" }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-[var(--text)]">{title}</span>

        <span
          className="select-none text-[var(--text-soft)] transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        style={{
          maxHeight: maxH,
          opacity: isOpen ? 1 : 0,
          transition: "max-height 260ms ease, opacity 200ms ease",
          overflow: "hidden",
        }}
      >
        <div ref={contentRef} className="prose prose-zinc mt-4 max-w-none">
          <PortableText value={answer} components={portableTextComponents} />
        </div>
      </div>
    </div>
  );
}
export default function FaqAccordion({
  items,
  renderAnswer,
}: {
  items: Item[];
  renderAnswer: (value: any[]) => React.ReactNode;
}) {
  const clean = useMemo(
    () =>
      (items ?? []).filter(
        (i) => String(i?.question ?? "").trim() && (i?.answer?.length ?? 0) > 0
      ),
    [items]
  );

  const [openKey, setOpenKey] = useState<string | null>(
    clean?.[0]?._key ?? "0"
  );

  if (!clean.length) return null;

  return (
    <div className="mt-8 grid gap-3">
      {clean.map((item, idx) => {
        const key = item._key ?? String(idx);
        const isOpen = openKey === key;

        return (
          <div
            key={key}
            className="rounded-2xl bg-white/60"
            style={{ border: "1px solid var(--border)" }}
          >
            <button
              type="button"
              onClick={() => setOpenKey((cur) => (cur === key ? null : key))}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-base font-semibold text-[var(--text)]">
                {item.question}
              </span>

              <span
                className="select-none text-[var(--text-soft)] transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>

            {/* animated panel */}
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-0">
                  <div className="prose prose-zinc max-w-none">
                    {renderAnswer(item.answer ?? [])}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}