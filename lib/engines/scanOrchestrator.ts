/**
 * Scan orchestrator — runs the full diagnostic pipeline and produces a
 * complete ScanResult.
 *
 * Sequence:
 *   1. Lightweight presence checks (HEAD request to website, search for GBP)
 *   2. Citation analyzer (1-2 web_search calls)
 *   3. Visibility simulator (2 web_search calls)
 *   4. Compute score, classification, recommendations, diagnosis
 *   5. Return full ScanResult
 *
 * Total runtime target: 30-50 seconds. Vercel Hobby max is 60s, so we
 * budget conservatively. If any individual step fails, we proceed with
 * partial data — never fail the entire scan because one query timed out.
 */

import { analyzeCitations } from "./citationAnalyzer";
import { simulateAIQueries } from "./visibilitySimulator";
import { computeScore } from "./scoring";
import { classify } from "./classification";
import { generateRecommendations } from "./recommendation";
import { buildDiagnosis, buildIssues } from "./diagnosis";
import type {
  BusinessProfile,
  DetectedSignals,
  ScanResult,
} from "@/lib/types/scan";

export async function runFullScan(
  profile: BusinessProfile,
): Promise<ScanResult> {
  const startTime = Date.now();

  // ─── Step 1: Lightweight presence checks ─────────────────────
  const presenceData = await detectPresence(profile);

  // ─── Step 2: Citation analysis ──────────────────────────────
  let citationData: Awaited<ReturnType<typeof analyzeCitations>>;
  try {
    citationData = await analyzeCitations(profile);
  } catch (err) {
    console.error("[scanOrchestrator] Citation analysis failed:", err);
    citationData = {
      count: 0,
      level: "none",
      napConsistent: false,
      sources: [],
      notes: "Citation analysis temporarily unavailable.",
    };
  }

  // ─── Step 3: Visibility simulation ──────────────────────────
  let visibilityData: Awaited<ReturnType<typeof simulateAIQueries>>;
  try {
    visibilityData = await simulateAIQueries(profile);
  } catch (err) {
    console.error("[scanOrchestrator] Visibility simulation failed:", err);
    visibilityData = { checks: [], competitors: [] };
  }

  // ─── Step 4: Synthesize ─────────────────────────────────────
  const detected: DetectedSignals = {
    websiteReachable: presenceData.websiteReachable,
    websiteHasSchema: presenceData.websiteHasSchema,
    websiteHasFAQSchema: false, // deeper detection lives in audit-agent CLI
    websiteHasLocalBusinessSchema: false,
    gbpFound: presenceData.gbpFound,
    gbpCompleteness: presenceData.gbpCompleteness,
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

  const result: ScanResult = {
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
  };

  return result;
}

// ─── Lightweight presence detection ──────────────────────────────
async function detectPresence(profile: BusinessProfile): Promise<{
  websiteReachable: boolean;
  websiteHasSchema: boolean;
  gbpFound: boolean;
  gbpCompleteness?: number;
}> {
  // Website check: HEAD request with 5s timeout
  let websiteReachable = false;
  let websiteHasSchema = false;
  if (profile.website) {
    websiteReachable = await isUrlReachable(profile.website);
    if (websiteReachable) {
      websiteHasSchema = await checkForSchema(profile.website);
    }
  }

  // GBP check: if user provided URL, accept. If not, infer "unknown" (treat as not found
  // for scoring purposes, but the scan won't penalise as harshly because it's an
  // unknown vs verified-absent).
  // For Phase 1, simple: if user provided GBP URL → assume found. If not → assume not.
  // Phase 2 will add Google search for the business to detect GBP.
  const gbpFound = Boolean(profile.gbpUrl);

  return {
    websiteReachable,
    websiteHasSchema,
    gbpFound,
    // gbpCompleteness intentionally undefined for Phase 1 — adding deeper
    // GBP introspection is Phase 2 work
  };
}

async function isUrlReachable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    return res.ok || res.status < 500; // accept any non-server-error
  } catch {
    return false;
  }
}

async function checkForSchema(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "KabelomoreScan/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return false;
    const html = await res.text();
    return html.includes('application/ld+json');
  } catch {
    return false;
  }
}

function countSocialProfiles(profile: BusinessProfile): number {
  let count = 0;
  if (profile.facebookUrl) count++;
  if (profile.instagramUrl) count++;
  if (profile.linkedinUrl) count++;
  return count;
}
