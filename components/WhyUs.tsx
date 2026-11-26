import { Heart, MapPin, MessageCircle, Mountain, Users } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { ScrollPath } from "@/components/ui/skiper/scroll-path";
import { WHY_US } from "@/constants/site";
import { RevealText } from "@/components/ui/reveal-text";

const ICONS = {
  "map-pin": MapPin,
  mountain: Mountain,
  users: Users,
  "message-circle": MessageCircle,
  heart: Heart,
};

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-forest py-20 text-cream sm:py-28">
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-0 w-full text-forest-soft/40"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0 220V150l140-80 120 60 170-110 150 90 120-50 180 120 160-100 140 70 150-60 110 50v80z"
        />
      </svg>

      <ScrollPath className="absolute inset-x-0 top-6 h-32 sm:top-10 sm:h-44" />

      <div className="container-page relative">
        <div className="max-w-2xl pt-16 sm:pt-20">
          <p className="eyebrow text-gold">Why travel with us</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
            <RevealText text="A small team that loves the mountains as much as you do" />
          </h2>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_US.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <BlurFade key={item.title} inView delay={i * 0.06}>
                <li className="group h-full rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 transition duration-300 ease-out hover:-translate-y-1.5 hover:bg-white/[0.1] hover:ring-gold/40 motion-reduce:hover:translate-y-0">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sunset/15 text-sunset transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-sunset group-hover:text-white motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/75">{item.body}</p>
                </li>
              </BlurFade>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
