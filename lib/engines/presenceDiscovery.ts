/**
 * Presence discovery — finds a business's website and Google Business
 * Profile via web_search, even when the user didn't provide URLs.
 *
 * Critical engine: without this, the scan returns "no website / no GBP"
 * for any business whose owner didn't fill in those fields. That's a
 * 25-point hit on the score for no reason — the business probably has
 * those assets, the owner just didn't paste the URL.
 *
 * Strategy:
 *  - Run a single Claude + web_search call asking it to find website AND
 *    GBP simultaneously. Returns structured data.
 *  - Falls back gracefully to "unknown" rather than "absent" on parse failure.
 *
 * Cost: ~$0.10 per call. Adds ~10-12s to scan duration.
 */

import {
  anthropic,
  SCAN_MODEL,
  WEB_SEARCH_TOOL,
  SCAN_SYSTEM_PROMPT,
} from "@/lib/anthropic-client";
import type { BusinessProfile } from "@/lib/types/scan";

export type DiscoveredPresence = {
  websiteUrl: string | null;
  websiteFound: boolean;
  gbpUrl: string | null;
  gbpFound: boolean;
  // True if we successfully ran a search; false if the call errored
  // (so the orchestrator knows to treat absence as "unknown" not "verified absent")
  discoveryRan: boolean;
  notes: string;
};

export async function discoverPresence(
  profile: BusinessProfile,
): Promise<DiscoveredPresence> {
  const countryName =
    profile.country === "ZA"
      ? "South Africa"
      : profile.country === "GB"
        ? "United Kingdom"
        : profile.country === "US"
          ? "United States"
          : profile.country;

  const prompt = `You are searching for a business's online presence. Use web_search to find their official website and Google Business Profile.

Business: "${profile.businessName}"
Industry: ${profile.industry}
Location: ${profile.city}, ${countryName}
${profile.phone ? `Phone (for cross-reference): ${profile.phone}` : ""}

Run 1-2 web_search queries. Suggested:
- "${profile.businessName}" "${profile.city}"
- "${profile.businessName}" "${profile.city}" official website OR "Google Business Profile"

Look for:
1. The official website URL (their own domain, not a directory listing)
2. A Google Business Profile listing (look for Google Maps URLs like maps.app.goo.gl, or evidence the business has a GBP from search results showing hours/reviews)

Distinguish carefully:
- "OMS Lifting Solutions" the SA company is different from "OMS Group" (an Italian packaging company). Use the city to disambiguate.
- A directory listing on Brabys/Cylex/B2BHint is NOT the official website.
- A Facebook page is NOT the official website but may indicate the business exists.

Respond with ONLY a JSON object (no other text, no code blocks):
{
  "websiteUrl": "<URL of the official website, or null if not found>",
  "websiteFound": <true if you found their official website>,
  "gbpUrl": "<URL of their Google Business Profile, or null if not found>",
  "gbpFound": <true if there's evidence they have a GBP, even without a direct URL>,
  "notes": "<1-2 sentences summarizing what you found and any disambiguation>"
}`;

  try {
    const response = await anthropic.messages.create({
      model: SCAN_MODEL,
      max_tokens: 1500,
      system: SCAN_SYSTEM_PROMPT,
      tools: [{ ...WEB_SEARCH_TOOL, max_uses: 2 }],
      messages: [{ role: "user", content: prompt }],
    });

    const json = extractJsonFromResponse(response);

    return {
      websiteUrl: typeof json.websiteUrl === "string" ? json.websiteUrl : null,
      websiteFound: Boolean(json.websiteFound),
      gbpUrl: typeof json.gbpUrl === "string" ? json.gbpUrl : null,
      gbpFound: Boolean(json.gbpFound),
      discoveryRan: true,
      notes: typeof json.notes === "string" ? json.notes : "",
    };
  } catch (err) {
    console.error("[presenceDiscovery] failed:", err);
    return {
      websiteUrl: null,
      websiteFound: false,
      gbpUrl: null,
      gbpFound: false,
      discoveryRan: false,
      notes: "Discovery search failed — could not auto-find website/GBP.",
    };
  }
}

// ─── Helpers (same JSON extraction pattern as other engines) ─────

type DiscoveryJson = {
  websiteUrl?: string | null;
  websiteFound?: boolean;
  gbpUrl?: string | null;
  gbpFound?: boolean;
  notes?: string;
};

function extractJsonFromResponse(response: {
  content: Array<{ type: string; text?: string }>;
}): DiscoveryJson {
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
