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

export async function POST(req: Request) {
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

  // Save profile to storage (graceful — works without KV for local dev)
  await safeStorageOp(() => saveProfile(scanId, profile));
  await safeStorageOp(() => setStatus(scanId, "scanning"));

  // Notify Kabelo immediately on submission
  notifyKabeloOnSubmission(profile).catch((err) =>
    console.error("[scan/start] submission notification failed:", err),
  );

  // Run the actual scan synchronously. Takes ~30-50s typically.
  // Client shows engaging progress UI during this wait.
  let result: ScanResult;
  try {
    result = await runFullScan(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scan failed";
    console.error(`[scan/start] runFullScan errored:`, err);
    await safeStorageOp(() => setError(scanId, message));
    return NextResponse.json(
      {
        ok: false,
        scanId,
        message:
          "We hit a snag running your scan. Don't worry — we've notified Kabelo and he'll deliver your report manually within 24 hours.",
      },
      { status: 500 },
    );
  }

  // Save result to storage if configured
  await safeStorageOp(() => saveResult(scanId, result));
  await safeStorageOp(() => setStatus(scanId, "complete"));

  // Notify Kabelo with full results
  notifyKabeloOnCompletion(result, profile).catch((err) =>
    console.error("[scan/start] completion notification failed:", err),
  );

  return NextResponse.json({ ok: true, scanId, result });
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

async function notifyKabeloOnCompletion(
  result: ScanResult,
  profile: BusinessProfile,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  await resend.emails.send({
    from: `Kabelomore Scans <${fromEmail}>`,
    to: [inboxEmail],
    replyTo: profile.email,
    subject: `Scan complete — ${profile.businessName} — ${result.score}/100`,
    text: [
      `Scan complete for ${profile.businessName}`,
      "─".repeat(50),
      ``,
      `Score:           ${result.score}/100`,
      `Classification:  ${result.classification}`,
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
      `Citation count: ${result.detected.citationCount}`,
      `Citation level: ${result.detected.citationLevel}`,
      `Citation sources: ${result.detected.citationSources.slice(0, 5).join(", ") || "—"}`,
      ``,
      `Visibility queries:`,
      ...result.visibilityChecks.map(
        (v) =>
          `  • "${v.query}" → ${v.businessAppears ? "✓ business cited" : "✗ business NOT cited"}`,
      ),
      ``,
      `Competitors AI is recommending:`,
      ...result.competitors.slice(0, 5).map((c) => `  • ${c.name}`),
      ``,
      `Scan duration: ${(result.durationMs / 1000).toFixed(1)}s`,
    ].join("\n"),
  });
}
