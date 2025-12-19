"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CloudImage } from "@/lib/cloudinary.server";
import { cloudinaryImg } from "@/lib/cloudinary.client";

export default function LightboxGallery({
  images,
  titleFallback,
}: {
  images: CloudImage[];
  titleFallback: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const current = images[index];

  // lock scroll als lightbox open is
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // keyboard controls
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  // preload volgende
  const nextIndex = useMemo(
    () => (images.length ? (index + 1) % images.length : 0),
    [index, images.length]
  );
  useEffect(() => {
    if (!open || images.length <= 1) return;
    const preload = new window.Image();
    preload.src = cloudinaryImg(images[nextIndex].public_id, 2200, 2200);
  }, [open, images, nextIndex]);

  if (!images?.length) return null;

  return (
    <>
      {/* GRID */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.public_id}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group relative overflow-hidden rounded-2xl bg-[var(--surface-2)] shadow-[var(--shadow-sm)] text-left"
            style={{ border: "1px solid var(--border)" }}
            aria-label="Open foto"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={cloudinaryImg(img.public_id, 1400, 1750)}
                alt={img.alt || img.caption || titleFallback}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          </button>
        ))}
      </div>

      {/* LIGHTBOX */}
      {open && current && (
        <div className="fixed inset-0 z-[60]">
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="Sluit lightbox"
          />

          {/* content */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div
              className="w-full max-w-5xl overflow-hidden rounded-3xl bg-[var(--bg)]"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* top bar */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text)]">
                    {current.caption || titleFallback}
                  </p>
                  {current.alt && (
                    <p className="mt-1 truncate text-xs text-[var(--text-soft)]">{current.alt}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                    className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 text-sm font-medium hover:bg-white"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((i) => (i + 1) % images.length)}
                    className="rounded-full border border-[var(--border)] bg-white/60 px-4 py-2 text-sm font-medium hover:bg-white"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-strong)]"
                  >
                    Sluiten
                  </button>
                </div>
              </div>

              {/* image */}
              <div className="relative h-[70vh] w-full bg-black">
                <Image
                  src={cloudinaryImg(current.public_id, 2400, 2400)}
                  alt={current.alt || current.caption || titleFallback}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
