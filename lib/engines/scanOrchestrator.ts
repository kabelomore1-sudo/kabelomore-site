/**
 * Scan orchestrator — runs the full diagnostic pipeline and produces a
 * complete ScanResult.
 *
 * Sequence:
 *   1. Discovery: find website + GBP if user didn't provide them (10-12s)
 *   2. Presence checks: HEAD request + schema check on the resolved URL (3-5s)
 *   3. Citation analysis: 2 parallel multi-strategy searches (10-15s)
 *   4. Visibility simulator: 2 customer-style queries (20-25s)
 *   5. Compute score, classification, recommendations, diagnosis
 *   6. Return full ScanResult
 *
 * Total runtime budget: 50-60s. Must fit Vercel Hobby maxDuration of 60s.
 *
 * Resilience: every stage has graceful error handling. One failed engine
 * never fails the entire scan — partial data is better than no data.
 */

import { discoverPresence } from "./presenceDiscovery";
import { analyzeCitations } from "./citationAnalyzer";
import { simulateAIQueries } from "./visibilitySimulator";
import { findPlace } from "./gbpFetcher";
import { computeScore } from "./scoring";
import { classify } from "./classification";
import { generateRecommendations } from "./recommendation";
import { buildDiagnosis, buildIssues } from "./diagnosis";
import type {
  BusinessProfile,
  DetectedSignals,
  ScanResult,
} from "@/lib/types/scan";

export type StageStatus = "ok" | "partial" | "failed" | "skipped";

export type ScanStageReport = {
  discovery: StageStatus;
  presenceCheck: StageStatus;
  gbpLookup: StageStatus;
  citationAnalysis: StageStatus;
  visibilitySimulation: StageStatus;
};

