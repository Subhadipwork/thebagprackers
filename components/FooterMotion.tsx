"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

/**
 * Giant "Backpackers" wordmark at the foot of the page. A sunset glow inside the letters
 * follows the pointer across the footer; on touch screens it drifts slowly by itself.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const x = useSpring(mx, { stiffness: 120, damping: 20 });
  const y = useSpring(my, { stiffness: 120, damping: 20 });
  const backgroundImage = useMotionTemplate`radial-gradient(ellipse 55% 120% at ${x}% ${y}%, rgba(247,148,29,0.98) 0%, rgba(251,176,64,0.75) 22%, rgba(251,248,241,0.32) 52%, rgba(251,248,241,0.1) 100%)`;

  useEffect(() => {
    const footer = ref.current?.closest("footer");
    if (!footer || reduce) return;
    let drift: ReturnType<typeof animate> | null = null;
    const startDrift = () => {
      drift?.stop();
      drift = animate(mx, [mx.get(), 85, 15, 50], { duration: 14, ease: "easeInOut", repeat: Infinity });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      drift?.stop();
      const r = ref.current!.getBoundingClientRect();
      mx.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
      my.set(Math.min(90, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
    };
    const onLeave = () => {
      my.set(30);
      startDrift();
    };
    startDrift();
    footer.addEventListener("pointermove", onMove);
    footer.addEventListener("pointerleave", onLeave);
    return () => {
      drift?.stop();
      footer.removeEventListener("pointermove", onMove);
      footer.removeEventListener("pointerleave", onLeave);
    };
  }, [mx, my, reduce]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative -mb-[0.18em] select-none overflow-hidden text-center">
      <motion.span
        className="inline-block whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.05em]"
        initial={{ y: "40%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -40px 0px" }}
        transition={{ type: "spring", bounce: 0.2, visualDuration: 0.9 }}
        style={{
          fontSize: "clamp(52px, 14.6vw, 210px)",
          backgroundImage,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,.5) 78%, rgba(0,0,0,.25) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,.5) 78%, rgba(0,0,0,.25) 100%)",
        }}
      >
        Backpackers
      </motion.span>
    </div>
  );
}

/** Pill button back to the top of the page; the arrow nudges up on hover. */
export function BackToTop() {
  return (
    <motion.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      whileTap={{ scale: 0.95 }}
      className="group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-cream ring-1 ring-cream/25 transition-colors duration-200 hover:bg-cream hover:text-forest-deep"
    >
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0" aria-hidden />
      Back to top
    </motion.button>
  );
}
