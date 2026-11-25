"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/site";
import { TextRoll } from "@/components/ui/skiper/text-roll";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-cream/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_0_rgba(31,58,43,0.08),0_8px_24px_-12px_rgba(31,58,43,0.25)]" : ""
      }`}
    >
      <nav className="container-page flex h-[72px] items-center justify-between gap-6">
        <a href="#top" aria-label="The Backpackers home" className="shrink-0">
          <Image
            src="/the-backpackers-logo-wide.jpg"
            alt="The Backpackers"
            width={1130}
            height={470}
            priority
            className="h-12 w-auto mix-blend-multiply sm:h-[52px]"
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block text-sm font-medium text-forest/80"
              >
                <TextRoll>{link.label}</TextRoll>
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="btn-primary hidden md:inline-flex">
          Plan Your Trip
        </a>

        <button
          type="button"
          className="rounded-full p-2 text-forest md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-forest/10 bg-cream md:hidden">
          <ul className="container-page flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-forest"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pb-2 pt-3">
              <a href="#contact" onClick={() => setOpen(false)} className="btn-primary w-full">
                Plan Your Trip
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
