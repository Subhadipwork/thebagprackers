import Image from "next/image";
import { BlurFade } from "@/components/ui/blur-fade";
import { Parallax } from "@/components/ui/parallax";
import { photo } from "@/constants/site";
import { RevealText } from "@/components/ui/reveal-text";

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <BlurFade inView className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] shadow-xl sm:mx-auto lg:mx-0">
            <Parallax distance={24} className="absolute -inset-y-8 inset-x-0">
              <Image
                src={photo("1668437824006-1be44600774b", 900, 1125)}
                alt="Snowy mountains under a blue sky"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </Parallax>
          </div>
          <Parallax distance={-36} className="absolute -bottom-8 right-0 hidden sm:block lg:-right-4">
            <div className="relative aspect-square w-48 overflow-hidden rounded-3xl border-[6px] border-cream shadow-lg">
              <Image
                src={photo("1595815771614-ade9d652a65d", 400, 400)}
                alt="A wooden house on a lake near snow-covered mountains"
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          </Parallax>
        </BlurFade>

        <BlurFade inView delay={0.1} className="order-1 lg:order-2">
          <p className="eyebrow">Who we are</p>
          <h2 className="section-title mt-3">
            <RevealText text="Discover mountains. Experience nature. Create memories." />
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
            <p>
              The Backpackers is a Kolkata-based travel company for people who love mountains,
              nature, adventure and exploration. We organize trips to some of India&apos;s most
              beautiful mountain destinations, including Meghalaya, Arunachal Pradesh and Kashmir.
            </p>
            <p>
              Whether you want to join a group tour or plan a trip of your own, we help you step
              away from the everyday: hidden mountain villages, wide-open landscapes, local culture
              and quiet moments surrounded by nature.
            </p>
            <p>
              For us, travelling is about more than ticking off a place. It&apos;s about
              discoveries, connections and memories that stay with you long after you&apos;re home.
            </p>
          </div>
          <p className="mt-8 font-script text-2xl text-forest">Your journey to the mountains starts here.</p>
        </BlurFade>
      </div>
    </section>
  );
}
