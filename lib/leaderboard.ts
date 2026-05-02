/**
 * The SA AEO Index — public leaderboard data
 *
 * Each entry represents a real or anonymised SA professional firm scored
 * against The Real Estate Method's 7 properties. Updated monthly.
 *
 * Strategic intent (Naval):
 *   - Becomes THE benchmark when buyers ask "how does my firm compare?"
 *   - Compounding asset: each monthly update generates PR + LinkedIn content
 *   - Lead magnet: firms NOT in the index inquire about how to be added
 *   - Defensive moat: once we're seen as the index keeper, that role is hard to replace
 *
 * Public-eligibility rules:
 *   - Real firms appear by name only with explicit written consent
 *   - Anonymised firms appear as 'Practice A / Firm B / Industrial C' until consent received
 *   - All entries link to a method-of-scoring footnote
 *
 * Beta state (May 2026):
 *   - First 12 entries are anonymised seeds illustrating the format
 *   - First named entries (with consent) target Q3 2026
 *   - Methodology + scoring criteria documented at /about + AUDIT-PLAYBOOK.md
 */

export type LeaderboardEntry = {
  rank: number;
  /** Display name. Use 'Practice A' style for anonymised entries until consent given. */
  name: string;
  /** Optional — only set for entries with public consent */
  publicConsent: boolean;
  city: string;
  sector: "medical" | "legal" | "industrial";
  /** Specific specialty/practice area to add texture */
  specialty: string;
  /** AEO score 0-100 — calculated from 7-property coverage with sector weighting */
  score: number;
  /** Top-performing property (e.g. 'GBP completeness') */
  topStrength: string;
  /** Highest-leverage gap (e.g. 'No industry citations') */
  biggestGap: string;
  /** ISO 8601 last-audit date */
  lastUpdated: string;
};

