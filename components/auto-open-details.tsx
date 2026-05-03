"use client";

/**
 * AutoOpenDetails — wraps a `<details>` element and auto-opens it
 * when the URL hash matches the wrapper's `targetId`.
 *
 * Why: collapsed sections that double as anchor-nav targets create a
 * double-click problem — user clicks the TOC chip, lands on a closed
 * section, has to click again to see content. This component bridges
 * the gap without introducing custom scroll logic.
 *
 * Behaviour:
 *   - On mount: if window.location.hash === `#${targetId}`, open the details
 *   - On hashchange: same check
 *   - User can still manually close after auto-open
 *   - Server-renders as a passive wrapper (no JS state until mount)
 *
 * Why not a CSS-only solution: CSS `:target` can style elements but
 * cannot toggle the `open` attribute on `<details>`. No spec workaround
 * exists in 2026.
 */

import { useEffect, useRef } from "react";

interface Props {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

export function AutoOpenDetails({ targetId, children, className }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function maybeOpen() {
      if (!wrapperRef.current) return;
      if (window.location.hash !== `#${targetId}`) return;
      const details = wrapperRef.current.querySelector("details");
      if (details && !details.open) {
        details.open = true;
      }
    }
    maybeOpen();
    window.addEventListener("hashchange", maybeOpen);
    return () => window.removeEventListener("hashchange", maybeOpen);
  }, [targetId]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
