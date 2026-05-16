import { NextResponse, after } from "next/server";
import { Resend } from "resend";
import {
  getProfile,
  saveResult,
  setStatus,
  setError,
  updateScanMeta,
} from "@/lib/storage/scanStore";
import { runFullScan } from "@/lib/engines/scanOrchestrator";
import type { ScanResult } from "@/lib/types/scan";
import type { ScanStageReport } from "@/lib/engines/scanOrchestrator";
import { verifyAdminRequest } from "@/lib/admin-auth";

// Helper type for the result returned by runFullScan — includes stageReport
type ScanResultWithStages = ScanResult & { stageReport?: ScanStageReport };
import { recordEvent, safeErrorMessage } from "@/lib/scan-events";
import { sendEmailOrThrow } from "@/lib/resend-helper";
import {
  buildAdminCompletionEmail,
  buildClientCompletionEmail,
} from "@/lib/email-templates";
import { site } from "@/lib/site";

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

  // Default behaviour: when admin clicks Run scan from the dashboard,
  // we also automatically fire BOTH completion emails (client + admin
  // notification) so the workflow completes in one action. To override
  // (e.g. you want to review before sending), pass ?skipEmail=1.
  const url = new URL(req.url);
  const skipEmail = url.searchParams.get("skipEmail") === "1";

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

    // Email dispatch is DEFERRED to after the response is flushed
    // (next/server `after`). Sending two transactional emails inline
    // added ~2-5s to the critical path right at the 60s ceiling and was
    // a contributor to the 504s. The scan result + "complete" status
    // are already persisted above, so even if this post-response work
    // is cut short the dashboard shows the result and the "Send email"
    // button can retry. Outcomes are tracked via recordEvent + the
    // Emailed meta flag (the dashboard reads those, not this response).
    if (!skipEmail) {
      after(async () => {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY!);
          const inboxEmail =
            process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
          const fromEmail =
            process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

          let clientEmailSent = false;

          // Client completion email — conversion-focused
          try {
            const email = buildClientCompletionEmail({ result, profile });
            await sendEmailOrThrow(resend, {
              from: `Kabelo More <${fromEmail}>`,
              to: [profile.email],
              replyTo: site.contact.email,
              subject: email.subject,
              text: email.text,
              html: email.html,
            });
            clientEmailSent = true;
            recordEvent({ type: "client_completion_email_sent", scanId: id });
          } catch (e) {
            recordEvent({
              type: "client_completion_email_failed",
              scanId: id,
              error: safeErrorMessage(e),
            });
          }

          // Admin notification — operational, comprehensive
          try {
            const email = buildAdminCompletionEmail({
              result,
              profile,
              stageReport: (result as ScanResultWithStages).stageReport,
              clientEmailWillBeSent: clientEmailSent,
            });
            await sendEmailOrThrow(resend, {
              from: `Kabelomore Scans <${fromEmail}>`,
              to: [inboxEmail],
              replyTo: profile.email,
              subject: email.subject,
              text: email.text,
            });
            recordEvent({ type: "completion_email_sent", scanId: id });
          } catch (e) {
            recordEvent({
              type: "completion_email_failed",
              scanId: id,
              error: safeErrorMessage(e),
            });
          }

          // If the client email landed, mark the scan Emailed (same
          // flag the Mark Emailed button toggles).
          if (clientEmailSent) {
            try {
              await updateScanMeta(id, { emailed: true });
            } catch {
              /* meta update non-fatal */
            }
          }
        } catch (e) {
          // Defensive: a post-response task must never throw uncaught.
          recordEvent({
            type: "completion_email_failed",
            scanId: id,
            error: safeErrorMessage(e),
          });
        }
      });
    }

    return NextResponse.json({
      ok: true,
      scanId: id,
      score: result.score,
      classification: result.classification,
      durationMs: result.durationMs,
      resultUrl: `/scan/${id}/results`,
      emailDispatch: skipEmail ? "skipped" : "deferred",
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
