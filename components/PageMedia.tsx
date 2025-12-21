"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { urlFor } from "@/lib/sanity.image";

type MediaItem = {
  asset: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
};

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PageMedia({
  media,
  priority = false,
  className = "",
}: {
  media: MediaItem[];
  priority?: boolean;
  className?: string;
}) {
  // Support zowel asset._id (groq asset->{_id,url}) als asset._ref (sanity image ref)
  const items = useMemo(
    () => (media ?? []).filter((m) => m?.asset?._id || m?.asset?._ref),
    [media]
  );

  // Willekeurige volgorde per pageload (maar stabiel tijdens sessie)
  const itemsRef = useRef<MediaItem[] | null>(null);
  if (!itemsRef.current) itemsRef.current = shuffle(items);
  const images = itemsRef.current;

  const fadeMs = 1800; // net iets sneller/strakker
  const intervalMs = 9000;

  const [current, setCurrent] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [zoomKey, setZoomKey] = useState(0);

  const next = images.length > 0 ? (current + 1) % images.length : 0;

  // URL builder (zachte crop, editorial)
  const getUrl = (img: MediaItem) =>
    urlFor(img.asset)
      .width(1800)
      .height(1125)
      .fit("crop")
      .auto("format")
      .quality(80)
      .url();

  // Preload volgende slide
  useEffect(() => {
    if (images.length <= 1) return;
    const preload = new window.Image();
    preload.src = getUrl(images[next]);
  }, [images, next]);

  // Loop
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setShowNext(true);

      window.setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setShowNext(false);
        setZoomKey((k) => k + 1);
      }, fadeMs);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, fadeMs, intervalMs]);

  if (!images.length) return null;

  const currentItem = images[current];
  const nextItem = images[next];

  const currentSrc = getUrl(currentItem);
  const nextSrc = getUrl(nextItem);

  // Alleen éérste image priority als jij dat vraagt
  const isPriority = priority && current === 0;

  return (
    <div
      className={[
        // ✅ mobiel kleiner, desktop groter
        "relative w-full overflow-hidden rounded-3xl",
        "h-[360px] sm:h-[420px] md:h-[520px]",
        className,
      ].join(" ")}
      style={{
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <Image
        key={`current-${zoomKey}`}
        src={currentSrc}
        alt=""
        fill
        priority={isPriority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover kenburns"
        placeholder={currentItem.asset.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={currentItem.asset.metadata?.lqip}
      />

      {images.length > 1 && (
        <Image
          key={`next-${zoomKey}`}
          src={nextSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover kenburns"
          style={{
            opacity: showNext ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
          placeholder={nextItem.asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={nextItem.asset.metadata?.lqip}
        />
      )}

      {/* zachte “fade naar pagina” onderkant */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[var(--bg)]" />
    </div>
  );
}