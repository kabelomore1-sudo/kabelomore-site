import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  getProfile,
  getResult,
  getStatus,
  updateScanMeta,
} from "@/lib/storage/scanStore";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { recordEvent, safeErrorMessage } from "@/lib/scan-events";
import { sendEmailOrThrow } from "@/lib/resend-helper";
import {
  buildAdminCompletionEmail,
  buildClientCompletionEmail,
} from "@/lib/email-templates";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/scans/[id]/send-email
 *
 * Fires the client + admin completion emails for an EXISTING scan
 * result. Use case: scans that completed before the email automation
 * shipped, or admin wants to manually re-trigger delivery without
 * burning another ~$0.34 on a fresh scan.
 *
 * Distinct from the /run endpoint:
 *   /run         — fires the scan + emails (costs $$$)
 *   /send-email  — emails only, from saved KV data (free)
 *
 * Requires:
 *   - scan status === "complete" (no results to email otherwise)
 *   - admin auth via cookie or Bearer token
 *
 * On success:
 *   - Both emails dispatched (client gets visual HTML, admin gets ops detail)
 *   - meta.emailed flipped to true
 *
 * Failure is per-email — one failing doesn't block the other.
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

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json(
      { ok: false, message: "scanId is required." },
      { status: 400 },
    );
  }

  // Pull everything we need from KV in parallel
  const [profile, result, status] = await Promise.all([
    getProfile(id).catch(() => null),
    getResult(id).catch(() => null),
    getStatus(id).catch(() => null),
  ]);

  if (!profile) {
    return NextResponse.json(
      {
        ok: false,
        message: `No saved profile for scan ${id}. The submission may have predated the KV index.`,
      },
      { status: 404 },
    );
  }

  if (status !== "complete" || !result) {
    return NextResponse.json(
      {
        ok: false,
        message: `Scan ${id} hasn't completed yet (status: ${status ?? "unknown"}). Use /run to fire the scan first, then email.`,
      },
      { status: 409 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { ok: false, message: "RESEND_API_KEY not configured." },
      { status: 503 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  let clientEmailSent = false;
  let adminEmailSent = false;
  const emailErrors: string[] = [];

  // Client completion email
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
    recordEvent({
      type: "client_completion_email_sent",
      scanId: id,
      data: { trigger: "admin_resend" },
    });
  } catch (e) {
    emailErrors.push(`client: ${safeErrorMessage(e)}`);
    recordEvent({
      type: "client_completion_email_failed",
      scanId: id,
      error: safeErrorMessage(e),
    });
  }

  // Admin notification email
  try {
    const email = buildAdminCompletionEmail({
      result,
      profile,
      stageReport: undefined, // not available on resend — original scan stage data may have been overwritten
      clientEmailWillBeSent: clientEmailSent,
    });
    await sendEmailOrThrow(resend, {
      from: `Kabelomore Scans <${fromEmail}>`,
      to: [inboxEmail],
      replyTo: profile.email,
      subject: email.subject,
      text: email.text,
    });
    adminEmailSent = true;
    recordEvent({
      type: "completion_email_sent",
      scanId: id,
      data: { trigger: "admin_resend" },
    });
  } catch (e) {
    emailErrors.push(`admin: ${safeErrorMessage(e)}`);
    recordEvent({
      type: "completion_email_failed",
      scanId: id,
      error: safeErrorMessage(e),
    });
  }

  // Flip meta.emailed if the client email landed
  if (clientEmailSent) {
    try {
      await updateScanMeta(id, { emailed: true });
    } catch {
      /* non-fatal */
    }
  }

  // 207 multi-status — partial success is allowed
  const httpStatus = clientEmailSent || adminEmailSent ? 200 : 500;

  return NextResponse.json(
    {
      ok: clientEmailSent || adminEmailSent,
      scanId: id,
      clientEmailSent,
      adminEmailSent,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
      message: clientEmailSent
        ? "Emails dispatched. Workflow marked as Emailed."
        : adminEmailSent
          ? "Admin email sent, but client email failed. See emailErrors."
          : "Both emails failed. See emailErrors.",
    },
    { status: httpStatus },
  );
}
