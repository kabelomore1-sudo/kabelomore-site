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
 * HONEST PHRASING (post-trust-audit):
 *   We never say "your business has no citations" or "AI engines have
 *   no record of you" — both overclaim. The scan didn't survey every
 *   directory ever and didn't query ChatGPT/Gemini/Perplexity natively.
 *   We say "our test queries didn't surface…" / "we couldn't find a
 *   GBP via search…" so the prospect understands the bound on what
 *   was actually checked.
 *
 * This is THE most important text in the system. Buyers' decisions rest on
 * how clearly they understand what's wrong. Don't bury the lead, but never
 * claim more than the scan actually established.
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
  // Pattern: STATE → CAUSE → IMPLICATION
  // Hedged so we don't overclaim what the scan tested.

  if (classification === "type-a-no-presence") {
    return `${businessName} scored ${score}/100 (directional). In our test queries, AI engines didn't surface your business — meaning customers asking AI for businesses like yours are unlikely to see your name.`;
  }

  if (classification === "type-b-partial-presence") {
    if (detected.citationLevel === "none") {
      return `${businessName} scored ${score}/100 (directional). Your business exists online, but our directory + industry searches didn't surface third-party citations — which is why AI engines aren't yet recommending you with confidence.`;
    }
    return `${businessName} scored ${score}/100 (directional). AI engines have partial knowledge of your business but our test answers showed insufficient authority signals to recommend you consistently.`;
  }

  if (classification === "type-c-active-presence") {
    return `${businessName} scored ${score}/100 (directional). AI engines know your business but in our test queries you were occasionally cited rather than consistently recommended. The gap to dominance is closeable.`;
  }

  // Type D
  return `${businessName} scored ${score}/100 (directional). In our test queries, AI engines actively recommended your business — the next move is dominance through compounding monthly work.`;
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
      return `${businessName} appears largely invisible to AI search in our test queries.`;
    case "type-b-partial-presence":
      return `${businessName} has a partial digital footprint — but in our test queries, AI engines weren't recommending you when customers ask.`;
    case "type-c-active-presence":
      return `${businessName} has a working digital presence — AI engines know about you, but you're not the default recommendation in our test queries.`;
    case "type-d-strong-presence":
      return `${businessName} is well-positioned for AI search — you're showing up where it matters in our test queries.`;
  }
}

function buildCauseSentence(d: DetectedSignals): string {
  // Pick the dominant cause based on what's missing — phrased so it
  // describes what we observed, not what definitively is.
  if (d.citationLevel === "none") {
    return "The biggest reason: our directory + industry searches didn't surface any third-party citations. AI engines verify businesses by mentions on trusted directories and industry sites — without those signals visible to a search-grounded AI, you have weak authority footing.";
  }
  if (!d.websiteReachable && !d.gbpFound) {
    return "The biggest reason: we couldn't reach a website AND couldn't detect a Google Business Profile in search results. AI engines need at least one verified entity record to consider recommending you.";
  }
  if (d.websiteReachable && !d.websiteHasSchema) {
    return "The biggest reason: your website has no JSON-LD schema markup we could parse. AI engines see a wall of text instead of structured business data — much harder to quote reliably.";
  }
  if (!d.gbpFound) {
    return "The biggest reason: we couldn't detect a Google Business Profile via search. GBP is the single biggest local AI visibility signal in 2026 — please confirm it exists so we can rule this out.";
  }
  if (!d.napConsistent) {
    return "The biggest reason: business details (name, address, phone) appeared inconsistent across the platforms our search surfaced. AI engines downgrade trust when signals don't match.";
  }
  return "The biggest reason: insufficient depth across the layers AI engines weight most heavily.";
}

