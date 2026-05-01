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
