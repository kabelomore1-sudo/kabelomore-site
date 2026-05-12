"use client";

/**
 * BeforeAfter — toggle between two visual states ("before AEO" /
 * "after AEO") to show the gap viscerally.
 *
 * Design decision: TOGGLE, not draggable slider.
 *
 * Slider sliders look impressive but introduce three real problems:
 *   1. Touch handling on mobile is fiddly — drag conflicts with page
 *      scroll, requires manual gesture detection, breaks on iOS Safari
 *   2. Doesn't keyboard-accessible without extra ARIA work
 *   3. Discoverability — many users don't realise it's draggable;
 *      A/B tests at Optimizely + UserTesting show toggle outperforms
 *      slider on first-time-visitor pages
 *
 * Toggle is one tap, works everywhere, accessible by default, and
 * communicates the same "two states" idea without gimmickry.
 *
 * Usage:
 *   <BeforeAfter
 *     beforeLabel="Before AEO"
 *     afterLabel="After AEO"
 *     before={<SomeJSX />}
 *     after={<SomeOtherJSX />}
 *   />
 *
 * The `before` and `after` children can be any JSX — screenshots,
 * AI conversation mockups, code blocks, GBP cards, etc. The component
 * doesn't own the content, just the toggle UX.
 */

import { useState } from "react";

interface Props {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Caption shown above the toggle — frames what the comparison is */
  caption?: string;
  /** Optional subcaption for context */
  subcaption?: string;
  className?: string;
}

export function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  subcaption,
  className = "",
}: Props) {
  const [showing, setShowing] = useState<"before" | "after">("before");

  return (
    <div className={`overflow-hidden rounded-3xl border border-rule bg-white shadow-soft ${className}`}>
      {/* Caption row */}
      {(caption || subcaption) && (
        <header className="border-b border-rule bg-ink-50/40 px-6 py-4">
          {caption && (
            <div className="text-sm font-semibold text-ink-900">{caption}</div>
          )}
          {subcaption && (
            <div className="mt-0.5 text-xs text-ink-500">{subcaption}</div>
          )}
        </header>
      )}

      {/* Toggle controls — segmented, accessible by keyboard */}
      <div
        role="tablist"
        aria-label="Compare before and after"
        className="flex items-center gap-2 border-b border-rule bg-white px-6 py-3"
      >
        <button
          type="button"
          role="tab"
          aria-selected={showing === "before"}
          onClick={() => setShowing("before")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all md:flex-none md:px-5 ${
            showing === "before"
              ? "bg-rose-100 text-rose-700"
              : "bg-ink-50 text-ink-500 hover:bg-ink-100"
          }`}
        >
          {beforeLabel}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={showing === "after"}
          onClick={() => setShowing("after")}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all md:flex-none md:px-5 ${
            showing === "after"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-ink-50 text-ink-500 hover:bg-ink-100"
          }`}
        >
          {afterLabel}
        </button>
        <div className="ml-auto hidden text-[10px] uppercase tracking-wider text-ink-400 md:block">
          Tap to compare
        </div>
      </div>

      {/* Content panes — fade between states via CSS opacity transition.
          Both stay in the DOM so the height doesn't jump on toggle.
          Each pane has a tinted background (rose for BEFORE, emerald for
          AFTER) so the state change is unmistakable at a glance. The
          tint is subtle (50/30 opacity) so it doesn't fight the content. */}
      <div className="relative">
        <div
          role="tabpanel"
          aria-label="Before state"
          aria-hidden={showing !== "before"}
          className={`bg-rose-50/40 p-5 transition-opacity duration-300 md:p-6 ${
            showing === "before"
              ? "opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0"
          }`}
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600" aria-hidden="true" />
            Before AEO
          </div>
          {before}
        </div>
        <div
          role="tabpanel"
          aria-label="After state"
          aria-hidden={showing !== "after"}
          className={`bg-emerald-50/40 p-5 transition-opacity duration-300 md:p-6 ${
            showing === "after"
              ? "opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0"
          }`}
        >
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
            After AEO
          </div>
          {after}
        </div>
      </div>
    </div>
  );
}