function buildImplicationSentence(
  c: Classification,
  _d: DetectedSignals,
): string {
  switch (c) {
    case "type-a-no-presence":
      return "Right now, customers who ask ChatGPT, Claude, Gemini, or Perplexity for businesses like yours are likely sent to your competitors instead.";
    case "type-b-partial-presence":
      return "Competitors with stronger AEO infrastructure are likely getting the AI recommendations — even when their underlying business or service quality isn't actually better than yours.";
    case "type-c-active-presence":
      return "You're in the running but not the default. AI engines give you partial credit, but the consistent recommendations tend to go to firms that have invested in citation density and content authority.";
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
 *
 * Phrasing is deliberately bounded — we describe what the scan tested
 * and what it didn't surface, rather than asserting absolute absence.
 */
export function buildIssues(detected: DetectedSignals): Issue[] {
  const issues: Issue[] = [];

  if (detected.citationLevel === "none") {
    issues.push({
      id: "no-citations",
      severity: "critical",
      title: "No third-party citations surfaced",
      explanation:
        "Our directory + industry searches didn't find your business mentioned on any trusted third-party site. Citations are how AI engines verify businesses exist and are real. (If you have listings we missed, share them — we'll re-check.)",
      fixCategory: "citations",
    });
  } else if (detected.citationLevel === "low") {
    issues.push({
      id: "low-citations",
      severity: "high",
      title: "Insufficient citation breadth",
      explanation:
        "We surfaced some citations but not the density that typically pushes a business to default AI recommendations. We typically see 25-50 active citations on businesses that get cited consistently across AI engines.",
      fixCategory: "citations",
    });
  }

  if (detected.websiteReachable && !detected.websiteHasSchema) {
    issues.push({
      id: "no-schema",
      severity: "critical",
      title: "No JSON-LD schema markup detected",
      explanation:
        "Your site doesn't expose structured data we could parse — meaning AI engines have to guess what your business does instead of reading verified entity data. (Schema injected at runtime via tag manager won't be visible to crawlers either — confirm with us if you think you have it.)",
      fixCategory: "schema",
    });
  }

  if (!detected.gbpFound) {
    issues.push({
      id: "no-gbp",
      severity: "critical",
      title: "Google Business Profile not detected via search",
      explanation:
        "We couldn't surface a Google Business Profile for your business in search results. GBP is the single biggest local AI visibility signal — please confirm it exists so we can rule this out. (We don't yet query the Google Maps API directly; that ships Phase 1.5.)",
      fixCategory: "gbp",
    });
  } else if (detected.gbpCompleteness && detected.gbpCompleteness < 80) {
    issues.push({
      id: "incomplete-gbp",
      severity: "high",
      title: "Google Business Profile likely incomplete",
      explanation: `Based on what surfaced in search, your GBP appears around ${detected.gbpCompleteness}% complete. Categories, hours, photos, services — every blank field weakens AI engines' trust signal.`,
      fixCategory: "gbp",
    });
  }

  if (!detected.websiteReachable) {
    issues.push({
      id: "no-website",
      severity: "high",
      title: "Website not reachable",
      explanation:
        "We couldn't reach a website at the URL we tested. AI engines can recommend businesses without websites, but the citation density required to do so is much higher. A simple, AEO-ready website is the highest-leverage first investment.",
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
      title: "Possible NAP inconsistency across listings",
      explanation:
        "Your business name, address, or phone appeared to vary across the directories our search surfaced. AI engines downgrade trust when signals don't match. (We'll verify the exact mismatches in your full audit.)",
      fixCategory: "consistency",
    });
  }

  if (detected.websiteReachable && !detected.websiteHasFAQSchema) {
    issues.push({
      id: "no-faq-schema",
      severity: "medium",
      title: "No FAQ-structured content detected",
      explanation:
        "AI engines quote question-answer blocks directly when answering customer queries. Without FAQ schema or answer-shaped content visible in your HTML, your site is harder for AI to quote.",
      fixCategory: "content",
    });
  }

  // Sort by severity: critical → high → medium → low
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return issues.sort((a, b) => order[a.severity] - order[b.severity]);
}
