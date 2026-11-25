import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { SITE } from "@/constants/site";

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
    <section id="contact" className="bg-cream-dark py-20 sm:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <div>
          <p className="eyebrow">Plan your trip</p>
          <h2 className="section-title mt-3">Let&apos;s plan your next escape</h2>
          <p className="mt-4 max-w-md text-muted">
            Tell us where you&apos;d like to go and when. Whether it&apos;s a group departure or a
            trip just for you, we&apos;ll get back to you with ideas and next steps.
          </p>

          <ul className="mt-8 space-y-4">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-semibold text-forest hover:text-sunset-deep"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-forest">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex gap-3">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-forest/10 transition hover:ring-sunset"
              >
                <Image src={s.icon} alt="" width={20} height={20} unoptimized />
              </a>
            ))}
          </div>
        </div>

        <EnquiryForm />
      </div>
    </section>
  );
}
