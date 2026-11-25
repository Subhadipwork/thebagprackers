import Image from "next/image";
import { MapPin } from "lucide-react";
import { ProgressiveBlur } from "@/components/ui/skiper/progressive-blur";
import { HERO_PHOTO, photo } from "@/constants/site";

/**
 * Above-the-fold hero. Text is deliberately not animated in with JS so it paints
 * straight from the HTML (better Largest Contentful Paint); a light CSS fade-up is used instead.
 */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={photo(HERO_PHOTO, 2000)}
        alt="A green mountain valley with a waterfall in the distance"
        fill
        preload
        fetchPriority="high"
        quality={35}
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-deep/90 via-forest-deep/60 to-forest-deep/10" />
      <ProgressiveBlur position="bottom" height="110px" blurAmount="6px" className="z-10" />

      <div className="container-page flex min-h-[calc(100svh-72px)] flex-col justify-center pb-32 pt-20 md:min-h-[680px]">
        <div className="hero-rise max-w-2xl text-cream">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold ring-1 ring-white/20 backdrop-blur">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Kolkata Based Travel Company
          </p>

          <h1 className="mt-6">
            <span className="block font-script text-3xl text-gold sm:text-4xl">The Backpackers</span>
            <span className="mt-1 block font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Wander More,
              <br />
              <span className="text-sunset">Worry Less.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
            Explore breathtaking mountains, discover hidden destinations, and experience journeys
            worth remembering. From Meghalaya and Arunachal Pradesh to the mountains of Kashmir,
            your next journey starts here.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#destinations" className="btn-primary px-7 py-3.5">
              Explore Destinations
            </a>
            <a href="#contact" className="btn-ghost-light px-7 py-3.5">
              Plan Your Trip
            </a>
          </div>

          <p className="mt-10 text-sm font-medium tracking-[0.25em] text-cream/70">
            EXPLORE · EXPERIENCE · ESCAPE
          </p>
        </div>
      </div>
    </section>
  );
}
