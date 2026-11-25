import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { DESTINATIONS, photo } from "@/constants/site";

export default function Destinations() {
  return (
    <section id="destinations" className="bg-cream-dark py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow">Where we go</p>
            <h2 className="section-title mt-3">Featured destinations</h2>
            <p className="mt-4 text-muted">
              Our trips focus on India&apos;s mountain and hill regions. Here&apos;s where we&apos;re
              heading right now.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DESTINATIONS.map((d, i) => (
            <BlurFade key={d.slug} inView delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-forest/5 transition-shadow hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo(d.photo, 900, 675)}
                    alt={d.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent" />
                  <h3 className="absolute bottom-4 left-5 font-display text-2xl font-bold text-white">
                    {d.name}
                  </h3>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-relaxed text-muted">{d.teaser}</p>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors hover:text-sunset-deep"
                  >
                    Enquire about {d.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            </BlurFade>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-forest/20 px-5 py-4 text-sm text-muted">
          <Compass className="h-5 w-5 shrink-0 text-sunset" aria-hidden />
          More mountain destinations are on the way. Have somewhere in mind?{" "}
          <a href="#contact" className="font-semibold text-forest underline-offset-4 hover:underline">
            Tell us
          </a>
        </div>
      </div>
    </section>
  );
}
