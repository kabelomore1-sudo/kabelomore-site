"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Mobile-only sticky CTA. Appears after scrolling past the hero
 * (350px), hides on /scan and /contact pages where the form/CTA
 * is already the primary action. Conversion lift on mobile is
 * typically 15-25% with a sticky CTA on service pages.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Hide on /scan and /contact — form is the primary action there
    const path = window.location.pathname;
    if (path === "/scan" || path === "/contact") {
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
      className={`fixed inset-x-0 bottom-0 z-30 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="border-t border-rule bg-white/95 px-5 py-3 shadow-lift backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="truncate text-xs font-medium uppercase tracking-wider text-accent-600">
              Free · 24-hour turnaround
            </div>
            <div className="truncate text-sm font-semibold text-ink-900">
              See what AI says about your business
            </div>
          </div>
          <Link
            href="/scan"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-ink-800"
          >
            Free scan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
