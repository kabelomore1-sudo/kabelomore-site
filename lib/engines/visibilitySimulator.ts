/**
 * Visibility simulator — runs customer-style queries via Claude +
 * web_search to see what AI engines would actually recommend.
 *
 * This is the "gut punch" engine. The results page shows the buyer:
 *   "Here's exactly what AI says when your customers search.
 *    Notice who's listed. Notice who isn't."
 *
 * PROMPT MINING (Ticket 1 — from the Ubersuggest competitive analysis,
 * docs/competitive-research/2026-05-14-*):
 *   Ubersuggest's strongest feature is showing the REAL questions
 *   buyers ask AI in a category, not templated keyword strings. We now
 *   do the same:
 *     1. MINE — one Claude call (NO web_search, ~4-6s) generates 8-12
 *        realistic buyer questions, localised to this business's
 *        vertical / city / country, each intent-tagged.
 *     2. EXECUTE — an intent-diverse subset (MAX_EXECUTED) is run
 *        through live web_search for verbatim capture. Mining is cheap;
 *        web_search is the expensive 60s-ceiling/rate-limit risk, so we
 *        bound how many we actually execute.
 *     3. SURFACE — the FULL mined list (executed + listed-only) is
 *        returned so the report can show "the questions your customers
 *        ask AI" with intent tags.
 *   Fallback: if mining fails or yields too few, we fall back to the
 *   original 4 hardcoded intent shapes. The scan never fails on this.
 *
 * Budget: mining (serial, no web_search) ~4-6s, then MAX_EXECUTED
 * web_search queries in PARALLEL ~15-20s (slowest, not sum). Runs
 * alongside citation analysis in the orchestrator's Promise.all; total
 * stays inside the Vercel 60s function ceiling.
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
  MinedPrompt,
  QueryIntent,
  VisibilityCheck,
} from "@/lib/types/scan";

/**
 * How many mined prompts we actually run through live web_search.
 *
 * The old engine ran 4 in parallel "well inside the safe zone" (its
 * own comment noted 8 would need chunking). 5 keeps us conservative on
 * both the Anthropic web_search rate limit (5 × max_uses 2 = 10 search
 * burst) and the Vercel 60s ceiling, while giving one more intent slot
 * than before. Promise.allSettled means a rate-limited query just
 * drops — the scan continues with the rest.
 */
const MAX_EXECUTED_QUERIES = 5;

/** Target size of the mined prompt list surfaced in the report. */
const TARGET_MINED_PROMPTS = 12;

/**
 * Runtime allow-list mirroring the QueryIntent union (which is
 * compile-time only). Used to validate model-generated intents — an
 * unrecognised value is coerced to "research" (a safe, generic shape)
 * rather than dropped, so we never silently lose a mined prompt.
 */
const VALID_INTENTS: readonly QueryIntent[] = [
  "recommendation",
  "research",
  "problem",
  "brand",
  "urgency",
  "comparison",
  "cost",
  "conversational",
  "review",
] as const;
const VALID_INTENT_SET = new Set<string>(VALID_INTENTS);

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
  /** The full mined prompt list (executed + listed-only), for the
   *  report's "questions your customers ask AI" section. */
  minedPrompts: MinedPrompt[];
};

export async function simulateAIQueries(
  profile: BusinessProfile,
): Promise<VisibilityAnalysis> {
  // ── Step 1: MINE (cheap — one Claude call, no web_search) ────────
  // If mining fails or returns too few usable prompts, fall back to
  // the original hardcoded intent shapes. The scan never fails here.
  const mined = await mineCustomerPrompts(profile).catch((err) => {
    console.error("[visibilitySimulator] prompt mining failed:", err);
    return [] as QueryDefinition[];
  });

  let promptPool: QueryDefinition[] =
    mined.length >= 4 ? mined : fallbackCustomerQueries(profile);

  // Guarantee a brand-awareness probe regardless of what mining
  // produced — testing whether AI knows the business when asked
  // directly by name is a distinct, high-signal check the old engine
  // always ran. Append (don't replace) so it also appears in the
  // surfaced list.
  if (!promptPool.some((p) => p.intent === "brand")) {
    promptPool = [
      ...promptPool,
      {
        query: `Reviews and reputation of ${profile.businessName}`,
        intent: "brand",
      },
    ];
  }
  promptPool = dedupeQueries(promptPool).slice(0, TARGET_MINED_PROMPTS);

  // ── Step 2: SELECT an intent-diverse subset to execute live ──────
  const toExecute = selectExecutionSubset(promptPool);
  const executedKeys = new Set(toExecute.map((q) => q.query.toLowerCase()));

  // PARALLEL execution — the queries are independent (no shared state,
  // separate web_search invocations) so running in parallel collapses
  // the total to ~15-20s (the slowest single query, not the sum),
  // keeping us inside Vercel's 60s function ceiling.
  //
  // Promise.allSettled (not .all) so one query's failure doesn't tank
  // the whole scan — we drop that check and continue.
  const settled = await Promise.allSettled(
    toExecute.map((def) => runQuery(def, profile)),
  );

  const checks: VisibilityCheck[] = [];
  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === "fulfilled") {
      checks.push(result.value);
    } else {
      console.error(
        `[visibilitySimulator] Query failed: "${toExecute[i].query}"`,
        result.reason,
      );
    }
  }

  const competitors = aggregateCompetitors(checks);

  // ── Step 3: SURFACE the full mined list with executed flags ──────
  const minedPrompts: MinedPrompt[] = promptPool.map((p) => ({
    query: p.query,
    intent: p.intent,
    executed: executedKeys.has(p.query.toLowerCase()),
  }));

  return { checks, competitors, minedPrompts };
}