const entriesArr: LeaderboardEntry[] = [
  // INDUSTRIAL — top sector for SA AEO opportunity
  {
    rank: 1,
    name: "OMS Lifting Solutions",
    publicConsent: true,
    city: "Pretoria",
    sector: "industrial",
    specialty: "Lifting equipment · BBBEE Level 1 · Mining contracts",
    score: 42,
    topStrength: "BBBEE Level 1 + 5-year mining contract track record",
    biggestGap: "Schema markup + industry citations (CSD, CIDB, BBBEE Verification)",
    lastUpdated: "2026-04-15",
  },
  {
    rank: 2,
    name: "Industrial Firm B",
    publicConsent: false,
    city: "Witbank",
    sector: "industrial",
    specialty: "Steel fabrication · Mining suppliers",
    score: 38,
    topStrength: "Active LinkedIn presence (founder posting weekly)",
    biggestGap: "BBBEE Level not visible in any digital property",
    lastUpdated: "2026-04-22",
  },
  {
    rank: 3,
    name: "Industrial Firm C",
    publicConsent: false,
    city: "Vereeniging",
    sector: "industrial",
    specialty: "Conveyor systems · Mining + agro-processing",
    score: 35,
    topStrength: "30+ photos on GBP showing capability",
    biggestGap: "No industry-specific citations (Mining Weekly, DMRE, etc.)",
    lastUpdated: "2026-04-28",
  },

  // MEDICAL
  {
    rank: 4,
    name: "Medical Practice D",
    publicConsent: false,
    city: "Sandton",
    sector: "medical",
    specialty: "Cardiology · Discovery Network",
    score: 33,
    topStrength: "Strong Google reviews (45+ at 4.8 stars)",
    biggestGap: "No FAQ schema — patient questions go unanswered to AI",
    lastUpdated: "2026-04-18",
  },
  {
    rank: 5,
    name: "Medical Practice E",
    publicConsent: false,
    city: "Cape Town",
    sector: "medical",
    specialty: "Aesthetics + dermatology",
    score: 30,
    topStrength: "Active Instagram (irrelevant to AI engines)",
    biggestGap: "No HelloPeter profile + no schema markup",
    lastUpdated: "2026-04-25",
  },
  {
    rank: 6,
    name: "Medical Practice F",
    publicConsent: false,
    city: "Durban",
    sector: "medical",
    specialty: "Orthopaedics",
    score: 28,
    topStrength: "Hospital affiliation listed prominently",
    biggestGap: "Founder LinkedIn dormant since 2024",
    lastUpdated: "2026-04-20",
  },

  // LEGAL
  {
    rank: 7,
    name: "Law Firm G",
    publicConsent: false,
    city: "Johannesburg",
    sector: "legal",
    specialty: "Commercial · M&A",
    score: 27,
    topStrength: "Strong website with detailed practice areas",
    biggestGap: "No GBP — invisible to local SERP entirely",
    lastUpdated: "2026-04-12",
  },
  {
    rank: 8,
    name: "Law Firm H",
    publicConsent: false,
    city: "Cape Town",
    sector: "legal",
    specialty: "Commercial · Tech / SaaS clients",
    score: 25,
    topStrength: "Founding partner LinkedIn cadence (3 posts/week)",
    biggestGap: "No Saflii author profile + no LSSA listing claimed",
    lastUpdated: "2026-04-30",
  },
  {
    rank: 9,
    name: "Law Firm I",
    publicConsent: false,
    city: "Pretoria",
    sector: "legal",
    specialty: "Family + estates",
    score: 22,
    topStrength: "Strong reviews on HelloPeter (28+, 4.6 stars)",
    biggestGap: "Schema markup absent + no court of practice listed anywhere",
    lastUpdated: "2026-04-26",
  },

  // BOTTOM RANGE — illustrative
  {
    rank: 10,
    name: "Industrial Firm J",
    publicConsent: false,
    city: "Port Elizabeth",
    sector: "industrial",
    specialty: "Automotive parts manufacturing",
    score: 18,
    topStrength: "BBBEE Level 2 verified (visible on certificate page only)",
    biggestGap: "No GBP, no LinkedIn, no schema — invisible to AI",
    lastUpdated: "2026-04-29",
  },
  {
    rank: 11,
    name: "Medical Practice K",
    publicConsent: false,
    city: "Bloemfontein",
    sector: "medical",
    specialty: "General practice",
    score: 16,
    topStrength: "Active practice (visible from physical signage only)",
    biggestGap: "Zero digital footprint beyond a stale Facebook page",
    lastUpdated: "2026-04-30",
  },
  {
    rank: 12,
    name: "Law Firm L",
    publicConsent: false,
    city: "East London",
    sector: "legal",
    specialty: "Labour + CCMA practice",
    score: 14,
    topStrength: "Long-established (40+ years)",
    biggestGap: "No website. AI engines have nothing to cite.",
    lastUpdated: "2026-04-24",
  },
];

/** Sorted descending by score, with rank recalculated (in case data is edited) */
export const leaderboardEntries = entriesArr
  .slice()
  .sort((a, b) => b.score - a.score)
  .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

export const leaderboardStats = {
  totalEntries: leaderboardEntries.length,
  averageScore:
    Math.round(
      (leaderboardEntries.reduce((sum, e) => sum + e.score, 0) /
        leaderboardEntries.length) *
        10,
    ) / 10,
  topScore: leaderboardEntries[0]?.score ?? 0,
  bottomScore: leaderboardEntries[leaderboardEntries.length - 1]?.score ?? 0,
  bySector: {
    medical: leaderboardEntries.filter((e) => e.sector === "medical").length,
    legal: leaderboardEntries.filter((e) => e.sector === "legal").length,
    industrial: leaderboardEntries.filter((e) => e.sector === "industrial")
      .length,
  },
};

export function getLeaderboardEntries(filter?: {
  sector?: "medical" | "legal" | "industrial";
}) {
  if (filter?.sector) {
    return leaderboardEntries.filter((e) => e.sector === filter.sector);
  }
  return leaderboardEntries;
}
