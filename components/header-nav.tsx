"use client";

/**
 * HeaderNav — primary site navigation with active-state highlighting
 * across desktop + mobile.
 *
 * Layout:
 *   - Desktop (≥md): inline links rendered in the existing header bar.
 *     Active link gets a subtle dark color + underline-on-hover treatment.
 *   - Mobile  (<md): horizontal-scroll pill bar shown BELOW the brand row
 *     (within the same sticky header so it never disappears). Pills are
 *     rounded chips with the active one filled in dark; tapping scrolls
 *     the active pill into view on first render so users always see
 *     where they are.
 *
 * Why two presentations:
 *   - Mobile lost ALL navigation in the previous header (nav was
 *     hidden md:flex). Adding a hamburger drawer was tempting but
 *     adds 2 components + state + ARIA + focus-trap logic. A sticky
 *     pill bar is one tap fewer per navigation, always visible, and
 *     matches a pattern users see daily on Twitter/X, Reddit, etc.
 *   - Desktop already has horizontal real estate; inline links are
 *     scannable and don't waste vertical pixels.
 *
 * Active detection:
 *   We treat `/` specially (only active when path === "/") and other
 *   routes as active when the current path starts with their href.
 *   This covers nested routes like /services#packages or /scan/preview
 *   highlighting their parent nav item.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { navigation } from "@/lib/site";

interface NavItem {
  label: string;
  href: string;
}

export function HeaderNavDesktop() {
  const pathname = usePathname() ?? "/";
  return (
    <nav
      aria-label="Primary"
      className="hidden md:flex items-center gap-6 lg:gap-7"
    >
      {navigation.primary.map((item) => {
        const active = isActive(item, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`text-sm transition-colors ${
              active
                ? "font-semibold text-ink-900"
                : "text-ink-500 hover:text-ink-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function HeaderNavMobile() {
  const pathname = usePathname() ?? "/";
  const containerRef = useRef<HTMLDivElement>(null);

  // On first render, scroll the active pill into view so users on a deep
  // page (e.g. /pricing) immediately see the highlighted "Pricing" pill
  // instead of "Overview / Scan / Services" stuck at the start.
  useEffect(() => {
    if (!containerRef.current) return;
    const active = containerRef.current.querySelector<HTMLAnchorElement>(
      '[data-active="true"]',
    );
    if (active) {
      active.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "center",
      });
    }
  }, [pathname]);

  return (
    <nav
      aria-label="Primary (mobile)"
      className="md:hidden border-t border-rule/60 bg-white/85 backdrop-blur-md"
    >
      <div
        ref={containerRef}
        className="flex gap-1.5 overflow-x-auto px-4 py-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {navigation.primary.map((item) => {
          const active = isActive(item, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active ? "true" : "false"}
              aria-current={active ? "page" : undefined}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-ink-900 text-white"
                  : "bg-ink-50 text-ink-700 hover:bg-ink-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Active-state helper ──────────────────────────────────────────
function isActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  // Nested-path matching: /services covers /services/anything,
  // /scan covers /scan/preview, /scan/[id]/results, etc.
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
