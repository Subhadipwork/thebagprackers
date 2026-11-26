"use client";

import { MotionConfig } from "motion/react";

/** One place for site-wide motion settings: transforms switch off for reduced-motion users. */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
