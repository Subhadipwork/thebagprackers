"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { NAV_LINKS } from "@/constants/site";
import { TextRoll } from "@/components/ui/skiper/text-roll";
import { cn } from "@/lib/utils";

const SHRINK_AT = 80; // px scrolled before the bar turns into a floating pill
const PILL_MAX = 980; // pill width on laptops
const spring = { type: "spring", stiffness: 260, damping: 32 } as const;

/**
 * Resizable navbar: a full-width bar at the top of the page that shrinks into a floating,
 * blurred pill once the visitor scrolls, and opens back out at the top.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [vw, setVw] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setShrunk(y > SHRINK_AT));

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    setShrunk(window.scrollY > SHRINK_AT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Highlight the section in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector<HTMLElement>(l.href)).filter(
      (s): s is HTMLElement => !!s,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const clear = () => window.scrollY < 200 && setActive(null);
    window.addEventListener("scroll", clear, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", clear);
    };
  }, []);

  const desktop = vw >= 768;
  // full width at the top; a centred pill (with a 12px margin on phones) once scrolled
  const maxWidth = vw ? (shrunk ? (desktop ? Math.min(PILL_MAX, vw - 48) : vw - 24) : vw) : undefined;

  return (
    <header className="pointer-events-none sticky top-0 z-40 h-[72px]">
      <motion.div
        initial={false}
        animate={{
          maxWidth,
          y: shrunk ? 12 : 0,
          borderRadius: shrunk ? (open ? 24 : 999) : 0,
          backgroundColor: open ? "rgba(251,248,241,0.98)" : shrunk ? "rgba(251,248,241,0.82)" : "rgba(251,248,241,0.95)",
          boxShadow: shrunk
            ? "0 0 0 1px rgba(31,58,43,0.08), 0 12px 32px -12px rgba(31,58,43,0.35), inset 0 1px 0 rgba(255,255,255,0.6)"
            : "0 1px 0 rgba(31,58,43,0.06), 0 0 0 0 rgba(31,58,43,0), inset 0 0 0 rgba(255,255,255,0)",
        }}
        transition={spring}
        className="pointer-events-auto mx-auto w-full overflow-hidden backdrop-blur-md"
      >
        <nav
          className={cn(
            "mx-auto flex items-center justify-between gap-4 transition-[height,padding] duration-300 ease-out",
            shrunk ? "h-[60px] px-3 sm:px-4" : "container-page h-[72px]",
          )}
        >
          <a href="#top" aria-label="The Backpackers home" className="shrink-0 transition-transform duration-300 hover:scale-[1.03]">
            <Image
              src="/the-backpackers-logo-wide.webp"
              alt="The Backpackers"
              width={480}
              height={200}
              loading="eager"
              unoptimized
              className={cn(
                "w-auto mix-blend-multiply transition-[height] duration-300 ease-out",
                shrunk ? "h-10" : "h-12 sm:h-[52px]",
              )}
            />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="relative">
                {active === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-forest/[0.08]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                  />
                )}
                <a
                  href={link.href}
                  aria-current={active === link.href ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full py-2 text-sm font-medium transition-[color,padding] duration-300",
                    shrunk ? "px-3" : "px-3.5",
                    active === link.href ? "text-forest" : "text-forest/75 hover:text-forest",
                  )}
                >
                  <TextRoll>{link.label}</TextRoll>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className={cn(
              "btn-primary hidden transition-[padding,transform,background-color,box-shadow] md:inline-flex",
              shrunk && "px-5 py-2.5",
            )}
          >
            Plan Your Trip
          </a>

          <button
            type="button"
            className="rounded-full p-2 text-forest md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "menu"}
                className="block"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="menu"
              className="overflow-hidden border-t border-forest/10 md:hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.ul
                className={cn("flex flex-col py-3", shrunk ? "px-4" : "container-page")}
                initial="closed"
                animate="open"
                variants={{ open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } }, closed: {} }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.href} variants={{ closed: { x: -12, opacity: 0 }, open: { x: 0, opacity: 1 } }}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn("block py-3 text-base font-medium", active === link.href ? "text-sunset-deep" : "text-forest")}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li className="pb-2 pt-3" variants={{ closed: { y: 8, opacity: 0 }, open: { y: 0, opacity: 1 } }}>
                  <a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                    Plan Your Trip
                  </a>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
