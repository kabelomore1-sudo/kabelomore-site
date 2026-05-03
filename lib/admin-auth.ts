/**
 * Admin auth — single source of truth for `/admin/*` and `/api/admin/*`
 * route protection.
 *
 * Auth model: a single shared bearer token (`ADMIN_TOKEN` env var). Not
 * a multi-user system — Kabelo is the only admin. Token can arrive via:
 *   1. `Authorization: Bearer <token>` header (API routes)
 *   2. `X-Admin-Token: <token>` header (alt API form)
 *   3. HttpOnly cookie set by `/api/admin/login` (dashboard sessions)
 *   4. `?token=<token>` query string (FIRST visit only — handed off to
 *      the login route which moves it into an HttpOnly cookie and
 *      strips the URL)
 *
 * Why HttpOnly cookies (instead of JS-readable):
 *   - Cookie can't be exfiltrated by injected XSS that runs in the page
 *   - SameSite=Strict prevents the cookie from being sent on cross-site
 *     requests, mitigating CSRF for our action endpoints
 *   - Trade-off accepted: client-side JS can't see the cookie value, so
 *     auth state is checked exclusively server-side. We never need the
 *     value in the browser anyway.
 *
 * Threat model NOT covered:
 *   - ADMIN_TOKEN leakage (env var compromise) — out of scope
 *   - Token guessing — mitigated by 24+ char length requirement
 *   - Endpoint enumeration — admin routes are not linked publicly and
 *     are excluded from the sitemap; this is defense-in-depth only
 */

const MIN_TOKEN_LENGTH = 24;

export const ADMIN_COOKIE_NAME = "kabelomore_admin";
export const ADMIN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type AuthFailReason =
  | "no-token-configured" // ADMIN_TOKEN env var missing or too short — server-side misconfig
  | "missing" // No token presented at all
  | "invalid"; // Token presented but didn't match

export type AuthResult =
  | { ok: true }
  | { ok: false; reason: AuthFailReason };

/**
 * Pure verification: given a candidate token string, is it the
 * configured admin token? No I/O, no parsing — just compare.
 *
 * Returns a structured result so callers can distinguish missing vs
 * invalid vs misconfigured.
 */
export function verifyAdminToken(candidate: string | undefined | null): AuthResult {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || expected.length < MIN_TOKEN_LENGTH) {
    return { ok: false, reason: "no-token-configured" };
  }
  if (!candidate) {
    return { ok: false, reason: "missing" };
  }
  if (!constantTimeEqual(candidate, expected)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true };
}

/**
 * Verify an incoming API Request — extracts the token from any of the
 * supported transport mechanisms and runs `verifyAdminToken` against it.
 */
export function verifyAdminRequest(req: Request): AuthResult {
  const candidate = extractTokenFromRequest(req);
  return verifyAdminToken(candidate);
}

/**
 * Verify a server component invocation — explicit cookie + query inputs
 * since RSC doesn't have a Request object.
 *
 * Priority: cookie > query (query is only used during the initial
 * /api/admin/login handoff; the page redirects to login when it sees
 * `?token=…` rather than reading the query directly).
 */
export function verifyAdminFromComponent(input: {
  cookieToken: string | undefined;
  queryToken?: string | undefined;
}): AuthResult {
  return verifyAdminToken(input.cookieToken ?? input.queryToken);
}

// ─── Helpers ──────────────────────────────────────────────────────

function extractTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth) {
    const match = /^Bearer\s+(.+)$/.exec(auth);
    if (match) return match[1].trim();
  }

  const xAdmin = req.headers.get("x-admin-token");
  if (xAdmin) return xAdmin.trim();

  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const parts = cookieHeader.split(";");
    for (const part of parts) {
      const [name, ...rest] = part.split("=");
      if (name?.trim() === ADMIN_COOKIE_NAME) {
        return decodeURIComponent(rest.join("=")).trim();
      }
    }
  }

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("token");
    if (q) return q.trim();
  } catch {
    /* malformed url — ignore */
  }

  return null;
}

/**
 * Constant-time string equality. Returns false if lengths differ
 * (so the comparison short-circuits on length, not content).
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Build the Set-Cookie header value for the admin session.
 *
 * Flags:
 *   - HttpOnly  — not readable from JavaScript (mitigates XSS exfiltration)
 *   - Secure    — HTTPS only (enabled in production)
 *   - SameSite=Strict — cookie not sent on cross-site requests
 *                       (mitigates CSRF on our admin POST endpoints)
 *   - Path=/    — sent on all routes including /api/admin/*
 *   - Max-Age=30 days — explicit expiry
 */
export function buildAdminCookieHeader(token: string, secure: boolean): string {
  const flags = [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${ADMIN_COOKIE_MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Strict",
  ];
  if (secure) flags.push("Secure");
  return flags.join("; ");
}

/**
 * Build the Set-Cookie header that immediately expires the admin
 * cookie (for /api/admin/logout).
 */
export function buildAdminCookieClearHeader(secure: boolean): string {
  const flags = [
    `${ADMIN_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Strict",
  ];
  if (secure) flags.push("Secure");
  return flags.join("; ");
}
