import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";
import { CardStack } from "@/components/ui/skiper/card-stack";
import { DESTINATIONS, photo } from "@/constants/site";
import { RevealText } from "@/components/ui/reveal-text";

function DestinationCard({ d, index }: { d: (typeof DESTINATIONS)[number]; index: number }) {
  return (
    <article className="group grid overflow-hidden rounded-[28px] bg-white shadow-[0_20px_50px_-24px_rgba(20,42,30,0.45)] ring-1 ring-forest/5 md:min-h-[420px] md:grid-cols-[1.15fr_1fr]">
      <div className="relative aspect-[16/10] md:aspect-auto">
        <Image
          src={photo(d.photo, 1100, 800)}
          alt={d.alt}
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <span className="font-display text-sm font-bold text-sunset-deep">0{index + 1}</span>
        <h3 className="mt-2 font-display text-3xl font-bold text-forest sm:text-4xl">{d.name}</h3>
        <p className="mt-4 leading-relaxed text-muted">{d.teaser}</p>
        <a href="#contact" className="btn-forest mt-8 self-start">
          Enquire about {d.name}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
}

export default function Destinations() {
  return (
    <section id="destinations" className="bg-cream-dark py-20 sm:py-28">
      <div className="container-page">
        <div className="max-w-xl">
          <p className="eyebrow">Where we go</p>
          <h2 className="section-title mt-3">
            <RevealText text="Featured destinations" />
          </h2>
          <p className="mt-4 text-muted">
            Our trips focus on India&apos;s mountain and hill regions. Here&apos;s where we&apos;re
            heading right now.
          </p>
        </div>

        <div className="mt-12">
          <CardStack
            cards={DESTINATIONS.map((d, i) => (
              <DestinationCard key={d.slug} d={d} index={i} />
            ))}
          />
        </div>

        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-forest/20 px-5 py-4 text-sm text-muted">
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
