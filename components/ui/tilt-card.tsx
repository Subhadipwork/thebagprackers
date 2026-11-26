"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";

/** A card that tilts toward the pointer, with a soft light that follows it. */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), spring);
  const gx = useTransform(px, [0, 1], ["0%", "100%"]);
  const gy = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(255,255,255,0.16), transparent 60%)`;

  return (
    <div className="h-full [perspective:1200px]">
      <motion.article
        className={className}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 -z-[5]" style={{ background: glare }} />
      </motion.article>
    </div>
  );
}
