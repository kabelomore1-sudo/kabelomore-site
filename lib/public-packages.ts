/**
 * Public-facing packages — the 3 visible paths on /services.
 *
 * Strategic principle: "Simple outside, flexible inside."
 *
 *   - The PUBLIC menu shows 3 packages: Starter / Growth / Premium
 *   - The INTERNAL tier system (lib/site.ts) keeps all 14 tiers for
 *     CRM, briefs, custom proposals, and Discovery-engine matching
 *   - Each public package maps to one or more internal tiers — the
 *     matching engine picks the right internal tier after Discovery
 *
 * Why 3 instead of 14?
 *   - Decision fatigue kills B2B service-page conversion
 *   - Naval: 'simple outside, flexible inside' = ONE menu choice that
 *     branches into custom delivery
 *   - Neil: pages with 3 tiers convert ~2× pages with 7+ tiers
 *
 * The Discovery form (/discover) IS the matching engine. It collects
 * sector + customer value + current state + goals and outputs ONE
 * recommended public package (with confidence + reasoning).
 */

export type PublicPackageId = "starter" | "growth" | "premium";

export interface PublicPackage {
  id: PublicPackageId;
  name: string;
  /** One-line tagline shown under the name */
  positioning: string;
  /** Who this is for — directly addresses the buyer */
  who: string;
  /** What problem it solves — the buyer's pain in their words */
  problem: string;
  /** Why this matters — outcome, not deliverables */
  why: string;
  /** Concrete next step — what happens if they pick this */
  nextStep: string;
  /** Display price (anchored, not exhaustive) */
  price: { sa: string; intl: string };
  payment: string;
  /** 4-6 highlight bullet points — outcomes, not feature lists */
  highlights: string[];
  /** Internal tier IDs this package can map to (lib/site.ts) */
  internalTierIds: string[];
  /** Mark as "Recommended" / "Most popular" — exactly ONE should be true */
  highlight: boolean;
  /** Primary CTA — usually routes to /discover for matching */
  cta: { label: string; href: string };
}

export const publicPackages: PublicPackage[] = [
  {
    id: "starter",
    name: "Starter",
    positioning: "Get the basics right.",
    who: "Businesses with no website yet — or with a site that AI engines can't read. Or businesses that want to know exactly where they stand before committing to anything ongoing.",
    problem:
      "Your customers can't find you on Google or AI engines. The basics aren't in place: schema, GBP, citations, AI-readable content.",
    why: "Fix the foundation. AI visibility compounds — but only on top of solid basics. Skip this and every monthly investment leaks.",
    nextStep:
      "Free AI scan first. Then a fixed-scope project (R5,000 – R12,500) tailored to what your scan reveals.",
    price: { sa: "From R5,000", intl: "From $295" },
    payment: "Once-off · 50% to start, 50% on delivery",
    highlights: [
      "Free AI Visibility Scan + 24-hour PDF report",
      "Schema markup + Google Business Profile setup",
      "AI-readable website if you don't have one (right scope for your business)",
      "10 trusted business directory listings",
      "Custom quote based on your scan results",
    ],
    internalTierIds: [
      "scan",
      "starter",
      "discovery",
      "foundation",
      "foundation-lite",
      "optimization",
      "optimization-lite",
    ],
    highlight: false,
    cta: { label: "Start with a free scan", href: "/scan" },
  },
  {
    id: "growth",
    name: "Growth",
    positioning: "Compound your visibility every month.",
    who: "Established businesses (medical, legal, industrial) ready to dominate Google + AI search in their category. Where most clients land.",
    problem:
      "Your competitors show up in AI answers. You don't. The work that fixes this — citations, content, LinkedIn, reviews — is repetitive maintenance, not a one-time setup.",
    why: "AI visibility compounds. Six months of consistent work = the difference between being invisible and being THE answer. One new client per quarter pays for the year.",
    nextStep:
      "Take the 10-min Discovery. We'll confirm Growth fits — or recommend a better starting point honestly.",
    price: { sa: "R5,500/month", intl: "$395 / £335 / month" },
    payment: "Monthly · 3-month minimum, cancel anytime after",
    highlights: [
      "Daily AI visibility tracking across ChatGPT, Claude, Gemini, Perplexity",
      "2 long-form articles + LinkedIn ghost-writing every month",
      "5 industry-specific citations per quarter (Medical Board, LSSA, BBBEE, etc.)",
      "Active review velocity (Google + HelloPeter)",
      "Monthly competitive intelligence + 30-min strategy call",
    ],
    internalTierIds: ["growth", "local-growth-lite"],
    highlight: true, // RECOMMENDED — exactly one
    cta: { label: "Take the 10-min Discovery", href: "/discover" },
  },
  {
    id: "premium",
    name: "Premium / Systems",
    positioning: "Visibility + AI workflow automation.",
    who: "Mid-market firms making AI visibility their primary growth channel. Established practices, multi-region firms, or businesses operating at scale who want execution AND systems.",
    problem:
      "You don't just need monitoring. You need execution at velocity, automation that compounds, and someone strategic in your loop without hiring a CMO.",
    why: "When customer value is R100k+, a single client recovers months of investment. Premium combines AI visibility leadership with workflow automation — fewer manual touches, more compounding outputs.",
    nextStep:
      "Apply via Discovery. Premium engagements include a fit-check call before any commitment.",
    price: { sa: "From R10,500/month", intl: "From $750 / £640 / month" },
    payment: "Monthly · 3-month minimum, cancel anytime after",
    highlights: [
      "Everything in Growth at higher velocity (4 articles/mo, 3 LinkedIn/wk)",
      "Industry PR pitches + HARO journalist sourcing",
      "Educational YouTube content + knowledge panel optimisation",
      "Workflow automation (CRM, dashboards, follow-up systems)",
      "Monthly executive call + 24-hour priority SLA",
      "Optional fractional Head of AI Visibility (multi-region firms)",
    ],
    internalTierIds: ["premium", "strategy-partner", "digital-pr"],
    highlight: false,
    cta: { label: "Apply via Discovery", href: "/discover" },
  },
];

