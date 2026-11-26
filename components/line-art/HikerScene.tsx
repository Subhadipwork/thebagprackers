"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { mountHikerScene } from "./hiker-scene";

type Props = {
  className?: string;
  /**
   * "card": the fixed 2:1 scene. "strip": fills its box; the scene is as wide as the box
   * allows at `height` units tall, so it never stretches or letterboxes.
   */
  variant?: "card" | "strip";
  /** Scene height in units for the strip (≈ px on desktop). */
  height?: number;
  /** Hiker size. */
  scale?: number;
  /** Paper colour behind the drawing (fills that hide lines behind them). */
  paper?: string;
  /** Where the camp sits, as a fraction of the width. */
  campAt?: number;
  /** Which corner the hint line sits in. */
  hintAlign?: "left" | "right";
};

/** React wrapper: the scene is plain SVG built and animated by hiker-scene.ts. */
export default function HikerScene({ className, variant = "card", height = 220, scale, paper, campAt, hintAlign }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cleanup: (() => void) | undefined;
    let lastW = 0;
    const mount = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h || Math.abs(w - lastW) < 2) return;
      lastW = w;
      cleanup?.();
      cleanup =
        variant === "strip"
          ? mountHikerScene(host, { width: Math.round((height * w) / h), height, scale: scale ?? 1, campAt, hintAlign })
          : mountHikerScene(host, { scale, campAt, hintAlign });
    };
    mount();
    const ro = new ResizeObserver(mount);
    ro.observe(host);
    return () => {
      ro.disconnect();
      cleanup?.();
    };
  }, [variant, height, scale, campAt, hintAlign]);

  return (
    <div
      ref={ref}
      className={cn("line-art", className)}
      style={paper ? ({ "--paper": paper } as CSSProperties) : undefined}
    />
  );
}
