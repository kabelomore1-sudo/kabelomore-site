/**
 * Canonical pricing source of truth for kabelomore.com.
 *
 * This file is the SINGLE source for every pricing string surfaced on
 * the site. /pricing, /services, the homepage FAQ, the scan results
 * package menu, and any future surface all import from here.
 *
 * Versioned because pricing decisions are not edits — they're product
 * changes. When PRICING_VERSION bumps, every consumer should pull and
 * verify their display copy matches.
 *
 * Locked structure as of 2026-05-14. Do not invent variations. If a
 * surface needs a price not in this file, the right move is to add
 * it here (with rationale in the diff) — not to hardcode it elsewhere.
 */

export const PRICING_VERSION = "v1.0.0";
export const PRICING_LAST_UPDATED = "2026-05-14";
export const CURRENCY = "ZAR";
export const CURRENCY_SYMBOL = "R";

export const PACKAGES = {
  starter: {
    name: "Starter",
    price: 5000,
    priceType: "once-off",
    slug: "starter",
    tagline: "For solo professionals and small service businesses",
    description:
      "Foundations: schema, GBP, 10 directory listings, basic measurement.",
    deliverables: [
      "Google Analytics 4 + Google Search Console verified",
      "Organization/LocalBusiness schema on homepage",
      "10 directory citations",
      "Google Business Profile claim and basic setup",
      "Day 0 baseline scan",
    ],
    timeInvestment: "12-16 hours",
  },
  optimizationPack: {
    name: "Optimization Pack",
    price: 10500,
    priceType: "once-off",
    slug: "optimization-pack",
    isModal: true,
    tagline: "The full AEO layer in 3 weeks",
    description:
      "Schema, GBP rebuild, 10 citations, 3 priority pages rewritten in answer-shape, llms.txt deployed, full measurement stack.",
    deliverables: [
      "Full Measurement Foundation (GA4, GSC, Bing Webmaster Tools with IndexNow, Microsoft Clarity)",
      "JSON-LD schemas across all service pages",
      "llms.txt and robots.txt rebuilt with AI bot allows",
      "GBP complete rebuild with review acquisition workflow",
      "10 directory citations with NAP consistency",
      "3 priority pages rewritten in answer-shape format",
      "10-12 FAQ items deployed with FAQPage schema",
      "LinkedIn company page refresh + sameAs entity graph",
      "Day 0 and Day 30 rescans with progress report",
    ],
    timeInvestment: "32-40 hours",
    billing: "50% deposit, 50% on Day 30 delivery",
  },
  foundationBuildLite: {
    name: "Foundation Build Lite",
    price: 12500,
    priceType: "once-off",
    slug: "foundation-build-lite",
    tagline: "For solo professionals without a website",
    description: "One-page site with full AEO baked in from launch.",
    deliverables: [
      "One-page mobile-first site (5 sections: hero, about, services, FAQ, contact)",
      "WordPress or Next.js build",
      "All content writing (hero, about, services, 8-10 FAQ items)",
      "Hosting setup with client ownership",
      "Domain configuration support",
      "Everything from Optimization Pack baked in",
      "30-day post-launch support",
    ],
    timeInvestment: "25-32 hours",
  },
  foundationBuild: {
    name: "Foundation Build",
    priceMin: 18500,
    priceMax: 24500,
    priceType: "once-off",
    slug: "foundation-build",
    tagline: "For businesses that need a full multi-page site",
    description:
      "Multi-page site built with AEO baked in from line one.",
    deliverables: [
      "3-9+ page site (WordPress or Next.js)",
      "Custom design within chosen template framework",
      "Contact forms with conversion tracking",
      "Mobile-responsive, Core Web Vitals optimised",
      "Hosting setup with client ownership",
      "Domain and business email setup support",
      "Content production for all pages",
      "Everything from Optimization Pack baked in",
      "WordPress plugin stack for WP builds",
      "30-day post-launch support",
    ],
    timeInvestment: "50-70 hours",
  },
} as const;

export const RETAINERS = {
  growth: {
    name: "Growth",
    price: 5500,
    priceType: "monthly",
    minimumMonths: 3,
    slug: "growth",
    isModal: true,
    tagline: "Compounding monthly AEO + citations + LinkedIn",
    description: "The standard retainer for clients post-Foundation.",
    deliverables: [
      "4 LinkedIn company posts + 2 personal posts per month",
      "4 Google Business Profile posts per month",
      "1 short video per month",
      "1 cornerstone content piece per month",
      "3-5 additional directory citations per month",
      "Monthly AI engine rescan + 1-page progress report",
      "Monthly 60-min strategy call",
      "Review acquisition push (target 5-8 reviews per month)",
    ],
  },
  premium: {
    name: "Premium",
    priceMin: 10500,
    priceType: "monthly",
    minimumMonths: 6,
    slug: "premium",
    tagline: "Visibility + workflow automation + PR",
    description: "For clients pursuing category leadership.",
    deliverables: [
      "Everything in Growth, plus daily content cadence",
      "2 short videos per month",
      "Local Google Ads management (ad spend separate)",
      "Waze advertising management where applicable",
      "Monthly email newsletter",
      "Quarterly community event coordination",
      "Influencer and partner outreach",
      "Weekly 30-min strategy calls",
      "Quarterly comprehensive deep audit",
    ],
  },
} as const;

export const HEADLINE_PRICE_RANGE = "R5,000–R10,500 once-off";
export const HEADLINE_RETAINER_RANGE = "R5,500/month from";

export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString("en-ZA")}`;
}

export function formatPriceMonthly(amount: number): string {
  return `${formatPrice(amount)}/month`;
}

export function formatPriceRange(min: number, max?: number): string {
  if (!max) return `from ${formatPrice(min)}`;
  return `${formatPrice(min)}–${formatPrice(max)}`;
}
