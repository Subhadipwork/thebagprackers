import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import TripTrail, { TripCaption } from "@/components/TripTrail";
import { SITE } from "@/constants/site";
import { BlurFade } from "@/components/ui/blur-fade";
import { RevealText } from "@/components/ui/reveal-text";

export default function Contact() {
  const details = [
    { icon: Phone, label: "Call us", value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${SITE.whatsappNumber}`,
    },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: "Based in", value: SITE.city },
  ];

  return (
    <section id="contact" className="relative isolate bg-cream-dark pt-16 sm:pt-20 lg:flex lg:min-h-[100svh] lg:flex-col lg:pt-10">
      {/* the form floats above the trail; empty space lets clicks through to the hikers */}
      <div className="container-page pointer-events-none relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.25fr] lg:flex-1 lg:gap-12 lg:pb-[150px]">
        <div className="pointer-events-auto lg:self-start">
          <p className="eyebrow">Plan your trip</p>
          <h2 className="section-title mt-3">
            <RevealText text="Let’s plan your next escape" />
          </h2>
          <BlurFade inView delay={0.15}>
            <p className="mt-3 max-w-md text-muted">
              Tell us where you&apos;d like to go and when. Whether it&apos;s a group departure or a
              trip just for you, we&apos;ll get back to you with ideas and next steps.
            </p>
          </BlurFade>

          <div role="list" className="mt-6 grid gap-3 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value, href }, i) => {
              const external = href?.startsWith("http");
              const body = (
                <>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest text-gold transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-sunset group-hover:text-white motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-wider text-muted">{label}</span>
                    <span className="block truncate text-sm font-semibold text-forest">{value}</span>
                  </span>
                </>
              );
              const card =
                "group flex items-center gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-forest/10 transition duration-300 ease-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_14px_30px_-18px_rgba(31,58,43,0.5)] hover:ring-sunset/40 motion-reduce:hover:translate-y-0";
              return (
                <BlurFade key={label} inView delay={0.2 + i * 0.07}>
                  <div role="listitem">
                    {href ? (
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className={card}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className={card}>{body}</div>
                    )}
                  </div>
                </BlurFade>
              );
            })}
          </div>

          <BlurFade inView delay={0.5}>
            <div className="mt-5 flex gap-3">
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-forest/10 transition duration-300 hover:-translate-y-1 hover:rotate-6 hover:ring-sunset motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                >
                  <Image src={s.icon} alt="" width={20} height={20} unoptimized />
                </a>
              ))}
            </div>
          </BlurFade>

          <TripCaption className="mt-8 hidden lg:block [@media(max-height:760px)]:!hidden" />
        </div>

        <BlurFade inView delay={0.1} direction="up" offset={24} className="pointer-events-auto">
          <EnquiryForm />
        </BlurFade>
      </div>

      {/* laptops: the trail stays along the bottom of the screen while the form is in view,
          then settles above the footer · phones: it closes the section */}
      <TripTrail className="mt-12 h-[230px] lg:sticky lg:bottom-0 lg:z-0 lg:-mt-[260px] lg:h-[260px]" />
    </section>
  );
}
