"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/constants/site";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * Background video for the hero. The photo underneath stays the first thing visitors see
 * (fast Largest Contentful Paint); the video only starts loading after the page has loaded,
 * on screens 768px+ wide, and never for reduced-motion, data-saver or 2G/3G visitors.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const skip =
      !SITE.heroVideo ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(min-width: 768px)").matches ||
      conn?.saveData ||
      (conn?.effectiveType && /(^|-)(2g|3g)$/.test(conn.effectiveType));
    if (skip) return;

    const start = () => setSrc(SITE.heroVideo);
    if (document.readyState === "complete") {
      const id = window.setTimeout(start, 300);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    if (src) ref.current?.play().catch(() => {});
  }, [src]);

  if (!src) return null;

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      onTimeUpdate={(e) => {
        if (!playing && e.currentTarget.currentTime > 0) setPlaying(true);
      }}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
