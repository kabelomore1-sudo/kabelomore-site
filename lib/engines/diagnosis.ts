/**
 * Diagnosis engine — turns numbers into plain English.
 *
 * Two outputs:
 *   - diagnosisOneLiner  → for WhatsApp + email subject + meta description
 *   - diagnosisFull      → for results page hero (3-4 sentences)
 *
 * Pure function. No I/O. The only logic is "given the score + classification
 * + detected signals + top issue, what's the cleanest plain-English
 * explanation of what's happening?"
 *
 * This is THE most important text in the system. Buyers' decisions rest on
 * how clearly they understand what's wrong. Don't bury the lead.
 */

import type {
  Classification,
  DetectedSignals,
  Issue,
  ScoreLayers,
} from "@/lib/types/scan";

export function buildDiagnosis(input: {
  businessName: string;
  score: number;
  classification: Classification;
  layers: ScoreLayers;
  detected: DetectedSignals;
  topIssue?: Issue;
}): { oneLiner: string; full: string } {
  const { businessName, score, classification, detected, topIssue } = input;

  const oneLiner = buildOneLiner(businessName, score, classification, detected);
  const full = buildFull(businessName, score, classification, detected, topIssue);

  return { oneLiner, full };
}

// ─── 1-line summary (for WhatsApp / email subject) ───────────────
function buildOneLiner(
  businessName: string,
  score: number,
  classification: Classification,
  detected: DetectedSignals,
): string {
  // The pattern: STATE → CAUSE → FIX
  // "[Business] scores X/100. [Reason]. [Implication]."

  if (classification === "type-a-no-presence") {
    return `${businessName} scored ${score}/100. AI engines have no record of your business — when customers ask AI for businesses like yours, your name doesn't come up at all.`;
  }

  if (classification === "type-b-partial-presence") {
    if (detected.citationLevel === "none") {
      return `${businessName} scored ${score}/100. Your business exists online but has zero third-party citations — which is why AI engines aren't recommending you, even though your site exists.`;
    }
    return `${businessName} scored ${score}/100. AI engines have partial knowledge of your business but not enough authority signals to recommend you when customers ask.`;
  }

  if (classification === "type-c-active-presence") {
    return `${businessName} scored ${score}/100. AI engines know your business but you're occasionally cited rather than consistently recommended. The gap to dominance is closeable.`;
  }

  // Type D
  return `${businessName} scored ${score}/100. AI engines actively recommend your business — the next move is dominance through compounding monthly work.`;
}

// ─── Full diagnosis (3-4 sentences, for results hero) ────────────
function buildFull(
  businessName: string,
  score: number,
  classification: Classification,
  detected: DetectedSignals,
  topIssue?: Issue,
): string {
  const parts: string[] = [];

  // Sentence 1: the headline
  parts.push(buildHeadlineSentence(businessName, score, classification));

  // Sentence 2: WHY (the cause, drawn from the top issue)
  if (topIssue) {
    parts.push(`The biggest reason: ${topIssue.explanation}`);
  } else {
    parts.push(buildCauseSentence(detected));
  }

  // Sentence 3: WHAT IT MEANS (the implication)
  parts.push(buildImplicationSentence(classification, detected));

  // Sentence 4 (optional): WHAT TO DO (the path)
  parts.push(buildPathSentence(classification));

  return parts.join(" ");
}

function buildHeadlineSentence(
  businessName: string,
  score: number,
  c: Classification,
): string {
  switch (c) {
    case "type-a-no-presence":
      return `${businessName} is currently invisible to AI search.`;
    case "type-b-partial-presence":
      return `${businessName} has a partial digital footprint, but AI engines aren't recommending you when customers ask.`;
    case "type-c-active-presence":
      return `${businessName} has a working digital presence — AI engines know about you, but you're not the default recommendation.`;
    case "type-d-strong-presence":
      return `${businessName} is well-positioned for AI search — you're showing up where it matters.`;
  }
}

function buildCauseSentence(d: DetectedSignals): string {
  // Pick the dominant cause based on what's missing
  if (d.citationLevel === "none") {
    return "The biggest reason: zero third-party citations. AI engines verify businesses by mentions on trusted directories and industry sites — without those, you have no authority signal.";
  }
  if (!d.websiteReachable && !d.gbpFound) {
    return "The biggest reason: no website AND no Google Business Profile. AI engines need at least one verified entity record to consider recommending you.";
  }
  if (d.websiteReachable && !d.websiteHasSchema) {
    return "The biggest reason: your website has no schema markup. AI engines see a wall of text instead of structured business data.";
  }
  if (!d.gbpFound) {
    return "The biggest reason: no Google Business Profile. GBP is the single biggest local AI visibility signal in 2026.";
  }
  if (!d.napConsistent) {
    return "The biggest reason: inconsistent business details (name, address, phone) across the platforms where you appear. AI engines downgrade trust when signals don't match.";
  }
  return "The biggest reason: insufficient depth across the layers AI engines weight most heavily.";
}

