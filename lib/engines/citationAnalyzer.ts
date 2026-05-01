/**
 * Citation analyzer — uses Claude + web_search to find third-party
 * mentions of a business across the web.
 *
 * Why citations dominate the AI Visibility score: AI engines (ChatGPT,
 * Claude, Gemini, Perplexity) verify businesses by mentions on trusted
 * directories. Without citations, no AI engine confidently recommends
 * the business — regardless of how good the website is.
 *
 * This engine: 1 web_search call, structured output, ~10-15 seconds.
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

  const prompt = `You are auditing third-party citations for a business. Use web_search to find mentions on directory sites, industry registries, and other websites.

Business name: "${profile.businessName}"
Industry: ${profile.industry}
Location: ${profile.city}, ${countryName}
${profile.phone ? `Phone (for cross-reference): ${profile.phone}` : ""}
${profile.website ? `Website: ${profile.website}` : "(no website provided)"}

Run 1-2 web_search queries to find mentions of this business. Suggested searches:
- "${profile.businessName}" "${profile.city}"
- "${profile.businessName}" directory listing

Count distinct third-party DOMAINS that mention this business. Look for:
- Business directories (Brabys, Cylex, Yellosa, Hellopeter for ZA; Yelp, BBB for US; Yell.com for UK)
- Industry-specific directories or registries
- News sites or industry articles
- Professional bodies, associations
- Review platforms

Note any inconsistencies in name, phone, or address across mentions.

Respond with ONLY a JSON object (no other text, no code blocks):
{
  "count": <number of distinct domains mentioning the business>,
  "sources": [<list of domain strings, e.g. "brabys.com">],
  "napConsistent": <true if NAP details match across all citations, false if inconsistent or unable to verify>,
  "notes": "<1-2 sentences on citation quality, gaps, or anything notable>"
}`;

  const response = await anthropic.messages.create({
    model: SCAN_MODEL,
    max_tokens: 1500,
    tools: [{ ...WEB_SEARCH_TOOL, max_uses: 2 }],
    messages: [{ role: "user", content: prompt }],
  });

  const json = extractJsonFromResponse(response);
  const count = typeof json.count === "number" ? json.count : 0;
  const sources = Array.isArray(json.sources)
    ? json.sources.filter((s: unknown): s is string => typeof s === "string")
    : [];

  return {
    count,
    level: citationLevelFromCount(count),
    napConsistent:
      typeof json.napConsistent === "boolean" ? json.napConsistent : false,
    sources,
    notes: typeof json.notes === "string" ? json.notes : "",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

type ParsedJson = {
  count?: number;
  sources?: unknown[];
  napConsistent?: boolean;
  notes?: string;
};

function extractJsonFromResponse(response: {
  content: Array<{ type: string; text?: string }>;
}): ParsedJson {
  const textBlocks = response.content.filter(
    (b): b is { type: "text"; text: string } => b.type === "text",
  );
  const lastText = textBlocks[textBlocks.length - 1]?.text ?? "";

  // Try fenced code block first
  const fenced = lastText.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : findFirstJsonObject(lastText);

  try {
    return JSON.parse(candidate);
  } catch {
    // Defensive default — if Claude doesn't return clean JSON, assume worst case
    return {
      count: 0,
      sources: [],
      napConsistent: false,
      notes: "Could not parse citation data — defaulting to zero citations",
    };
  }
}

function findFirstJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return text.slice(start, end + 1).trim();
  }
  return text.trim();
}
