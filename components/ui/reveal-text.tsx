"use client";

import { motion } from "motion/react";

/** Words rise into place one after another when the heading scrolls into view. */
export function RevealText({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      className="inline"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]">
          <motion.span
            className="inline-block will-change-transform"
            variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
            transition={{ type: "spring", bounce: 0.15, visualDuration: 0.5 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}
