/**
 * Citation analyzer — finds third-party mentions of a business across the web.
 *
 * REWRITTEN to use multi-strategy search instead of a single Claude call.
 * Why: a single call was returning 0 citations even when 5-6 verified
 * citations existed (the OMS test case proved this empirically).
 *
 * New strategy:
 *  - Call 1: directory & registry search (Brabys, Cylex, B2BHint, etc.)
 *  - Call 2: industry/professional body search (LME, ECSA, LEEASA, etc.)
 *  - Aggregate distinct domains across both calls
 *  - Surface failures explicitly — never silently default to 0
 *
 * Cost: ~$0.20 per scan (2 Claude calls × ~$0.10 each).
 * Runtime: ~20-25s sequential, ~12s if run in parallel.
 */

import { anthropic, SCAN_MODEL, WEB_SEARCH_TOOL } from "@/lib/anthropic-client";
import { citationLevelFromCount } from "./scoring";
import type { BusinessProfile, CitationLevel } from "@/lib/types/scan";

export type CitationAnalysis = {
  count: number;
  level: CitationLevel;
  napConsistent: boolean;
  sources: string[];
  notes: string;
  // True if at least one search ran successfully — false if both failed
  // (so the orchestrator knows to mark this as "incomplete" not "0 citations")
  discoveryRan: boolean;
};

type SingleSearchResult = {
  domains: string[];
  napIssuesFound: boolean;
  notes: string;
  ran: boolean;
};

export async function analyzeCitations(
  profile: BusinessProfile,
): Promise<CitationAnalysis> {
  const countryName =
    profile.country === "ZA"
      ? "South Africa"
      : profile.country === "GB"
        ? "United Kingdom"
        : profile.country === "US"
          ? "United States"
          : profile.country;

  // Run two distinct citation searches in parallel
  const [directorySearch, industrySearch] = await Promise.all([
    runDirectorySearch(profile, countryName),
    runIndustrySearch(profile, countryName),
  ]);

  // Aggregate distinct domains
  const allDomains = new Set<string>();
  for (const d of directorySearch.domains) allDomains.add(d.toLowerCase());
  for (const d of industrySearch.domains) allDomains.add(d.toLowerCase());

  // Filter out domains that are clearly the business's own (we want THIRD-party citations)
  const sourcesArr = Array.from(allDomains).filter((d) => {
    if (!profile.website) return true;
    try {
      const ownDomain = new URL(profile.website).hostname.replace(/^www\./, "");
      return !d.includes(ownDomain);
    } catch {
      return true;
    }
  });

  const count = sourcesArr.length;
  const ranAtLeastOne = directorySearch.ran || industrySearch.ran;

  // NAP consistency: if either search found inconsistencies, mark as inconsistent
  const napConsistent = !(
    directorySearch.napIssuesFound || industrySearch.napIssuesFound
  );

  const noteParts: string[] = [];
  if (directorySearch.notes) noteParts.push(`Directory: ${directorySearch.notes}`);
  if (industrySearch.notes) noteParts.push(`Industry: ${industrySearch.notes}`);

  return {
    count,
    level: citationLevelFromCount(count),
    napConsistent,
    sources: sourcesArr,
    notes: noteParts.join(" | ") || "No specific notes captured.",
    discoveryRan: ranAtLeastOne,
  };
}

// ─── Search 1: General directories ───────────────────────────────
async function runDirectorySearch(
  profile: BusinessProfile,
  countryName: string,
): Promise<SingleSearchResult> {
  const directories =
    profile.country === "ZA"
      ? "Brabys, Cylex, Yellosa, Showme, Hellopeter, B2BHint, SACompany"
      : profile.country === "GB"
        ? "Yell, Yelp UK, Trustpilot, Companies House"
        : profile.country === "US"
          ? "Yelp, BBB, Yellowpages, Manta, Crunchbase"
          : "general business directories";

  const prompt = `You are searching for third-party directory listings of a business. Use web_search.

Business: "${profile.businessName}"
Location: ${profile.city}, ${countryName}
${profile.phone ? `Phone: ${profile.phone}` : ""}
${profile.website ? `Their own website: ${profile.website}` : ""}

Run 1-2 web_search queries to find directory mentions. Try:
- "${profile.businessName}" ${profile.city}
- "${profile.businessName}" directory listing OR registration

Focus on directories like: ${directories}

Disambiguate: if there are multiple businesses with similar names (e.g. "OMS Group" Italy vs "OMS Lifting" South Africa), only count mentions of the SPECIFIC business at the SPECIFIC city.

Respond with ONLY a JSON object (no other text, no code blocks):
{
  "domains": [<list of distinct THIRD-PARTY domain names that mention this specific business, e.g. "brabys.com", "cylex.co.za">],
  "napIssuesFound": <true if business name/phone/address vary across listings>,
  "notes": "<1 sentence on what was found>"
}`;

  return runSearchCall(prompt, "directory");
}

