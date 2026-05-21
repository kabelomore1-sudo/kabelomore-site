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

export const PRICING_VERSION = "v1.1.0";
export const PRICING_LAST_UPDATED = "2026-05-16";
export const CURRENCY = "ZAR";
export const CURRENCY_SYMBOL = "R";

/**
 * Section variant:
 *   - "deliverable" (default) — the work included in the package.
 *     Rendered as the primary list.
 *   - "prerequisite" — what the client needs to provide. Rendered
 *     smaller / collapsible (it's information, not deliverables).
 *   - "platform"    — platform-compatibility notes. Same treatment
 *     as prerequisite.
 *
 * Variants exist because the pricing page renders sections with
 * different visual weight — primary deliverables get the bulleted
 * checklist, prereqs/platform-notes get a quieter <details> block.
 */
type SectionVariant = "deliverable" | "prerequisite" | "platform";
type DeliverableSection = {
  heading: string;
  items: readonly string[];
  variant?: SectionVariant;
};

export const PACKAGES = {
  // ─── Google Business Profile Setup (was "Starter") ─────────────
  // GBP-led repositioning. Slug stays "starter" so every existing
  // data-tier attribute, Stripe ref, intake-brief lookup, and
  // recommendation-engine mapping keeps resolving.
  starter: {
    name: "Google Business Profile Setup",
    subtitle: "+ Citations Foundation",
    price: 5000,
    priceType: "once-off",
    slug: "starter",
    tagline: "The fastest visible win in local + AI search.",
    description:
      "GBP claimed and optimized, plus 10 directory citations with NAP consistency.",
    sections: [
      {
        heading: "Google Business Profile",
        items: [
          "Complete listing setup and optimization (categories, hours, services)",
          "Photo optimization and strategic placement (you supply photos; photographer recommendations available if needed)",
          "Q&A section seeded with 8-10 common customer questions (we draft, you approve)",
          "Business attributes configured (payment methods, accessibility features, service options)",
          "First-month GBP posts (4 posts drafted, scheduled, and published one per week for 30 days)",
          "90-day post calendar template with content categories and example structures",
          "Brief training on how to create and schedule future posts yourself",
          "Review acquisition system (WhatsApp/SMS templates, optimal timing guidance, negative review response templates)",
        ],
      },
      {
        heading: "Citations",
        items: [
          "10 directory citations submitted (Brabys, Cylex, HelloPeter, plus industry-specific directories)",
          "NAP consistency verified (Name, Address, Phone matching across every listing — how AI engines verify you're a real business)",
          "Citation tracking spreadsheet for your records",
        ],
      },
    ] satisfies readonly DeliverableSection[],
    timeInvestment: "12-16 hours",
  },

  // ─── Optimization Pack ──────────────────────────────────────────
  // 5 deliverable sections + 2 collapsible info sections
  // (prerequisites, platform notes). The card visibly opens with
  // GBP work, then layers in the AEO depth (schema, measurement,
  // content), then hides prereqs/platform under <details>.
  optimizationPack: {
    name: "Optimization Pack",
    price: 10500,
    priceType: "once-off",
    slug: "optimization-pack",
    isModal: true,
    tagline: "The full AEO layer in 3 weeks",
    description:
      "GBP rebuild + schema + measurement + AI-shaped content + 10 citations. The full AEO layer for an existing website.",
    sections: [
      {
        heading: "Google Business Profile (rebuild)",
        items: [
          "Complete GBP rebuild with optimization",
          "Photo optimization and strategic placement",
          "Q&A seeding, attributes, business details",
          "30-day post calendar with 4 posts drafted and scheduled",
          "90-day post calendar template",
          "Review acquisition system",
        ],
      },
      {
        heading: "Citations",
        items: [
          "10 directory citations with NAP consistency (Name, Address, Phone matching everywhere)",
          "Citation tracking spreadsheet",
        ],
      },
      {
        heading: "Schema & technical",
        items: [
          "Structured data markup (JSON-LD schemas) across all service pages — code that tells Google and AI engines what each page is about",
          "AI access files (llms.txt and robots.txt) rebuilt with AI bot allows — instructions telling ChatGPT, Claude, Gemini, Perplexity they're welcome to read your site",
          "Schema markup validation and testing",
        ],
      },
      {
        heading: "Measurement foundation",
        items: [
          "Google Analytics 4 (GA4) — tracking how visitors use your website",
          "Google Search Console (GSC) — tracking how Google sees your site",
          "Bing Webmaster Tools with IndexNow — Microsoft search visibility",
          "Microsoft Clarity — heatmaps showing what visitors actually click",
          "Day 0 baseline and Day 30 progress measurement",
        ],
      },
      {
        heading: "Content",
        items: [
          "3 priority pages rewritten in answer-shape format (structured to answer the questions customers actually ask AI)",
          "10-12 frequently asked questions added with FAQPage schema (so AI engines can quote individual answers in their responses)",
        ],
      },
      {
        heading: "Prerequisites (you provide)",
        variant: "prerequisite",
        items: [
          "Full administrative access to your website CMS",
          "Hosting login OR ability to grant temporary access",
          "Existing brand assets (logo, colors, copy)",
          "Don't have full access? See \"What if I can't grant full access?\" in FAQs",
        ],
      },
      {
        heading: "Platform notes",
        variant: "platform",
        items: [
          "WordPress, Squarespace, Wix, Webflow, Shopify: full scope",
          "Custom-built platforms: discovery call required",
          "No CMS or static site: Foundation Build Lite recommended instead",
        ],
      },
    ] satisfies readonly DeliverableSection[],
    timeInvestment: "32-40 hours",
    billing: "50% deposit, 50% on Day 30 delivery",
  },

  // ─── Foundation Build Lite ──────────────────────────────────────
  // Repriced 2026-05-16: R12,500 → R9,500. Honest math: ~R3,500-4k
  // for the one-page site (SA market range), ~R5,500-6k for the
  // bundled AEO foundation work.
  foundationBuildLite: {
    name: "Foundation Build Lite",
    subtitle: "Website + AEO foundation for businesses starting from scratch",
    price: 9500,
    priceType: "once-off",
    slug: "foundation-build-lite",
    tagline:
      "For service businesses that don't have a website — yet.",
    description:
      "One-page mobile-first site built with AEO baked in from launch. Same Optimization Pack layer, smaller scope.",
    sections: [
      {
        heading: "Website build",
        items: [
          "One-page website built mobile-first (designed to work perfectly on phones first, since most customers visit from their phone)",
          "Five core sections: introduction, About your business, services offered, frequently asked questions, contact details",
          "All content writing (we draft the copy, you approve)",
          "Built on WordPress or modern web technology (Next.js) — depending on what fits your business best",
          "Hosting setup with you owning the domain and account",
          "Domain configuration support",
          "30-day post-launch support",
        ],
      },
      {
        heading: "Google Business Profile",
        items: [
          "Complete listing setup and optimization",
          "Photo optimization and strategic placement (you supply photos; photographer recommendations available if needed)",
          "Q&A section seeded (we draft 8-10 common customer questions, you approve)",
          "Business attributes configured",
          "First-month posts (4 posts written and scheduled, one per week)",
          "Review acquisition system (WhatsApp/SMS templates, response templates)",
        ],
      },
      {
        heading: "AEO foundation",
        items: [
          "Structured data markup (JSON-LD schemas) — code that tells Google and AI engines what your business does",
          "AI access files (llms.txt and robots.txt) — instructions allowing ChatGPT, Claude, Gemini, Perplexity to read your site",
          "Measurement setup — Google Analytics 4, Google Search Console, Bing Webmaster Tools, Microsoft Clarity",
          "Day 0 baseline scan + Day 30 progress measurement",
        ],
      },
      {
        heading: "Citations",
        items: [
          "10 directory citations submitted (Brabys, Cylex, HelloPeter, plus industry-specific directories)",
          "NAP consistency verified",
        ],
      },
    ] satisfies readonly DeliverableSection[],
    timeInvestment: "25-32 hours",
  },

  // ─── Foundation Build ───────────────────────────────────────────
  // Repriced 2026-05-16: R18,500-R24,500 → R14,500-R19,500. Honest
  // math: R6k-11k website (3-9 pages, SA market range) + R8,500-9,500
  // bundled AEO foundation. priceNote surfaces "final price depends
  // on scope" on the card.
  foundationBuild: {
    name: "Foundation Build",
    subtitle: "Multi-page website + AEO foundation for established businesses",
    priceMin: 14500,
    priceMax: 19500,
    priceType: "once-off",
    slug: "foundation-build",
    priceNote:
      "Final price depends on number of pages and scope — confirmed after free scan",
    tagline:
      "For service businesses where one page isn't enough.",
    description:
      "3-9 page mobile-first site with AEO baked in from line one. Custom design, all content writing included.",
    sections: [
      {
        heading: "Website build",
        items: [
          "3-9 page website built mobile-first (works perfectly on phones)",
          "Custom design (not template-based)",
          "All content writing (we draft, you approve)",
          "Built on WordPress or modern web technology (Next.js)",
          "Hosting setup with you owning the domain and account",
          "Domain configuration support",
          "30-day post-launch support",
        ],
      },
      {
        heading: "Google Business Profile",
        items: [
          "Complete listing setup and optimization",
          "Photo optimization and strategic placement",
          "Q&A section seeded",
          "Business attributes configured",
          "First-month posts (4 posts written and scheduled)",
          "Review acquisition system",
        ],
      },
      {
        heading: "AEO foundation",
        items: [
          "Structured data markup (JSON-LD schemas) across all service pages",
          "AI access files (llms.txt and robots.txt)",
          "Measurement setup (Google Analytics 4, Google Search Console, Bing Webmaster Tools, Microsoft Clarity)",
          "3 priority pages rewritten in answer-shape format (structured to directly answer the questions your customers ask AI engines)",
          "10-12 frequently asked questions added with FAQPage schema (so AI engines can quote individual answers in their responses)",
          "Day 0 baseline scan + Day 30 progress measurement",
        ],
      },
      {
        heading: "Citations",
        items: [
          "10 directory citations with NAP consistency",
          "Citation tracking spreadsheet",
        ],
      },
    ] satisfies readonly DeliverableSection[],
    timeInvestment: "40-60 hours",
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
    description:
      "The standard retainer for clients who want to keep compounding their AI visibility work after the initial setup.",
    sections: [
      {
        heading: "AEO maintenance & growth",
        items: [
          "Monthly AI engine rescan across ChatGPT, Claude, Gemini, Perplexity",
          "Citation building (3-5 new directories per month)",
          "1 cornerstone AEO content piece per month (article structured around questions customers ask AI engines)",
          "1-page progress report with measured improvements",
        ],
      },
      {
        heading: "Google Business Profile",
        items: [
          "4 GBP posts per month (drafted, scheduled, published)",
          "Review acquisition push (target 5-8 reviews per month)",
          "Response management for incoming reviews",
          "Monthly GBP performance review",
        ],
      },
      {
        heading: "Content & authority",
        items: [
          "4 LinkedIn company posts + 2 personal posts per month",
          "1 short video per month (90-second format for LinkedIn/social)",
          "Strategic editorial direction",
        ],
      },
      {
        heading: "Client service",
        items: [
          "Monthly 60-minute strategy call",
          "Quarterly rescan + strategy review",
          "Ongoing scope flexibility (swap deliverables based on monthly priorities)",
        ],
      },
    ] satisfies readonly DeliverableSection[],
  },
  premium: {
    name: "Premium",
    priceMin: 10500,
    priceType: "monthly",
    minimumMonths: 6,
    slug: "premium",
    tagline: "Visibility + workflow automation + PR",
    description:
      "For clients ready for category leadership. Daily content cadence, paid ads management, PR outreach, and weekly strategy calls — on top of everything in Growth.",
    priceNote:
      "Paid advertising spend is billed separately by Google/platforms directly to your account. Retainer covers management work only.",
    sections: [
      {
        heading: "Everything in Growth Retainer",
        items: ["All Growth retainer deliverables (see above)"],
      },
      {
        heading: "Advanced content",
        items: [
          "Daily content cadence across platforms",
          "2 short videos per month",
          "Monthly email newsletter (drafted and scheduled)",
          "Quarterly community event coordination",
        ],
      },
      {
        heading: "Paid growth",
        items: [
          "Local Google Ads management (ad spend separate, billed by Google directly to your account)",
          "Waze advertising management where applicable (ad spend separate)",
        ],
      },
      {
        heading: "PR & outreach",
        items: [
          "Influencer and partner outreach",
          "Media list management",
          "Press release distribution",
        ],
      },
      {
        heading: "Client service",
        items: [
          "Weekly 30-minute strategy calls",
          "Quarterly business review",
        ],
      },
    ] satisfies readonly DeliverableSection[],
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
