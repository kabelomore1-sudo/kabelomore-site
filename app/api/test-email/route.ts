/**
 * /api/test-email — protected diagnostic endpoint to verify Resend
 * delivery without spending a cent on Anthropic.
 *
 * Usage:
 *   POST /api/test-email
 *   Body: { token: string, to?: string }
 *
 * Token must match TEST_EMAIL_TOKEN env var. Without the env var set,
 * the endpoint refuses to run (no token == no test sends).
 *
 * Returns rich diagnostic info about the Resend send attempt including
 * the exact error if it fails. This is THE FASTEST way to debug why
 * scan emails aren't arriving — run a single test, see the precise
 * Resend error, fix the underlying issue.
 *
 * Common failure modes the response will surface:
 *   - "Domain not verified" → user must verify kabelomore.com in Resend
 *   - "You can only send testing emails to your own email address"
 *     → Resend test-mode restriction; FROM address requires domain verification
 *   - "Invalid API key" → RESEND_API_KEY is wrong or revoked
 *   - "Too many requests" → free-tier 100/day cap exceeded
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { recordEvent, safeErrorMessage } from "@/lib/scan-events";

export const runtime = "nodejs";
export const maxDuration = 30;

const TestEmailSchema = z.object({
  token: z.string().min(1),
  to: z.string().email().optional(),
});

export async function POST(req: Request) {
  // ─── Auth: require TEST_EMAIL_TOKEN to match ────────────────────
  const expectedToken = process.env.TEST_EMAIL_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "TEST_EMAIL_TOKEN env var is not set on the server. Add it in Vercel → Settings → Environment Variables (any random 24+ character string), then redeploy. This protects the endpoint from being called by anyone.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = TestEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  if (parsed.data.token !== expectedToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized — token does not match." },
      { status: 401 },
    );
  }

  // ─── Send the test email ─────────────────────────────────────────
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY not configured on server." },
      { status: 503 },
    );
  }

  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const targetEmail = parsed.data.to ?? inboxEmail;
  const sentAt = new Date().toISOString();

  const resend = new Resend(apiKey);
  const fromConfig = `Kabelomore Test <${fromEmail}>`;

  try {
    const result = await resend.emails.send({
      from: fromConfig,
      to: [targetEmail],
      subject: `[TEST] Resend delivery check — ${sentAt}`,
      text: [
        "This is a diagnostic test email from kabelomore.com.",
        "",
        `Sent at:     ${sentAt}`,
        `From:        ${fromConfig}`,
        `To:          ${targetEmail}`,
        `Reply-to:    (not set)`,
        "",
        "If you're receiving this, Resend delivery from this configuration",
        "is working. If scan emails are still failing, the issue is in the",
        "scan flow code, not the email transport.",
        "",
        "If you did NOT expect this email, ignore it — someone with the",
        "TEST_EMAIL_TOKEN ran a diagnostic check.",
        "",
        "— Kabelomore diagnostic system",
      ].join("\n"),
    });

    recordEvent({
      type: "admin_email_sent",
      data: {
        kind: "test",
        to: targetEmail,
        resendId: result.data?.id,
      },
    });

    return NextResponse.json({
      ok: true,
      sentAt,
      from: fromConfig,
      to: targetEmail,
      resendId: result.data?.id ?? null,
      resendError: result.error ?? null,
      message: result.error
        ? `Resend returned an error — see resendError below.`
        : `Test email sent successfully. Check ${targetEmail} inbox (and spam folder).`,
    });
  } catch (err) {
    const errorMessage = safeErrorMessage(err);
    recordEvent({
      type: "admin_email_failed",
      data: { kind: "test", to: targetEmail },
      error: errorMessage,
    });

    return NextResponse.json(
      {
        ok: false,
        sentAt,
        from: fromConfig,
        to: targetEmail,
        error: errorMessage,
        diagnosis: diagnoseResendError(errorMessage),
      },
      { status: 500 },
    );
  }
}

/**
 * Pattern-match common Resend errors and return human-readable next steps.
 * This is what tells Kabelo exactly what to fix when emails fail.
 */
function diagnoseResendError(error: string): string {
  const lower = error.toLowerCase();

  if (lower.includes("domain") && lower.includes("verif")) {
    return "Domain not verified in Resend. Either verify kabelomore.com in Resend → Domains, OR set SCAN_FROM_EMAIL=onboarding@resend.dev in Vercel env vars (works without domain verification but only sends to the email used for the Resend account).";
  }

  if (lower.includes("only send testing emails")) {
    return "You're using onboarding@resend.dev without a verified domain. In this mode, Resend only delivers to the email you signed up with. To send to ANY recipient, you must verify your own domain at resend.com/domains. This is the most common 'no emails arrive' cause.";
  }

  if (lower.includes("api key") || lower.includes("unauthor")) {
    return "RESEND_API_KEY is invalid or revoked. Generate a new one at resend.com/api-keys and update Vercel env vars.";
  }

  if (lower.includes("too many requests") || lower.includes("rate limit")) {
    return "You've hit Resend's free-tier 100/day rate limit. Wait until tomorrow or upgrade Resend tier.";
  }

  if (lower.includes("from") && lower.includes("invalid")) {
    return "FROM address is malformed or rejected. Check SCAN_FROM_EMAIL value — should be a real email like scan@yourdomain.com OR onboarding@resend.dev.";
  }

  return "Unrecognised Resend error. Check the full error message above and the Resend logs at resend.com/emails.";
}
