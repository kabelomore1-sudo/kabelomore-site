"use client";

import { useEffect, useState } from "react";

/**
 * ScrollToTop — small dark pill that appears in the bottom-right after
 * 400px of scroll. Smooth-scrolls back to top when clicked.
 *
 * Positioning: bottom-24 (96px) so it sits ABOVE the sticky scan bar.
 * Mobile: right-5. Desktop: right-8 / bottom-28 for more breathing room.
 *
 * Hidden until scroll threshold is met. No animation on entry — just
 * conditional render.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-white shadow-card transition-all duration-200 hover:bg-ink-800 active:scale-95 md:bottom-28 md:right-8"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
