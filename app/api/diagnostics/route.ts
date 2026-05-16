import { NextResponse } from "next/server";
import {
  getLastSubmission,
  getRecentEvents,
} from "@/lib/scan-events";
import { getScanMode } from "@/lib/scan-mode";

export const runtime = "nodejs";

/**
 * /api/diagnostics — public endpoint Kabelo can hit to verify environment.
 *
 * Reports which env vars are set (without exposing values). Helps diagnose
 * when the scan is silently failing because of missing configuration.
 *
 * Visit kabelomore.com/api/diagnostics to see status.
 *
 * SECURITY: this endpoint reveals which integrations exist but never the
 * actual key values. Safe to keep public.
 */
export async function GET() {
  const checks = {
    // Required for the scan to run at all
    ANTHROPIC_API_KEY: {
      set: Boolean(process.env.ANTHROPIC_API_KEY),
      required: true,
      purpose: "Powers the AI scan (Claude + web_search). Without this, scans return empty data in ~5s.",
      fix: "Vercel → Settings → Environment Variables → Add ANTHROPIC_API_KEY (production)",
    },
    // Required for emails (scan submission + completion notifications)
    RESEND_API_KEY: {
      set: Boolean(process.env.RESEND_API_KEY),
      required: true,
      purpose: "Sends scan emails to Kabelo's inbox. Without this, no emails arrive.",
      fix: "Vercel → Settings → Environment Variables → Add RESEND_API_KEY (production)",
    },
    // Optional: persistent scan results
    KV_REST_API_URL: {
      set: Boolean(process.env.KV_REST_API_URL),
      required: false,
      purpose: "Stores scan results so /scan/[id]/results URLs are persistent and shareable.",
      fix: "Vercel → Storage → Create KV Database → auto-injects this var",
    },
    KV_REST_API_TOKEN: {
      set: Boolean(process.env.KV_REST_API_TOKEN),
      required: false,
      purpose: "Auth token for KV (paired with KV_REST_API_URL).",
      fix: "Auto-set when you create the KV database above.",
    },
    // Optional: Notion CRM
    NOTION_TOKEN: {
      set: Boolean(process.env.NOTION_TOKEN),
      required: false,
      purpose: "Writes scan submissions to Notion CRM (Free Scans database).",
      fix: "See NOTION_SCANS_SETUP.md",
    },
    NOTION_SCANS_DATABASE_ID: {
      set: Boolean(process.env.NOTION_SCANS_DATABASE_ID),
      required: false,
      purpose: "ID of the Free Scans database in Notion.",
      fix: "See NOTION_SCANS_SETUP.md",
    },
    // Optional: email customization
    SCAN_INBOX_EMAIL: {
      set: Boolean(process.env.SCAN_INBOX_EMAIL),
      required: false,
      purpose: "Override which email gets scan reports (default: kabelo@kabelomore.com).",
      fix: "Add to Vercel env vars only if you want a different inbox.",
    },
    SCAN_FROM_EMAIL: {
      set: Boolean(process.env.SCAN_FROM_EMAIL),
      required: false,
      purpose: "Override the From address (default: scan@kabelomore.com).",
      fix: "Add to Vercel env vars only if you want a different sender.",
    },
    // Required for the /admin/scans dashboard. We expose the LENGTH but
    // never the value — length differences are the most common reason
    // the login route returns 403 (whitespace, partial paste, wrong
    // copy). Length leak is acceptable: it doesn't materially help an
    // attacker against a 24+ char random token (search space is still
    // astronomically large).
    ADMIN_TOKEN: {
      set: Boolean(process.env.ADMIN_TOKEN),
      // Raw length (pre-trim). meetsMinLength uses the TRIMMED length
      // because auth trims before the 24-char check — a value like
      // "<23chars>\n" has raw length 24 but is effectively too short.
      length: process.env.ADMIN_TOKEN?.length ?? 0,
      meetsMinLength: (process.env.ADMIN_TOKEN?.trim().length ?? 0) >= 24,
      // T3: the exact footgun that caused the multi-session lockout. If
      // true, the configured value has a leading/trailing space or
      // newline (classic password-manager / `vercel env add` paste).
      // Auth now trims defensively so login still works — but this
      // flags the dirty value so you can clean it WITHOUT attempting a
      // login or ever seeing the secret. `length` vs trimmed length +
      // this flag together tell the whole story.
      hasSurroundingWhitespace:
        Boolean(process.env.ADMIN_TOKEN) &&
        process.env.ADMIN_TOKEN !== process.env.ADMIN_TOKEN?.trim(),
      required: false,
      purpose:
        "Gates the /admin/scans dashboard + /api/admin/* endpoints. Must be 24+ chars random. NOTE: these values reflect THIS deployment's env snapshot — if you rotated ADMIN_TOKEN and they still look stale, the running deployment predates the change (redeploy).",
      fix: "Vercel → Settings → Environment Variables → ADMIN_TOKEN (Production + Preview). Then REDEPLOY — env var changes don't apply to running deploys.",
    },
    // Phase 1.5: Google Places API for real GBP signals (rating, reviews,
    // hours, categories). Without it, the scan can detect whether a GBP
    // exists (via Claude+web_search inference) but can't measure quality.
    GOOGLE_PLACES_API_KEY: {
      set: Boolean(process.env.GOOGLE_PLACES_API_KEY),
      required: false,
      purpose:
        "Pulls real GBP data (rating, reviews, hours, categories) via Google Places API. Without it, scans fall back to inferred 'gbpFound only' from search snippets. Adds ~$0.034 per scan.",
      fix: "GCP → APIs & Services → Enable Places API → Create API key restricted to Places API. Then add as GOOGLE_PLACES_API_KEY env var in Vercel and redeploy.",
    },
  };

  const requiredMissing = Object.entries(checks)
    .filter(([_, c]) => c.required && !c.set)
    .map(([k]) => k);

  const optionalMissing = Object.entries(checks)
    .filter(([_, c]) => !c.required && !c.set)
    .map(([k]) => k);

  const status =
    requiredMissing.length === 0 ? "ready" : "missing-config";

  // Try a tiny test call to confirm Anthropic key actually WORKS (not just exists)
  let anthropicTest: { ok: boolean; message: string } = {
    ok: false,
    message: "Skipped — ANTHROPIC_API_KEY not set",
  };
  if (checks.ANTHROPIC_API_KEY.set) {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model: "claude-opus-4-7",
        max_tokens: 20,
        messages: [{ role: "user", content: "Reply with the word OK only." }],
      });
      const textBlock = res.content.find((b) => b.type === "text");
      anthropicTest = {
        ok: true,
        message: `API responded (model: ${res.model}, response starts with: "${"text" in (textBlock ?? {}) ? (textBlock as { text: string }).text.slice(0, 30) : ""}")`,
      };
    } catch (err) {
      anthropicTest = {
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      };
    }
  }

  // Pull recent in-memory events for live debugging (resets on redeploy).
  // Surfaces last 20 events + last-submission snapshot so Kabelo can
  // diagnose email delivery without grepping Vercel logs.
  const lastSubmission = getLastSubmission();
  const recentEvents = getRecentEvents(20);

  const scanMode = getScanMode();
  const scanModeNote =
    scanMode === "manual"
      ? "MANUAL mode — submissions saved + emails sent, NO Anthropic API call. Kabelo runs scans via CLI within 24h. Safest default. Set SCAN_MODE=automated in Vercel env vars to enable inline Anthropic scans."
      : scanMode === "automated"
        ? "AUTOMATED mode — submissions trigger Anthropic API calls with 45s timeout. Each scan costs ~$0.10-0.30. Set SCAN_MODE=manual in Vercel env vars to disable paid calls."
        : "DISABLED — all scan submissions are refused with 503. Emergency stop. Set SCAN_MODE=manual or automated to re-enable.";

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    summary:
      status === "ready"
        ? "All required env vars are set. Scan should work."
        : `Missing required env vars: ${requiredMissing.join(", ")}`,
    scanMode: {
      current: scanMode,
      paidApiCallsAllowed: scanMode === "automated",
      acceptsSubmissions: scanMode !== "disabled",
      note: scanModeNote,
    },
    requiredMissing,
    optionalMissing,
    anthropicTest,
    checks,
    // Live debugging surface (in-memory, per Vercel function instance)
    lastSubmission,
    recentEvents,
    testEmailEndpoint: {
      url: "/api/test-email",
      method: "POST",
      body: '{ "token": "<TEST_EMAIL_TOKEN>", "to": "you@example.com" }',
      note: "Set TEST_EMAIL_TOKEN env var in Vercel to enable. Use this to test Resend delivery without spending Anthropic credits.",
      tokenSet: Boolean(process.env.TEST_EMAIL_TOKEN),
    },
    helpfulLinks: {
      vercelEnvVars:
        "https://vercel.com/dashboard/[your-team]/kabelomore-site/settings/environment-variables",
      anthropicConsole: "https://console.anthropic.com/settings/keys",
      resendConsole: "https://resend.com/api-keys",
      resendDomains: "https://resend.com/domains",
      resendEmailLogs: "https://resend.com/emails",
      vercelKv:
        "https://vercel.com/dashboard/[your-team]/kabelomore-site/storage",
    },
  });
}
