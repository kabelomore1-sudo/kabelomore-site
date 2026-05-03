import { NextResponse } from "next/server";
import {
  getProfile,
  saveResult,
  setStatus,
  setError,
} from "@/lib/storage/scanStore";
import { runFullScan } from "@/lib/engines/scanOrchestrator";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { recordEvent, safeErrorMessage } from "@/lib/scan-events";

export const runtime = "nodejs";
// 60s is the Vercel Hobby ceiling. The orchestrator has its own internal
// budget (~50-55s) so we don't hit this in normal operation.
export const maxDuration = 60;

/**
 * POST /api/admin/scans/[id]/run
 *
 * Manually run a scan for a saved submission. Used by the admin dashboard
 * when SCAN_MODE=manual (i.e. the submit form deliberately skipped the
 * paid Anthropic call). Bypasses scan mode — admin can always run.
 *
 * Auth: ADMIN_TOKEN required.
 *
 * Side effects:
 *   - Saves the result + flips status to "complete" (or "failed" on error)
 *   - Costs ~$0.30-0.50 in Anthropic API spend per invocation
 *   - Does NOT email the prospect — that's a separate step (Kabelo
 *     reviews the result first, then sends the personalised email
 *     using the hosted /scan/[id]/results URL).
 *
 * Why not also email automatically:
 *   The whole reason manual mode exists is so Kabelo can verify the
 *   scan output before delivery. Auto-emailing would defeat that.
 */
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    if (auth.reason === "no-token-configured") {
      return NextResponse.json(
        { ok: false, message: "ADMIN_TOKEN env var is not configured." },
        { status: 503 },
      );
    }
    if (auth.reason === "invalid") {
      console.warn(
        JSON.stringify({
          event: "admin_api_forbidden",
          route: "POST /api/admin/scans/[id]/run",
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "ANTHROPIC_API_KEY is not configured. The scan needs Claude+web_search to run.",
      },
      { status: 503 },
    );
  }

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json(
      { ok: false, message: "scanId is required." },
      { status: 400 },
    );
  }

  const profile = await getProfile(id);
  if (!profile) {
    return NextResponse.json(
      {
        ok: false,
        message: `No saved profile for scan ${id}. The submission may have predated the index, or KV storage may be unconfigured.`,
      },
      { status: 404 },
    );
  }

  recordEvent({
    type: "PAID_API_CALL_STARTED",
    scanId: id,
    data: { trigger: "admin_manual" },
  });

  try {
    await setStatus(id, "scanning");
    const result = await runFullScan(profile);
    await saveResult(id, result);
    await setStatus(id, "complete");
    recordEvent({
      type: "PAID_API_CALL_FINISHED",
      scanId: id,
      data: { score: result.score, trigger: "admin_manual" },
    });
    return NextResponse.json({
      ok: true,
      scanId: id,
      score: result.score,
      classification: result.classification,
      durationMs: result.durationMs,
      resultUrl: `/scan/${id}/results`,
    });
  } catch (err) {
    const msg = safeErrorMessage(err);
    recordEvent({
      type: "PAID_API_CALL_FAILED",
      scanId: id,
      error: msg,
    });
    try {
      await setError(id, msg);
    } catch {
      /* storage already failing — proceed to error response */
    }
    return NextResponse.json(
      { ok: false, scanId: id, message: msg },
      { status: 500 },
    );
  }
}