/** Helper — get the recommended public package (exactly one should have highlight: true) */
export function getRecommendedPackage(): PublicPackage {
  return publicPackages.find((p) => p.highlight) ?? publicPackages[1];
}

/** Helper — get a public package by ID */
export function getPublicPackage(id: PublicPackageId): PublicPackage {
  return publicPackages.find((p) => p.id === id) ?? publicPackages[1];
}

// ============================================================
// MATCHING ENGINE
// ============================================================

/**
 * Recommendation output from the Discovery matching engine.
 *
 * After a buyer fills /discover, we compute this client-side from
 * their answers using a deterministic decision tree. No AI, no
 * external API call, no latency. Shown immediately on form success.
 */
export interface PackageRecommendation {
  packageId: PublicPackageId;
  package: PublicPackage;
  /** 1-2 sentences explaining WHY this fits THEM specifically */
  reason: string;
  /** Confidence in the match — drives whether we surface 'Talk to Kabelo' fallback */
  confidence: "high" | "medium" | "low";
  /** When true, surface the 'Talk to Kabelo' option more prominently */
  suggestHumanReview: boolean;
}

/**
 * Discovery answer shape — subset of fields the matching engine reads.
 * Keys match lib/discovery-questions.ts question IDs.
 */
export interface DiscoveryAnswerSubset {
  sector?: string;
  averageDealSize?: string;
  currentDigitalSetup?: string[];
  successMetric?: string;
  // Sector-specific
  bbbeeLevel?: string;
}

/**
 * The matching engine.
 *
 * Decision tree (deterministic, no AI):
 *
 *   1. High deal value (R100k+) → Premium
 *      ROI math is overwhelming; they should invest at the top of the ladder.
 *   2. No digital basics + small deal value → Starter
 *      They need foundations before any monthly retainer makes sense.
 *   3. Has GBP/schema/LinkedIn but isn't getting AI cited → Growth
 *      The textbook 'this is who Growth is for' profile.
 *   4. Sector = industrial + BBBEE Level 1-2 → Growth or Premium
 *      Procurement-driven buyers — high LTV, fits Premium if deal size allows.
 *   5. Default fallback → Growth (recommended) with suggestHumanReview = true
 *      When uncertain, recommend the most-converting tier and offer human review.
 */
