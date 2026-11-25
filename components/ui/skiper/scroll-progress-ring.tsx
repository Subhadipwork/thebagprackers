"use client";

/**
 * ScrollProgressRing — adapted from Skiper UI "Scroll progress 001" (skiper89).
 * https://skiper-ui.com · Author: @gurvinder-singh02
 * License: free for personal and commercial use; attribution to Skiper UI required (see site footer).
 * Changes: no NumberFlow dependency or dragging; brand colours; click scrolls to top;
 * hidden until the visitor has scrolled a little.
 */

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

const R = 18;

export function ScrollProgressRing() {
  const { scrollYProgress } = useScroll();
  const clamped = useTransform(scrollYProgress, (v) => Math.min(Math.max(v, 0), 1));
  const [percent, setPercent] = useState(0);

  useMotionValueEvent(clamped, "change", (v) => setPercent(Math.round(v * 100)));

  return (
    <AnimatePresence>
      {percent > 3 && (
        <motion.button
          type="button"
          aria-label={`Back to top (${percent}% scrolled)`}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="group fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream/80 text-forest shadow-lg ring-1 ring-forest/10 backdrop-blur"
        >
          <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-forest px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-cream opacity-0 transition-opacity group-hover:opacity-100">
            {percent}%
          </span>
          <svg className="absolute h-10 w-10" viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r={R} stroke="currentColor" strokeWidth="3" fill="none" className="opacity-15" />
            <motion.circle
              cx="24"
              cy="24"
              r={R}
              stroke="#F7941D"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              style={{ pathLength: clamped, rotate: -90, transformOrigin: "50% 50%" }}
            />
          </svg>
          <ArrowUp className="h-4 w-4" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
