import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { TiltCard } from "@/components/ui/tilt-card";
import { TOUR_TYPES, photo } from "@/constants/site";
import { RevealText } from "@/components/ui/reveal-text";

export default function TourTypes() {
  return (
    <section id="trips" className="py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Explore trips</p>
          <h2 className="section-title mt-3">
            <RevealText text="Travel your way" />
          </h2>
          <p className="mt-4 text-muted">
            Come along on a group departure, or let us plan a private trip around you. Either way,
            we take care of the details so you can enjoy the mountains.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {TOUR_TYPES.map((t, i) => (
            <BlurFade key={t.title} inView delay={i * 0.1}>
              <TiltCard className="group relative isolate flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-[28px] p-8 text-cream shadow-[0_24px_50px_-28px_rgba(20,42,30,0.6)] sm:p-10">
                <Image
                  src={photo(t.photo, 1200, 900)}
                  alt={t.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-deep via-forest-deep/60 to-forest-deep/5" />
                <span className="font-display text-sm font-bold text-gold">0{i + 1}</span>
                <h3 className="mt-2 font-display text-3xl font-bold">{t.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/85">{t.body}</p>
                <a href="#contact" className="btn-primary mt-6 self-start">
                  {t.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </a>
              </TiltCard>
            </BlurFade>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href="#contact" className="btn-forest px-8 py-3.5">
            Explore Trips
          </a>
          <p className="mt-3 text-xs text-muted">
            Trip packages and departure dates are coming soon. Enquire now and we&apos;ll share
            what&apos;s planned.
          </p>
        </div>
      </div>
    </section>
  );
}
