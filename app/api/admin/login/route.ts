import { NextResponse } from "next/server";
import {
  verifyAdminToken,
  buildAdminCookieHeader,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/login?token=<TOKEN>&next=<path>
 *
 * Token handoff endpoint. The dashboard page redirects here when it sees
 * `?token=…` in its URL so the cookie is set server-side (HttpOnly +
 * Secure + SameSite=Strict) instead of via JavaScript.
 *
 * Why this is a GET (not POST):
 *   The user clicks a link or pastes a URL — initial auth is a GET. POST
 *   would require a form. We accept the trade-off that the token appears
 *   in server logs for the duration of this request; the cookie is set
 *   immediately and the redirect strips the token from the browser URL.
 *
 * Logging: we log auth outcome (success / fail-reason) but NEVER the
 * token value. Failures are logged at ERROR level; success at INFO.
 *
 * Edge cases:
 *   - Missing token → 400 with friendly message
 *   - Invalid token → 403, no cookie set
 *   - ADMIN_TOKEN unconfigured → 503 (server misconfig)
 *   - `next` param sanitised to internal paths only (no open redirect)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  // Trim at the source too (verifyAdminToken also trims): a token
  // pasted into the address bar commonly picks up a trailing space.
  const token = url.searchParams.get("token")?.trim() ?? null;
  const nextRaw = url.searchParams.get("next") ?? "/admin/scans";

  // Open-redirect prevention: only allow same-origin internal paths.
  // Specifically reject protocol-relative (`//evil.com`) and absolute URLs.
  const next = sanitiseNextPath(nextRaw);

  if (!token) {
    console.warn(
      JSON.stringify({
        event: "admin_login_failed",
        reason: "no-token",
        ip: clientIp(req),
      }),
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          "Missing token. Append ?token=<your token> to authenticate, or visit /admin/scans?token=… directly.",
      },
      { status: 400 },
    );
  }

  const auth = verifyAdminToken(token);
  if (!auth.ok) {
    console.warn(
      JSON.stringify({
        event: "admin_login_failed",
        reason: auth.reason,
        ip: clientIp(req),
      }),
    );
    if (auth.reason === "no-token-configured") {
      return NextResponse.json(
        {
          ok: false,
          message:
            "ADMIN_TOKEN env var is not configured on the server. Set it in Vercel and redeploy.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { ok: false, message: "Forbidden — invalid admin token." },
      { status: 403 },
    );
  }

  // Token valid — set HttpOnly cookie + redirect to clean URL.
  const isProd = process.env.NODE_ENV === "production";
  const cookieHeader = buildAdminCookieHeader(token, isProd);

  console.info(
    JSON.stringify({
      event: "admin_login_success",
      ip: clientIp(req),
      next,
    }),
  );

  // 303 See Other: forces GET on the redirect target. Headers carry
  // the Set-Cookie so the cookie lands before the browser fetches `next`.
  return new Response(null, {
    status: 303,
    headers: {
      Location: next,
      "Set-Cookie": cookieHeader,
      // Ensure intermediaries don't cache this auth response
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Reject any `next` value that isn't an internal absolute path.
 * Protects against `?next=//evil.com/phish` open-redirects.
 */
function sanitiseNextPath(raw: string): string {
  // Must start with a single forward slash and not be protocol-relative.
  if (typeof raw !== "string") return "/admin/scans";
  if (!raw.startsWith("/")) return "/admin/scans";
  if (raw.startsWith("//")) return "/admin/scans";
  // Forbid embedded scheme injection (e.g. "/foo\nLocation: http://evil")
  if (raw.includes("\n") || raw.includes("\r")) return "/admin/scans";
  // Cap length defensively
  if (raw.length > 500) return "/admin/scans";
  return raw;
}

function clientIp(req: Request): string {
  // Vercel forwards the real IP in x-forwarded-for; first entry is the client.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}