// ─── Prompt mining (Ticket 1) ─────────────────────────────────────
//
// One Claude call, NO web_search — this is generation, not retrieval,
// so it's fast (~4-6s) and cheap. Produces realistic, localised buyer
// questions the way a customer actually types them, intent-tagged.
// Validated + sanitised before use; never trusted raw.
async function mineCustomerPrompts(
  profile: BusinessProfile,
): Promise<QueryDefinition[]> {
  const industryWords = profile.industry.replace(/-/g, " ");
  const country = countryName(profile.country);
  const services = profile.servicesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");

  const prompt = `You are mining the REAL questions a potential customer types into an AI assistant (ChatGPT, Gemini, Perplexity) when looking for a business like this one — usually BEFORE they know its name.

Business context:
- Name: ${profile.businessName}
- Industry: ${industryWords}
- Services: ${services || industryWords}
- Location: ${profile.city}, ${country}

Generate ${TARGET_MINED_PROMPTS} distinct, natural-language questions a real buyer would actually ask. Rules:
- Phrase them the way a real person types — full questions, not keyword strings.
- Localise: include "${profile.city}" or "${country}" where a real buyer naturally would (not every single one).
- Cover a SPREAD of buyer intents — do not cluster on one shape.
- Exactly 1-2 should name "${profile.businessName}" directly (tests whether AI knows the business by name).
- The rest must be category / problem / comparison / cost / urgency questions where the buyer does NOT yet know this specific business.

Classify each question with exactly ONE intent from this list (use the closest fit):
recommendation, research, problem, brand, urgency, comparison, cost, conversational, review

Respond with ONLY a JSON object — no prose, no markdown, no code fences:
{ "prompts": [ { "query": "...", "intent": "recommendation" } ] }`;

  const response = await anthropic.messages.create({
    model: SCAN_MODEL,
    max_tokens: 1500,
    system: SCAN_SYSTEM_PROMPT,
    // NOTE: deliberately NO tools — mining is pure generation.
    messages: [{ role: "user", content: prompt }],
  });

  return parseMinedPrompts(response);
}

function parseMinedPrompts(response: {
  content: Array<{ type: string; text?: string }>;
}): QueryDefinition[] {
  const textBlocks = response.content.filter(
    (b): b is { type: "text"; text: string } => b.type === "text",
  );
  const lastText = textBlocks[textBlocks.length - 1]?.text ?? "";
  const fenced = lastText.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : findFirstJsonObject(lastText);

  let parsed: { prompts?: unknown };
  try {
    parsed = JSON.parse(candidate);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed.prompts)) return [];

  const out: QueryDefinition[] = [];
  for (const item of parsed.prompts) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const query = typeof obj.query === "string" ? obj.query.trim() : "";
    if (!query) continue;
    const rawIntent =
      typeof obj.intent === "string" ? obj.intent.trim().toLowerCase() : "";
    const intent: QueryIntent = VALID_INTENT_SET.has(rawIntent)
      ? (rawIntent as QueryIntent)
      : "research"; // safe generic fallback — never drop a prompt
    out.push({ query, intent });
  }
  return dedupeQueries(out);
}

// ─── Execution subset selection ───────────────────────────────────
//
// We can't afford to web_search every mined prompt (cost + 60s
// ceiling). Pick MAX_EXECUTED_QUERIES that MAXIMISE intent diversity:
// always include a brand probe if present, then greedily take the
// first prompt of each not-yet-covered intent, then backfill in
// original order. This guarantees the deep-tested set spans buyer
// intents instead of clustering on whatever the model emitted first.
function selectExecutionSubset(pool: QueryDefinition[]): QueryDefinition[] {
  if (pool.length <= MAX_EXECUTED_QUERIES) return pool;

  const picked: QueryDefinition[] = [];
  const pickedKeys = new Set<string>();
  const take = (q: QueryDefinition) => {
    const key = q.query.toLowerCase();
    if (pickedKeys.has(key) || picked.length >= MAX_EXECUTED_QUERIES) return;
    picked.push(q);
    pickedKeys.add(key);
  };

  // 1. Brand probe first (highest-signal distinct check).
  const brand = pool.find((q) => q.intent === "brand");
  if (brand) take(brand);

  // 2. One prompt per not-yet-covered intent.
  const seenIntents = new Set<QueryIntent>(picked.map((q) => q.intent));
  for (const q of pool) {
    if (picked.length >= MAX_EXECUTED_QUERIES) break;
    if (!seenIntents.has(q.intent)) {
      take(q);
      seenIntents.add(q.intent);
    }
  }

  // 3. Backfill remaining slots in original order.
  for (const q of pool) {
    if (picked.length >= MAX_EXECUTED_QUERIES) break;
    take(q);
  }

  return picked;
}

