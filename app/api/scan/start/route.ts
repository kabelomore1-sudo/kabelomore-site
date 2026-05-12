import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";
import {
  generateScanId,
  saveProfile,
  setStatus,
  saveResult,
  setError,
  isStorageConfigured,
  addToIndex,
} from "@/lib/storage/scanStore";
import { runFullScan } from "@/lib/engines/scanOrchestrator";
import { INDUSTRIES, COUNTRIES } from "@/lib/types/scan";
import type { BusinessProfile, ScanResult } from "@/lib/types/scan";
import {
  checkLimit,
  getClientIp,
  formatRetryAfter,
} from "@/lib/rate-limit";
import {
  recordEvent,
  recordSubmission,
  safeErrorMessage,
} from "@/lib/scan-events";
import { sendEmailOrThrow } from "@/lib/resend-helper";
import {
  buildAdminCompletionEmail,
  buildClientCompletionEmail,
} from "@/lib/email-templates";
import {
  getScanMode,
  isPaidApiAllowed,
  acceptsSubmissions,
} from "@/lib/scan-mode";

export const runtime = "nodejs";
export const maxDuration = 60;

const ScanStartSchema = z.object({
  // Required
  businessName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  email: z.string().email(),

  // Strongly preferred (UI requires)
  industry: z.enum(INDUSTRIES),
  city: z.string().min(1).max(200),
  country: z.enum(COUNTRIES),
  servicesText: z.string().min(1).max(500),

  // Optional
  website: z.string().url().or(z.literal("")).optional(),
  gbpUrl: z.string().url().or(z.literal("")).optional(),
  facebookUrl: z.string().url().or(z.literal("")).optional(),
  instagramUrl: z.string().url().or(z.literal("")).optional(),
  linkedinUrl: z.string().url().or(z.literal("")).optional(),
  phone: z.string().max(50).optional(),

  // Honeypot — bots fill, humans don't
  company: z.string().max(0).optional(),
});

const SCAN_HARD_TIMEOUT_MS = 45_000;

/**
 * Outcome flags returned to the client. The UI MUST render messages
 * based on these flags only — never assume an email succeeded.
 *
 * This was the bug Kabelo caught: the UI claimed "we emailed you"
 * when emails had silently failed inside try/catch. Now every email
 * outcome is tracked explicitly and surfaced in the response.
 */
interface OutcomeFlags {
  submissionSaved: boolean;
  userEmailSent: boolean;
  adminEmailSent: boolean;
  scanCompleted: boolean;
  manualFallback: boolean;
}

