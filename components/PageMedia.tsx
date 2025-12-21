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

  // ✅ Mobiel detectie (voor andere crop + sizes)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const next = images.length > 0 ? (current + 1) % images.length : 0;

  /**
   * ✅ Strakkere (maar minder “afsnijdende”) hero crop:
   * - Mobiel: 4:5-ish (1200x1500) → laat meer “body” zien bij portretten
   * - Desktop: 16:10-ish (1800x1125) → editorial widescreen
   */
  const getHeroUrl = (img: MediaItem) => {
    const w = isMobile ? 1200 : 1800;
    const h = isMobile ? 1500 : 1125;

    return urlFor(img.asset)
      .width(w)
      .height(h)
      .fit("crop")
      .auto("format")
      .quality(80)
      .url();
  };

  // Preload volgende slide
  useEffect(() => {
    if (images.length <= 1) return;
    const preload = new window.Image();
    preload.src = getHeroUrl(images[next]);
  }, [images, next, isMobile]); // isMobile -> andere crop

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

  // ✅ LCP: alleen eerste render priority als priority=true
  const isPriority = priority ? current === 0 : false;

  // ✅ sizes: mobiel full width, desktop vaak half (in split layout)
  const sizes = "(max-width: 1024px) 100vw, 50vw";

  return (
    <div
      className="
        relative w-full overflow-hidden
        h-[320px] sm:h-[420px] md:h-[520px]
      "
    >
      <Image
        key={`current-${zoomKey}`}
        src={currentSrc}
        alt=""
        fill
        priority={isPriority}
        sizes={sizes}
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
          sizes={sizes}
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