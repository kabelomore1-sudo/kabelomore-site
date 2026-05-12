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

import {
  anthropic,
  SCAN_MODEL,
  WEB_SEARCH_TOOL,
  SCAN_SYSTEM_PROMPT,
} from "@/lib/anthropic-client";
import type {
  BusinessProfile,
  CompetitorMention,
  QueryIntent,
  VisibilityCheck,
} from "@/lib/types/scan";

/**
 * A query + its intent — paired at definition time so the intent
 * survives through to the report. Allows the results page to segment
 * "you appear for research queries but not urgency queries" rather
 * than just showing 4 strings with no semantic grouping.
 */
type QueryDefinition = {
  query: string;
  intent: QueryIntent;
};

export type VisibilityAnalysis = {
  checks: VisibilityCheck[];
  competitors: CompetitorMention[];
};

export async function simulateAIQueries(
  profile: BusinessProfile,
): Promise<VisibilityAnalysis> {
  const queries = generateCustomerQueries(profile);

  const checks: VisibilityCheck[] = [];
  for (const def of queries) {
    try {
      const check = await runQuery(def, profile);
      checks.push(check);
    } catch (err) {
      // If a single query fails, log and continue with the others
      console.error(`[visibilitySimulator] Query failed: "${def.query}"`, err);
    }
  }

  const competitors = aggregateCompetitors(checks);

  return { checks, competitors };
}

// ─── Query generation ─────────────────────────────────────────────
// 4 distinct intent shapes — each exercises a different AI retrieval
// pattern. Each query is tagged with its intent so the report can
// segment results ("visible for research, invisible for problem").
// We run all 4 sequentially because Anthropic's web_search has tighter
// rate limits than its base model.
function generateCustomerQueries(profile: BusinessProfile): QueryDefinition[] {
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
    {
      query: `Best ${primary} in ${profile.city}, ${country}`,
      intent: "recommendation",
    },
    {
      query: `Top ${industryWords} companies in ${profile.city}`,
      intent: "research",
    },
    {
      query: `Who can help me with ${primary} in ${profile.city}?`,
      intent: "problem",
    },
    {
      query: `Reviews and reputation of ${profile.businessName}`,
      intent: "brand",
    },
  ]; // 4 queries × ~12s ≈ 48s — orchestrator timeout protects against overrun
}

// ─── Single query execution ──────────────────────────────────────
async function runQuery(
  def: QueryDefinition,
  profile: BusinessProfile,
): Promise<VisibilityCheck> {
  const prompt = `Use web_search to see what businesses an AI assistant would recommend for this customer query. Do NOT answer the query yourself — observe what the live web returns.

Query: "${def.query}"

After web_search, report:
1. Names of the top 3-5 businesses being recommended, with a SHORT context for each (what services were mentioned, whether they were recommended or just listed)
2. Whether "${profile.businessName}" appears in the results
3. The verbatim language an AI assistant would use when responding

Respond with ONLY a JSON object (no other text, no code blocks). For competitors, "context" is optional — include it when the search results give specific detail about that business, omit otherwise.

{
  "businessAppears": <true if "${profile.businessName}" appears in results, false otherwise>,
  "competitorsCited": [
    { "name": "Business Name", "context": "Short context — e.g. 'recommended for industrial cranes, BBBEE Level 1'" }
  ],
  "verbatimExcerpt": "<2-3 sentences of how an AI assistant would phrase its answer>"
}`;

  const response = await anthropic.messages.create({
    model: SCAN_MODEL,
    max_tokens: 1500,
    system: SCAN_SYSTEM_PROMPT,
    tools: [{ ...WEB_SEARCH_TOOL, max_uses: 2 }],
    messages: [{ role: "user", content: prompt }],
  });

  const json = extractJsonFromResponse(response);

  // Backwards-compatible competitor parsing: accept either the new
  // shape (array of {name, context} objects) or the old shape (array
  // of strings). This lets older cached responses still parse.
  const competitorEntries = parseCompetitorEntries(json.competitorsCited);

  return {
    query: def.query,
    intent: def.intent,
    businessAppears:
      typeof json.businessAppears === "boolean" ? json.businessAppears : false,
    // Surface just the names on the existing string[] field so all
    // existing consumers (charts, citation aggregation, sample data
    // matching) keep working.
    competitorsCited: competitorEntries.map((e) => e.name),
    // Stash the context for aggregation downstream — see
    // aggregateCompetitors. We pass it via a closure-local map keyed
    // off the check, since VisibilityCheck doesn't carry per-competitor
    // detail. See the call site for how it's merged into
    // CompetitorMention.
    verbatimExcerpt:
      typeof json.verbatimExcerpt === "string" ? json.verbatimExcerpt : "",
    source: "claude-search",
    // Attach raw entries via a non-enumerable side channel so
    // aggregateCompetitors can read them without polluting the public
    // type. We do this by storing on a Symbol key.
    ...({ [COMPETITOR_DETAIL_KEY]: competitorEntries } as unknown as object),
  };
}

