/**
 * Scoring engine — computes the 0-100 AI Visibility Score.
 *
 * Pure function. No I/O. No side effects. Fully unit-testable.
 *
 * Weighting philosophy (validated against the system spec):
 *
 *   PRESENCE     25 pts  (website + GBP)
 *   AUTHORITY    40 pts  (citations) — DOMINANT, intentionally
 *   CONSISTENCY  20 pts  (NAP across platforms)
 *   CONTENT      15 pts  (schema + structure)
 *   ─────────────────
 *   TOTAL       100 pts
 *
 * The "no citations = invisible" rule is enforced naturally by the
 * weighting: zero authority caps total at 60/100 even with perfect
 * everything else. That's the score range that triggers Type B at
 * worst, often Type A — exactly what the spec demands.
 */

import type { BusinessProfile, DetectedSignals, ScoreLayers } from "@/lib/types/scan";

const WEIGHTS = {
  presence: 25,
  authority: 40,
  consistency: 20,
  content: 15,
} as const;

export function computeScore(
  _profile: BusinessProfile,
  detected: DetectedSignals,
): { score: number; layers: ScoreLayers } {
  const presence = computePresenceLayer(detected);
  const authority = computeAuthorityLayer(detected);
  const consistency = computeConsistencyLayer(detected);
  const content = computeContentLayer(detected);

  const score = Math.min(presence + authority + consistency + content, 100);

  return {
    score,
    layers: { presence, authority, consistency, content },
  };
}

// ─── Presence layer (25 max) ─────────────────────────────────────
function computePresenceLayer(d: DetectedSignals): number {
  let pts = 0;
  if (d.websiteReachable) pts += 10;
  if (d.gbpFound) pts += 15;
  return Math.min(pts, WEIGHTS.presence);
}

// ─── Authority layer (40 max) — DOMINANT ─────────────────────────
function computeAuthorityLayer(d: DetectedSignals): number {
  switch (d.citationLevel) {
    case "none":
      return 0;
    case "low":
      return 10; // 1-5 citations
    case "medium":
      return 25; // 6-15 citations
    case "high":
      return 40; // 16+ citations
    default:
      return 0;
  }
}

// ─── Consistency layer (20 max) ──────────────────────────────────
function computeConsistencyLayer(d: DetectedSignals): number {
  // Without ANY citations there's nothing to be consistent across
  if (d.citationLevel === "none") return 0;
  if (d.napConsistent) return WEIGHTS.consistency;
  // Partial credit: citations exist but inconsistent
  return Math.floor(WEIGHTS.consistency / 2);
}

// ─── Content layer (15 max) ──────────────────────────────────────
function computeContentLayer(d: DetectedSignals): number {
  let pts = 0;
  if (!d.websiteReachable) return 0;
  if (d.websiteHasSchema) pts += 5;
  if (d.websiteHasLocalBusinessSchema) pts += 5;
  if (d.websiteHasFAQSchema) pts += 5;
  return Math.min(pts, WEIGHTS.content);
}

/**
 * Helper: convert a raw citation count into the bucketed level.
 * Lives here so the bucketing rule has a single source of truth.
 */
export function citationLevelFromCount(count: number): DetectedSignals["citationLevel"] {
  if (count <= 0) return "none";
  if (count <= 5) return "low";
  if (count <= 15) return "medium";
  return "high";
}

/**
 * Helper: human-friendly label for the score range, used in
 * results page subtitles and email subject lines.
 */
export function scoreLabel(score: number): string {
  if (score < 25) return "Invisible to AI";
  if (score < 50) return "Barely visible";
  if (score < 75) return "Partially visible";
  if (score < 90) return "Well-positioned";
  return "Dominant";
}