export function recommendPackage(
  answers: DiscoveryAnswerSubset,
): PackageRecommendation {
  const setup = answers.currentDigitalSetup ?? [];
  const dealSize = answers.averageDealSize;
  const sector = answers.sector;
  const bbbee = answers.bbbeeLevel;

  const hasNoBasics = setup.includes("none-of-above") || setup.length === 0;
  const hasGBP = setup.includes("gbp-claimed");
  const hasSchema = setup.includes("schema-deployed");
  const hasLinkedIn = setup.includes("linkedin-active");
  const hasReviews = setup.includes("reviews-managed");
  const hasIndustryCitations = setup.includes("industry-citations");

  const basicsScore = [hasGBP, hasSchema, hasLinkedIn, hasReviews].filter(
    Boolean,
  ).length;

  // RULE 1: High customer value → Premium
  // The ROI math is decisive. Even one client per year pays for the engagement.
  if (dealSize === "100-500k" || dealSize === "500k-plus") {
    return {
      packageId: "premium",
      package: getPublicPackage("premium"),
      reason:
        dealSize === "500k-plus"
          ? "Your customer value (R500k+) means a single new client could recover an entire year of investment several times over. Premium gives you the execution velocity + systems to capture deals at this size."
          : "With customer value above R100k, a single new client recovers your annual investment. Premium adds the execution depth + automation that compounds at your deal size.",
      confidence: "high",
      suggestHumanReview: false,
    };
  }

  // RULE 2: No digital basics → Starter
  // They need foundations before any monthly retainer is worth running.
  if (hasNoBasics) {
    return {
      packageId: "starter",
      package: getPublicPackage("starter"),
      reason:
        "You don't have the digital basics in place yet. Starting with a Starter project — schema, Google Business Profile, AI-readable website — builds the foundation a monthly retainer compounds on top of. Skip this and any monthly investment leaks.",
      confidence: "high",
      suggestHumanReview: false,
    };
  }

  // RULE 3: Has basics but missing AI signals → Growth
  // The textbook fit. They need ongoing work that compounds.
  if (basicsScore >= 2 && (!hasIndustryCitations || basicsScore < 4)) {
    const sectorMatch =
      sector === "medical"
        ? "medical practice"
        : sector === "legal"
          ? "law firm"
          : sector === "industrial"
            ? "industrial business"
            : "business";

    return {
      packageId: "growth",
      package: getPublicPackage("growth"),
      reason: `Your ${sectorMatch} has solid digital foundations but isn't compounding visibility yet. Growth runs the ongoing content, citation, and LinkedIn work that gets you cited by AI engines and ranked on Google — without you doing the work yourself. Most ${sectorMatch}s in your situation see meaningful citation movement within 30-60 days.`,
      confidence: "high",
      suggestHumanReview: false,
    };
  }

  // RULE 4: Industrial + BBBEE Level 1-2 (high-trust procurement signal)
  if (sector === "industrial" && (bbbee === "level-1" || bbbee === "level-2")) {
    if (dealSize === "25-100k" || dealSize === "100-500k") {
      return {
        packageId: "premium",
        package: getPublicPackage("premium"),
        reason:
          "BBBEE Level 1-2 + customer value above R25k = high-trust procurement positioning. Premium gives you the PR pitches, executive content, and automation that compound BBBEE-aligned procurement opportunities at scale.",
        confidence: "high",
        suggestHumanReview: false,
      };
    }
    return {
      packageId: "growth",
      package: getPublicPackage("growth"),
      reason:
        "BBBEE Level 1-2 is a strong procurement signal — but only if it's visible across the platforms procurement officers actually search. Growth runs the citation and content work that surfaces your BBBEE positioning to enterprise + SOE buyers every month.",
      confidence: "high",
      suggestHumanReview: false,
    };
  }

  // RULE 5: Has most basics already (3-4 ticked) — wants depth
  if (basicsScore >= 3) {
    return {
      packageId: "growth",
      package: getPublicPackage("growth"),
      reason:
        "You're already doing more than most — solid foundations across multiple properties. Growth keeps that momentum compounding and adds the depth most firms in your category miss: industry citations, founder LinkedIn, active review velocity.",
      confidence: "medium",
      suggestHumanReview: false,
    };
  }

  // FALLBACK: default to Growth + suggest human review
  // We recommend the most-converting tier and explicitly offer Kabelo.
  return {
    packageId: "growth",
    package: getPublicPackage("growth"),
    reason:
      "Your situation looks like a Growth fit — most businesses with your profile compound well on monthly visibility work. But your answers don't trigger a high-confidence match, so we'd suggest a 20-min call with Kabelo before committing. He'll review your answers and either confirm Growth or recommend a custom scope.",
    confidence: "low",
    suggestHumanReview: true,
  };
}
