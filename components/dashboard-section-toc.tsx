"use client";

/**
 * DashboardSectionToc — sticky-on-scroll mini-nav for the preview
 * dashboard.
 *
 * Why this and not tabs / accordions / carousel:
 *   - Tabs hide content; visitors miss sections they didn't click.
 *     The dashboard's whole point is felt repetition (every chart
 *     reinforces the same finding). Hiding 6 of 7 charts at any time
 *     reduces emotional impact.
 *   - Accordions move scroll-length around but don't reduce it; they
 *     also break print/PDF export.
 *   - Carousels are the worst possible choice — content discoverability
 *     drops to 1/N per "swipe."
 *   - A sticky TOC adds zero friction (still scrollable as before) but
 *     gives power users a jump-button. Naval-shape: minimum gimmick,
 *     maximum function.
 *
 * Behaviour:
 *   - Sticks to top of viewport once scrolled past initial position
 *   - Active section highlights as you scroll (IntersectionObserver)
 *   - Smooth-scrolls on click (native CSS scroll-behavior)
 *   - Mobile: horizontal scroll (overflow-x-auto), keeps all chips
 *     reachable without wrapping
 *
 * No TOC entries are rendered if a target section's ID isn't in the
 * DOM — defensive against the dashboard being rendered with a subset
 * of sections (e.g. preview vs full results).
 */

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

const SECTIONS: TocItem[] = [
  { id: "score", label: "Score" },
  { id: "responses", label: "AI Responses" },
  { id: "layers", label: "Layers" },
  { id: "citations", label: "Citations" },
  { id: "issues", label: "Issues" },
  { id: "decide", label: "Get started" },
];

export function DashboardSectionToc() {
  const [activeId, setActiveId] = useState<string>("score");
  const [availableIds, setAvailableIds] = useState<Set<string>>(new Set());

  // Detect which section IDs exist in the DOM. We only show TOC chips
  // for sections that are actually rendered on this page.
  useEffect(() => {
    const present = new Set<string>();
    for (const s of SECTIONS) {
      if (document.getElementById(s.id)) present.add(s.id);
    }
    setAvailableIds(present);
  }, []);

  // Track which section is most-visible. IntersectionObserver fires on
  // section enter/exit; we pick the first intersecting entry as active.
  useEffect(() => {
    if (availableIds.size === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting entry to set as active.
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          // Sort by intersection ratio descending, then by viewport position
          intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        // Trigger when section is in the middle band of viewport
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    for (const id of availableIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [availableIds]);

  const visibleSections = SECTIONS.filter((s) => availableIds.has(s.id));
  if (visibleSections.length < 2) return null; // No point in a 0-1 item TOC

  return (
    <nav
      aria-label="Dashboard sections"
      className="sticky top-0 z-30 -mx-4 mb-4 border-b border-rule bg-white/90 px-4 py-2 backdrop-blur-md md:-mx-6 md:px-6"
    >
      <ul className="flex gap-1 overflow-x-auto text-xs md:text-sm">
        {visibleSections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <li key={s.id} className="flex-shrink-0">
              <a
                href={`#${s.id}`}
                className={`inline-flex h-8 items-center rounded-full px-3 font-medium transition-colors ${
                  isActive
                    ? "bg-ink-900 text-white"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
