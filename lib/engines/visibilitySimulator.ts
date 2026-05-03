/**
 * Visibility simulator — runs customer-style queries via Claude +
 * web_search to see what AI engines would actually recommend.
 *
 * This is the "gut punch" engine. The results page shows the buyer:
 *   "Here's exactly what AI says when your customers search.
 *    Notice who's listed. Notice who isn't."
 *
 * QUERY DIVERSITY (post-honesty-audit):
 *   We run 4 queries across distinct buyer-intent shapes — not 4
 *   reskins of the same query. The shapes:
 *     1. SUPERLATIVE   "Best [service] in [city]"
 *     2. CATEGORY      "Top [industry] companies in [city]"
 *     3. PROBLEM       "Who can help with [service]?"
 *     4. BRAND         "Reviews for [business name]"
 *   Each shape exercises a different retrieval pattern (general
 *   recommendation, category list, intent match, brand awareness).
 *   2 queries weren't enough — they were too similar to differentiate
 *   between "no AI footprint at all" and "no footprint for THIS query
 *   shape."
 *
 * Each query: ~10-12 seconds. 4 queries × 12s = ~48s sequential.
 * Hard cap at the orchestrator level keeps us inside the 60s Vercel
 * function timeout.
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
// 4 distinct intent shapes — each exercises a different AI retrieval
// pattern. We run all 4 sequentially because Anthropic's web_search
// has tighter rate limits than its base model.
function generateCustomerQueries(profile: BusinessProfile): string[] {
  const services = profile.servicesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const primary = services[0] || profile.industry.replace(/-/g, " ");
  const industryWords = profile.industry.replace(/-/g, " ");
  const country =
    profile.country === "ZA"
      ? "South Africa"
      : profile.country === "GB"
        ? "UK"
        : profile.country === "US"
          ? "USA"
          : profile.country;

  return [
    // 1. SUPERLATIVE — recommendation framing
    `Best ${primary} in ${profile.city}, ${country}`,
    // 2. CATEGORY — list framing
    `Top ${industryWords} companies in ${profile.city}`,
    // 3. PROBLEM / INTENT — buyer-need framing
    `Who can help me with ${primary} in ${profile.city}?`,
    // 4. BRAND — direct awareness check
    `Reviews and reputation of ${profile.businessName}`,
  ]; // 4 queries × ~12s ≈ 48s — orchestrator timeout protects against overrun
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
