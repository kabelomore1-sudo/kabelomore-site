"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
 */
const HIDE_PATTERNS = [
  /^\/scan$/,
  /^\/scan\//,
  /^\/contact$/,
  /^\/brief\//,
  /^\/proposals\//,
];

export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (HIDE_PATTERNS.some((re) => re.test(path))) {
      setHidden(true);
      return;
    }

    const onScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden) return null;

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
          className="md:max-w-[420px] md:rounded-2xl md:border md:border-rule md:bg-white/95 md:shadow-lift md:backdrop-blur-md md:px-2 md:py-2"
        >
          <Link
            href="/scan"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-4 text-base font-semibold text-white shadow-lift transition-colors hover:bg-ink-800 md:py-3"
          >
            Get a free AI scan
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
