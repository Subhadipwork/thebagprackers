import type { Metadata } from "next";
import { Dancing_Script, Inter, Montserrat } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ScrollProgressRing } from "@/components/ui/skiper/scroll-progress-ring";
import StructuredData from "@/components/StructuredData";
import { HERO_PHOTO, SITE, SITE_URL, photo } from "@/constants/site";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Backpackers | Mountain & Nature Trips from Kolkata",
    template: "%s | The Backpackers",
  },
  description: SITE.description,
  keywords: [
    "The Backpackers",
    "travel company in Kolkata",
    "Meghalaya tour from Kolkata",
    "Arunachal Pradesh tour",
    "Kashmir tour package",
    "mountain trips",
    "group tours",
    "customized tours",
  ],
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }] },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE.name,
    title: "The Backpackers | Wander More, Worry Less.",
    description: SITE.description,
    images: [{ url: photo(HERO_PHOTO, 1200, 630), width: 1200, height: 630, alt: "Green mountain valley with a waterfall" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Backpackers | Wander More, Worry Less.",
    description: SITE.description,
    images: [photo(HERO_PHOTO, 1200, 630)],
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the code from Google Search Console (HTML tag method).
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  other: { "theme-color": "#1F3A2B" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${display.variable} ${script.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <StructuredData />
      </head>
      <body>
        <Navbar />
        <main id="top">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollProgressRing />
      </body>
    </html>
  );
}
