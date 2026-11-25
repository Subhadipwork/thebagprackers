"use client";

/**
 * ScrollPath — adapted from Skiper UI "Svg follow scroll" (skiper19).
 * https://skiper-ui.com · Author: @gurvinder-singh02
 * License: free for personal and commercial use; attribution to Skiper UI required (see site footer).
 * Changes: reusable; draws a dashed travel route (like the flight path in the logo)
 * as its parent section scrolls through the viewport.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const ROUTE =
  "M-20 160 C 120 40, 260 40, 330 150 S 520 300, 610 190 S 760 30, 880 120 S 1080 300, 1180 170 S 1360 40, 1460 110";

export function ScrollPath({ className, color = "#FBB040" }: { className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pinOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none", className)}>
      <svg viewBox="0 0 1440 260" fill="none" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        {/* faint full route */}
        <path d={ROUTE} stroke={color} strokeOpacity="0.15" strokeWidth="3" strokeDasharray="10 12" strokeLinecap="round" />
        {/* route that draws with scroll; a mask keeps it dashed */}
        <mask id="route-dashes">
          <path d={ROUTE} stroke="#fff" strokeWidth="6" strokeDasharray="10 12" strokeLinecap="round" />
        </mask>
        <motion.path
          d={ROUTE}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          mask="url(#route-dashes)"
          style={{ pathLength }}
        />
        <motion.g style={{ opacity: pinOpacity }}>
          <circle cx="1460" cy="110" r="10" fill={color} />
          <circle cx="1460" cy="110" r="20" stroke={color} strokeOpacity="0.4" strokeWidth="3" />
        </motion.g>
      </svg>
    </div>
  );
}
