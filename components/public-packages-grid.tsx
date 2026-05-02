"use client";

/**
 * 3-card public package grid for /services.
 *
 * Replaces the 14-tier menu with a guided 3-tier ladder:
 *   - Starter (basics first)
 *   - Growth — Recommended (the default fit for most businesses)
 *   - Premium / Systems (high-value + automation)
 *
 * Recommended tier is visually amplified (scale + ring + badge).
 *
 * Each card emits a `package_card_view` track event when first scrolled
 * into view, and a `services_cta_click` event on CTA click.
 */

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Cog,
} from "lucide-react";
import {
  publicPackages,
  type PublicPackage,
} from "@/lib/public-packages";
import { track } from "@/lib/track";

const packageIcons = {
  starter: Zap,
  growth: Sparkles,
  premium: Cog,
} as const;

export function PublicPackagesGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3 md:gap-5">
      {publicPackages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}

function PackageCard({ pkg }: { pkg: PublicPackage }) {
  const ref = useRef<HTMLElement>(null);
  const Icon = packageIcons[pkg.id];

  // Fire a 'package_card_view' event when the card scrolls into view
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            track("package_card_view", { packageId: pkg.id });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pkg.id]);

  const handleCtaClick = () => {
    track("services_cta_click", { cta: "package-card", packageId: pkg.id });
  };

  // Highlighted ('Recommended') card gets visual amplification
  const cardClasses = pkg.highlight
    ? "relative rounded-3xl border-2 border-accent-500 bg-white p-7 shadow-lift md:scale-[1.02] md:p-8"
    : "rounded-3xl border border-rule bg-white p-7 shadow-soft md:p-8";

  return (
    <article ref={ref} className={cardClasses}>
      {pkg.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
            Recommended
          </span>
        </div>
      )}

      {/* Header: icon + name + tagline */}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
            pkg.highlight
              ? "bg-accent-500 text-white"
              : "bg-ink-100 text-ink-700"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
            {pkg.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-accent-600">
            {pkg.positioning}
          </p>
        </div>
      </div>

      {/* Who this is for — direct address */}
      <p className="mt-6 text-sm text-ink-700 leading-relaxed">
        <strong className="text-ink-900">Who it's for:</strong> {pkg.who}
      </p>

      {/* Why it matters — outcome-led */}
      <p className="mt-3 text-sm text-ink-600 leading-relaxed">{pkg.why}</p>

      {/* Pricing */}
      <div className="mt-6 border-t border-rule pt-5">
        <div className="text-2xl font-bold text-ink-900">{pkg.price.sa}</div>
        <div className="mt-0.5 text-xs text-ink-500">
          {pkg.price.intl} · {pkg.payment}
        </div>
      </div>

      {/* Highlights — outcome-shaped */}
      <ul className="mt-5 space-y-2.5">
        {pkg.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2
              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                pkg.highlight ? "text-accent-600" : "text-emerald-500"
              }`}
            />
            <span className="text-ink-700 leading-snug">{highlight}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-7">
        <Link
          href={pkg.cta.href}
          onClick={handleCtaClick}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
            pkg.highlight
              ? "bg-ink-900 text-white shadow-soft hover:bg-ink-800 hover:shadow-card"
              : "border-2 border-ink-900 text-ink-900 hover:bg-ink-50"
          }`}
        >
          {pkg.cta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Soft "next step" hint */}
      <p className="mt-4 text-center text-xs italic text-ink-500">
        {pkg.nextStep}
      </p>
    </article>
  );
}
