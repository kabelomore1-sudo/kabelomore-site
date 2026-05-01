/**
 * Classification engine — assigns a Type A/B/C/D bucket.
 *
 * The score alone isn't enough. We add hard rules to handle edge cases:
 *
 *  - No website + no GBP + no citations  → always Type A
 *    (regardless of score, because the score won't be < 25 if
 *     they happen to have a high consistency layer somehow)
 *
 *  - Otherwise: pure score-based ranges
 *
 * Type definitions match the system spec exactly:
 *
 *  TYPE A — No Presence       (score < 25)
 *  TYPE B — Partial Presence  (score 25-49)
 *  TYPE C — Active Presence   (score 50-74)
 *  TYPE D — Strong Presence   (score 75+)
 */

import type { Classification, DetectedSignals } from "@/lib/types/scan";

export function classify(
  score: number,
  detected: DetectedSignals,
): Classification {
  // Hard rule: complete absence overrides score range
  if (
    !detected.websiteReachable &&
    !detected.gbpFound &&
    detected.citationLevel === "none"
  ) {
    return "type-a-no-presence";
  }

  // Score-based classification
  if (score < 25) return "type-a-no-presence";
  if (score < 50) return "type-b-partial-presence";
  if (score < 75) return "type-c-active-presence";
  return "type-d-strong-presence";
}

/**
 * Human-friendly label for display in UI + emails.
 * Ordered so the buyer reads "where they are" → "what's missing".
 */
export function classificationLabel(c: Classification): string {
  switch (c) {
    case "type-a-no-presence":
      return "Type A — No Presence";
    case "type-b-partial-presence":
      return "Type B — Partial Presence";
    case "type-c-active-presence":
      return "Type C — Active Presence";
    case "type-d-strong-presence":
      return "Type D — Strong Presence";
  }
}

/**
 * 1-line description used on results page + WhatsApp drip.
 */
export function classificationDescription(c: Classification): string {
  switch (c) {
    case "type-a-no-presence":
      return "AI engines have no record of your business. You don't appear when customers ask AI for businesses like yours.";
    case "type-b-partial-presence":
      return "AI engines have some record of your business but you're rarely cited. Your competitors with stronger AEO infrastructure get recommended instead.";
    case "type-c-active-presence":
      return "AI engines know about your business and occasionally cite you. With targeted AEO work you can move from occasional mentions to consistent recommendation.";
    case "type-d-strong-presence":
      return "AI engines actively recommend your business for relevant queries. The opportunity now is to dominate your category through compounding monthly work.";
  }
}
