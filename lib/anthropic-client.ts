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

// Use Sonnet 4.7 for scan engine work — faster than Opus, plenty smart for
// structured extraction. Opus reserved for the deep audit-agent CLI.
export const SCAN_MODEL = "claude-sonnet-4-7";

export const WEB_SEARCH_TOOL = {
  type: "web_search_20260209" as const,
  name: "web_search" as const,
};
