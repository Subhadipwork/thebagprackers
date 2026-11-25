import type { Metadata } from "next";
import { NAV_LINKS } from "@/constants/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist. Head back to The Backpackers homepage to explore mountain trips from Kolkata.",
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="section-title mt-3">This trail doesn&apos;t lead anywhere</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you were looking for has moved or never existed. Let&apos;s get you back on the
        right path.
      </p>
      <a href="/" className="btn-primary mt-8">
        Back to homepage
      </a>
      <nav aria-label="Popular sections" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={`/${l.href}`} className="font-medium text-forest hover:text-sunset-deep">
            {l.label}
          </a>
        ))}
      </nav>
    </section>
  );
}
