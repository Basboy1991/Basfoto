"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type MediaItem = {
  asset: {
    _id: string;
    url: string;
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
  const urls = useMemo(() => media.map((m) => m.asset?.url).filter(Boolean) as string[], [media]);

  // Shuffle maar 1x per page load
  const shuffledRef = useRef<string[] | null>(null);
  if (!shuffledRef.current) {
    shuffledRef.current = shuffle(urls);
  }
  const images = shuffledRef.current;

  const fadeMs = 2200;
  const intervalMs = 10000; // iets langer zodat de zoom rustig voelt

  const [current, setCurrent] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [zoomKey, setZoomKey] = useState(0); // force re-start animation

  const next = images.length > 0 ? (current + 1) % images.length : 0;

  // Preload volgende afbeelding
  useEffect(() => {
    if (images.length <= 1) return;
    const img = new window.Image();
    img.src = images[next];
  }, [images, next]);

  // Slideshow loop
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = window.setInterval(() => {
      setShowNext(true);

      window.setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setShowNext(false);
        setZoomKey((k) => k + 1); // restart Ken Burns
      }, fadeMs);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, fadeMs, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className="relative mb-10 h-[420px] w-full overflow-hidden rounded-2xl">
      {/* Huidige afbeelding (met Ken Burns) */}
      <Image
        key={`current-${zoomKey}`}
        src={images[current]}
        alt=""
        fill
        priority
        className="object-cover kenburns"
      />

      {/* Volgende afbeelding (crossfade + Ken Burns) */}
      {images.length > 1 && (
        <Image
          key={`next-${zoomKey}`}
          src={images[next]}
          alt=""
          fill
          className="object-cover kenburns"
          style={{
            opacity: showNext ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
        />
      )}
    </div>
  );
}
