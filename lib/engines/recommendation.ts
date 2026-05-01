/**
 * Recommendation engine — maps a classification + detected signals
 * into a ranked list of actionable recommendations.
 *
 * Pure function. No I/O. The recommendations link directly to tier IDs
 * from lib/site.ts so the results page can deep-link to the right
 * `/foundation`, `/brief/[tier]`, etc.
 *
 * Mapping rules (per system spec):
 *
 *   TYPE A → Foundation Pack (build everything from zero)
 *   TYPE B → Optimization Pack (add AEO layer to existing site) +
 *            citation expansion as #1 priority
 *   TYPE C → Citation expansion + content authority work
 *   TYPE D → Growth/Premium retainer (compounding dominance)
 *
 * Within each type, we look at detected signals to refine the order.
 */

import type {
  Classification,
  DetectedSignals,
  Recommendation,
} from "@/lib/types/scan";

export function generateRecommendations(
  classification: Classification,
  detected: DetectedSignals,
): Recommendation[] {
  // Internal accumulator without rank — we assign rank at the end
  const recs: Omit<Recommendation, "rank">[] = [];

  switch (classification) {
    case "type-a-no-presence":
      recs.push(...recommendForTypeA(detected));
      break;
    case "type-b-partial-presence":
      recs.push(...recommendForTypeB(detected));
      break;
    case "type-c-active-presence":
      recs.push(...recommendForTypeC(detected));
      break;
    case "type-d-strong-presence":
      recs.push(...recommendForTypeD(detected));
      break;
  }

  // Assign rank based on order in array (which reflects priority)
  return recs
    .map((r, idx): Recommendation => ({ ...r, rank: idx + 1 }))
    .slice(0, 5); // Cap at 5 — don't overwhelm
}

// ─── TYPE A: No Presence ─────────────────────────────────────────
function recommendForTypeA(_d: DetectedSignals): Omit<Recommendation, "rank">[] {
  return [
    {
      title: "Foundation Pack — build everything from zero",
      explanation:
        "You don't have a website or a Google Business Profile yet. We build both, plus the schema markup AI engines need to actually trust your business. 4 weeks. You own everything when we're done.",
      estimatedImpact: "high",
      estimatedEffort: "medium",
      mapsToTier: "foundation",
    },
    {
      title: "Or start with Foundation Lite (R6,500)",
      explanation:
        "If you're a sole trader or single-service business, the lighter version covers a 1-page site, GBP, schema, and 5 directory listings in 2 weeks.",
      estimatedImpact: "medium",
      estimatedEffort: "low",
      mapsToTier: "foundation-lite",
    },
  ];
}

// ─── TYPE B: Partial Presence ────────────────────────────────────
function recommendForTypeB(d: DetectedSignals): Omit<Recommendation, "rank">[] {
  const recs: Omit<Recommendation, "rank">[] = [];

  // The defining issue for Type B: citations missing
  if (d.citationLevel === "none" || d.citationLevel === "low") {
    recs.push({
      title: "Build foundational citation breadth (THE biggest fix)",
      explanation:
        "Your single biggest gap is third-party citations. AI engines verify businesses by mentions on trusted directories. We'd build 10+ verified citations in 2-3 weeks as part of the Optimization Pack.",
      estimatedImpact: "high",
      estimatedEffort: "low",
      mapsToTier: "optimization",
    });
  }

  // Schema gap if present
  if (d.websiteReachable && !d.websiteHasSchema) {
    recs.push({
      title: "Deploy schema markup on your existing site",
      explanation:
        "Your site loads but has zero JSON-LD schema. AI engines can't verify what you do, where you are, or what services you offer. Schema deployment is included in Optimization Pack.",
      estimatedImpact: "high",
      estimatedEffort: "low",
      mapsToTier: "optimization",
    });
  }

  // GBP gap
  if (!d.gbpFound) {
    recs.push({
      title: "Claim and build out your Google Business Profile",
      explanation:
        "GBP is the single biggest local visibility lever in 2026. It's free to claim. We do the full setup as part of Optimization Pack.",
      estimatedImpact: "high",
      estimatedEffort: "low",
      mapsToTier: "optimization",
    });
  }

  // Optimization Pack as the unifying answer
  recs.push({
    title: "Optimization Pack — full AEO layer in 3 weeks",
    explanation:
      "All of the above bundled: schema, GBP rebuild, 10 citations, 3 priority pages rewritten in answer-shape, llms.txt deployed. R10,500. We don't rebuild your site.",
    estimatedImpact: "high",
    estimatedEffort: "medium",
    mapsToTier: "optimization",
  });

  return recs;
}

// ─── TYPE C: Active Presence ─────────────────────────────────────
function recommendForTypeC(d: DetectedSignals): Omit<Recommendation, "rank">[] {
  const recs: Omit<Recommendation, "rank">[] = [];

  // Citation expansion is the path from Type C → Type D
  if (d.citationLevel === "low" || d.citationLevel === "medium") {
    recs.push({
      title: "Expand citation breadth (low → high)",
      explanation:
        "You have some citations but not enough density to be the default AI recommendation in your category. Building 25-50 industry-specific citations is what tips the scale.",
      estimatedImpact: "high",
      estimatedEffort: "medium",
    });
  }

  recs.push({
    title: "Discovery & Strategy Sprint (R3,500) — clarity before commitment",
    explanation:
      "Before signing a retainer, get a 2-week strategy doc that maps exactly what to do and in what order. Bundled free into the first month of any retainer.",
    estimatedImpact: "medium",
    estimatedEffort: "low",
    mapsToTier: "discovery",
  });

  recs.push({
    title: "Growth Retainer — compounding monthly work",
    explanation:
      "AEO compounds month over month. 2 articles, 4 GBP posts, schema updates, 1-2 citations, monthly competitor monitoring. R8,500/month. The clients who maintain through months 6-12 widen the gap.",
    estimatedImpact: "high",
    estimatedEffort: "medium",
    mapsToTier: "growth",
  });

  return recs;
}

// ─── TYPE D: Strong Presence ─────────────────────────────────────
function recommendForTypeD(_d: DetectedSignals): Omit<Recommendation, "rank">[] {
  return [
    {
      title: "Premium Retainer — dominance strategy",
      explanation:
        "You're already well-positioned. Premium adds 4 articles/month, dedicated specialist time, monthly executive call, and reputation monitoring. For businesses where AI visibility IS the growth strategy.",
      estimatedImpact: "high",
      estimatedEffort: "medium",
      mapsToTier: "premium",
    },
    {
      title: "Or stay on Growth retainer with content acceleration",
      explanation:
        "If Premium scope is more than you need, Growth + Content Boost add-on (extra 2 articles/month) gives you most of the velocity at lower cost.",
      estimatedImpact: "medium",
      estimatedEffort: "low",
      mapsToTier: "growth",
    },
  ];
}
