"use client";

import { motion, useScroll, useTransform } from "motion/react";

/** Hero background: drifts down and zooms slightly as the page scrolls, so the text slides over it. */
export function HeroBackdrop({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 180]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.08]);
  return (
    <motion.div className="absolute inset-0 -z-20" style={{ y, scale }}>
      {children}
    </motion.div>
  );
}

/** Hero text: lifts and fades as it scrolls away. */
export function HeroForeground({ children, className }: { children: React.ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -70]);
  const opacity = useTransform(scrollY, [0, 520], [1, 0.15]);
  return (
    <motion.div className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}
