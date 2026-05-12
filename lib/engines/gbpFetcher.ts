/**
 * GBP fetcher — looks up a business on Google Places (legacy API) and
 * returns structured GBP signals for the scan engine.
 *
 * Phase 1.5 addition. Closes the biggest measurement gap the scan had
 * before now: we could see if a Google Business Profile *existed* (via
 * Claude+web_search inference), but we couldn't measure rating, review
 * count, categories, hours, or operational status — all of which are
 * dominant signals for local-intent verticals (medical, legal,
 * industrial).
 *
 * Implementation notes:
 *   - Uses the LEGACY Places API. Two calls per scan:
 *       1. findplacefromtext  ($0.017) — resolves a Place ID from
 *          "businessName city" text
 *       2. place/details      ($0.017) — pulls full place data
 *     Budget: ~$0.034 per scan invocation that actually hits the API.
 *   - Graceful degradation: any failure (missing env var, network error,
 *     API quota exceeded, place not found) returns an "empty" result
 *     with a notes field explaining why. The orchestrator marks the
 *     stage as "failed" or "skipped" but the rest of the scan continues.
 *   - 8-second internal timeout per call — defensive against Places
 *     occasionally hanging. The orchestrator's overall budget is 60s,
 *     so we can't afford one stage burning through that.
 *
 * What "verified" means here:
 *   The Places API has no public "claimed listing" field. Best
 *   approximation is BUSINESS_STATUS=OPERATIONAL combined with
 *   user_ratings_total > 0. This rules out closed listings and
 *   completely-unclaimed ones. Not a perfect proxy — a claimed listing
 *   with zero reviews is still possible — but it's the cleanest signal
 *   we can get without scraping.
 *
 * Key restrictions to set in GCP:
 *   - API restriction: Places API only (already done)
 *   - Application restriction: defer until deploy egress IP is stable;
 *     for now keep it open. Production hardening: switch to IP allowlist
 *     once the Vercel egress range is known and stable.
 */

import type { BusinessProfile } from "@/lib/types/scan";

const PLACES_BASE = "https://maps.googleapis.com/maps/api/place";
const FETCH_TIMEOUT_MS = 8000;

export interface GbpData {
  /** True when Places returned a candidate AND details fetched cleanly */
  found: boolean;
  /** Google Place ID — useful for downstream linking */
  placeId: string | null;
  /** Canonical business name from the listing (may differ from profile) */
  name: string | null;
  /** Formatted address — useful for NAP-consistency checks */
  address: string | null;
  /** Formatted phone — useful for NAP-consistency checks */
  phone: string | null;
  /** Rating 0.0-5.0 */
  rating: number | null;
  /** user_ratings_total — review count */
  reviewCount: number | null;
  /** First type returned by Places (e.g. "restaurant", "store") */
  primaryCategory: string | null;
  /** Full types array — all categories Places returned */
  categories: string[];
  /** True if opening_hours.weekday_text is populated */
  hasHours: boolean;
  /** business_status === "OPERATIONAL" */
  isOperational: boolean;
  /** Heuristic: OPERATIONAL && reviewCount > 0. See file header. */
  verifiedHeuristic: boolean;
  /** Number of photos in the listing — engagement signal */
  photoCount: number;
  /** Plain-English note about what was found / why empty */
  notes: string;
}

/**
 * Resolve a business via Places API.
 *
 * Returns a `GbpData` with `found: false` on any error path. The
 * `notes` field carries a short reason — surfaced in the admin
 * notification email and Vercel logs.
 */