export async function runFullScan(
  profile: BusinessProfile,
): Promise<ScanResult & { stageReport: ScanStageReport }> {
  const startTime = Date.now();
  const stageReport: ScanStageReport = {
    discovery: "skipped",
    presenceCheck: "skipped",
    gbpLookup: "skipped",
    citationAnalysis: "skipped",
    visibilitySimulation: "skipped",
  };

  // ─── Stage 1: Discovery (find website + GBP if not provided) ──
  let resolvedWebsite = profile.website;
  let resolvedGbpUrl = profile.gbpUrl;
  let discoveryNotes = "";

  if (!resolvedWebsite || !resolvedGbpUrl) {
    try {
      const discovered = await discoverPresence(profile);
      stageReport.discovery = discovered.discoveryRan ? "ok" : "failed";
      discoveryNotes = discovered.notes;

      if (!resolvedWebsite && discovered.websiteFound && discovered.websiteUrl) {
        resolvedWebsite = discovered.websiteUrl;
      }
      if (!resolvedGbpUrl && discovered.gbpFound && discovered.gbpUrl) {
        resolvedGbpUrl = discovered.gbpUrl;
      } else if (!resolvedGbpUrl && discovered.gbpFound) {
        // GBP exists but no direct URL — flag as found anyway
        resolvedGbpUrl = "(found-via-search)";
      }
    } catch (err) {
      console.error("[scanOrchestrator] discovery failed:", err);
      stageReport.discovery = "failed";
    }
  } else {
    stageReport.discovery = "skipped"; // user provided both URLs
  }

  // ─── Stage 2: Presence check ────────────────────────────────
  let presenceData: Awaited<ReturnType<typeof checkPresence>>;
  try {
    presenceData = await checkPresence(resolvedWebsite, resolvedGbpUrl);
    stageReport.presenceCheck = "ok";
  } catch (err) {
    console.error("[scanOrchestrator] presence check failed:", err);
    stageReport.presenceCheck = "failed";
    presenceData = {
      websiteReachable: false,
      websiteHasSchema: false,
      websiteHasLocalBusinessSchema: false,
      websiteHasFAQSchema: false,
      gbpFound: Boolean(resolvedGbpUrl),
      gbpCompleteness: undefined,
    };
  }

  // ─── Stage 3 + 4 + 2.5: Citation + Visibility + GBP lookup (parallel) ──
  //
  // GBP lookup (Stage 2.5) runs alongside citation analysis and
  // visibility simulation because all three are independent (no shared
  // state) and the Places API call (~1-2s) is cheap relative to the
  // others. Parallelizing keeps the total scan budget under 60s.
  //
  // GBP lookup fails gracefully if GOOGLE_PLACES_API_KEY isn't set or
  // the API errors out — the rest of the scan continues with
  // gbpFound from presence discovery and the GBP-quality signals
  // simply undefined.
  const profileForEngines: BusinessProfile = {
    ...profile,
    website: resolvedWebsite,
    gbpUrl: resolvedGbpUrl,
  };

  const [citationResult, visibilityResult, gbpResult] = await Promise.all([
    analyzeCitations(profileForEngines).catch((err) => {
      console.error("[scanOrchestrator] citation analysis failed:", err);
      return null;
    }),
    simulateAIQueries(profileForEngines).catch((err) => {
      console.error("[scanOrchestrator] visibility simulation failed:", err);
      return null;
    }),
    findPlace(profileForEngines).catch((err) => {
      console.error("[scanOrchestrator] GBP lookup failed:", err);
      return null;
    }),
  ]);

  // GBP stage report: "skipped" if API key missing (we infer this from
  // the notes field), "ok" if found, "failed" if returned but found=false
  // due to API error (vs legitimate ZERO_RESULTS which we treat as ok).
  if (!gbpResult) {
    stageReport.gbpLookup = "failed";
  } else if (
    gbpResult.notes.includes("GOOGLE_PLACES_API_KEY not configured")
  ) {
    stageReport.gbpLookup = "skipped";
  } else if (gbpResult.found) {
    stageReport.gbpLookup = "ok";
  } else {
    // Searched but didn't find — could be the API errored OR the
    // business genuinely has no GBP. Both are useful signals; we mark
    // as "ok" because the stage ran successfully, just with no data.
    stageReport.gbpLookup = "ok";
  }

  // Status based on whether engines actually ran (not just whether results were 0)
  const citationData = citationResult ?? {
    count: 0,
    level: "none" as const,
    napConsistent: false,
    sources: [],
    notes: "Citation analysis temporarily unavailable",
    discoveryRan: false,
  };
  stageReport.citationAnalysis = citationResult
    ? citationResult.discoveryRan
      ? "ok"
      : "partial"
    : "failed";

  const visibilityData = visibilityResult ?? { checks: [], competitors: [] };
  stageReport.visibilitySimulation =
    visibilityResult && visibilityResult.checks.length > 0 ? "ok" : "failed";

  // ─── Stage 5: Synthesize ─────────────────────────────────────
  //
  // gbpFound: if Places API confirmed the listing, that trumps the
  // inference-based gbpFound from presence discovery. The Places API
  // is authoritative (it's reading Google's actual data); presence
  // discovery is a search-snippet inference.
  //
  // gbpCompleteness: derived from the new fields when available.
  // Score: rating present (+25) + reviews >0 (+25) + hours present
  // (+25) + categories present (+25) = 0-100. Gives the legacy
  // gbpCompleteness signal real data instead of being always undefined.
  const placesFound = gbpResult?.found === true;
  const gbpCompletenessDerived = gbpResult?.found
    ? computeGbpCompleteness(gbpResult)
    : presenceData.gbpCompleteness;

  const detected: DetectedSignals = {
    websiteReachable: presenceData.websiteReachable,
    websiteHasSchema: presenceData.websiteHasSchema,
    websiteHasFAQSchema: presenceData.websiteHasFAQSchema,
    websiteHasLocalBusinessSchema: presenceData.websiteHasLocalBusinessSchema,
    gbpFound: presenceData.gbpFound || placesFound,
    gbpCompleteness: gbpCompletenessDerived,
    // Phase 1.5 GBP signals — undefined when Places API didn't run
    gbpRating: gbpResult?.rating ?? undefined,
    gbpReviewCount: gbpResult?.reviewCount ?? undefined,
    gbpPrimaryCategory: gbpResult?.primaryCategory ?? undefined,
    gbpCategories: gbpResult?.categories ?? undefined,
    gbpHasHours: gbpResult?.hasHours ?? undefined,
    gbpVerifiedHeuristic: gbpResult?.verifiedHeuristic ?? undefined,
    citationCount: citationData.count,
    citationLevel: citationData.level,
    citationSources: citationData.sources,
    napConsistent: citationData.napConsistent,
    socialPresenceCount: countSocialProfiles(profile),
  };

  const { score, layers } = computeScore(profile, detected);
  const classification = classify(score, detected);
  const issues = buildIssues(detected);
  const recommendations = generateRecommendations(classification, detected);
  const { oneLiner, full } = buildDiagnosis({
    businessName: profile.businessName,
    score,
    classification,
    layers,
    detected,
    topIssue: issues[0],
  });

  const result: ScanResult & { stageReport: ScanStageReport } = {
    id: profile.scanId,
    businessName: profile.businessName,
    contactName: profile.contactName,
    email: profile.email,
    score,
    classification,
    layers,
    detected,
    issues,
    recommendations,
    competitors: visibilityData.competitors,
    visibilityChecks: visibilityData.checks,
    diagnosisOneLiner: oneLiner,
    diagnosisFull: full,
    scannedAt: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    stageReport,
  };

  // Log stage report for Vercel debugging
  console.log(`[scanOrchestrator] scan ${profile.scanId} complete:`, {
    score,
    classification,
    duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
    stages: stageReport,
    discoveredWebsite: resolvedWebsite,
    discoveredGbp: resolvedGbpUrl,
    discoveryNotes,
    citationCount: citationData.count,
    citationSources: citationData.sources.slice(0, 5),
  });

  return result;
}