export async function POST(req: Request) {
  try {
    // ─── Pre-flight: SCAN_MODE switch (operator-controlled kill switch)
    //   'disabled'  = refuse all submissions (emergency stop)
    //   'manual'    = accept submissions but skip paid Anthropic API
    //   'automated' = original behaviour with 45s timeout
    if (!acceptsSubmissions()) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Scan submissions are temporarily paused. Please email kabelo@kabelomore.com directly and we'll deliver your report manually within 24 hours.",
          mode: getScanMode(),
          flags: {
            submissionSaved: false,
            userEmailSent: false,
            adminEmailSent: false,
            scanCompleted: false,
            manualFallback: true,
          } satisfies OutcomeFlags,
        },
        { status: 503 },
      );
    }

    // Anthropic key is only required when paid API is allowed (automated mode)
    if (isPaidApiAllowed() && !process.env.ANTHROPIC_API_KEY) {
      recordEvent({ type: "scan_failed", error: "ANTHROPIC_API_KEY missing" });
      return NextResponse.json(
        {
          ok: false,
          message:
            "The scan service isn't configured yet. Please email kabelo@kabelomore.com and we'll handle this manually.",
          flags: {
            submissionSaved: false,
            userEmailSent: false,
            adminEmailSent: false,
            scanCompleted: false,
            manualFallback: false,
          } satisfies OutcomeFlags,
        },
        { status: 503 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    const parsed = ScanStartSchema.safeParse(body);
    if (!parsed.success) {
      recordEvent({
        type: "validation_failed",
        error: parsed.error.issues[0]?.message,
      });
      return NextResponse.json(
        {
          ok: false,
          message: parsed.error.issues[0]?.message ?? "Invalid submission.",
          field: parsed.error.issues[0]?.path?.join(".") ?? null,
        },
        { status: 400 },
      );
    }

    // Honeypot tripped — silently succeed (don't tip off bots)
    if (parsed.data.company) {
      recordEvent({ type: "honeypot_tripped" });
      return NextResponse.json({ ok: true, scanId: "honeypot" });
    }

    // Rate-limit: per-IP (1 per 5 min)
    const clientIp = getClientIp(req);
    const ipCheck = checkLimit("ip", clientIp);
    if (!ipCheck.allowed) {
      recordEvent({
        type: "rate_limit_ip",
        data: { retryAfterSeconds: ipCheck.retryAfterSeconds },
      });
      return NextResponse.json(
        {
          ok: false,
          message: `You've already submitted a scan recently. Please wait ${formatRetryAfter(ipCheck.retryAfterSeconds)} before submitting another. If you need help sooner, email kabelo@kabelomore.com directly.`,
        },
        { status: 429 },
      );
    }

    // Rate-limit: per-email (1 per 24 hr)
    const emailCheck = checkLimit("email", parsed.data.email.toLowerCase());
    if (!emailCheck.allowed) {
      recordEvent({
        type: "rate_limit_email",
        data: { email: parsed.data.email.toLowerCase() },
      });
      return NextResponse.json(
        {
          ok: false,
          message: `A scan for this email was already submitted within the last 24 hours. Check your inbox — your previous report should be on its way. Need to update something? Reply to your confirmation email or message kabelo@kabelomore.com.`,
        },
        { status: 429 },
      );
    }

    recordEvent({ type: "validation_passed" });

    const submittedAt = new Date().toISOString();
    const scanId = generateScanId();

    const profile: BusinessProfile = {
      scanId,
      submittedAt,
      businessName: parsed.data.businessName,
      contactName: parsed.data.contactName,
      email: parsed.data.email,
      industry: parsed.data.industry,
      city: parsed.data.city,
      country: parsed.data.country,
      servicesText: parsed.data.servicesText,
      website: parsed.data.website || undefined,
      gbpUrl: parsed.data.gbpUrl || undefined,
      facebookUrl: parsed.data.facebookUrl || undefined,
      instagramUrl: parsed.data.instagramUrl || undefined,
      linkedinUrl: parsed.data.linkedinUrl || undefined,
      phone: parsed.data.phone || undefined,
    };

    recordEvent({
      type: "scan_submitted",
      scanId,
      data: {
        businessName: profile.businessName,
        email: profile.email,
        industry: profile.industry,
      },
    });

    // ─── Save profile (index push happens AFTER emails ─ see below) ──
    let submissionSaved = true;
    try {
      await saveProfile(scanId, profile);
      await setStatus(scanId, "scanning");
      recordEvent({ type: "profile_saved", scanId });
    } catch (err) {
      submissionSaved = false;
      recordEvent({
        type: "scan_failed",
        scanId,
        error: `profile save: ${safeErrorMessage(err)}`,
      });
      // Continue — we can still try to send emails even without storage
    }

    // ─── Email 1: Notify Kabelo of submission ───────────────────────
    const errors: string[] = [];
    let adminEmailSent = false;
    try {
      await notifyKabeloOnSubmission(profile);
      adminEmailSent = true;
      recordEvent({ type: "admin_email_sent", scanId });
    } catch (err) {
      const msg = safeErrorMessage(err);
      errors.push(`admin email: ${msg}`);
      recordEvent({
        type: "admin_email_failed",
        scanId,
        error: msg,
      });
    }

    // ─── Email 2: User acknowledgment ───────────────────────────────
    let userEmailSent = false;
    try {
      await sendUserAcknowledgment(profile);
      userEmailSent = true;
      recordEvent({ type: "user_email_sent", scanId });
    } catch (err) {
      const msg = safeErrorMessage(err);
      errors.push(`user email: ${msg}`);
      recordEvent({
        type: "user_email_failed",
        scanId,
        error: msg,
      });
    }

    // ─── Run the scan with hard timeout — only in 'automated' mode ───
    // In 'manual' mode (default), skip the paid Anthropic call entirely.
    // Submission is saved + emails sent + Kabelo runs scan via CLI within 24h.
    // This is the safest default until automated scans reliably complete
    // inside Vercel's 60s function limit.
    let result: ScanResult | null = null;
    let scanCompleted = false;
    const paidApiAllowed = isPaidApiAllowed();

    if (paidApiAllowed) {
      recordEvent({
        type: "PAID_API_CALL_STARTED",
        scanId,
        data: { hardTimeoutMs: SCAN_HARD_TIMEOUT_MS, mode: "automated" },
      });

      try {
        result = await Promise.race([
          runFullScan(profile),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error("Scan exceeded 45s hard timeout")),
              SCAN_HARD_TIMEOUT_MS,
            ),
          ),
        ]);
        scanCompleted = true;
        recordEvent({
          type: "PAID_API_CALL_FINISHED",
          scanId,
          data: { score: result.score },
        });
        recordEvent({ type: "scan_completed", scanId });
      } catch (err) {
        const msg = safeErrorMessage(err);
        const isTimeout = msg.includes("timeout") || msg.includes("Scan exceeded");
        errors.push(`scan: ${msg}`);
        recordEvent({
          type: isTimeout ? "scan_timed_out" : "PAID_API_CALL_FAILED",
          scanId,
          error: msg,
        });
        try {
          await setError(scanId, msg);
        } catch {
          /* storage may be unconfigured */
        }
      }
    } else {
      // Manual mode — log it explicitly so logs show why no API call ran
      recordEvent({
        type: "scan_failed",
        scanId,
        data: { mode: "manual", reason: "manual_mode_no_paid_call" },
      });
    }

    const flags: OutcomeFlags = {
      submissionSaved,
      userEmailSent,
      adminEmailSent,
      scanCompleted,
      manualFallback: !scanCompleted,
    };

    // ─── Compose HONEST message based on actual outcomes ────────────
    const message = composeMessage(flags);

    // Snapshot for diagnostics
    recordSubmission({
      scanId,
      timestamp: submittedAt,
      businessName: profile.businessName,
      email: profile.email,
      flags,
      errors,
    });

    // ─── Push to admin index AFTER outcomes are known ───────────────
    // Index push is best-effort — if it fails we still have the profile
    // saved + admin notification email. The admin dashboard's failover
    // is to read profiles directly by scanId.
    if (submissionSaved) {
      try {
        await addToIndex({
          scanId,
          businessName: profile.businessName,
          contactName: profile.contactName,
          email: profile.email,
          industry: profile.industry,
          city: profile.city,
          country: profile.country,
          submittedAt: profile.submittedAt,
          userEmailSent: flags.userEmailSent,
          adminEmailSent: flags.adminEmailSent,
          manualFallback: flags.manualFallback,
        });
      } catch (indexErr) {
        recordEvent({
          type: "scan_failed",
          scanId,
          error: `index push: ${safeErrorMessage(indexErr)}`,
        });
      }
    }

    if (scanCompleted && result) {
      // Save result + send completion emails
      try {
        await saveResult(scanId, result);
        await setStatus(scanId, "complete");
      } catch {
        /* storage non-fatal */
      }

      // Admin notification (Kabelo) — comprehensive operational email
      try {
        await notifyKabeloOnCompletion(result, profile);
        recordEvent({ type: "completion_email_sent", scanId });
      } catch (err) {
        recordEvent({
          type: "completion_email_failed",
          scanId,
          error: safeErrorMessage(err),
        });
      }

      // Client completion email — conversion-focused HTML email with
      // score, diagnosis, top issues, top fixes, big CTA to hosted
      // report. Failure is non-fatal — admin still has the result and
      // can manually trigger the email from /admin/scans (Send email).
      try {
        await sendClientCompletionEmail(result, profile);
        recordEvent({ type: "client_completion_email_sent", scanId });
      } catch (err) {
        recordEvent({
          type: "client_completion_email_failed",
          scanId,
          error: safeErrorMessage(err),
        });
      }

      recordEvent({
        type: "response_returned",
        scanId,
        data: { ok: true },
      });
      return NextResponse.json({
        ok: true,
        scanId,
        result,
        message,
        flags,
      });
    }

    // Scan didn't complete — return honest fallback response.
    // The 'errors' array surfaces the exact Resend / scan failure
    // reason in the API response so it's debuggable from the client
    // without requiring Vercel log access.
    recordEvent({
      type: "response_returned",
      scanId,
      data: { ok: false, fallback: "manual", mode: getScanMode() },
    });
    return NextResponse.json(
      {
        ok: false,
        scanId,
        message,
        flags,
        mode: getScanMode(),
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 },
    );
  } catch (err) {
    // Last-resort catch-all — always return JSON
    recordEvent({
      type: "scan_failed",
      error: `unhandled: ${safeErrorMessage(err)}`,
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          "We hit an unexpected snag. Please email kabelo@kabelomore.com directly — we'll deliver your scan within 24 hours.",
        flags: {
          submissionSaved: false,
          userEmailSent: false,
          adminEmailSent: false,
          scanCompleted: false,
          manualFallback: false,
        } satisfies OutcomeFlags,
      },
      { status: 500 },
    );
  }
}