function buildImplicationSentence(
  c: Classification,
  _d: DetectedSignals,
): string {
  switch (c) {
    case "type-a-no-presence":
      return "Right now, every customer who asks ChatGPT, Claude, Gemini, or Perplexity for businesses like yours is sent to your competitors instead.";
    case "type-b-partial-presence":
      return "Your competitors with stronger AEO infrastructure are getting the AI recommendations — even when their underlying business or service quality isn't actually better than yours.";
    case "type-c-active-presence":
      return "You're in the running but not the default. AI engines give you partial credit, but the consistent recommendations are going to firms that have invested in citation density and content authority.";
    case "type-d-strong-presence":
      return "The compounding window is open: clients who maintain AEO discipline through months 6-24 dominate their categories long-term.";
  }
}

function buildPathSentence(c: Classification): string {
  switch (c) {
    case "type-a-no-presence":
      return "The path forward is the Foundation Pack — we build everything you need from zero in 4 weeks.";
    case "type-b-partial-presence":
      return "The path forward is the Optimization Pack — we add the AEO layer to your existing setup in 3 weeks. No rebuild needed.";
    case "type-c-active-presence":
      return "The path forward is citation expansion plus a Growth retainer — compound monthly work that moves you from 'occasionally cited' to 'consistently recommended'.";
    case "type-d-strong-presence":
      return "The path forward is a Premium retainer — dominance strategy with content velocity, executive support, and reputation monitoring.";
  }
}

// ─── Issue generator (shared with results page) ──────────────────
/**
 * Generate a ranked list of issues from detected signals.
 * Lives in this file because issues + diagnosis read off the same data.
 */
export function buildIssues(detected: DetectedSignals): Issue[] {
  const issues: Issue[] = [];

  if (detected.citationLevel === "none") {
    issues.push({
      id: "no-citations",
      severity: "critical",
      title: "Zero third-party citations",
      explanation:
        "Your business is not mentioned on any trusted directory or industry site we can find. Citations are how AI engines verify businesses exist and are real.",
      fixCategory: "citations",
    });
  } else if (detected.citationLevel === "low") {
    issues.push({
      id: "low-citations",
      severity: "high",
      title: "Insufficient citation breadth",
      explanation:
        "You have some citations but not enough density to be the default AI recommendation. Industry standard is 25-50 consistent citations across trusted directories.",
      fixCategory: "citations",
    });
  }

  if (detected.websiteReachable && !detected.websiteHasSchema) {
    issues.push({
      id: "no-schema",
      severity: "critical",
      title: "No schema markup on your website",
      explanation:
        "Your site has no structured data — meaning AI engines have to guess what your business does instead of having verified entity data they can confidently quote.",
      fixCategory: "schema",
    });
  }

  if (!detected.gbpFound) {
    issues.push({
      id: "no-gbp",
      severity: "critical",
      title: "Google Business Profile missing or not findable",
      explanation:
        "GBP is the single biggest local AI visibility signal. AI engines (and Google's AI Overviews) check GBP first when answering location-based queries.",
      fixCategory: "gbp",
    });
  } else if (detected.gbpCompleteness && detected.gbpCompleteness < 80) {
    issues.push({
      id: "incomplete-gbp",
      severity: "high",
      title: "Google Business Profile incomplete",
      explanation: `Your GBP exists but is only ${detected.gbpCompleteness}% complete. Categories, hours, photos, services — every blank field weakens AI engines' trust signal.`,
      fixCategory: "gbp",
    });
  }

  if (!detected.websiteReachable) {
    issues.push({
      id: "no-website",
      severity: "high",
      title: "No website detected",
      explanation:
        "AI engines can recommend businesses without websites, but the citation density required to do so is much higher. A simple, AEO-ready website is the highest-leverage first investment.",
      fixCategory: "presence",
    });
  }

  if (
    detected.citationLevel !== "none" &&
    !detected.napConsistent
  ) {
    issues.push({
      id: "nap-inconsistent",
      severity: "medium",
      title: "Inconsistent NAP across listings",
      explanation:
        "Your business name, address, or phone varies across the directories where you're mentioned. AI engines downgrade trust when signals don't match.",
      fixCategory: "consistency",
    });
  }

  if (detected.websiteReachable && !detected.websiteHasFAQSchema) {
    issues.push({
      id: "no-faq-schema",
      severity: "medium",
      title: "No FAQ-structured content",
      explanation:
        "AI engines quote question-answer blocks directly when answering customer queries. Without FAQ schema or answer-shaped content, your site can't be quoted easily.",
      fixCategory: "content",
    });
  }

  // Sort by severity: critical → high → medium → low
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return issues.sort((a, b) => order[a.severity] - order[b.severity]);
}
