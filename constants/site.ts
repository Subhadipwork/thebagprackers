/**
 * Site-wide content for The Backpackers.
 * Source of truth: docs/the-backpackers-website-context.md
 *
 * TODO before launch: replace the social links marked PLACEHOLDER.
 */

/** Public site URL (no trailing slash). Override with NEXT_PUBLIC_SITE_URL if the domain changes. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://thebagpackers.in").replace(/\/$/, "");

export const SITE = {
  name: "The Backpackers",
  description:
    "Kolkata-based travel company for mountain and nature trips to Meghalaya, Arunachal Pradesh and Kashmir. Join a group tour or plan a customized trip.",
  tagline: "Wander More, Worry Less.",
  city: "Kolkata, West Bengal",
  phone: "+91 89108 93882",
  whatsappNumber: "918910893882", // country code + number, digits only
  email: "hello@thebackpackers.in",
  socials: [
    { label: "Instagram", href: "#", icon: "/instagram.svg" }, // PLACEHOLDER
    { label: "Facebook", href: "#", icon: "/facebook.svg" }, // PLACEHOLDER
    { label: "YouTube", href: "#", icon: "/youtube.svg" }, // PLACEHOLDER
  ],
};

export const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#destinations", label: "Destinations" },
  { href: "#trips", label: "Trips" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

/** Unsplash image URL helper (Unsplash License, illustrative photos). */
export const photo = (id: string, w: number, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

export const HERO_PHOTO = "1689089526066-c7e6e95ee265";

export const DESTINATIONS = [
  {
    slug: "meghalaya",
    name: "Meghalaya",
    teaser:
      "Discover Meghalaya's green hills, dramatic landscapes, waterfalls, caves, and scenic natural surroundings.",
    photo: "1609276804051-8c5e906cc430",
    alt: "Waterfalls pouring down a green cliff under white clouds",
  },
  {
    slug: "arunachal-pradesh",
    name: "Arunachal Pradesh",
    teaser:
      "Explore the mountain landscapes, valleys, distinctive local culture, and peaceful destinations of Arunachal Pradesh.",
    photo: "1626761627604-f27d98885f4b",
    alt: "Snow-capped mountain framed by colourful prayer flags",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    teaser:
      "Experience Kashmir's majestic mountains, valleys, lakes, and changing seasonal landscapes.",
    photo: "1598091383021-15ddea10925d",
    alt: "A horse grazing in a green meadow below snow-covered mountains",
  },
];

export const TOUR_TYPES = [
  {
    title: "Group Tours",
    body: "Join a planned trip with other travellers. Meet like-minded people, share the road and split the stories. Departure dates and trip details will be published here as soon as they are finalized.",
    photo: "1593813738953-fb3c93e0769d",
    alt: "Travellers walking across a hanging bridge in a forest",
    cta: "Ask about group departures",
  },
  {
    title: "Customized Tours",
    body: "Tell us where you want to go, when, and who is coming along. We'll plan a trip around your dates, group size and travel style, whether it's a family holiday or a quiet escape for two.",
    photo: "1761387829550-d4b6af443008",
    alt: "A wooden boat on a calm canal with mountains in the distance",
    cta: "Plan a custom trip",
  },
];

export const WHY_US = [
  {
    title: "Kolkata based",
    body: "We're a local team from Kolkata, easy to reach and happy to talk your trip through.",
    icon: "map-pin",
  },
  {
    title: "Mountains are our focus",
    body: "Hills, valleys and nature trips are what we do, not one option on a long list.",
    icon: "mountain",
  },
  {
    title: "Group or private",
    body: "Join a group departure or have a trip planned just for you and your people.",
    icon: "users",
  },
  {
    title: "Planned with you",
    body: "Every trip starts with a conversation about what you want from it.",
    icon: "message-circle",
  },
  {
    title: "Memories first",
    body: "Hidden villages, local culture and quiet moments in nature are what we plan around.",
    icon: "heart",
  },
] as const;

export const GALLERY = [
  { id: "1625826415766-001bd75aaf52", alt: "Waterfalls near green trees" },
  { id: "1617159156637-dfb8655c9f95", alt: "Mountain village under a blue sky" },
  { id: "1778918027232-ee2527f92946", alt: "Yellow wildflowers below snow-capped peaks" },
  { id: "1637043765564-a071ff91a09f", alt: "A waterfall in a lush green valley" },
  { id: "1776834831114-77b5616f09cb", alt: "Monastery on a hillside with mountains behind" },
  { id: "1715457573748-8e8a70b2c1be", alt: "Boats floating on a lake" },
  { id: "1625826415128-3fbae9b3022c", alt: "Green mountains under white clouds" },
  { id: "1745780264153-741aa8260944", alt: "Snowy mountains under a bright blue sky" },
  { id: "1614591276564-7b3e69347a48", alt: "Wooden houses beside a calm lake" },
  { id: "1672399444836-3f2d667ded8e", alt: "A river running through a green forest" },
  { id: "1651509094074-e8acaeb84d8f", alt: "A ski lift going up a snowy mountain" },
  { id: "1589808015717-a626de258af0", alt: "Green grass field and mountains" },
];
