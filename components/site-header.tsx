import Link from "next/link";
import { Button } from "./ui/button";
import { Container } from "./ui/container";
import { navigation, site } from "@/lib/site";

/**
 * Site header — personal-brand styled, like Neil Patel's site.
 *
 * Logo treatment:
 *   - Photo placeholder (small circular avatar, currently a monogram —
 *     swap for real photo file when Kabelo has one)
 *   - Two-line brand: "Kabelo More" (primary) + "kabelomore.com" (subdued)
 *
 * When the real photo is ready, drop it at /public/kabelo-headshot.jpg
 * and uncomment the <Image /> block below — the monogram fallback
 * gets removed automatically.
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
            <BrandAvatar />
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

          {/* Primary nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navigation.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-ink-500 hover:text-ink-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex text-sm text-ink-500 hover:text-ink-900"
            >
              Contact
            </Link>
            <Button href={navigation.cta.href} variant="primary" size="sm">
              {navigation.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}

/**
 * BrandAvatar — circular photo slot.
 *
 * Currently shows a "KM" monogram on a dark gradient. When Kabelo's
 * real photo is ready, replace this component's body with:
 *
 *   import Image from "next/image";
 *   return (
 *     <Image
 *       src="/kabelo-headshot.jpg"
 *       alt="Kabelo More"
 *       width={36}
 *       height={36}
 *       priority
 *       className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
 *     />
 *   );
 */
function BrandAvatar() {
  return (
    <span
      className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white"
      style={{
        background:
          "linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 50%, rgb(245 158 11) 130%)",
      }}
      aria-label="Kabelo More — placeholder for headshot"
    >
      <span className="text-xs font-bold tracking-tight text-white">KM</span>
    </span>
  );
}
