/**
 * Visibility simulator — runs 2-3 customer-style queries via Claude +
 * web_search to see what AI engines would actually recommend.
 *
 * This is the "gut punch" engine. The results page shows the buyer:
 *   "Here's exactly what AI says when your customers search.
 *    Notice who's listed. Notice who isn't."
 *
 * Each query: ~10-12 seconds. We run 2 queries to stay under 60s
 * Vercel function timeout. Both run sequentially (web_search rate limits).
 */

import { anthropic, SCAN_MODEL, WEB_SEARCH_TOOL } from "@/lib/anthropic-client";
import type {
  BusinessProfile,
  CompetitorMention,
  VisibilityCheck,
} from "@/lib/types/scan";

export type VisibilityAnalysis = {
  checks: VisibilityCheck[];
  competitors: CompetitorMention[];
};

export async function simulateAIQueries(
  profile: BusinessProfile,
): Promise<VisibilityAnalysis> {
  const queries = generateCustomerQueries(profile);

  const checks: VisibilityCheck[] = [];
  for (const query of queries) {
    try {
      const check = await runQuery(query, profile);
      checks.push(check);
    } catch (err) {
      // If a single query fails, log and continue with the others
      console.error(`[visibilitySimulator] Query failed: "${query}"`, err);
    }
  }

  const competitors = aggregateCompetitors(checks);

  return { checks, competitors };
}

// ─── Query generation ─────────────────────────────────────────────
function generateCustomerQueries(profile: BusinessProfile): string[] {
  const services = profile.servicesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const primary = services[0] || profile.industry.replace(/-/g, " ");
  const country =
    profile.country === "ZA"
      ? "South Africa"
      : profile.country === "GB"
        ? "UK"
        : profile.country === "US"
          ? "USA"
          : profile.country;

  return [
    `Best ${primary} in ${profile.city}, ${country}`,
    `Top ${profile.industry.replace(/-/g, " ")} companies in ${profile.city}`,
  ]; // 2 queries × ~12s = ~24s — fits comfortably under 60s timeout
}

// ─── Single query execution ──────────────────────────────────────
async function runQuery(
  query: string,
  profile: BusinessProfile,
): Promise<VisibilityCheck> {
  const prompt = `Use web_search to see what businesses an AI assistant would recommend for this customer query. Do NOT answer the query yourself — observe what the live web returns.

Query: "${query}"

After web_search, report:
1. Names of the top 3-5 businesses being recommended
2. Whether "${profile.businessName}" appears in the results
3. The verbatim language an AI assistant would use when responding

Respond with ONLY a JSON object (no other text, no code blocks):
{
  "businessAppears": <true if "${profile.businessName}" appears in results, false otherwise>,
  "competitorsCited": [<list of business name strings>],
  "verbatimExcerpt": "<2-3 sentences of how an AI assistant would phrase its answer>"
}`;

  const response = await anthropic.messages.create({
    model: SCAN_MODEL,
    max_tokens: 1500,
    tools: [{ ...WEB_SEARCH_TOOL, max_uses: 2 }],
    messages: [{ role: "user", content: prompt }],
  });

  const json = extractJsonFromResponse(response);

  return {
    query,
    businessAppears: typeof json.businessAppears === "boolean" ? json.businessAppears : false,
    competitorsCited: Array.isArray(json.competitorsCited)
      ? json.competitorsCited.filter((c: unknown): c is string => typeof c === "string")
      : [],
    verbatimExcerpt: typeof json.verbatimExcerpt === "string" ? json.verbatimExcerpt : "",
    source: "claude-search",
  };
}

// ─── Aggregate competitors across checks ─────────────────────────
function aggregateCompetitors(checks: VisibilityCheck[]): CompetitorMention[] {
  const map = new Map<string, CompetitorMention>();

  for (const check of checks) {
    for (const name of check.competitorsCited) {
      const key = name.trim().toLowerCase();
      if (!key) continue;

      const existing = map.get(key);
      if (existing) {
        if (!existing.appearsInEngines.includes("claude-search")) {
          existing.appearsInEngines.push("claude-search");
        }
      } else {
        map.set(key, {
          name: name.trim(),
          appearsInEngines: ["claude-search"],
          hasCitations: true,
          citationCount: undefined,
        });
      }
    }
  }

  return Array.from(map.values()).slice(0, 10);
}

// ─── JSON extraction (same pattern as citationAnalyzer) ──────────
type ParsedQueryJson = {
  businessAppears?: boolean;
  competitorsCited?: unknown[];
  verbatimExcerpt?: string;
};

function extractJsonFromResponse(response: {
  content: Array<{ type: string; text?: string }>;
}): ParsedQueryJson {
  const textBlocks = response.content.filter(
    (b): b is { type: "text"; text: string } => b.type === "text",
  );
  const lastText = textBlocks[textBlocks.length - 1]?.text ?? "";

  const fenced = lastText.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : findFirstJsonObject(lastText);

  try {
    return JSON.parse(candidate);
  } catch {
    return {
      businessAppears: false,
      competitorsCited: [],
      verbatimExcerpt: "",
    };
  }
}

function findFirstJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) return text.slice(start, end + 1).trim();
  return text.trim();
}
