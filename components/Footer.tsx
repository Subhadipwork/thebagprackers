import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Mountain, Phone } from "lucide-react";
import { DESTINATIONS, NAV_LINKS, SITE } from "@/constants/site";
import { BlurFade } from "@/components/ui/blur-fade";
import { BackToTop, FooterWordmark } from "@/components/FooterMotion";

const heading = "text-[11px] font-semibold uppercase tracking-[0.22em] text-cream/45";
const link =
  "link-slide inline-flex items-center gap-2 text-[15px] text-cream/80 transition-colors duration-200 hover:text-gold";

export default function Footer() {
  const contact = [
    { icon: Phone, label: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp us", href: `https://wa.me/${SITE.whatsappNumber}` },
    { icon: Mail, label: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: SITE.city },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-forest-deep text-cream">
      {/* warm light rising from behind the top edge, like a sunset over a ridge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(247,148,29,0.16),transparent)]"
      />

      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-12 pb-12 pt-16 sm:pt-20 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr] lg:gap-10">
        <BlurFade inView className="col-span-2 lg:col-span-1">
          <div className="inline-block rounded-2xl bg-cream p-2.5 transition-transform duration-300 hover:-rotate-1 hover:scale-[1.02]">
            <Image
              src="/the-backpackers-logo-wide.webp"
              alt="The Backpackers"
              width={480}
              height={200}
              unoptimized
              className="h-12 w-auto mix-blend-multiply"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            A Kolkata-based travel company for mountain, hill and nature trips. Group tours and
            customized trips.
          </p>

          <a
            href="#contact"
            className="group mt-6 flex max-w-sm items-center gap-4 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:ring-gold/40 motion-reduce:hover:translate-y-0"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sunset text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100">
              <Mountain className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1 font-semibold text-cream">
                Planning a mountain trip?
                <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-cream/60">
                Tell us where and when. We&apos;ll reply on WhatsApp.
              </span>
            </span>
          </a>

          <div className="mt-6 flex gap-2.5">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cream/90 transition duration-300 hover:-translate-y-1 hover:rotate-6 hover:bg-gold motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                <Image src={s.icon} alt="" width={18} height={18} unoptimized />
              </a>
            ))}
          </div>
        </BlurFade>

        <BlurFade inView delay={0.08}>
          <nav aria-label="Footer">
            <h3 className={heading}>Explore</h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </BlurFade>

        <BlurFade inView delay={0.16}>
          <h3 className={heading}>Destinations</h3>
          <ul className="mt-5 space-y-3">
            {DESTINATIONS.map((d) => (
              <li key={d.slug}>
                <a href="#destinations" className={link}>
                  {d.name}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className={`${link} text-cream/55`}>
                Somewhere else?
              </a>
            </li>
          </ul>
        </BlurFade>

        <BlurFade inView delay={0.24} className="col-span-2 lg:col-span-1">
          <h3 className={heading}>Get in touch</h3>
          <ul className="mt-5 space-y-3">
            {contact.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={link}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                    {label}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-[15px] text-cream/80">
                    <Icon className="h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                    {label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </BlurFade>
      </div>

      <div className="container-page">
        <div className="flex flex-col items-center gap-4 border-t border-white/10 py-6 text-center text-xs text-cream/55 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} The Backpackers ·{" "}
            <span className="font-script text-base text-gold">{SITE.tagline}</span>
          </p>
          <p>
            Some UI components by{" "}
            <a
              href="https://skiper-ui.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-gold hover:underline"
            >
              Skiper UI
            </a>
          </p>
          <BackToTop />
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
