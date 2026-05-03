import { NextResponse } from "next/server";
import {
  listIndex,
  getStatus,
  getResult,
  getScanMeta,
  type IndexEntry,
  type ScanMeta,
} from "@/lib/storage/scanStore";
import { verifyAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/scans
 *
 * Returns the most recent submissions — recent-first — with:
 *  - submission metadata (name, email, sector, location, timestamp)
 *  - email delivery status captured at submit time
 *  - scan engine status (scanning / complete / failed / unknown)
 *  - score (when the scan has completed)
 *  - admin-set workflow flags (handled / emailed / archived / note)
 *
 * Plus a `metrics` block computed from the same dataset so the
 * dashboard can render summary cards without a second request.
 *
 * Auth: ADMIN_TOKEN required.
 *
 * Query params:
 *   limit  — max rows to return (1-200, default 50)
 *
 * Error handling:
 *   - 401 missing token / 403 invalid / 503 unconfigured
 *   - 500 surfaces a generic message; details only in server logs
 *   - Per-row I/O failures are absorbed: the row appears with
 *     status="unknown" rather than failing the whole response
 */
export async function GET(req: Request) {
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    if (auth.reason === "no-token-configured") {
      console.error(
        JSON.stringify({
          event: "admin_api_misconfigured",
          route: "GET /api/admin/scans",
        }),
      );
      return NextResponse.json(
        {
          ok: false,
          message:
            "ADMIN_TOKEN env var is not configured. Set it in Vercel before using the admin endpoints.",
        },
        { status: 503 },
      );
    }
    if (auth.reason === "invalid") {
      console.warn(
        JSON.stringify({
          event: "admin_api_forbidden",
          route: "GET /api/admin/scans",
        }),
      );
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

  const url = new URL(req.url);
  const limitRaw = url.searchParams.get("limit");
  const parsedLimit = parseInt(limitRaw ?? "50", 10);
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), 200)
    : 50;

  let entries: IndexEntry[];
  try {
    entries = await listIndex(limit);
  } catch (err) {
    console.error("[admin/scans] listIndex failed:", safeErr(err));
    return NextResponse.json(
      {
        ok: false,
        message:
          "Server error reading scan index. Check Vercel logs for details.",
      },
      { status: 500 },
    );
  }

  // Per-row I/O is sequential under Promise.all; ≤200 reads is fine.
  // Each row's I/O is wrapped so a single bad row can't fail the whole list.
  const rows = await Promise.all(entries.map(decorateRow));

  return NextResponse.json({
    ok: true,
    count: rows.length,
    metrics: computeMetrics(rows),
    rows,
  });
}

// ─── Row decoration ───────────────────────────────────────────────

type DecoratedRow = IndexEntry & {
  status: string;
  score: number | null;
  meta: ScanMeta;
};

async function decorateRow(e: IndexEntry): Promise<DecoratedRow> {
  let status = "unknown";
  let score: number | null = null;
  let meta: ScanMeta = {};

  try {
    status = (await getStatus(e.scanId)) ?? "unknown";
  } catch (err) {
    console.error(
      `[admin/scans] getStatus(${e.scanId}) failed:`,
      safeErr(err),
    );
  }

  if (status === "complete") {
    try {
      const r = await getResult(e.scanId);
      score = r?.score ?? null;
    } catch (err) {
      console.error(
        `[admin/scans] getResult(${e.scanId}) failed:`,
        safeErr(err),
      );
    }
  }

  try {
    meta = await getScanMeta(e.scanId);
  } catch (err) {
    console.error(
      `[admin/scans] getScanMeta(${e.scanId}) failed:`,
      safeErr(err),
    );
  }

  return { ...e, status, score, meta };
}

// ─── Metrics ──────────────────────────────────────────────────────

function computeMetrics(rows: DecoratedRow[]) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const isRecent = (iso: string) => {
    const t = new Date(iso).getTime();
    return Number.isFinite(t) && t >= sevenDaysAgo;
  };

  const total = rows.length;
  const recent = rows.filter((r) => isRecent(r.submittedAt)).length;

  const scanCompleted = rows.filter((r) => r.status === "complete").length;
  const scanFailed = rows.filter((r) => r.status === "failed").length;

  const userEmailKnown = rows.filter(
    (r) => typeof r.userEmailSent === "boolean",
  );
  const userEmailFailed = userEmailKnown.filter(
    (r) => r.userEmailSent === false,
  ).length;

  const adminEmailKnown = rows.filter(
    (r) => typeof r.adminEmailSent === "boolean",
  );
  const adminEmailFailed = adminEmailKnown.filter(
    (r) => r.adminEmailSent === false,
  ).length;

  const fallbackKnown = rows.filter(
    (r) => typeof r.manualFallback === "boolean",
  );
  const fallbackCount = fallbackKnown.filter(
    (r) => r.manualFallback === true,
  ).length;

  const handled = rows.filter((r) => r.meta?.handled === true).length;
  const emailed = rows.filter((r) => r.meta?.emailed === true).length;

  return {
    total,
    last7Days: recent,
    scanCompletedRate: total === 0 ? null : ratio(scanCompleted, total),
    scanFailedRate: total === 0 ? null : ratio(scanFailed, total),
    userEmailFailedRate:
      userEmailKnown.length === 0
        ? null
        : ratio(userEmailFailed, userEmailKnown.length),
    adminEmailFailedRate:
      adminEmailKnown.length === 0
        ? null
        : ratio(adminEmailFailed, adminEmailKnown.length),
    manualFallbackRate:
      fallbackKnown.length === 0
        ? null
        : ratio(fallbackCount, fallbackKnown.length),
    handledCount: handled,
    emailedCount: emailed,
  };
}

function ratio(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10; // one decimal
}

// ─── Safe logging ─────────────────────────────────────────────────
function safeErr(err: unknown): string {
  if (err instanceof Error) {
    return err.message
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, "[REDACTED]")
      .replace(/re_[a-zA-Z0-9_-]{20,}/g, "[REDACTED]")
      .slice(0, 300);
  }
  return String(err).slice(0, 300);
}
