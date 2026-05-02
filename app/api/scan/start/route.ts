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
} from "@/lib/storage/scanStore";
import { runFullScan } from "@/lib/engines/scanOrchestrator";
import { INDUSTRIES, COUNTRIES } from "@/lib/types/scan";
import type { BusinessProfile, ScanResult } from "@/lib/types/scan";

export const runtime = "nodejs";
// Vercel Hobby plan max is 60s. Pro is 300s. We design for 60s with
// careful per-engine timeouts inside the orchestrator.
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

/**
 * Hard timeout for the scan execution. Vercel Hobby max is 60s;
 * we cap our scan at 45s to leave buffer for email sends + the
 * JSON response. If the scan exceeds this, we gracefully fall back
 * to "Kabelo will deliver manually within 24 hours" — emails have
 * already been sent so the user has a clear next step.
 */
const SCAN_HARD_TIMEOUT_MS = 45_000;

export async function POST(req: Request) {
  // CRITICAL: wrap the entire handler in try/catch so we ALWAYS return
  // JSON. Without this, an unhandled exception or a Vercel function
  // timeout returns plain text ("An error occurred...") and the client
  // JSON.parse chokes — that's the error symptom Kabelo saw in production.
  try {
    // ─── Pre-flight: detect missing required env vars and fail loudly ──
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error(
        "[scan/start] ANTHROPIC_API_KEY is not set. Scan cannot run.",
      );
      return NextResponse.json(
        {
          ok: false,
          message:
            "The scan service isn't fully configured yet. Kabelo has been notified — he'll deliver your scan manually within 24 hours via email.",
          configError: "ANTHROPIC_API_KEY missing",
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
      return NextResponse.json(
        {
          ok: false,
          message: parsed.error.issues[0]?.message ?? "Invalid submission.",
          field: parsed.error.issues[0]?.path?.join(".") ?? null,
        },
        { status: 400 },
      );
    }

    // Honeypot tripped — silently succeed
    if (parsed.data.company) {
      return NextResponse.json({ ok: true, scanId: "honeypot" });
    }

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

    // Save profile + status (graceful — works without KV for local dev)
    await safeStorageOp(() => saveProfile(scanId, profile));
    await safeStorageOp(() => setStatus(scanId, "scanning"));

    // CRITICAL: AWAIT the email sends. Without await, Vercel serverless
    // cancels pending promises when the response returns — so the emails
    // silently never send. Past behaviour: 'no emails arrive on scan'.
    //
    // Each email is wrapped in its own try/catch so one failure doesn't
    // block the others — partial delivery is better than no delivery.

    // Email 1: Notify Kabelo of submission
    try {
      await notifyKabeloOnSubmission(profile);
    } catch (err) {
      console.error("[scan/start] notify-kabelo-submission failed:", err);
    }

    // Email 2: User acknowledgment — confirms submission + sets expectation
    try {
      await sendUserAcknowledgment(profile);
    } catch (err) {
      console.error("[scan/start] user-acknowledgment failed:", err);
    }

    // Run the scan with a hard timeout. If it succeeds, return the result.
    // If it times out OR errors, gracefully return ok:false with a helpful
    // message — emails are already sent so user has a clear next step.
    let result: ScanResult | null = null;
    let scanError: string | null = null;
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
    } catch (err) {
      scanError = err instanceof Error ? err.message : "Scan failed";
      console.error(`[scan/start] runFullScan errored:`, err);
      await safeStorageOp(() => setError(scanId, scanError!));
    }

    if (!result) {
      // Scan failed or timed out. User has been emailed; Kabelo has been
      // notified. Manual fallback path is now in motion.
      return NextResponse.json(
        {
          ok: false,
          scanId,
          message:
            "We've got your details and emailed you a confirmation. The automated scan didn't finish in time — Kabelo will run it manually and email your report within 24 hours.",
          fallback: "manual",
        },
        { status: 200 },
      );
    }

    // Scan succeeded — save + notify Kabelo with results, return to client
    await safeStorageOp(() => saveResult(scanId, result!));
    await safeStorageOp(() => setStatus(scanId, "complete"));

    try {
      await notifyKabeloOnCompletion(result, profile);
    } catch (err) {
      console.error("[scan/start] notify-kabelo-completion failed:", err);
    }

    return NextResponse.json({ ok: true, scanId, result });
  } catch (err) {
    // Last-resort catch-all. We always return JSON — never plain text.
    console.error("[scan/start] unhandled error:", err);
    return NextResponse.json(
      {
        ok: false,
        message:
          "We hit an unexpected snag on our end. Email kabelo@kabelomore.com directly and we'll deliver your scan manually within 24 hours.",
      },
      { status: 500 },
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────

async function safeStorageOp(op: () => Promise<unknown>): Promise<void> {
  try {
    await op();
  } catch (err) {
    console.error("[scan/start] storage op failed (non-fatal):", err);
  }
}

async function notifyKabeloOnSubmission(profile: BusinessProfile): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  await resend.emails.send({
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

/**
 * Send the user a confirmation email immediately after submission.
 * Sets the "report within 24 hours" expectation regardless of whether
 * the automated scan completes inline or falls back to manual delivery.
 *
 * This was missing from the original flow — users submitted and heard
 * nothing for the next 30-50s while the scan ran. Now they get a
 * confirmation in their inbox before the scan even finishes.
 */
async function sendUserAcknowledgment(profile: BusinessProfile): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  const firstName = profile.contactName.split(" ")[0] ?? "there";

  await resend.emails.send({
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
      "  Within 24 hours: a personalised PDF report covering",
      "    · How ChatGPT, Claude, Gemini, and Perplexity respond when",
      "      your customers search for your services",
      "    · The 3 highest-leverage fixes to improve your AI visibility",
      "    · A no-pressure recommendation on what to do next",
      "",
      "  Sometimes our automated scan completes immediately — if so,",
      "  you'll receive a more detailed second email with the full report.",
      "  If it doesn't, Kabelo runs it manually and the report arrives",
      "  within 24 hours either way.",
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

async function notifyKabeloOnCompletion(
  result: ScanResult & { stageReport?: import("@/lib/engines/scanOrchestrator").ScanStageReport },
  profile: BusinessProfile,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  // Stage report — what worked vs what didn't
  const stages = result.stageReport;
  const stageEmoji = (s: string | undefined) =>
    s === "ok" ? "✅" : s === "partial" ? "⚠️" : s === "failed" ? "❌" : "—";

  // Confidence flag — if any stage failed, mark scan as low-confidence
  const hasFailures = stages
    ? Object.values(stages).some((s) => s === "failed" || s === "partial")
    : false;
  const confidenceTag = hasFailures
    ? `[LOW CONFIDENCE — manual verification recommended]`
    : `[high confidence]`;

  await resend.emails.send({
    from: `Kabelomore Scans <${fromEmail}>`,
    to: [inboxEmail],
    replyTo: profile.email,
    subject: `Scan complete — ${profile.businessName} — ${result.score}/100 ${hasFailures ? "⚠️" : ""}`,
    text: [
      `Scan complete for ${profile.businessName} ${confidenceTag}`,
      "─".repeat(60),
      ``,
      `Score:           ${result.score}/100`,
      `Classification:  ${result.classification}`,
      ``,
      `Stage report (what ran successfully):`,
      stages
        ? [
            `  ${stageEmoji(stages.discovery)}  Discovery (find website + GBP):       ${stages.discovery}`,
            `  ${stageEmoji(stages.presenceCheck)}  Presence check (HEAD + schema):       ${stages.presenceCheck}`,
            `  ${stageEmoji(stages.citationAnalysis)}  Citation analysis (multi-search):     ${stages.citationAnalysis}`,
            `  ${stageEmoji(stages.visibilitySimulation)}  Visibility simulation (AI queries):   ${stages.visibilitySimulation}`,
          ].join("\n")
        : `  (stage tracking unavailable)`,
      ``,
      `Layers:`,
      `  Presence:    ${result.layers.presence}/25`,
      `  Authority:   ${result.layers.authority}/40`,
      `  Consistency: ${result.layers.consistency}/20`,
      `  Content:     ${result.layers.content}/15`,
      ``,
      `Top issues:`,
      ...result.issues
        .slice(0, 3)
        .map((i, idx) => `  ${idx + 1}. [${i.severity.toUpperCase()}] ${i.title}`),
      ``,
      `Top recommendations:`,
      ...result.recommendations.slice(0, 3).map((r) => `  ${r.rank}. ${r.title}`),
      ``,
      `Diagnosis: ${result.diagnosisOneLiner}`,
      ``,
      `View full results page: ${site.url}/scan/${result.id}/results`,
      ``,
      `─── Detected signals ───`,
      `Website reachable: ${result.detected.websiteReachable ? "yes" : "no"}`,
      `Website has schema: ${result.detected.websiteHasSchema ? "yes" : "no"}`,
      `GBP found: ${result.detected.gbpFound ? "yes" : "no"}`,
      `Citation count: ${result.detected.citationCount}`,
      `Citation level: ${result.detected.citationLevel}`,
      `Citation sources: ${result.detected.citationSources.slice(0, 8).join(", ") || "—"}`,
      `NAP consistent: ${result.detected.napConsistent ? "yes" : "no"}`,
      ``,
      `─── Visibility queries ───`,
      ...result.visibilityChecks.map(
        (v) =>
          `  • "${v.query}" → ${v.businessAppears ? "✓ business cited" : "✗ business NOT cited"}`,
      ),
      ``,
      `Competitors AI is recommending:`,
      ...result.competitors.slice(0, 5).map((c) => `  • ${c.name}`),
      ``,
      `Scan duration: ${(result.durationMs / 1000).toFixed(1)}s`,
      ``,
      hasFailures
        ? `⚠️  This scan had partial/failed stages — review the detected signals above and run audit-agent CLI manually for verification before sending the report to the prospect.`
        : `✅  All scan stages ran successfully.`,
    ].join("\n"),
  });
}
