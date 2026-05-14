import { NextResponse } from "next/server";
import { z } from "zod";
import {
  submitToIndexNow,
  getAllUrlsFromSitemap,
} from "@/lib/indexnow";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/indexnow/submit
 *
 * Pushes URLs to IndexNow (Bing + Yandex + all participating engines).
 * Admin-gated because:
 *   - Every call writes signal to Bing's index — accidental triggers
 *     waste rate-limit budget
 *   - Bot-driven submissions of unrelated URLs would be a vector for
 *     spam injection if the endpoint were public
 *
 * Two modes:
 *   1. Explicit list:   { "urls": ["https://kabelomore.com/...", ...] }
 *   2. Whole sitemap:   { "fromSitemap": true }
 *
 * Recommended usage:
 *   - Post-deploy: { fromSitemap: true } once per deploy to refresh
 *     the index. Single POST, max ~50 URLs, well inside rate limits.
 *   - On targeted content publish (new blog post, new case study):
 *     send just the new URL(s) so Bing crawls them within hours.
 *
 * Future: wire to a Vercel deploy webhook so the post-deploy ping
 * happens automatically. For now triggerable from the admin
 * dashboard or via curl with the admin bearer token.
 */

const PayloadSchema = z
  .union([
    z.object({
      urls: z.array(z.string().url()).min(1).max(10_000),
      fromSitemap: z.never().optional(),
    }),
    z.object({
      fromSitemap: z.literal(true),
      urls: z.never().optional(),
    }),
  ])
  .refine(
    (val) => "urls" in val || "fromSitemap" in val,
    "Provide either `urls` array or `fromSitemap: true`",
  );

export async function POST(req: Request) {
  // ─── Admin auth gate ────────────────────────────────────
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    if (auth.reason === "no-token-configured") {
      return NextResponse.json(
        { ok: false, message: "ADMIN_TOKEN env var is not configured." },
        { status: 503 },
      );
    }
    if (auth.reason === "invalid") {
      return NextResponse.json(
        { ok: false, message: "Forbidden — invalid admin token." },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { ok: false, message: "Unauthorised — access token required." },
      { status: 401 },
    );
  }

  // ─── Parse + validate payload ─────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = PayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message:
          parsed.error.issues[0]?.message ??
          "Invalid payload. Send either { urls: [...] } or { fromSitemap: true }.",
      },
      { status: 400 },
    );
  }

  // ─── Resolve URL list ──────────────────────────────────
  let urls: string[];
  if ("fromSitemap" in parsed.data && parsed.data.fromSitemap) {
    try {
      urls = await getAllUrlsFromSitemap();
    } catch (err) {
      return NextResponse.json(
        {
          ok: false,
          message:
            err instanceof Error
              ? err.message
              : "Failed to fetch sitemap.",
        },
        { status: 502 },
      );
    }
    if (urls.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Sitemap returned zero URLs. Check /sitemap.xml is reachable and well-formed.",
        },
        { status: 502 },
      );
    }
  } else if ("urls" in parsed.data) {
    urls = parsed.data.urls as string[];
  } else {
    return NextResponse.json(
      { ok: false, message: "Internal: payload validation passed but no URL source." },
      { status: 500 },
    );
  }

  // ─── Submit ────────────────────────────────────────────
  const result = await submitToIndexNow(urls);

  // Log structured event so we can grep Vercel logs for IndexNow activity.
  // Useful when diagnosing "did the deploy webhook actually fire?" later.
  console.info(
    JSON.stringify({
      event: "indexnow_submission",
      ok: result.ok,
      status: result.status,
      urlCount: result.urlCount,
    }),
  );

  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
  });
}

/**
 * GET /api/indexnow/submit
 * Returns 405 with a helpful hint, because someone WILL hit this URL
 * in a browser at some point and we should explain what's needed.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "POST only. Body: { urls: string[] } or { fromSitemap: true }. Auth: Authorization: Bearer <ADMIN_TOKEN>.",
    },
    { status: 405 },
  );
}
