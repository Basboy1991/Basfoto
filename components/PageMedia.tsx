"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { urlFor } from "@/lib/sanity.image";

type MediaItem = {
  asset: {
    _id?: string; // asset-> projection geeft _id
    _ref?: string; // soms krijg je alleen ref
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
}: {
  media: MediaItem[];
  priority?: boolean;
}) {
  const items = useMemo(
    () => (media ?? []).filter((m) => m?.asset?._ref || m?.asset?._id),
    [media]
  );

  // Willekeurige volgorde per pageload
  const itemsRef = useRef<MediaItem[] | null>(null);
  if (!itemsRef.current) itemsRef.current = shuffle(items);
  const images = itemsRef.current;

  const fadeMs = 2000;
  const intervalMs = 9500;

  const [current, setCurrent] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [zoomKey, setZoomKey] = useState(0);

  if (!images || images.length === 0) return null;

  const next = (current + 1) % images.length;

  const getHeroUrl = (img: MediaItem) =>
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
    const nextItem = images[next];
    if (!nextItem) return;

    const preload = new window.Image();
    preload.src = getHeroUrl(nextItem);
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

  const currentItem = images[current];
  const nextItem = images[next];

  const currentSrc = getHeroUrl(currentItem);
  const nextSrc = getHeroUrl(nextItem);

  // ✅ Alleen priority als de parent dat wil én alleen op de 1e render
  const isPriority = priority && current === 0;

  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <Image
        key={`current-${zoomKey}`}
        src={currentSrc}
        alt=""
        fill
        priority={isPriority}
        sizes="(max-width: 1024px) 100vw, 50vw"
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