// ─── Lightweight presence check using resolved URLs ──────────────
//
// Phase 1 honest measurement:
//  - Website reachable: HEAD request, follow redirects, accept any
//    non-5xx status (some sites return 403/406 to crawlers but are
//    obviously up; we don't want false negatives).
//  - Schema check: parse <script type="application/ld+json"> blocks
//    properly and inspect the @type field. A bare substring match was
//    catching false positives (the literal text "FAQPage" in JS
//    comments) and missing real schemas split across multiple blocks.
//
// What this still doesn't catch:
//  - Schema injected at runtime via tag manager (won't be in static
//    HTML response). We surface this caveat in the issues copy so
//    prospects know to confirm manually.
async function checkPresence(
  websiteUrl: string | undefined,
  gbpUrl: string | undefined,
): Promise<{
  websiteReachable: boolean;
  websiteHasSchema: boolean;
  websiteHasLocalBusinessSchema: boolean;
  websiteHasFAQSchema: boolean;
  gbpFound: boolean;
  gbpCompleteness?: number;
}> {
  let websiteReachable = false;
  let websiteHasSchema = false;
  let websiteHasLocalBusinessSchema = false;
  let websiteHasFAQSchema = false;

  if (websiteUrl) {
    websiteReachable = await isUrlReachable(websiteUrl);
    if (websiteReachable) {
      const schemaInfo = await detectSchemaTypes(websiteUrl);
      websiteHasSchema = schemaInfo.hasAnyJsonLd;
      websiteHasLocalBusinessSchema = schemaInfo.hasLocalBusiness;
      websiteHasFAQSchema = schemaInfo.hasFAQ;
    }
  }

  return {
    websiteReachable,
    websiteHasSchema,
    websiteHasLocalBusinessSchema,
    websiteHasFAQSchema,
    gbpFound: Boolean(gbpUrl),
    // gbpCompleteness deferred to Phase 1.5 (requires Google Places / GBP API)
  };
}

/**
 * Compute a 0-100 GBP completeness score from Places API data.
 *
 * 25 points each for:
 *   - Has a rating (filled-in star rating)
 *   - Has at least 1 review
 *   - Has opening hours
 *   - Has at least one category (always true if Places returned anything,
 *     but defensive)
 *
 * This is a coarse signal — a 5-star single-review listing scores 50%
 * the same as a 4-star 200-review listing. Refinement (review velocity,
 * photo count thresholds, primary category match to industry) is a
 * Phase 1.6 concern.
 */
function computeGbpCompleteness(
  gbp: import("./gbpFetcher").GbpData,
): number {
  let pts = 0;
  if (typeof gbp.rating === "number" && gbp.rating > 0) pts += 25;
  if (typeof gbp.reviewCount === "number" && gbp.reviewCount > 0) pts += 25;
  if (gbp.hasHours) pts += 25;
  if (gbp.categories.length > 0) pts += 25;
  return pts;
}