// ─── Search 2: Industry / professional bodies ────────────────────
async function runIndustrySearch(
  profile: BusinessProfile,
  countryName: string,
): Promise<SingleSearchResult> {
  // Industry-specific guidance — sector-aware citation discovery so the
  // search query targets the registers and directories AI engines actually
  // weight for that industry. Adding a sector here is the single highest-
  // leverage way to improve scan accuracy for prospects in that vertical.
  const industryHint =
    profile.industry === "industrial-supplier" || profile.industry === "manufacturing"
      ? "LME register (Department of Labour for ZA), ECSA, LEEASA, SAIMM, mining industry directories"
      : profile.industry === "legal"
        ? "Law Society register (LSSA), General Council of the Bar, professional body directories"
        : profile.industry === "medical"
          ? "HPCSA register, medpages, medical association directories"
          : profile.industry === "construction"
            ? "NHBRC, Master Builders Association, CIDB grading, construction industry directories"
            : profile.industry === "automotive"
              ? "RMI register, automotive industry directories"
              : profile.industry === "mining"
                ? "SAMI (SA Mining Industry), DMRE registrations, Mining Weekly, Engineering News, Junior Mining Council, SAIMM, Minerals Council"
                : profile.industry === "agriculture"
                  ? "Agbiz, AgriSA, Grain SA, commodity body directories, Farmer's Weekly, agri-processing associations"
                  : profile.industry === "finance"
                    ? "FSCA register, SAICA / SAIPA / SAIBA membership directories, JSE-listed pages, financial advisory directories"
                    : profile.industry === "property"
                      ? "Property24, Private Property, EAAB register, REIM Africa, Property Wheel, Sectional Title Owners Forum"
                      : profile.industry === "government"
                        ? "Central Supplier Database (CSD), DTIC business registrations, government tender portals (eTender, IPS), SOE supplier lists"
                        : profile.industry === "education"
                          ? "DHET / SETA registrations, Umalusi, training accreditation bodies, education association directories"
                          : "professional body and industry-specific registers";

  const prompt = `You are searching for industry-specific mentions of a business. Use web_search.

Business: "${profile.businessName}"
Industry: ${profile.industry}
Location: ${profile.city}, ${countryName}

Run 1-2 web_search queries to find industry-relevant mentions. Examples:
- "${profile.businessName}" ${profile.industry}
- "${profile.businessName}" registered OR member OR certified

Look for mentions on industry-specific sites: ${industryHint}

Also check for: news mentions, industry publications, social media (Facebook page, LinkedIn company page).

Disambiguate strictly — only count mentions of THIS business at the SPECIFIC city.

Respond with ONLY a JSON object (no other text, no code blocks):
{
  "domains": [<list of distinct domain names>],
  "napIssuesFound": <true if name/phone/address inconsistencies>,
  "notes": "<1 sentence on what was found>"
}`;

  return runSearchCall(prompt, "industry");
}

// ─── Single Claude+search call with JSON extraction ──────────────
async function runSearchCall(
  prompt: string,
  label: string,
): Promise<SingleSearchResult> {
  try {
    const response = await anthropic.messages.create({
      model: SCAN_MODEL,
      max_tokens: 1500,
      tools: [{ ...WEB_SEARCH_TOOL, max_uses: 2 }],
      messages: [{ role: "user", content: prompt }],
    });

    const json = extractJsonFromResponse(response);
    const domains = Array.isArray(json.domains)
      ? json.domains.filter((d: unknown): d is string => typeof d === "string")
      : [];

    return {
      domains,
      napIssuesFound: Boolean(json.napIssuesFound),
      notes: typeof json.notes === "string" ? json.notes : "",
      ran: true,
    };
  } catch (err) {
    console.error(`[citationAnalyzer] ${label} search failed:`, err);
    return {
      domains: [],
      napIssuesFound: false,
      notes: `${label} search errored`,
      ran: false,
    };
  }
}

// ─── JSON extraction ─────────────────────────────────────────────
type SearchJson = {
  domains?: unknown[];
  napIssuesFound?: boolean;
  notes?: string;
};

function extractJsonFromResponse(response: {
  content: Array<{ type: string; text?: string }>;
}): SearchJson {
  const textBlocks = response.content.filter(
    (b): b is { type: "text"; text: string } => b.type === "text",
  );
  const lastText = textBlocks[textBlocks.length - 1]?.text ?? "";

  const fenced = lastText.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : findFirstJsonObject(lastText);

  try {
    return JSON.parse(candidate);
  } catch {
    return {};
  }
}

function findFirstJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) return text.slice(start, end + 1).trim();
  return text.trim();
}
