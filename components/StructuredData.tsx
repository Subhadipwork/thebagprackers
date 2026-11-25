import { DESTINATIONS, SITE, SITE_URL, photo, HERO_PHOTO } from "@/constants/site";

/**
 * JSON-LD structured data (schema.org) for search engines and AI assistants.
 * Only facts confirmed by the company are included: no ratings, prices or opening hours.
 */
export default function StructuredData() {
  const sameAs = SITE.socials.map((s) => s.href).filter((h) => h.startsWith("http"));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": `${SITE_URL}/#organization`,
        name: SITE.name,
        slogan: SITE.tagline,
        description: SITE.description,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/the-backpackers-logo.webp`,
        image: photo(HERO_PHOTO, 1200, 630),
        email: SITE.email,
        telephone: SITE.phone.replace(/\s/g, ""),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressRegion: "West Bengal",
          addressCountry: "IN",
        },
        areaServed: [
          ...DESTINATIONS.map((d) => ({ "@type": "State", name: d.name, containedInPlace: { "@type": "Country", name: "India" } })),
          { "@type": "Country", name: "India" },
        ],
        knowsAbout: ["Mountain travel", "Group tours", "Customized tours", ...DESTINATIONS.map((d) => `${d.name} tours`)],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: SITE.phone.replace(/\s/g, ""),
          email: SITE.email,
          areaServed: "IN",
          availableLanguage: ["English", "Bengali", "Hindi"],
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: "The Backpackers | Mountain & Nature Trips from Kolkata",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        primaryImageOfPage: photo(HERO_PHOTO, 1200, 630),
        inLanguage: "en-IN",
      },
      {
        "@type": "ItemList",
        name: "Featured destinations",
        itemListElement: DESTINATIONS.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "TouristDestination",
            name: d.name,
            description: d.teaser,
            image: photo(d.photo, 1200, 800),
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
