import Link from "next/link";
import { Button } from "./ui/button";
import { Container } from "./ui/container";
import { navigation, site } from "@/lib/site";
import { FounderAvatar } from "./founder-avatar";
import { HeaderNavDesktop, HeaderNavMobile } from "./header-nav";

/**
 * Site header — personal-brand styled, like Neil Patel's site.
 *
 * Sticky top of every page. Two rows on mobile (brand + horizontal
 * scroll-pill nav), one row on desktop (brand + inline nav + CTA).
 *
 * The FounderAvatar component renders Kabelo's photo (if uploaded to
 * /public/images/kabelo-more.jpg) or falls back to a KM monogram on a
 * dark→amber gradient. Auto-detects file presence — no code change
 * needed when photo is dropped in place.
 *
 * The nav links + active-state highlighting live in `HeaderNav*`
 * client components — they need usePathname() to detect the active
 * route, so they're isolated to keep this header server-rendered.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/60 bg-white/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Brand: avatar + two-line name + domain */}
          <Link
            href="/"
            className="flex items-center gap-3 text-ink-900 hover:text-ink-700"
          >
            <FounderAvatar size={36} />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[1.02rem] font-semibold tracking-tight">
                {site.brand}
              </span>
              <span className="text-[0.68rem] font-mono text-ink-400">
                {site.brandDomain}
              </span>
            </span>
            {/* Mobile: just the name */}
            <span className="text-[1.02rem] font-semibold tracking-tight sm:hidden">
              {site.brand}
            </span>
          </Link>

          {/* Desktop primary nav (active-aware) */}
          <HeaderNavDesktop />

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button href={navigation.cta.href} variant="primary" size="sm">
              {navigation.cta.label}
            </Button>
          </div>
        </div>
      </Container>

      {/* Mobile primary nav — horizontal scroll pills, active-aware.
          Lives inside the same sticky header so it remains visible at
          all times. Hidden on md+ where the inline desktop nav covers it. */}
      <HeaderNavMobile />
    </header>
  );
}
