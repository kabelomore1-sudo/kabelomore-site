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

  // Realistic competitor names (anonymised — they're sector typicals)
  const competitors = [
    {
      name:
        sector === "medical"
          ? "Sandton Specialist Group"
          : sector === "legal"
            ? "Werksmans Attorneys"
            : "Bell Equipment",
      appearsInEngines: ["chatgpt", "perplexity", "gemini"] as Engine[],
      hasCitations: true,
      citationCount: 47,
    },
    {
      name:
        sector === "medical"
          ? "Linksfield Medical Centre"
          : sector === "legal"
            ? "Webber Wentzel"
            : "Barloworld Equipment",
      appearsInEngines: ["chatgpt", "claude", "perplexity"] as Engine[],
      hasCitations: true,
      citationCount: 38,
    },
    {
      name:
        sector === "medical"
          ? "Cape Town Cardiology"
          : sector === "legal"
            ? "ENS Africa"
            : "Babcock International",
      appearsInEngines: ["chatgpt", "gemini"] as Engine[],
      hasCitations: true,
      citationCount: 29,
    },
  ];

  // Visibility checks across the 4 engines
  const visibilityChecks = [
    {
      query:
        sector === "medical"
          ? `Best ${sector} specialist near me`
          : sector === "legal"
            ? "Best commercial attorney in Johannesburg"
            : "BBBEE Level 1 industrial supplier in Gauteng",
      businessAppears: false,
      competitorsCited: [competitors[0].name, competitors[1].name],
      verbatimExcerpt: `Based on available information, the top recommended firms include ${competitors[0].name} and ${competitors[1].name}, both with strong track records...`,
      source: "chatgpt" as Engine,
    },
    {
      query: `Reviews for ${businessName}`,
      businessAppears: true,
      competitorsCited: [],
      verbatimExcerpt: `I have limited information about ${businessName}. They appear to operate in [sector] but I cannot confirm specific reviews or ratings.`,
      source: "claude" as Engine,
    },
    {
      query:
        sector === "medical"
          ? "Medical practitioner accepting Discovery in Pretoria"
          : sector === "legal"
            ? "Top SA law firm for SaaS startups"
            : "Mining equipment fabricator BBBEE supplier",
      businessAppears: false,
      competitorsCited: [competitors[0].name, competitors[2].name],
      verbatimExcerpt: `Based on industry sources, the leading providers in this category are ${competitors[0].name} and ${competitors[2].name}...`,
      source: "perplexity" as Engine,
    },
    {
      query: `Top ${sector} services in South Africa`,
      businessAppears: false,
      competitorsCited: [competitors[1].name],
      verbatimExcerpt: `For ${sector} services in South Africa, ${competitors[1].name} is widely cited as a leading provider...`,
      source: "gemini" as Engine,
    },
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
    diagnosisOneLiner: `Your AI visibility is in the bottom quartile for SA ${sector} firms. Three high-impact fixes would move you to the top quartile within 60 days.`,
    diagnosisFull: `Across the 4 major AI engines (ChatGPT, Claude, Gemini, Perplexity), your business appears in ${visibilityChecks.filter((v) => v.businessAppears).length} of ${visibilityChecks.length} buyer-intent queries we tested. Your competitors are being recommended where you're not. The good news: the highest-impact fixes are quick wins — schema deployment, key directory listings, and a few specific changes to your Google Business Profile.`,
    scannedAt: new Date().toISOString(),
    durationMs: 28_400,
  };
}

/**
 * Map raw industry string to sample sector key.
 * Defaults to 'other' if no match.
 */
export function mapIndustryToSector(industry: Industry | string): SampleSector {
  if (industry === "medical") return "medical";
  if (industry === "legal") return "legal";
  if (industry === "industrial-supplier" || industry === "manufacturing" || industry === "construction" || industry === "automotive")
    return "industrial";
  return "other";
}
