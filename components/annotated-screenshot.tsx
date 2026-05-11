"use client";

/**
 * AnnotatedScreenshot — overlay numbered hotspots on top of any visual
 * (image, mockup, custom JSX) with click/tap-to-expand tooltips.
 *
 * Pattern: Appcues / Pendo / Hotjar-style annotation markers.
 *
 * Why this exists:
 *   On /scan, prospects have to submit data before they see what
 *   they'll get back. That's a trust gap — they want to know the
 *   report contains real value, not a one-page generic PDF. Showing
 *   them an annotated preview of "here's what's in your report"
 *   removes the gap WITHOUT exposing live client data.
 *
 * Children-based API:
 *   <AnnotatedScreenshot hotspots={[...]}>
 *     {anything — an <img>, a custom mockup component, or inline JSX}
 *   </AnnotatedScreenshot>
 *
 * The children render as the "image". The component overlays
 * absolute-positioned hotspot markers on top, positioned by x/y
 * percentages of the children's bounding box.
 *
 * Interaction:
 *   - Click/tap a hotspot to expand its tooltip
 *   - Click anywhere else to close
 *   - Only one hotspot can be active at a time (others dim)
 *   - Keyboard-accessible: Tab to focus, Enter/Space to activate
 *
 * Mobile:
 *   - Hotspots are 32px (well above 44px tap-target if we count the
 *     padded clickable area)
 *   - Tooltips reflow to fit the viewport instead of clipping
 */

import { useEffect, useRef, useState } from "react";

export interface Hotspot {
  /** Horizontal position 0-100 (percent of the children's bounding box) */
  x: number;
  /** Vertical position 0-100 */
  y: number;
  /** Short label shown in the marker (usually a number — auto-assigned if omitted) */
  label?: string;
  /** Heading shown when the hotspot is active */
  title: string;
  /** Body text shown when the hotspot is active */
  description: string;
}

interface Props {
  hotspots: Hotspot[];
  children: React.ReactNode;
  /** Optional caption shown below the visual */
  caption?: string;
  className?: string;
}

export function AnnotatedScreenshot({
  hotspots,
  children,
  caption,
  className = "",
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Outside-click closes the active hotspot
  useEffect(() => {
    if (activeIndex === null) return;
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setActiveIndex(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIndex(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [activeIndex]);

  return (
    <figure
      ref={containerRef}
      className={`overflow-hidden rounded-3xl border border-rule bg-white shadow-soft ${className}`}
    >
      <div className="relative">
        {/* The "screenshot" content — whatever the user passed in */}
        <div className="relative">{children}</div>

        {/* Hotspot markers — absolutely positioned over the content */}
        {hotspots.map((spot, idx) => {
          const isActive = activeIndex === idx;
          const isDimmed = activeIndex !== null && activeIndex !== idx;
          const labelText = spot.label ?? String(idx + 1);
          return (
            <button
              key={`${spot.x}-${spot.y}-${idx}`}
              type="button"
              aria-label={spot.title}
              aria-expanded={isActive}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(isActive ? null : idx);
              }}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              className={`absolute z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-bold transition-all ${
                isActive
                  ? "scale-110 bg-accent-600 text-white shadow-lift ring-4 ring-accent-200"
                  : isDimmed
                    ? "scale-90 bg-ink-300 text-white opacity-40 hover:opacity-80"
                    : "bg-accent-500 text-white shadow-card hover:scale-105 hover:bg-accent-600"
              }`}
            >
              {/* Pulsing ring on idle (only when nothing is active) */}
              {activeIndex === null && (
                <span
                  className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent-400 opacity-50"
                  aria-hidden="true"
                />
              )}
              {labelText}
            </button>
          );
        })}

        {/* Active hotspot tooltip — rendered below the visual on mobile,
            inline-floating on desktop. Positioned at the bottom of the
            container so it never clips off-screen. */}
        {activeIndex !== null && (
          <div
            role="dialog"
            aria-labelledby={`hotspot-${activeIndex}-title`}
            className="absolute inset-x-3 bottom-3 z-30 rounded-2xl border border-rule bg-white p-4 shadow-lift md:inset-x-auto md:right-4 md:max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white">
                {hotspots[activeIndex].label ?? activeIndex + 1}
              </div>
              <div className="flex-1">
                <div
                  id={`hotspot-${activeIndex}-title`}
                  className="text-sm font-semibold text-ink-900"
                >
                  {hotspots[activeIndex].title}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">
                  {hotspots[activeIndex].description}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close annotation"
                onClick={() => setActiveIndex(null)}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink-700"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="border-t border-rule bg-ink-50/40 px-5 py-3 text-center text-xs text-ink-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
