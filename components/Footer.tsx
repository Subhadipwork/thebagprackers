import Image from "next/image";
import { NAV_LINKS, SITE } from "@/constants/site";

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-cream/80">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="inline-block rounded-2xl bg-cream p-3">
            <Image
              src="/the-backpackers-logo-wide.jpg"
              alt="The Backpackers"
              width={1130}
              height={470}
              className="h-14 w-auto mix-blend-multiply"
            />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            A Kolkata-based travel company for mountain, hill and nature trips to Meghalaya,
            Arunachal Pradesh, Kashmir and beyond. Group tours and customized trips.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-cream">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-cream">Get in touch</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                {SITE.email}
              </a>
            </li>
            <li>{SITE.city}</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 transition hover:bg-gold"
              >
                <Image src={s.icon} alt="" width={16} height={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} The Backpackers. All rights reserved.</p>
          <p className="font-script text-base text-gold">{SITE.tagline}</p>
          <p className="text-cream/50">
            Some UI components by{" "}
            <a href="https://skiper-ui.com" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-gold hover:underline">
              Skiper UI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
