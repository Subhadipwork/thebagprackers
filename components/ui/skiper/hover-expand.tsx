"use client";

/**
 * HoverExpand — adapted from Skiper UI "ExpandOnHover" (skiper52).
 * https://skiper-ui.com · Author: @gurvinder-singh02
 * License: free for personal and commercial use; attribution to Skiper UI required (see site footer).
 * Changes: uses `motion/react`, drops unused Swiper CSS imports, uses next/image,
 * adds captions, keyboard focus support and configurable sizes.
 */

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type HoverExpandItem = { src: string; alt: string; caption?: string };

export function HoverExpand({
  items,
  className,
  initialActive = 1,
  activeWidth = "26rem",
  idleWidth = "4.5rem",
  height = "26rem",
}: {
  items: HoverExpandItem[];
  className?: string;
  initialActive?: number;
  activeWidth?: string;
  idleWidth?: string;
  height?: string;
}) {
  const [active, setActive] = useState(initialActive);

  return (
    <div className={cn("flex w-full items-center justify-center gap-1.5", className)}>
      {items.map((item, index) => {
        const isActive = active === index;
        return (
          <motion.button
            type="button"
            key={item.src}
            aria-label={item.alt}
            aria-pressed={isActive}
            className="relative shrink-0 cursor-pointer overflow-hidden rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sunset focus-visible:ring-offset-2"
            style={{ height }}
            initial={false}
            animate={{ width: isActive ? activeWidth : idleWidth }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onHoverStart={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <Image src={item.src} alt={item.alt} fill sizes="420px" className="object-cover" />
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-forest-deep/70 via-transparent to-transparent p-5 text-left"
                >
                  {item.caption && (
                    <p className="text-sm font-semibold text-white drop-shadow">{item.caption}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
