/**
 * Scan storage — abstracts where scan state lives.
 *
 * Architecture:
 *   - Vercel KV when KV_REST_API_URL + KV_REST_API_TOKEN are set
 *     (production: persistent, fast, free hobby tier handles 1000s of scans)
 *   - In-memory Map otherwise (local dev only — does NOT survive function
 *     restarts, but works for `npm run dev` testing)
 *
 * Why this abstraction: keeps the rest of the codebase from caring about
 * where storage lives. We can swap KV for Postgres later by changing only
 * this file.
 *
 * Keys layout in KV:
 *   scan:{scanId}:profile  → BusinessProfile (TTL 30 days)
 *   scan:{scanId}:status   → "scanning" | "complete" | "failed"  (TTL 30 days)
 *   scan:{scanId}:result   → ScanResult                          (TTL 30 days)
 *   scan:{scanId}:error    → string error message if failed
 */

import { kv } from "@vercel/kv";
import type { BusinessProfile, ScanResult } from "@/lib/types/scan";

export type ScanStatus = "scanning" | "complete" | "failed";

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

// ─── In-memory fallback (local dev only) ─────────────────────────
const memProfile = new Map<string, BusinessProfile>();
const memStatus = new Map<string, ScanStatus>();
const memResult = new Map<string, ScanResult>();
const memError = new Map<string, string>();
const memIndex: IndexEntry[] = [];

// ─── Submission index (for the admin dashboard) ─────────────────
//
// KV doesn't expose a fast `list keys by prefix` for free — instead
// we maintain an explicit list at `scan:index`, lpush'd recent-first.
// Each entry is the minimum metadata the admin dashboard needs to
// render a row without fetching every profile separately.
//
// Capped at 500 entries (ltrim'd on each push) so the list stays
// O(1) to read. Older scans still exist under their per-key entries
// — they just don't appear in the "recent" admin list.

export type IndexEntry = {
  scanId: string;
  businessName: string;
  contactName: string;
  email: string;
  industry: string;
  city: string;
  country: string;
  submittedAt: string;
  // Captured at submission time so the admin dashboard can show whether
  // the user got their confirmation email and Kabelo got his admin
  // notification — without an extra fetch per row.
  userEmailSent?: boolean;
  adminEmailSent?: boolean;
  manualFallback?: boolean;
};

const INDEX_KEY = "scan:index";
const INDEX_MAX = 500;

// ─── Admin-set per-scan metadata ──────────────────────────────────
// Tracks Kabelo's manual workflow state. Separate from the scan
// engine's own status (scanning/complete/failed) so admin actions
// don't collide with scan execution. Keyed under scan:{id}:meta.
export type ScanMeta = {
  /** True once Kabelo has reviewed the scan output */
  handled?: boolean;
  /** True once Kabelo has emailed the prospect their report */
  emailed?: boolean;
  /** True once the prospect has been moved out of "active leads" */
  archived?: boolean;
  /** Free-form note Kabelo can write against this scan */
  note?: string;
  /** ISO timestamp of the most recent meta update */
  updatedAt?: string;
};

const memMeta = new Map<string, ScanMeta>();

function isKvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

// ─── Profile (input) ──────────────────────────────────────────────
export async function saveProfile(
  scanId: string,
  profile: BusinessProfile,
): Promise<void> {
  if (isKvConfigured()) {
    await kv.set(`scan:${scanId}:profile`, profile, { ex: TTL_SECONDS });
  } else {
    memProfile.set(scanId, profile);
  }
}

export async function getProfile(
  scanId: string,
): Promise<BusinessProfile | null> {
  if (isKvConfigured()) {
    return await kv.get<BusinessProfile>(`scan:${scanId}:profile`);
  }
  return memProfile.get(scanId) ?? null;
}

// ─── Status ───────────────────────────────────────────────────────
export async function setStatus(
  scanId: string,
  status: ScanStatus,
): Promise<void> {
  if (isKvConfigured()) {
    await kv.set(`scan:${scanId}:status`, status, { ex: TTL_SECONDS });
  } else {
    memStatus.set(scanId, status);
  }
}

export async function getStatus(scanId: string): Promise<ScanStatus | null> {
  if (isKvConfigured()) {
    return await kv.get<ScanStatus>(`scan:${scanId}:status`);
  }
  return memStatus.get(scanId) ?? null;
}

