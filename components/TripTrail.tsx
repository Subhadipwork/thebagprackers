"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import HikerScene from "@/components/line-art/HikerScene";
import { TRIP_EVENT, type TripDetail } from "@/lib/trip-events";
import { cn } from "@/lib/utils";

const TOTAL = 5; // trip fields counted by the enquiry form

function caption(progress: number) {
  const filled = Math.round(progress * TOTAL);
  if (filled === 0) return "The group is waiting at camp. Where shall we go?";
  if (filled < TOTAL) return `${filled} of ${TOTAL} details in. The campfire's getting going…`;
  return "All set! Send it and we'll plan the route together.";
}

function useTripProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const on = (e: Event) => setProgress((e as CustomEvent<TripDetail>).detail.progress);
    window.addEventListener(TRIP_EVENT, on);
    return () => window.removeEventListener(TRIP_EVENT, on);
  }, []);
  return progress;
}

/** Speech bubble from the camp: follows the enquiry form as it fills in. */
export function TripCaption({ className, tail = "down" }: { className?: string; tail?: "down" | "none" }) {
  const text = caption(useTripProgress());
  return (
    <div className={cn("relative", className)} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={text}
          className="relative inline-block rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-forest shadow-[0_10px_26px_-14px_rgba(31,58,43,0.5)] ring-1 ring-forest/10"
          initial={{ y: 10, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", bounce: 0.25, visualDuration: 0.35 }}
        >
          {text}
          {tail === "down" && (
            <span aria-hidden className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 bg-white ring-1 ring-forest/10 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/**
 * Full-width line-art trail along the bottom of the Plan Your Trip section. It reacts to the
 * enquiry form (TRIP_EVENT): hikers cheer and the fire grows as the details come in.
 */
export default function TripTrail({ className }: { className?: string }) {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* the sky fades into the section, so the drawing grows out of the page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-cream-dark to-transparent" />
      <HikerScene
        variant="strip"
        height={wide ? 260 : 230}
        scale={wide ? 1.1 : 1}
        campAt={wide ? 0.27 : 0.8}
        hintAlign={wide ? "left" : "right"}
        paper="#F2ECDF"
        className="h-full w-full"
      />
      {/* phones: the bubble sits over the trail (laptops show it in the text column) */}
      <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center px-4 lg:hidden">
        <TripCaption tail="none" className="text-center" />
      </div>
    </div>
  );
}
