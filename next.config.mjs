import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    // Unsplash photos get a responsive srcset from Unsplash's CDN (see lib/image-loader.ts).
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Cap widths: phones/laptops never need a 3840px photo.
    deviceSizes: [640, 750, 828, 1080, 1280, 1600],
    imageSizes: [96, 128, 256, 384, 480],
    qualities: [35, 75],
  },
  // Pin the project root so Next.js doesn't pick up lockfiles from parent folders.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
