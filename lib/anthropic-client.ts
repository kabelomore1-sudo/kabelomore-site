/**
 * Anthropic SDK client — singleton, lazy-initialized.
 *
 * Why lazy: Vercel build runs without API keys set in the build env.
 * If we try to instantiate at module load, build fails. So we defer
 * until first actual use (which only happens at runtime inside an
 * authenticated request).
 */

import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export const anthropic: Anthropic = new Proxy({} as Anthropic, {
  get(_t, prop) {
    if (!_client) {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error(
          "ANTHROPIC_API_KEY is not set. Add it to .env.local for development " +
            "and to Vercel Environment Variables for production.",
        );
      }
      _client = new Anthropic({ apiKey });
    }
    return Reflect.get(_client, prop, _client);
  },
});

// Use claude-opus-4-7 for scan engine work — same model audit-agent uses
// successfully. Slightly pricier than a Sonnet variant but verified working
// across our infra. Cost per scan is ~$0.40-0.80 which fits unit economics.
// (Tried "claude-sonnet-4-7" — that model name returns 404 on this account.)
export const SCAN_MODEL = "claude-opus-4-7";

export const WEB_SEARCH_TOOL = {
  type: "web_search_20260209" as const,
  name: "web_search" as const,
};

/**
 * Shared system prompt used by every scan-engine call to Claude.
 *
 * Why: by default, generative models hedge on naming specific businesses
 * ("you can find many providers in your area..."). For an AI Visibility
 * scan we NEED named entities — the whole product is "did your business
 * surface, and if not, who did?". This system prompt biases Claude toward
 * naming companies explicitly.
 *
 * Used by:
 *   - visibilitySimulator.runQuery      (customer-style queries)
 *   - citationAnalyzer.runSearchCall    (directory + industry searches)
 *   - presenceDiscovery.discoverPresence (website + GBP lookup)
 *
 * Without this, our scans frequently returned empty competitorsCited
 * arrays even when the web_search results clearly named competitors —
 * the model just didn't think it should repeat the names.
 */
export const SCAN_SYSTEM_PROMPT =
  "You are a helpful assistant analysing live web search results for an AI Visibility scan. Provide detailed, specific findings with company names, locations, and context. ALWAYS mention specific businesses by name when the web search results name them. Do not hedge or anonymise — if the search results say 'Integrate Lifting SA', say 'Integrate Lifting SA'. Preserve original casing and spelling of business names. Your output is consumed by downstream code that needs exact names to compare against the prospect's business.";
