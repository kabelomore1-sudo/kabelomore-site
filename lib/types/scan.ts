/**
 * Type system for the AI Visibility diagnostic engine.
 *
 * Three concerns separated:
 *  - INPUT  → BusinessProfile (what the user submits)
 *  - SCAN   → DetectedSignals (what the engines observe)
 *  - OUTPUT → ScanResult (what the user sees)
 *
 * The engines (scoring, classification, recommendation, diagnosis) are
 * pure functions over these types. No I/O. No side effects. Testable
 * in isolation.
 */

// ─── Enums ──────────────────────────────────────────────────────────

export const INDUSTRIES = [
  // High-ticket SA verticals first (matching our ICP and likely deal value)
  "medical",
  "legal",
  "industrial-supplier",
  "manufacturing",
  "construction",
  "mining",
  "agriculture",
  "finance",
  "property",
  "government",
  "education",
  "professional-services",
  "automotive",
  "retail",
  "hospitality",
  "other",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const COUNTRIES = ["ZA", "GB", "US", "other"] as const;
export type Country = (typeof COUNTRIES)[number];

export type CitationLevel = "none" | "low" | "medium" | "high";

export type Classification =
  | "type-a-no-presence"
  | "type-b-partial-presence"
  | "type-c-active-presence"
  | "type-d-strong-presence";

export type IssueSeverity = "critical" | "high" | "medium" | "low";

export type FixCategory =
  | "citations"
  | "schema"
  | "gbp"
  | "content"
  | "presence"
  | "consistency";

export type Engine = "chatgpt" | "claude" | "gemini" | "perplexity" | "claude-search";

// ─── INPUT: What the user submits ─────────────────────────────────

export type BusinessProfile = {
  // Required minimum
  businessName: string;
  contactName: string;
  email: string;

  // Strongly preferred (UI requires but allows blank)
  industry: Industry;
  city: string;
  country: Country;
  servicesText: string; // free-text comma-separated list

  // Optional — system handles missing data
  website?: string;
  gbpUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  phone?: string;

  // System-set
  scanId: string; // human-friendly slug
  submittedAt: string; // ISO timestamp
  ipHash?: string;
};

// ─── SCAN: What the engines observe ───────────────────────────────

export type DetectedSignals = {
  websiteReachable: boolean;
  websiteHasSchema: boolean;
  websiteHasFAQSchema: boolean;
  websiteHasLocalBusinessSchema: boolean;

  gbpFound: boolean;
  gbpCompleteness?: number; // 0-100 if found

  citationCount: number;
  citationLevel: CitationLevel;
  citationSources: string[]; // domains where business is mentioned
  napConsistent: boolean;

  socialPresenceCount: number; // how many social profiles are linked + active

  // Future / Phase 2
  hasLlmsTxt?: boolean;
  robotsAllowsAICrawlers?: boolean;
};

// ─── OUTPUT: What the user sees ───────────────────────────────────

export type Issue = {
  id: string;
  severity: IssueSeverity;
  title: string; // "No citations found"
  explanation: string; // 1-2 plain-English sentences
  fixCategory: FixCategory;
};

export type Recommendation = {
  rank: number; // 1 = highest priority
  title: string;
  explanation: string;
  estimatedImpact: "high" | "medium" | "low";
  estimatedEffort: "low" | "medium" | "high";
  mapsToTier?: string; // tier id from lib/site.ts (e.g. "optimization")
};

export type CompetitorMention = {
  name: string;
  appearsInEngines: Engine[];
  hasCitations: boolean;
  citationCount?: number;
};

export type VisibilityCheck = {
  query: string;
  businessAppears: boolean;
  competitorsCited: string[];
  verbatimExcerpt: string;
  source: Engine;
};

export type ScoreLayers = {
  presence: number; // 0-25
  authority: number; // 0-40 (DOMINANT)
  consistency: number; // 0-20
  content: number; // 0-15
};

export type ScanResult = {
  id: string; // matches BusinessProfile.scanId
  businessName: string; // denormalized for templates / display
  contactName: string;
  email: string;

  // Headline numbers
  score: number; // 0-100
  classification: Classification;
  layers: ScoreLayers;

  // What we observed
  detected: DetectedSignals;

  // Diagnosis
  issues: Issue[]; // ranked by severity
  recommendations: Recommendation[]; // ranked by impact/effort
  competitors: CompetitorMention[];
  visibilityChecks: VisibilityCheck[]; // 3-5 query results

  // Plain-English summary
  diagnosisOneLiner: string; // for WhatsApp + meta
  diagnosisFull: string; // for results page hero

  // System metadata
  scannedAt: string;
  durationMs: number;
  apiCostUsd?: number;
};

// ─── FOLLOW-UP: drip + conversion tracking ───────────────────────

export type Contact = {
  scanId: string;
  phoneE164: string;
  whatsappOptIn: boolean;
  emailOptIn: boolean;
  capturedAt: string;
};

export type FollowupTemplate =
  | "day-1-score"
  | "day-2-citations"
  | "day-3-competitors"
  | "day-5-offer";

export type FollowupChannel = "whatsapp" | "email";

export type FollowupStatus = "scheduled" | "sent" | "failed" | "skipped";

export type FollowupMessage = {
  id: string;
  scanId: string;
  channel: FollowupChannel;
  template: FollowupTemplate;
  scheduledFor: string;
  status: FollowupStatus;
  sentAt?: string;
  draftBody?: string; // for v1 manual sending
  manuallySentBy?: "kabelo";
};

export type ConvertedTo =
  | "scan-only"
  | "starter-audit"
  | "discovery"
  | "optimization-pack"
  | "optimization-lite"
  | "foundation-pack"
  | "foundation-lite"
  | "growth-retainer"
  | "premium-retainer";

export type Conversion = {
  scanId: string;
  convertedTo: ConvertedTo;
  conversionDate: string;
  daysFromScan: number;
};
