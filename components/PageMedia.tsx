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

  const imagesRef = useRef<string[] | null>(null);
  if (!imagesRef.current) imagesRef.current = shuffle(urls);
  const images = imagesRef.current;

  const fadeMs = 2200;
  const intervalMs = 10000;

  const [current, setCurrent] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [zoomKey, setZoomKey] = useState(0);

  const next = images.length > 0 ? (current + 1) % images.length : 0;

  useEffect(() => {
    if (images.length <= 1) return;
    const img = new window.Image();
    img.src = images[next];
  }, [images, next]);

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

  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <Image
        key={`current-${zoomKey}`}
        src={images[current]}
        alt=""
        fill
        priority
        className="object-cover kenburns"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />

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
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}
    </div>
  );
}