export async function findPlace(profile: BusinessProfile): Promise<GbpData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return empty("GOOGLE_PLACES_API_KEY not configured");
  }

  // Compose the search text. Including city + country narrows the
  // candidate set dramatically and reduces same-name ambiguity
  // (the OMS Lifting SA vs OMS Group Italy problem the original
  // scan engine already had to disambiguate).
  const queryParts = [profile.businessName, profile.city];
  if (profile.country) queryParts.push(profile.country);
  const query = queryParts.filter(Boolean).join(" ");

  try {
    // Step 1: findplacefromtext — get a Place ID
    const findUrl =
      `${PLACES_BASE}/findplacefromtext/json` +
      `?input=${encodeURIComponent(query)}` +
      `&inputtype=textquery` +
      `&fields=place_id,name,formatted_address` +
      `&key=${apiKey}`;

    const findResp = await fetchWithTimeout(findUrl, FETCH_TIMEOUT_MS);
    if (!findResp.ok) {
      return empty(`findplacefromtext HTTP ${findResp.status}`);
    }
    const findJson = (await findResp.json()) as PlaceFindResponse;

    if (findJson.status === "ZERO_RESULTS") {
      return empty(`No Place found for "${query}"`);
    }
    if (findJson.status !== "OK") {
      return empty(
        `findplacefromtext returned status=${findJson.status}` +
          (findJson.error_message ? `: ${findJson.error_message}` : ""),
      );
    }

    const candidate = findJson.candidates?.[0];
    if (!candidate?.place_id) {
      return empty("findplacefromtext returned no candidates");
    }

    // Step 2: place/details — pull the structured signals
    const detailsFields = [
      "place_id",
      "name",
      "formatted_address",
      "formatted_phone_number",
      "rating",
      "user_ratings_total",
      "types",
      "opening_hours",
      "business_status",
      "photo",
    ].join(",");

    const detailsUrl =
      `${PLACES_BASE}/details/json` +
      `?place_id=${encodeURIComponent(candidate.place_id)}` +
      `&fields=${detailsFields}` +
      `&key=${apiKey}`;

    const detailsResp = await fetchWithTimeout(detailsUrl, FETCH_TIMEOUT_MS);
    if (!detailsResp.ok) {
      return empty(`place/details HTTP ${detailsResp.status}`);
    }
    const detailsJson = (await detailsResp.json()) as PlaceDetailsResponse;

    if (detailsJson.status !== "OK" || !detailsJson.result) {
      return empty(
        `place/details returned status=${detailsJson.status}` +
          (detailsJson.error_message ? `: ${detailsJson.error_message}` : ""),
      );
    }

    const r = detailsJson.result;
    const categories = Array.isArray(r.types) ? r.types : [];
    const reviewCount =
      typeof r.user_ratings_total === "number" ? r.user_ratings_total : 0;
    const isOperational = r.business_status === "OPERATIONAL";

    return {
      found: true,
      placeId: r.place_id ?? candidate.place_id,
      name: typeof r.name === "string" ? r.name : null,
      address:
        typeof r.formatted_address === "string" ? r.formatted_address : null,
      phone:
        typeof r.formatted_phone_number === "string"
          ? r.formatted_phone_number
          : null,
      rating: typeof r.rating === "number" ? r.rating : null,
      reviewCount,
      primaryCategory: categories[0] ?? null,
      categories,
      hasHours:
        Array.isArray(r.opening_hours?.weekday_text) &&
        (r.opening_hours?.weekday_text?.length ?? 0) > 0,
      isOperational,
      verifiedHeuristic: isOperational && reviewCount > 0,
      photoCount: Array.isArray(r.photos) ? r.photos.length : 0,
      notes: `Resolved via Places API · ${categories.length} categories · ${reviewCount} reviews`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return empty(`Places API error: ${msg.slice(0, 200)}`);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────

function empty(reason: string): GbpData {
  return {
    found: false,
    placeId: null,
    name: null,
    address: null,
    phone: null,
    rating: null,
    reviewCount: null,
    primaryCategory: null,
    categories: [],
    hasHours: false,
    isOperational: false,
    verifiedHeuristic: false,
    photoCount: 0,
    notes: reason,
  };
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// ─── API response shapes ─────────────────────────────────────────

interface PlaceFindResponse {
  status: string;
  error_message?: string;
  candidates?: {
    place_id?: string;
    name?: string;
    formatted_address?: string;
  }[];
}

interface PlaceDetailsResponse {
  status: string;
  error_message?: string;
  result?: {
    place_id?: string;
    name?: string;
    formatted_address?: string;
    formatted_phone_number?: string;
    rating?: number;
    user_ratings_total?: number;
    types?: string[];
    business_status?: string;
    opening_hours?: {
      weekday_text?: string[];
    };
    photos?: unknown[];
  };
}
