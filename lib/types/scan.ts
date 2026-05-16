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

/**
 * QueryIntent — the buyer-need shape each test query exercises.
 *
 * Different intents test different AI retrieval patterns. A business
 * might be cited for "research" queries (general info) but invisible
 * for "problem" queries (urgent help) — that's a meaningfully
 * different gap than "invisible everywhere".
 *
 * Currently we run 4 queries that cover: recommendation, research,
 * problem, brand. Expansion to 8 intents (urgency, comparison, cost,
 * conversational, review) is on the roadmap once cost per scan is
 * justified by traffic data.
 */
export type QueryIntent =
  | "recommendation"
  | "research"
  | "problem"
  | "brand"
  | "urgency"
  | "comparison"
  | "cost"
  | "conversational"
  | "review";

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

  // ─── GBP signals from Places API (Phase 1.5) ────────────────────
  // Populated by `gbpFetcher.findPlace` in Stage 2.5 of the orchestrator.
  // All optional — older scans + scans where Places API is unavailable
  // simply omit them; the rest of the engine doesn't depend on them.
  /** Rating 0.0-5.0 from Places */
  gbpRating?: number;
  /** Review count from Places */
  gbpReviewCount?: number;
  /** First category Places returned (e.g. "store", "lawyer") */
  gbpPrimaryCategory?: string;
  /** All category strings Places returned */
  gbpCategories?: string[];
  /** True if Places returned opening_hours.weekday_text */
  gbpHasHours?: boolean;
  /** Heuristic: business_status=OPERATIONAL && reviewCount>0 */
  gbpVerifiedHeuristic?: boolean;

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
  /** Short snippet from the AI response — what was said about this
   *  competitor (services mentioned, recommended vs just listed).
   *  Optional because older scans + aggregations may not have it. */
  context?: string;
  /** Whether the competitor was named alongside the prospect's location
   *  in the AI response. Indicates true local competition vs
   *  national/multinational firms that surface from generic queries. */
  locality?: "local" | "regional" | "national" | "unknown";

  // ─── Leaderboard signals (Ticket 2) ──────────────────────────────
  // From the Ubersuggest competitive analysis: their free "Top Brands /
  // Avg. rank" table is the most concrete threat signal. We derive the
  // same from data we already collect — the order the AI proxy named
  // each business within each query result.
  /** Number of executed queries this competitor appeared in. Pair with
   *  the total executed-query count for an "appears in X of Y" ratio.
   *  Optional — older scans pre-date leaderboard aggregation. */
  mentionCount?: number;
  /** Mean 1-based position the AI proxy named this competitor, averaged
   *  across the queries where it appeared (2 d.p.). LOWER = named
   *  earlier / more prominently. This is observed ordering in our proxy
   *  responses, NOT an authoritative market ranking — the report copy
   *  must frame it honestly. Optional for back-compat. */
  avgRank?: number;
};

export type VisibilityCheck = {
  query: string;
  businessAppears: boolean;
  competitorsCited: string[];
  verbatimExcerpt: string;
  source: Engine;
  /** Buyer-need shape this query exercises. Lets us segment results
   *  by intent ("you're visible for research, invisible for urgency").
   *  Optional because older scans pre-date intent tagging. */
  intent?: QueryIntent;
};

/**
 * A customer question mined for THIS specific business, intent-tagged.
 *
 * Ticket 1 (prompt mining, derived from the Ubersuggest competitive
 * analysis — see docs/competitive-research/2026-05-14-*): instead of 4
 * hardcoded query templates we generate 8-12 realistic buyer questions
 * per scan, localised to the business's vertical / city / country, each
 * classified by QueryIntent.
 *
 * The full list is surfaced in the report ("the questions your customers
 * ask AI") — cheap, because generation is a single non-web_search call.
 * Only an intent-diverse subset is executed via live web_search
 * (`executed: true`, verbatim capture in visibilityChecks) to keep the
 * scan inside the Vercel 60s function ceiling.
 */
export type MinedPrompt = {
  query: string;
  intent: QueryIntent;
  /** True if this prompt was run through live web_search (its verbatim
   *  result appears in visibilityChecks). False = surfaced in the
   *  report as a known buyer question, but not deep-tested this run. */
  executed: boolean;
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
  /** Ticket 1: the full set of customer questions we mined for this
   *  business, each intent-tagged. A subset (executed:true) was run
   *  live (their verbatim results are in visibilityChecks); the rest
   *  are surfaced as "what your customers ask AI". Optional — older
   *  scans pre-date prompt mining and simply omit it. */
  minedPrompts?: MinedPrompt[];

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