// ─── Result (output) ──────────────────────────────────────────────
export async function saveResult(
  scanId: string,
  result: ScanResult,
): Promise<void> {
  if (isKvConfigured()) {
    await kv.set(`scan:${scanId}:result`, result, { ex: TTL_SECONDS });
  } else {
    memResult.set(scanId, result);
  }
}

export async function getResult(scanId: string): Promise<ScanResult | null> {
  if (isKvConfigured()) {
    return await kv.get<ScanResult>(`scan:${scanId}:result`);
  }
  return memResult.get(scanId) ?? null;
}

// ─── Error (when scan fails) ──────────────────────────────────────
export async function setError(
  scanId: string,
  errorMessage: string,
): Promise<void> {
  if (isKvConfigured()) {
    await kv.set(`scan:${scanId}:error`, errorMessage, { ex: TTL_SECONDS });
  } else {
    memError.set(scanId, errorMessage);
  }
  await setStatus(scanId, "failed");
}

export async function getError(scanId: string): Promise<string | null> {
  if (isKvConfigured()) {
    return await kv.get<string>(`scan:${scanId}:error`);
  }
  return memError.get(scanId) ?? null;
}

// ─── Submission index (push + list) ──────────────────────────────
/**
 * Push an index entry to the recent-first list.
 *
 * Idempotent enough for our needs: if called twice with the same
 * scanId, the entry shows up twice (mild duplication). We accept
 * this because deduping requires an O(n) scan on every write, and
 * scan submissions are 1-per-IP-per-5-min anyway.
 */
export async function addToIndex(entry: IndexEntry): Promise<void> {
  if (isKvConfigured()) {
    await kv.lpush(INDEX_KEY, JSON.stringify(entry));
    await kv.ltrim(INDEX_KEY, 0, INDEX_MAX - 1);
  } else {
    memIndex.unshift(entry);
    if (memIndex.length > INDEX_MAX) memIndex.length = INDEX_MAX;
  }
}

/**
 * List the most recent N submissions, recent-first.
 *
 * Defensive parsing: @vercel/kv has historically returned raw strings
 * for list entries, but newer versions auto-parse JSON. We handle both
 * shapes so an SDK upgrade can't quietly break the admin dashboard.
 */
export async function listIndex(limit = 100): Promise<IndexEntry[]> {
  if (isKvConfigured()) {
    const raw = await kv.lrange(INDEX_KEY, 0, limit - 1);
    return raw
      .map((item: unknown): IndexEntry | null => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item) as IndexEntry;
          } catch {
            return null;
          }
        }
        if (item && typeof item === "object") {
          return item as IndexEntry;
        }
        return null;
      })
      .filter((e): e is IndexEntry => e !== null);
  }
  return memIndex.slice(0, limit);
}

// ─── Admin metadata (handled / emailed / notes) ──────────────────
/**
 * Read the admin-set metadata for a scan. Returns an empty object
 * if no metadata exists yet — never null — so callers can spread
 * safely without conditionals.
 */
export async function getScanMeta(scanId: string): Promise<ScanMeta> {
  if (isKvConfigured()) {
    try {
      const data = await kv.get<ScanMeta>(`scan:${scanId}:meta`);
      return data ?? {};
    } catch (err) {
      console.error(`[scanStore] getScanMeta failed for ${scanId}:`, err);
      return {};
    }
  }
  return memMeta.get(scanId) ?? {};
}

/**
 * Merge a partial meta update onto the existing record. We use merge
 * (not replace) so admin actions are independent — toggling `emailed`
 * doesn't blow away `handled` or notes.
 */
export async function updateScanMeta(
  scanId: string,
  patch: Partial<ScanMeta>,
): Promise<ScanMeta> {
  const current = await getScanMeta(scanId);
  const next: ScanMeta = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  if (isKvConfigured()) {
    await kv.set(`scan:${scanId}:meta`, next, { ex: TTL_SECONDS });
  } else {
    memMeta.set(scanId, next);
  }
  return next;
}

// ─── Helpers ──────────────────────────────────────────────────────
export function generateScanId(): string {
  // Format: scan_YYYYMMDD_random12chars
  // Human-friendly enough for support, unguessable enough for privacy
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 14);
  return `scan_${date}_${random}`;
}

export function isStorageConfigured(): boolean {
  return isKvConfigured();
}
