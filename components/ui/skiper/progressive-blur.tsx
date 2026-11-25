/**
 * ProgressiveBlur — adapted from Skiper UI "Progressive Blur" (skiper41).
 * https://skiper-ui.com · Author: @gurvinder-singh02
 * License: free for personal and commercial use; attribution to Skiper UI required (see site footer).
 */

export function ProgressiveBlur({
  className = "",
  backgroundColor = "#FBF8F1",
  position = "bottom",
  height = "150px",
  blurAmount = "4px",
}: {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
}) {
  const isTop = position === "top";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-0 w-full select-none ${className}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, #000 50%, transparent)`
          : `linear-gradient(to top, #000 50%, transparent)`,
        WebkitMaskImage: isTop
          ? `linear-gradient(to bottom, #000 50%, transparent)`
          : `linear-gradient(to top, #000 50%, transparent)`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
      }}
    />
  );
}