async function isUrlReachable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "KabelomoreScan/1.0" },
    });
    clearTimeout(timeout);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Parse JSON-LD blocks from a page and detect specific schema types.
 *
 * Stronger than a `html.includes("application/ld+json")` substring
 * match — that approach was returning false positives (literal text
 * "LocalBusiness" inside JS comments / inline scripts) and false
 * negatives (multi-block schemas where one block was malformed).
 *
 * We accept three @type shapes:
 *   - String:    "@type": "LocalBusiness"
 *   - Array:     "@type": ["LocalBusiness", "Plumber"]
 *   - @graph:    {"@graph": [{"@type": "LocalBusiness"}, ...]}
 *
 * Failure modes:
 *   - JSON.parse failure on a block → that block contributes nothing
 *     (but we don't fail the whole detection).
 *   - Network failure → return all-false (logged upstream).
 *
 * Caveat (returned to user via issue copy):
 *   - Tag-manager-injected schema won't appear in our static fetch.
 *     We tell the prospect this so they can confirm manually.
 */
async function detectSchemaTypes(url: string): Promise<{
  hasAnyJsonLd: boolean;
  hasLocalBusiness: boolean;
  hasFAQ: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "KabelomoreScan/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return { hasAnyJsonLd: false, hasLocalBusiness: false, hasFAQ: false };
    const html = await res.text();

    // Regex extracts every JSON-LD <script> block. The /s flag lets `.`
    // span newlines. Non-greedy capture so adjacent blocks don't merge.
    const blockRegex =
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

    let hasAnyJsonLd = false;
    let hasLocalBusiness = false;
    let hasFAQ = false;

    // LocalBusiness has many subtypes (LegalService, MedicalBusiness,
    // Plumber, etc.) — checking against the canonical schema.org
    // hierarchy entries that actually represent local businesses.
    const localBusinessTypes = new Set([
      "LocalBusiness",
      "LegalService",
      "MedicalBusiness",
      "MedicalClinic",
      "Physician",
      "Dentist",
      "AutomotiveBusiness",
      "FinancialService",
      "FoodEstablishment",
      "HealthAndBeautyBusiness",
      "HomeAndConstructionBusiness",
      "Plumber",
      "Electrician",
      "ProfessionalService",
      "Store",
      "Restaurant",
      "Hotel",
    ]);

    let match: RegExpExecArray | null;
    while ((match = blockRegex.exec(html)) !== null) {
      hasAnyJsonLd = true;
      const raw = match[1].trim();
      if (!raw) continue;

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        continue; // malformed block — skip but keep scanning others
      }

      // Walk the parsed structure. Schema can be a single object,
      // an array of objects, or an @graph wrapping an array.
      const nodes = collectSchemaNodes(parsed);
      for (const node of nodes) {
        const types = extractTypes(node);
        if (types.some((t) => localBusinessTypes.has(t))) {
          hasLocalBusiness = true;
        }
        if (types.includes("FAQPage")) {
          hasFAQ = true;
        }
      }
    }

    return { hasAnyJsonLd, hasLocalBusiness, hasFAQ };
  } catch {
    return { hasAnyJsonLd: false, hasLocalBusiness: false, hasFAQ: false };
  }
}

// Flatten schema.org JSON-LD into a list of typed nodes.
// Handles single objects, arrays, and @graph containers.
function collectSchemaNodes(parsed: unknown): Record<string, unknown>[] {
  if (Array.isArray(parsed)) {
    return parsed.flatMap((item) => collectSchemaNodes(item));
  }
  if (parsed && typeof parsed === "object") {
    const obj = parsed as Record<string, unknown>;
    if (Array.isArray(obj["@graph"])) {
      return collectSchemaNodes(obj["@graph"]);
    }
    return [obj];
  }
  return [];
}

// Read @type — accept string, string[], or undefined.
function extractTypes(node: Record<string, unknown>): string[] {
  const t = node["@type"];
  if (typeof t === "string") return [t];
  if (Array.isArray(t)) {
    return t.filter((x): x is string => typeof x === "string");
  }
  return [];
}

function countSocialProfiles(profile: BusinessProfile): number {
  let count = 0;
  if (profile.facebookUrl) count++;
  if (profile.instagramUrl) count++;
  if (profile.linkedinUrl) count++;
  return count;
}
