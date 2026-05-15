/**
 * Sector-aware sample report data for the preview dashboard.
 *
 * Used in two places:
 *   1. /scan submit success screen (FallbackBanner) — shows prospects
 *      what their personalised report will look like
 *   2. /scan/preview public page — standalone demo for marketing /
 *      LinkedIn share / OMS-type pre-pitch
 *
 * The numbers are realistic but ILLUSTRATIVE — they reflect typical
 * day-0 baselines for SA medical / legal / industrial firms before
 * any AEO work is done. Always clearly framed as "Sample" so we
 * never imply this is the prospect's actual data.
 *
 * Pattern recognition baked in:
 *   - Medical: typically has GBP + reviews but no schema, no AI citations
 *   - Legal: often has website + LSSA listing but minimal LinkedIn, no schema
 *   - Industrial: often has nothing — no GBP, no schema, low citations,
 *     completely invisible to AI engines
 */

import type {
  ScanResult,
  Classification,
  Industry,
  Engine,
} from "@/lib/types/scan";

type SampleSector = "medical" | "legal" | "industrial" | "other";

/**
 * Generate a sample ScanResult for the given sector.
 * Used to populate preview charts.
 */
export function generateSampleReport(
  sector: SampleSector,
  businessName: string = "Your Business",
): ScanResult {
  const baselines: Record<
    SampleSector,
    {
      score: number;
      classification: Classification;
      presence: number;
      authority: number;
      consistency: number;
      content: number;
      citationCount: number;
      websiteHasSchema: boolean;
      gbpFound: boolean;
      napConsistent: boolean;
    }
  > = {
    medical: {
      score: 32,
      classification: "type-b-partial-presence",
      presence: 18, // GBP usually claimed
      authority: 6, // very few citations on medical platforms
      consistency: 12, // NAP usually OK
      content: 4, // no FAQ schema, no AI-shaped content
      citationCount: 8,
      websiteHasSchema: false,
      gbpFound: true,
      napConsistent: true,
    },
    legal: {
      score: 27,
      classification: "type-b-partial-presence",
      presence: 14,
      authority: 5,
      consistency: 10,
      content: 4,
      citationCount: 6,
      websiteHasSchema: false,
      gbpFound: false, // many law firms don't have GBP claimed
      napConsistent: true,
    },
    industrial: {
      score: 18,
      classification: "type-a-no-presence",
      presence: 8,
      authority: 3,
      consistency: 8,
      content: 2,
      citationCount: 3,
      websiteHasSchema: false,
      gbpFound: false,
      napConsistent: false, // often inconsistent across directories
    },
    other: {
      score: 24,
      classification: "type-b-partial-presence",
      presence: 12,
      authority: 4,
      consistency: 9,
      content: 3,
      citationCount: 5,
      websiteHasSchema: false,
      gbpFound: true,
      napConsistent: true,
    },
  };

  const b = baselines[sector];

  // Sector-specific issues
  const issues =
    sector === "medical"
      ? [
          {
            id: "no-medical-aid-listing",
            severity: "critical" as const,
            title: "Medical aid plans not visible to AI engines",
            explanation:
              "Patients search 'cardiologist who accepts Discovery' — without explicit medical aid listing, AI engines can't match you to those queries.",
            fixCategory: "content" as const,
          },
          {
            id: "no-hpcsa",
            severity: "high" as const,
            title: "HPCSA registration not surfaced in structured data",
            explanation:
              "Your HPCSA verification is the highest-trust credential AI engines look for. It's likely buried in your About page instead of in schema.",
            fixCategory: "schema" as const,
          },
          {
            id: "no-hellopeter",
            severity: "high" as const,
            title: "HelloPeter profile not claimed",
            explanation:
              "70% of SA patients check HelloPeter before booking. Without an active profile + responses, AI engines have no review signal.",
            fixCategory: "citations" as const,
          },
        ]
      : sector === "legal"
        ? [
            {
              id: "no-lssa",
              severity: "critical" as const,
              title: "Law Society of SA listing not verified",
              explanation:
                "LSSA is the highest-trust legal verification AI engines cross-reference. Without it, you appear unverified to ChatGPT and Perplexity.",
              fixCategory: "citations" as const,
            },
            {
              id: "no-practice-area-schema",
              severity: "high" as const,
              title: "Practice areas not in structured data",
              explanation:
                "AI engines need granular practice areas (e.g. 'Commercial litigation in tech contracts') as schema, not just bullets in your About page.",
              fixCategory: "schema" as const,
            },
            {
              id: "no-founder-linkedin",
              severity: "high" as const,
              title: "Founding partner LinkedIn dormant",
              explanation:
                "AI engines train heavily on LinkedIn for legal authority. Inactive founder profiles signal a low-priority firm to ChatGPT.",
              fixCategory: "presence" as const,
            },
          ]
        : [
            // industrial
            {
              id: "no-csd",
              severity: "critical" as const,
              title: "Central Supplier Database (CSD) not registered",
              explanation:
                "CSD registration is essential for SOE procurement — without it, government procurement officers can't find or shortlist you regardless of AI visibility.",
              fixCategory: "citations" as const,
            },
            {
              id: "bbbee-not-visible",
              severity: "critical" as const,
              title: "BBBEE Level not surfaced in any digital property",
              explanation:
                "Procurement officers search 'BBBEE Level 1 supplier for [capability]' — your level needs to be in schema, GBP, AND on your homepage.",
              fixCategory: "content" as const,
            },
            {
              id: "no-engineering-news",
              severity: "high" as const,
              title: "Not listed in Engineering News supplier directory",
              explanation:
                "Engineering News is heavily indexed by AI engines for SA industrial queries. Without a listing, you're invisible to procurement-stage AI searches.",
              fixCategory: "citations" as const,
            },
          ];

  // Sector-specific recommendations
  const recommendations =
    sector === "medical"
      ? [
          {
            rank: 1,
            title: "Deploy Physician + MedicalBusiness schema with HPCSA",
            explanation:
              "1-day implementation. Enables AI engines to verify your credentials confidently.",
            estimatedImpact: "high" as const,
            estimatedEffort: "low" as const,
            mapsToTier: "optimization",
          },
          {
            rank: 2,
            title: "Claim HelloPeter + run quarterly review campaign",
            explanation:
              "Most patient-trust signal SA AI engines harvest. Compounds within 60 days.",
            estimatedImpact: "high" as const,
            estimatedEffort: "low" as const,
            mapsToTier: "growth",
          },
          {
            rank: 3,
            title: "Add medical aid acceptance to GBP + website + schema",
            explanation:
              "Direct match for buyer-intent queries like 'doctor who accepts Discovery in Sandton'.",
            estimatedImpact: "high" as const,
            estimatedEffort: "low" as const,
            mapsToTier: "starter",
          },
        ]
      : sector === "legal"
        ? [
            {
              rank: 1,
              title: "Verify LSSA listing + add to website footer",
              explanation:
                "Highest-trust legal credential. AI engines weight it heavily.",
              estimatedImpact: "high" as const,
              estimatedEffort: "low" as const,
              mapsToTier: "optimization",
            },
            {
              rank: 2,
              title: "Founder LinkedIn weekly cadence (3 ghost-written posts/week)",
              explanation:
                "LinkedIn is where Perplexity + ChatGPT train on legal authority.",
              estimatedImpact: "high" as const,
              estimatedEffort: "medium" as const,
              mapsToTier: "growth",
            },
            {
              rank: 3,
              title: "Deploy LegalService schema with practice areas",
              explanation:
                "Lets AI cite you for specific practice areas, not just brand searches.",
              estimatedImpact: "medium" as const,
              estimatedEffort: "low" as const,
              mapsToTier: "starter",
            },
          ]
        : [
            {
              rank: 1,
              title: "Register on CSD (Central Supplier Database)",
              explanation:
                "Essential for SOE/government work. Procurement portals cross-reference CSD.",
              estimatedImpact: "high" as const,
              estimatedEffort: "low" as const,
              mapsToTier: "optimization",
            },
            {
              rank: 2,
              title: "Add BBBEE Level to GBP description + homepage hero + schema",
              explanation:
                "Direct match for procurement queries. Single biggest visibility lever.",
              estimatedImpact: "high" as const,
              estimatedEffort: "low" as const,
              mapsToTier: "starter",
            },
            {
              rank: 3,
              title: "Submit listing to Engineering News + Mining Weekly directories",
              explanation:
                "Sector-specific high-trust citations AI engines harvest for industrial queries.",
              estimatedImpact: "high" as const,
              estimatedEffort: "medium" as const,
              mapsToTier: "growth",
            },
          ];

  // Realistic competitor names per sector — REAL local SA mid-market
  // firms that actually compete in each vertical. NOT multinational
  // enterprise brands (Bell / Barloworld / Babcock are too big to be a
  // competitor for a mid-market industrial supplier — using them in the
  // sample broke trust because prospects know their real competitive set).
  //
  // For industrial: Pretoria/Gauteng lifting equipment competitors that
  // actually appear in Google Maps for queries like 'hoist equipment
  // pretoria' / 'lifting equipment supplier gauteng'.
  const competitors = [
    {
      name:
        sector === "medical"
          ? "Sandton Specialist Group"
          : sector === "legal"
            ? "Werksmans Attorneys"
            : "Integrate Lifting SA",
      appearsInEngines: ["chatgpt", "perplexity", "gemini"] as Engine[],
      hasCitations: true,
      citationCount: 32,
    },
    {
      name:
        sector === "medical"
          ? "Linksfield Medical Centre"
          : sector === "legal"
            ? "Webber Wentzel"
            : "Elephant Lifting Equipment",
      appearsInEngines: ["chatgpt", "claude", "perplexity"] as Engine[],
      hasCitations: true,
      citationCount: 28,
    },
    {
      name:
        sector === "medical"
          ? "Cape Town Cardiology"
          : sector === "legal"
            ? "ENS Africa"
            : "RGM Cranes",
      appearsInEngines: ["chatgpt", "gemini"] as Engine[],
      hasCitations: true,
      citationCount: 21,
    },
  ];

  // Visibility checks — realistic queries customers actually run.
  // For industrial: queries align with what procurement officers and
  // operations managers Google for lifting/hoist equipment in Gauteng.
  const visibilityChecks = [
    {
      query:
        sector === "medical"
          ? `Best ${sector} specialist near me`
          : sector === "legal"
            ? "Best commercial attorney in Johannesburg"
            : "Hoist equipment supplier in Pretoria",
      businessAppears: false,
      competitorsCited: [competitors[0].name, competitors[1].name],
      verbatimExcerpt: `For ${sector === "industrial" ? "hoist and lifting equipment in Pretoria" : "the top firms in this category"}, here are some recommended suppliers: ${competitors[0].name} and ${competitors[1].name}, both with strong local presence and customer reviews...`,
      source: "chatgpt" as Engine,
    },
    {
      query: `Reviews for ${businessName}`,
      businessAppears: true,
      competitorsCited: [],
      verbatimExcerpt: `I have limited information about ${businessName}. They appear to operate in this sector but I cannot confirm specific reviews, recent customer feedback, or detailed services without more context.`,
      source: "claude" as Engine,
    },
    {
      query:
        sector === "medical"
          ? "Medical practitioner accepting Discovery in Pretoria"
          : sector === "legal"
            ? "Top SA law firm for SaaS startups"
            : "BBBEE Level 1 lifting equipment supplier Gauteng",
      businessAppears: false,
      competitorsCited: [competitors[0].name, competitors[2].name],
      verbatimExcerpt: `Based on industry sources, the leading providers I can identify are ${competitors[0].name} and ${competitors[2].name}, both verified with strong reputations in the South African market...`,
      source: "perplexity" as Engine,
    },
    {
      query:
        sector === "industrial"
          ? "Lifting equipment supplier mining contracts SA"
          : `Top ${sector} services in South Africa`,
      businessAppears: false,
      competitorsCited: [competitors[1].name],
      verbatimExcerpt: `For ${sector === "industrial" ? "lifting equipment serving the mining sector in South Africa" : `${sector} services in South Africa`}, ${competitors[1].name} is one of the more established providers I can recommend based on available information...`,
      source: "gemini" as Engine,
    },
  ];

  // Mined prompts (Ticket 1) — the full set of buyer questions we'd
  // surface for this category, intent-tagged. The 4 marked executed
  // mirror the visibilityChecks above (deep-tested live); the rest are
  // "listed" so the sample demonstrates both states.
  const minedPrompts =
    sector === "industrial"
      ? [
          { query: "Best industrial lifting equipment suppliers in Pretoria", intent: "recommendation" as const, executed: true },
          { query: `Reviews and reputation of ${businessName}`, intent: "brand" as const, executed: true },
          { query: "BBBEE Level 1 lifting equipment supplier in Gauteng", intent: "research" as const, executed: true },
          { query: "Lifting equipment supplier for mining contracts in South Africa", intent: "problem" as const, executed: true },
          { query: "Overhead crane vs gantry crane — which is better for a factory?", intent: "comparison" as const, executed: false },
          { query: "How much does a 10-ton overhead crane cost in South Africa?", intent: "cost" as const, executed: false },
          { query: "Urgent hoist repair near me in Pretoria", intent: "urgency" as const, executed: false },
          { query: "Who can service my electric chain hoist in Gauteng?", intent: "problem" as const, executed: false },
          { query: "Is it cheaper to rent or buy lifting equipment for a short project?", intent: "cost" as const, executed: false },
          { query: "What lifting equipment do I need to move a 5-ton machine safely?", intent: "conversational" as const, executed: false },
        ]
      : sector === "medical"
        ? [
            { query: "Best specialist near me accepting Discovery medical aid", intent: "recommendation" as const, executed: true },
            { query: `Reviews and patient experience at ${businessName}`, intent: "brand" as const, executed: true },
            { query: "Top-rated medical practitioner in Pretoria", intent: "research" as const, executed: true },
            { query: "Which doctor can help with this urgently in Pretoria?", intent: "urgency" as const, executed: true },
            { query: "Private vs public specialist consultation — what's the difference?", intent: "comparison" as const, executed: false },
            { query: "How much is a specialist consultation without medical aid in SA?", intent: "cost" as const, executed: false },
            { query: "What should I ask before booking this procedure?", intent: "conversational" as const, executed: false },
            { query: "Practitioners accepting new patients in Gauteng", intent: "problem" as const, executed: false },
          ]
        : sector === "legal"
          ? [
              { query: "Best commercial attorney in Johannesburg", intent: "recommendation" as const, executed: true },
              { query: `Reviews and reputation of ${businessName}`, intent: "brand" as const, executed: true },
              { query: "Top SA law firm for SaaS and tech startups", intent: "research" as const, executed: true },
              { query: "Who can help me with a contract dispute urgently?", intent: "urgency" as const, executed: true },
              { query: "Big firm vs boutique law firm for a startup — which is better?", intent: "comparison" as const, executed: false },
              { query: "Typical fee for a commercial contract review in South Africa", intent: "cost" as const, executed: false },
              { query: "What do I need to prepare before a first legal consultation?", intent: "conversational" as const, executed: false },
              { query: "Attorney experienced in shareholder agreements in Gauteng", intent: "problem" as const, executed: false },
            ]
          : [
              { query: `Best ${sector} provider near me`, intent: "recommendation" as const, executed: true },
              { query: `Reviews and reputation of ${businessName}`, intent: "brand" as const, executed: true },
              { query: `Top ${sector} companies in South Africa`, intent: "research" as const, executed: true },
              { query: `Who can help me with ${sector} services urgently?`, intent: "urgency" as const, executed: true },
              { query: `${sector} pricing in South Africa — what's typical?`, intent: "cost" as const, executed: false },
              { query: `How do I choose the right ${sector} provider?`, intent: "conversational" as const, executed: false },
            ];

  return {
    id: "preview",
    businessName,
    contactName: "Sample User",
    email: "preview@kabelomore.com",
    score: b.score,
    classification: b.classification,
    layers: {
      presence: b.presence,
      authority: b.authority,
      consistency: b.consistency,
      content: b.content,
    },
    detected: {
      websiteReachable: true,
      websiteHasSchema: b.websiteHasSchema,
      websiteHasFAQSchema: false,
      websiteHasLocalBusinessSchema: b.websiteHasSchema,
      gbpFound: b.gbpFound,
      gbpCompleteness: b.gbpFound ? 65 : undefined,
      citationCount: b.citationCount,
      citationLevel: b.citationCount > 20 ? "high" : b.citationCount > 10 ? "medium" : b.citationCount > 0 ? "low" : "none",
      citationSources:
        sector === "medical"
          ? ["hpcsa.co.za", "brabys.com", "google.com/maps"]
          : sector === "legal"
            ? ["lssa.org.za", "brabys.com", "linkedin.com"]
            : ["brabys.com", "google.com/maps"],
      napConsistent: b.napConsistent,
      socialPresenceCount: 2,
    },
    issues,
    recommendations,
    competitors,
    visibilityChecks,
    minedPrompts,
    diagnosisOneLiner: `For a typical SA ${sector} firm, AI engine visibility usually starts in the bottom quartile — even when Google rankings are reasonable. Three high-impact fixes typically move firms to the top quartile within 60 days. (Score is directional, not deterministic.)`,
    diagnosisFull: `Across customer-style queries we run via Claude + live web search (a proxy for ChatGPT, Gemini, Perplexity until native adapters ship in Phase 1.5), the typical baseline shows the business appearing in ${visibilityChecks.filter((v) => v.businessAppears).length} of ${visibilityChecks.length} buyer-intent queries. This is independent of Google search performance — businesses ranking well on Google Maps can still be invisible to AI engines because the systems weight signals differently. The good news: the highest-impact fixes for AI visibility are quick wins — schema deployment, key directory listings, and a few specific changes to your Google Business Profile that AI engines weight heavily.`,
    scannedAt: new Date().toISOString(),
    durationMs: 28_400,
  };
}

/**
 * Map raw industry string to sample sector key.
 *
 * The preview dashboard only renders 4 distinct sample patterns
 * (medical / legal / industrial / other) — but the form now accepts
 * many more industries. We collapse adjacent industries onto the
 * closest sample pattern so the preview stays meaningful:
 *   - medical → medical
 *   - legal / finance → legal (procurement-driven, professional-services
 *     pattern)
 *   - industrial / manufacturing / construction / mining / agriculture /
 *     automotive / property → industrial (procurement-driven,
 *     trade-association heavy)
 *   - government / education / professional-services / retail /
 *     hospitality / other → other (generic baseline)
 */
export function mapIndustryToSector(industry: Industry | string): SampleSector {
  if (industry === "medical") return "medical";
  if (industry === "legal" || industry === "finance") return "legal";
  if (
    industry === "industrial-supplier" ||
    industry === "manufacturing" ||
    industry === "construction" ||
    industry === "automotive" ||
    industry === "mining" ||
    industry === "agriculture" ||
    industry === "property"
  ) {
    return "industrial";
  }
  return "other";
}