/**
 * Compose a user-facing message from the actual outcome flags + mode.
 *
 * CRITICAL: this function NEVER claims an email was sent unless the
 * corresponding flag is true. NEVER claims a scan ran unless it actually
 * completed. The original bug was a hardcoded 'we emailed you' string.
 *
 * In MANUAL mode (current default), we don't promise an automated scan —
 * we promise Kabelo runs the scan manually within 24h. Same UX, no false
 * promises about an automated pipeline that isn't reliable yet.
 */
function composeMessage(flags: OutcomeFlags): string {
  const mode = getScanMode();

  // Best case: scan completed inline (only possible in 'automated' mode)
  if (flags.scanCompleted) {
    return "Your AI Visibility report is ready. Opening it now…";
  }

  // ─── MANUAL MODE — explicit, honest about delivery model ─────────
  if (mode === "manual") {
    if (flags.userEmailSent && flags.adminEmailSent) {
      return "Request received. We've emailed you a confirmation and Kabelo will personally run your AI Visibility scan + deliver the report within 24 hours.";
    }
    if (flags.adminEmailSent && !flags.userEmailSent) {
      return "Request received and Kabelo has been notified — he'll deliver your report within 24 hours. We couldn't send the confirmation email automatically; please check your spam folder.";
    }
    if (flags.userEmailSent && !flags.adminEmailSent) {
      return "Request received. We've emailed you a confirmation, but our internal notification didn't go through. Please reply to your confirmation email so Kabelo knows to follow up.";
    }
    if (flags.submissionSaved) {
      return "Request received and saved — but we couldn't send confirmation emails automatically. Please email kabelo@kabelomore.com directly with your business name to ensure Kabelo follows up.";
    }
    return "Something went wrong on our end. Please email kabelo@kabelomore.com directly with your business details.";
  }

  // ─── AUTOMATED MODE — scan didn't complete inline ────────────────
  if (flags.userEmailSent && flags.adminEmailSent) {
    return "Request received. We've emailed you a confirmation and Kabelo will deliver your full report within 24 hours.";
  }
  if (flags.adminEmailSent && !flags.userEmailSent) {
    return "Request received and Kabelo has been notified. We couldn't deliver the confirmation email automatically — please check your spam folder, or email kabelo@kabelomore.com if it doesn't arrive.";
  }
  if (flags.userEmailSent && !flags.adminEmailSent) {
    return "Request received. We've emailed you a confirmation, but our internal notification didn't go through. Please reply to the confirmation email or WhatsApp +27 76 035 1084 to ensure follow-up.";
  }
  if (flags.submissionSaved) {
    return "Request received and saved. We couldn't deliver email confirmations automatically — please email kabelo@kabelomore.com directly to ensure follow-up.";
  }
  return "Something went wrong on our end. Please email kabelo@kabelomore.com directly with your business details and we'll handle this manually.";
}

