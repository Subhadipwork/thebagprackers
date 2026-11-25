"use client";

/**
 * CardStack — adapted from Skiper UI "Card stack scroll" (skiper16).
 * https://skiper-ui.com · Author: @gurvinder-singh02
 * License: free for personal and commercial use; attribution to Skiper UI required (see site footer).
 * Changes: no Lenis (native scrolling), uses `motion/react`, renders any card content,
 * cards sit below the sticky navbar.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

function StickyCard({
  i,
  progress,
  range,
  targetScale,
  children,
}: {
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  children: React.ReactNode;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <div className="sticky top-[96px] flex items-start justify-center pb-10">
      <motion.div style={{ scale, top: i * 24 }} className="relative w-full origin-top">
        {children}
      </motion.div>
    </div>
  );
}

export function CardStack({ cards }: { cards: React.ReactNode[] }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });

  return (
    <div ref={container} className="relative">
      {cards.map((card, i) => {
        const targetScale = Math.max(0.85, 1 - (cards.length - i - 1) * 0.05);
        return (
          <StickyCard
            key={i}
            i={i}
            progress={scrollYProgress}
            range={[i / cards.length, 1]}
            targetScale={targetScale}
          >
            {card}
          </StickyCard>
        );
      })}
    </div>
  );
}
