"use client";

/**
 * DashboardSectionToc — sticky section navigation for the long
 * preview/results dashboard.
 *
 * Two presentations:
 *   - Desktop (≥md): horizontal pill bar, sticky to viewport top
 *   - Mobile  (<md): "Jump to section ▾" dropdown — a single button
 *                    that opens a vertical list, closes on selection
 *
 * Why two presentations:
 *   Horizontal scroll pills work on mobile but require swiping to
 *   reach the right-side chips. A native-feeling dropdown is faster:
 *   tap → see all sections → tap one → scroll there → dropdown closes.
 *   Desktop has the horizontal real-estate, so a flat pill bar
 *   is the most scannable + lowest-friction pattern.
 *
 * Why this and not tabs / accordions / carousel:
 *   - Tabs hide content. The dashboard's emotional impact relies on
 *     felt repetition across sections (every chart reinforces the
 *     same finding). Hiding 6 of 7 charts would gut that.
 *   - Accordions break print/PDF and just shuffle scroll-length
 *     rather than reduce it.
 *   - Carousels destroy content discoverability — content drops to
 *     1/N visibility per swipe.
 *   - A sticky TOC adds zero friction (still scrollable as before)
 *     but gives users a jump button. Naval-shape: minimum gimmick,
 *     maximum function.
 *
 * Behaviour:
 *   - Renders only chips for sections whose ID exists in the DOM
 *     (defensive against subset rendering — e.g. preview vs full
 *     results page may differ)
 *   - Active section highlights as the user scrolls
 *     (IntersectionObserver with rootMargin tuned to the middle
 *     band of the viewport)
 *   - Anchor links use native CSS scroll-behavior + scroll-mt
 *     (no custom JS smooth-scroll logic — fewer bugs)
 *   - Mobile dropdown closes when a link is tapped, on outside
 *     click, or on ESC
 */

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface TocItem {
  id: string;
  label: string;
}

// Order matters — chips render left-to-right on desktop, top-to-bottom
// on mobile. Sequence follows the natural scroll order of the dashboard.
const SECTIONS: TocItem[] = [
  { id: "score", label: "Score" },
  { id: "responses", label: "AI engines" },
  { id: "layers", label: "Signals" },
  { id: "citations", label: "Citations" },
  { id: "issues", label: "Fixes" },
  { id: "competitors", label: "Competitors" },
  { id: "decide", label: "Get started" },
];

export function DashboardSectionToc() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [availableIds, setAvailableIds] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  // Detect which section IDs exist in the DOM. We render chips only
  // for sections that are actually present on this page.
  useEffect(() => {
    const present = new Set<string>();
    for (const s of SECTIONS) {
      if (document.getElementById(s.id)) present.add(s.id);
    }
    setAvailableIds(present);
  }, []);

  // Track which section is most-visible.
  // rootMargin shrinks the trigger band to the middle 20% of viewport
  // — reduces flicker when sections are close together.
  useEffect(() => {
    if (availableIds.size === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio,
          );
          setActiveId(intersecting[0].target.id);
        }
      },
      {
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

  // Close mobile dropdown on outside click / ESC.
  useEffect(() => {
    if (!mobileOpen) return;
    function onClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const visibleSections = SECTIONS.filter((s) => availableIds.has(s.id));
  if (visibleSections.length < 2) return null; // Not worth rendering for 0-1 items

  const activeSection =
    visibleSections.find((s) => s.id === activeId) ?? visibleSections[0];

  return (
    <nav
      ref={containerRef}
      aria-label="Dashboard sections"
      className="sticky top-0 z-30 -mx-4 mb-4 border-b border-rule bg-white/90 backdrop-blur-md md:-mx-6"
    >
      {/* ─── Mobile: 'Jump to section ▾' dropdown ─── */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((s) => !s)}
          aria-expanded={mobileOpen}
          aria-controls="dashboard-toc-mobile-list"
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm"
        >
          <span className="text-ink-500">
            Jump to:{" "}
            <strong className="font-semibold text-ink-900">
              {activeSection.label}
            </strong>
          </span>
          <ChevronDown
            className={`h-4 w-4 flex-shrink-0 text-ink-500 transition-transform ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {mobileOpen && (
          <ul
            id="dashboard-toc-mobile-list"
            className="border-t border-rule bg-white"
          >
            {visibleSections.map((s) => {
              const isActive = s.id === activeId;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between border-b border-rule/60 px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-ink-50 font-semibold text-ink-900"
                        : "text-ink-700 hover:bg-ink-50/60"
                    }`}
                  >
                    <span>{s.label}</span>
                    {isActive && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-700">
                        Now
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ─── Desktop: horizontal pill bar ─── */}
      <div className="hidden md:block">
        <ul className="flex gap-1 overflow-x-auto px-6 py-2">
          {visibleSections.map((s) => {
            const isActive = s.id === activeId;
            return (
              <li key={s.id} className="flex-shrink-0">
                <a
                  href={`#${s.id}`}
                  className={`inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ink-900 text-white shadow-soft"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