function dedupeQueries(queries: QueryDefinition[]): QueryDefinition[] {
  const seen = new Set<string>();
  const out: QueryDefinition[] = [];
  for (const q of queries) {
    const key = q.query.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ query: q.query.trim(), intent: q.intent });
  }
  return out;
}

function countryName(country: BusinessProfile["country"]): string {
  return country === "ZA"
    ? "South Africa"
    : country === "GB"
      ? "UK"
      : country === "US"
        ? "USA"
        : country;
}

// ─── Fallback query generation ────────────────────────────────────
// Used only when prompt mining fails or returns too few prompts. The
// original 4 distinct intent shapes — each exercises a different AI
// retrieval pattern (recommendation, research, problem, brand).
function fallbackCustomerQueries(profile: BusinessProfile): QueryDefinition[] {
  const services = profile.servicesText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const primary = services[0] || profile.industry.replace(/-/g, " ");
  const industryWords = profile.industry.replace(/-/g, " ");
  const country = countryName(profile.country);

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
  ];
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
// context across queries — first non-empty context wins.
//
// LEADERBOARD (Ticket 2): the position a business is named WITHIN a
// query's competitor list is a usable prominence proxy — the runQuery
// prompt asks for "the top 3-5 businesses being recommended", so index
// order ≈ how prominently the AI proxy surfaced them. We accumulate
// (sum of 1-based positions, count) per competitor, then attach
// `avgRank` (mean position, lower = more prominent) and `mentionCount`
// (queries appeared in). The result is sorted most-prominent-first so
// every downstream consumer (report leaderboard, admin/client emails,
// follow-up drips) leads with who's actually winning.
//
// Honesty: this is observed ordering in OUR proxy responses, not an
// authoritative market ranking — the report copy frames it that way.
//
// Future expansion: detect `locality` by checking whether the
// competitor name appeared alongside the profile city in
// `verbatimExcerpt` (a real differentiator vs SEMrush/Ubersuggest,
// which don't fuse Google Places "nearby" data the way our gbpFetcher
// does — see docs/competitive-research/).
function aggregateCompetitors(checks: VisibilityCheck[]): CompetitorMention[] {
  const map = new Map<string, CompetitorMention>();
  // key → running { sum of 1-based positions, count of appearances }.
  // `__check` holds the VisibilityCheck whose contribution was last
  // counted, so a business named twice in ONE response only scores its
  // first (best) position for that query.
  const rank = new Map<
    string,
    { sum: number; count: number; __check: VisibilityCheck }
  >();

  for (const check of checks) {
    // Read per-competitor detail from the symbol side channel attached
    // in runQuery. If the check came from older code without the
    // symbol, fall back to names-only.
    const details = (check as unknown as Record<symbol, unknown>)[
      COMPETITOR_DETAIL_KEY
    ] as CompetitorEntry[] | undefined;

    const entries: CompetitorEntry[] =
      details && details.length > 0
        ? details
        : check.competitorsCited.map((name) => ({ name }));

    entries.forEach((entry, idx) => {
      const trimmed = entry.name.trim();
      if (!trimmed) return;
      upsertCompetitor(map, trimmed, entry.context, check.verbatimExcerpt);

      // Position within THIS query's list (1-based). Dedupe within a
      // single check — if the model names the same business twice in
      // one response, only its first (best) position counts for that
      // query so a repeated mention can't inflate mentionCount.
      const key = trimmed.toLowerCase();
      const acc = rank.get(key);
      if (acc && acc.__check === check) return;
      const next = acc ?? { sum: 0, count: 0, __check: check };
      next.sum += idx + 1;
      next.count += 1;
      next.__check = check;
      rank.set(key, next);
    });
  }

  // Attach derived leaderboard fields.
  for (const [key, mention] of map) {
    const acc = rank.get(key);
    if (acc && acc.count > 0) {
      mention.mentionCount = acc.count;
      mention.avgRank = Math.round((acc.sum / acc.count) * 100) / 100;
    }
  }

  // Sort most-prominent-first: lower avgRank wins; more mentions breaks
  // ties; then name for stable output. Competitors with no rank data
  // (shouldn't happen post-aggregation, but defensive) sink last.
  return Array.from(map.values())
    .sort((a, b) => {
      const ar = a.avgRank ?? Number.POSITIVE_INFINITY;
      const br = b.avgRank ?? Number.POSITIVE_INFINITY;
      if (ar !== br) return ar - br;
      const am = a.mentionCount ?? 0;
      const bm = b.mentionCount ?? 0;
      if (am !== bm) return bm - am;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10);
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
