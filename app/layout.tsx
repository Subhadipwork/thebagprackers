import type { Metadata } from "next";
import { Dancing_Script, Inter, Montserrat } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { HERO_PHOTO, photo } from "@/constants/site";

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
  title: {
    default: "The Backpackers | Mountain & Nature Trips from Kolkata",
    template: "%s | The Backpackers",
  },
  description:
    "The Backpackers is a Kolkata-based travel company for mountain and nature trips to Meghalaya, Arunachal Pradesh and Kashmir. Join a group tour or plan a customized trip. Wander More, Worry Less.",
  keywords: [
    "The Backpackers",
    "Kolkata travel company",
    "Meghalaya tour",
    "Arunachal Pradesh tour",
    "Kashmir tour",
    "mountain trips",
    "group tours",
    "customized tours",
  ],
  applicationName: "The Backpackers",
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }] },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "The Backpackers",
    title: "The Backpackers | Wander More, Worry Less.",
    description:
      "Mountain and nature trips from Kolkata to Meghalaya, Arunachal Pradesh and Kashmir. Group and customized tours.",
    images: [{ url: photo(HERO_PHOTO, 1200, 630), width: 1200, height: 630, alt: "Green mountain valley" }],
  },
  other: { "theme-color": "#1F3A2B" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${script.variable}`}>
      <body>
        <Navbar />
        <main id="top">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