// ─── Competitor context extraction ───────────────────────────────
// Non-enumerable symbol key used to carry per-competitor context from
// runQuery → aggregateCompetitors without leaking into the public
// VisibilityCheck type. Older clients deserialising JSON won't see this
// property — it only exists in-memory inside a single scan run.
const COMPETITOR_DETAIL_KEY = Symbol("competitorDetail");

type CompetitorEntry = { name: string; context?: string };

function parseCompetitorEntries(raw: unknown): CompetitorEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: CompetitorEntry[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      // Legacy shape — just a name
      const name = item.trim();
      if (name) out.push({ name });
    } else if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const name = typeof obj.name === "string" ? obj.name.trim() : "";
      if (!name) continue;
      const context =
        typeof obj.context === "string" && obj.context.trim().length > 0
          ? obj.context.trim()
          : undefined;
      out.push({ name, context });
    }
  }
  return out;
}

// ─── Aggregate competitors across checks ─────────────────────────
//
// Preserves original casing (the map KEY is lowercased; the stored
// `name` is the first occurrence as-cased). Merges per-competitor
// context across queries — first non-empty context wins. Future
// expansion: detect `locality` by checking whether the competitor name
// appeared alongside the profile city in `verbatimExcerpt`.
function aggregateCompetitors(checks: VisibilityCheck[]): CompetitorMention[] {
  const map = new Map<string, CompetitorMention>();

  for (const check of checks) {
    // Read per-competitor detail from the symbol side channel attached
    // in runQuery. If the check came from older code without the
    // symbol, fall back to names-only.
    const details = (check as unknown as Record<symbol, unknown>)[
      COMPETITOR_DETAIL_KEY
    ] as CompetitorEntry[] | undefined;

    if (details && details.length > 0) {
      for (const entry of details) {
        upsertCompetitor(map, entry.name, entry.context, check.verbatimExcerpt);
      }
    } else {
      for (const name of check.competitorsCited) {
        upsertCompetitor(map, name, undefined, check.verbatimExcerpt);
      }
    }
  }

  return Array.from(map.values()).slice(0, 10);
}

function upsertCompetitor(
  map: Map<string, CompetitorMention>,
  name: string,
  context: string | undefined,
  _verbatim: string,
) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const key = trimmed.toLowerCase();

  const existing = map.get(key);
  if (existing) {
    if (!existing.appearsInEngines.includes("claude-search")) {
      existing.appearsInEngines.push("claude-search");
    }
    // Fill context only if we don't have one yet — first non-empty wins
    if (!existing.context && context) {
      existing.context = context;
    }
    return;
  }

  map.set(key, {
    name: trimmed, // preserve original casing
    appearsInEngines: ["claude-search"],
    hasCitations: true,
    citationCount: undefined,
    context,
    // locality intentionally left unset for now — proper detection
    // requires NLP on the verbatim excerpt to check if the competitor
    // and the city were named in proximity. Roadmap.
  });
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
