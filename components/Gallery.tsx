import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { HoverExpand } from "@/components/ui/skiper/hover-expand";
import { GALLERY, photo } from "@/constants/site";
import { RevealText } from "@/components/ui/reveal-text";

function Row({ items, reverse }: { items: typeof GALLERY; reverse?: boolean }) {
  return (
    <Marquee pauseOnHover reverse={reverse} repeat={3} className="[--duration:60s] [--gap:1rem]">
      {items.map((g) => (
        <figure
          key={g.id}
          className="relative h-48 w-72 shrink-0 overflow-hidden rounded-2xl sm:h-60 sm:w-[22rem]"
        >
          <Image
            src={photo(g.id, 720, 480)}
            alt={g.alt}
            fill
            sizes="352px"
            className="object-cover"
          />
        </figure>
      ))}
    </Marquee>
  );
}

export default function Gallery() {
  const half = Math.ceil(GALLERY.length / 2);
  return (
    <section id="gallery" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Travel gallery</p>
          <h2 className="section-title mt-3">
            <RevealText text="A glimpse of the mountains" />
          </h2>
          <p className="mt-4 text-muted">
            Waterfalls, valleys, lakes and snow. A taste of the landscapes waiting for you.
          </p>
        </div>
      </div>

      {/* Large screens: Skiper UI hover-expand strip */}
      <div className="container-page mt-12 hidden xl:block">
        <HoverExpand
          items={GALLERY.slice(0, 9).map((g) => ({
            src: photo(g.id, 840, 840),
            alt: g.alt,
            caption: g.alt,
          }))}
        />
      </div>

      {/* Smaller screens: auto-scrolling rows */}
      <div className="relative mt-12 flex flex-col gap-2 xl:hidden">
        <Row items={GALLERY.slice(0, half)} />
        <Row items={GALLERY.slice(half)} reverse />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cream sm:w-32" />
      </div>

      <p className="container-page mt-6 text-center text-xs text-muted">
        Illustrative destination photos from Unsplash. Photos from our own trips are coming soon.
      </p>
    </section>
  );
}
