/**
 * next/image loader for a static export.
 * Unsplash photos are resized by Unsplash's CDN (and served as WebP/AVIF via auto=format),
 * so each <Image> gets a real srcset instead of one full-size file.
 * Local files are returned unchanged.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  const url = new URL(src);
  const origW = Number(url.searchParams.get("w")) || width;
  const origH = Number(url.searchParams.get("h"));
  url.searchParams.set("w", String(width));
  if (origH) url.searchParams.set("h", String(Math.round((origH * width) / origW)));
  url.searchParams.set("q", String(quality || 70));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}
