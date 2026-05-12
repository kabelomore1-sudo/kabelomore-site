"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Sticky bottom CTA — always-on persistent "Free AI Scan" pill that
 * follows the user as they scroll. Highest-leverage real estate on
 * the site.
 *
 * Behavior:
 *   - Hides on /scan and /contact (form is the primary action there)
 *   - Hides on /scan/[id]/results, /brief/[tier], /proposals/[slug]
 *   - Otherwise: visible after 350px of scroll, full-width pill on
 *     mobile, centered max-420px pill with drop shadow on desktop
 *   - Dismissible: visitor can hit × to hide it for the session. We
 *     persist the dismissal in localStorage so it doesn't reappear
 *     on every page navigation within the session. (Cleared on next
 *     browser restart — gives them another shot the next visit.)
 *
 * Why dismissible:
 *   Tester feedback flagged the bar as overlapping body content on
 *   mid-scroll content sections. The layout already has `pb-24` on
 *   <main> to prevent footer-cutoff, but mid-content the bar still
 *   occludes ~64px of the viewport. A dismiss button respects the
 *   visitor's choice without removing the CTA from new sessions.
 */
const HIDE_PATTERNS = [
  /^\/scan$/,
  /^\/scan\//,
  /^\/contact$/,
  /^\/brief\//,
  /^\/proposals\//,
];

// Session-only dismissal — sessionStorage clears when the browser
// closes, so a returning visitor gets the CTA again. We don't use
// localStorage because permanent dismissal could lose us conversions
// from visitors who change their mind days later.
const DISMISSAL_KEY = "kabelomore_sticky_cta_dismissed";

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check route-based hiding first
    const path = window.location.pathname;
    if (HIDE_PATTERNS.some((re) => re.test(path))) {
      setHidden(true);
      return;
    }

    // Check session-dismissal flag
    try {
      if (window.sessionStorage.getItem(DISMISSAL_KEY) === "1") {
        setDismissed(true);
      }
    } catch {
      /* sessionStorage disabled — proceed without dismissal memory */
    }

    const onScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleDismiss() {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISSAL_KEY, "1");
    } catch {
      /* silently ignore — fallback is in-memory only for this page */
    }
  }

  if (hidden || dismissed) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      {/* Mobile: full-width bar with prominent button.
          Desktop: centered pill with subtle gradient backdrop. */}
      <div className="px-4 pb-4 pt-2 md:flex md:justify-center md:px-0 md:pb-6">
        <div
          className="relative md:max-w-[420px] md:rounded-2xl md:border md:border-rule md:bg-white/95 md:shadow-lift md:backdrop-blur-md md:px-2 md:py-2"
        >
          {/* Dismiss button — top-right corner. Tap target is 32px to
              clear the iOS Safari accidental-tap heuristic. Positioned
              so it doesn't compete with the primary CTA. */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss this CTA for this session"
            className="absolute -top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-500 shadow-soft ring-1 ring-rule hover:text-ink-900 md:-top-3"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <Link
            href="/scan"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-4 text-base font-semibold text-white shadow-lift transition-colors hover:bg-ink-800 md:py-3"
          >
            Get your free AI scan
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="mt-1.5 text-center text-[11px] font-medium text-ink-500">
            Free · 24-hour turnaround · No card
          </div>
        </div>
      </div>
    </div>
  );
}