// ─── Email helpers ────────────────────────────────────────────────

async function notifyKabeloOnSubmission(profile: BusinessProfile): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const resend = new Resend(apiKey);
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  await sendEmailOrThrow(resend, {
    from: `Kabelomore Scans <${fromEmail}>`,
    to: [inboxEmail],
    replyTo: profile.email,
    subject: `New scan submitted — ${profile.businessName}`,
    text: [
      "New AI Visibility scan submitted",
      "─".repeat(50),
      `Business:    ${profile.businessName}`,
      `Contact:     ${profile.contactName}`,
      `Email:       ${profile.email}`,
      `Phone:       ${profile.phone ?? "—"}`,
      `Industry:    ${profile.industry}`,
      `Location:    ${profile.city}, ${profile.country}`,
      `Website:     ${profile.website ?? "—"}`,
      `GBP:         ${profile.gbpUrl ?? "—"}`,
      "",
      `Services:`,
      profile.servicesText,
      "",
      `Scan ID: ${profile.scanId}`,
      `Submitted: ${profile.submittedAt}`,
      `KV storage: ${isStorageConfigured() ? "ON" : "OFF (results in email only)"}`,
      "",
      `Scan results land in another email when complete (~30-60s).`,
    ].join("\n"),
  });
}

async function sendUserAcknowledgment(profile: BusinessProfile): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  const firstName = profile.contactName.split(" ")[0] ?? "there";

  await sendEmailOrThrow(resend, {
    from: `Kabelo More <${fromEmail}>`,
    to: [profile.email],
    replyTo: site.contact.email,
    subject: `Got your scan request — ${profile.businessName}`,
    text: [
      `Hi ${firstName},`,
      "",
      `Confirmed — we've received your AI Visibility Scan request for ${profile.businessName}.`,
      "",
      "WHAT HAPPENS NEXT:",
      "",
      "  Within 24 hours: a personalised written report delivered via",
      "  a secure web link (and a summary email). It covers:",
      "    · How an AI proxy (Claude + live web search, standing in for",
      "      ChatGPT, Gemini, and Perplexity) responds when your customers",
      "      search for your services",
      "    · The 3 highest-leverage fixes to improve your AI visibility",
      "    · A no-pressure recommendation on what to do next",
      "",
      "  Methodology note: native ChatGPT, Gemini, and Perplexity adapters",
      "  ship in Phase 1.5 — for now we use a Claude+web_search proxy.",
      "  The score is directional (re-runs may vary 5-10 points), not a",
      "  precise measurement.",
      "",
      "  Need it as a PDF? Reply to this email and we'll export the",
      "  report as a PDF for you within the same 24-hour window.",
      "",
      "WHILE YOU WAIT:",
      "",
      "  Three free reads that pair well with your scan:",
      `  · The Real Estate Method: ${site.url}/about`,
      `  · 47-point sector checklists: ${site.url}/resources`,
      `  · The SA AEO Index: ${site.url}/leaderboard`,
      "",
      "If anything's wrong with your submission or you want to add",
      "context, just reply to this email or WhatsApp +27 76 035 1084.",
      "",
      "— Kabelo More",
      "  AI Visibility Consultant · Pretoria",
      `  ${site.url}`,
    ].join("\n"),
  });
}

