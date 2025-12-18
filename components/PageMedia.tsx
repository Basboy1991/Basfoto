"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { urlFor } from "@/lib/sanity.image";

type MediaItem = {
  asset: {
    _id: string;
    url: string;
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

export default function PageMedia({ media }: { media: MediaItem[] }) {
  const items = useMemo(() => {
    const clean = media.filter((m) => m?.asset?._id);
    return clean;
  }, [media]);

  // Shuffle 1x per page load (jouw wens: willekeurige volgorde)
  const itemsRef = useRef<MediaItem[] | null>(null);
  if (!itemsRef.current) itemsRef.current = shuffle(items);
  const images = itemsRef.current;

  const fadeMs = 2000;
  const intervalMs = 9500;

  const [current, setCurrent] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [zoomKey, setZoomKey] = useState(0);

  const next = images.length > 0 ? (current + 1) % images.length : 0;

  // Bouw een "performance" URL (Sanity CDN -> auto format = WebP/AVIF)
  const getHeroUrl = (img: MediaItem) =>
    urlFor(img.asset).width(1600).height(1066).fit("crop").auto("format").quality(80).url();

  // Preload next image (met dezelfde parameters als render)
  useEffect(() => {
    if (images.length <= 1) return;
    const preload = new window.Image();
    preload.src = getHeroUrl(images[next]);
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

  if (images.length === 0) return null;

  const currentItem = images[current];
  const nextItem = images[next];

  const currentSrc = getHeroUrl(currentItem);
  const nextSrc = getHeroUrl(nextItem);

  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <Image
        key={`current-${zoomKey}`}
        src={currentSrc}
        alt=""
        fill
        // ✅ LCP: alleen eerste render krijgt priority
        priority={current === 0}
        // ✅ voorkomt layout shift: sizes goed zetten
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover kenburns"
        // ✅ blur placeholder via Sanity lqip
        placeholder={currentItem.asset.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={currentItem.asset.metadata?.lqip}
      />

      {images.length > 1 && (
        <Image
          key={`next-${zoomKey}`}
          src={nextSrc}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover kenburns"
          style={{
            opacity: showNext ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
          placeholder={nextItem.asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={nextItem.asset.metadata?.lqip}
        />
      )}
    </div>
  );
}