/**
 * Admin completion email — operational, comprehensive.
 * Uses the template helper for consistency between this path and the
 * admin-dashboard "Run scan" path (which now also sends this email).
 *
 * `clientEmailWillBeSent` reflects whether we ALSO sent the client a
 * results email. In the /api/scan/start automated path that's always
 * true. In the admin-dashboard path it's a flag the admin can toggle.
 */
async function notifyKabeloOnCompletion(
  result: ScanResult & {
    stageReport?: import("@/lib/engines/scanOrchestrator").ScanStageReport;
  },
  profile: BusinessProfile,
  clientEmailWillBeSent = true,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const resend = new Resend(apiKey);
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  const email = buildAdminCompletionEmail({
    result,
    profile,
    stageReport: result.stageReport,
    clientEmailWillBeSent,
  });

  await sendEmailOrThrow(resend, {
    from: `Kabelomore Scans <${fromEmail}>`,
    to: [inboxEmail],
    replyTo: profile.email,
    subject: email.subject,
    text: email.text,
  });
}

/**
 * Client completion email — conversion-focused HTML email with score,
 * diagnosis, top 3 issues, top 3 fixes, big CTA to the hosted report.
 *
 * Sent from Kabelo's personal address (replyTo set so client replies
 * route back to the same inbox). Failure is non-fatal — admin still
 * has the result in /admin/scans and can re-send manually via the
 * "Send email" button.
 */
async function sendClientCompletionEmail(
  result: ScanResult,
  profile: BusinessProfile,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  const email = buildClientCompletionEmail({ result, profile });

  await sendEmailOrThrow(resend, {
    from: `Kabelo More <${fromEmail}>`,
    to: [profile.email],
    replyTo: site.contact.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}
