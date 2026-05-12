/**
 * Email templates for completed scans.
 *
 * Two recipients, two templates:
 *
 * 1. CLIENT completion email
 *    - Conversion-focused: score, plain-English diagnosis, top 3 fixes,
 *      big CTA to the hosted report
 *    - HTML + plain-text version (Gmail/Outlook fall back to plain-text
 *      when HTML rendering is blocked)
 *    - No PII beyond business name in the visible body
 *
 * 2. ADMIN completion email (Kabelo's inbox)
 *    - Operational: stage report, raw detected signals, visibility
 *      check details, the client's contact info, full data dump
 *    - Plain text only — admin doesn't need styling, they need data
 *
 * Email design constraints (the "email-safe" rules):
 *   - No CSS variables, no flexbox, no grid — Outlook will not render them
 *   - Tables for layout, inline styles only
 *   - All colours hex-coded (no Tailwind class names — they don't exist
 *     in email contexts)
 *   - All fonts system-stack — no @font-face
 *   - Width capped at 600px — standard mobile-friendly email width
 *   - All CTAs use bulletproof button technique (table-cell, no <button>)
 *
 * What the client gets visually:
 *   - Header bar with brand name (no logo image — too many email clients
 *     block external images by default; we use type-led branding)
 *   - Big score block: 3-digit number, colour-coded background
 *   - 1-line classification underneath
 *   - 2-paragraph plain-English diagnosis
 *   - Numbered top 3 fixes
 *   - Single primary CTA (table-cell button) to the hosted report
 *   - Footer with contact + AI-engine proxy disclosure
 */

import type { BusinessProfile, ScanResult } from "@/lib/types/scan";
import { classificationLabel } from "@/lib/engines/classification";
import { scoreLabel } from "@/lib/engines/scoring";
import { site } from "@/lib/site";

interface ScanStageReportShape {
  discovery: string;
  presenceCheck: string;
  gbpLookup: string;
  citationAnalysis: string;
  visibilitySimulation: string;
}

export interface CompiledEmail {
  subject: string;
  html: string;
  text: string;
}

// ─── Colour scale ──────────────────────────────────────────────────
// Same scale used in the ScoreGauge component for visual consistency
// across the site and email. Hex-coded for email safety.
function scoreColour(score: number): {
  bg: string; // background of the big score block
  fg: string; // text colour for "score X/100" line
  label: string; // short label e.g. "Barely visible"
} {
  if (score < 25) return { bg: "#dc2626", fg: "#ffffff", label: scoreLabel(score) };
  if (score < 50) return { bg: "#f59e0b", fg: "#ffffff", label: scoreLabel(score) };
  if (score < 75) return { bg: "#84cc16", fg: "#ffffff", label: scoreLabel(score) };
  return { bg: "#10b981", fg: "#ffffff", label: scoreLabel(score) };
}

// ─── CLIENT completion email ──────────────────────────────────────

export function buildClientCompletionEmail(input: {
  result: ScanResult;
  profile: BusinessProfile;
}): CompiledEmail {
  const { result, profile } = input;
  const firstName = (profile.contactName || "").split(" ")[0] || "there";
  const reportUrl = `${site.url}/scan/${result.id}/results`;
  const colour = scoreColour(result.score);

  const top3Issues = result.issues.slice(0, 3);
  const top3Recs = result.recommendations.slice(0, 3);

  // Subject line tuned to read as TRANSACTIONAL, not marketing.
  // Gmail's Promotions filter weights subjects with $/%/score/marketing
  // keywords. We deliberately:
  //   - Use "Your scan results" framing (matches user expectation of
  //     receiving a thing they requested)
  //   - Include business name as second clause for personalisation signal
  //   - Avoid emoji, numbers in brackets, "FREE", marketing exclamation
  //   - Don't lead with "Your AI Visibility Score: X/100" which reads as
  //     a marketing teaser (the number-in-subject pattern is a Promotions
  //     flag in Gmail's classifier).
  const subject = `Your scan results — ${profile.businessName}`;

  // ─── Plain-text version ───
  // Tone: conversational, transactional. No "headlines", no exclamation,
  // no marketing-coded phrasing ("here's what we found!" etc). Reads
  // like a personal email from one person to another.
  const text = [
    `Hi ${firstName},`,
    "",
    `Your scan finished for ${profile.businessName}. Quick summary below — the full breakdown (with charts and AI response examples) is at the link.`,
    "",
    `Headline: ${result.score}/100 — ${colour.label}`,
    "",
    "Plain-English read:",
    result.diagnosisFull,
    "",
    "Full report (web link):",
    reportUrl,
    "",
    top3Issues.length > 0 ? "The three things to look at first:" : "",
    ...top3Issues.map(
      (issue, idx) => `${idx + 1}. ${issue.title}`,
    ),
    "",
    top3Recs.length > 0 ? "The three highest-leverage fixes:" : "",
    ...top3Recs.map((rec, idx) => `${idx + 1}. ${rec.title}`),
    "",
    "Most clients book a 15-min call once they've read the report — we go through it together, you ask whatever, no pressure or pitch. If that's useful, reply to this email or WhatsApp 076 035 1084.",
    "",
    "Kabelo",
    `${site.url}`,
    "",
    "Notes on methodology: scan runs customer-style queries via Claude with live web search (proxy for ChatGPT, Gemini, Perplexity). Score is a directional readiness indicator — re-runs may vary 5-10 points.",
  ]
    .filter(Boolean)
    .join("\n");

  // ─── HTML version (the rich email) ─────────────────────────────
  // Table-based layout, inline styles, 600px wide. Each section is
  // its own <table> for maximum email-client compatibility.
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica,Arial,sans-serif;color:#18181b;-webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f5;">
    <tr><td align="center" style="padding:24px 12px;">

      <!-- Container -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">

        <!-- Header — minimal, no caps, no marketing eyebrow.
             Gmail Promotions filter is sensitive to all-caps eyebrows
             ("AI VISIBILITY REPORT") so we drop the marketing chrome
             and lead with the business name. Reads as a transactional
             notification, not a marketing send. -->
        <tr><td style="padding:24px 28px 8px;border-bottom:1px solid #e4e4e7;">
          <div style="font-size:16px;font-weight:600;color:#18181b;">Scan results for ${escapeHtml(profile.businessName)}</div>
          <div style="font-size:12px;color:#71717a;margin-top:4px;">From Kabelo More · kabelomore.com</div>
        </td></tr>

        <!-- Greeting — conversational, no exclamation, no "Here's what we found!" -->
        <tr><td style="padding:20px 28px 12px;">
          <p style="margin:0 0 10px;font-size:16px;line-height:1.5;color:#27272a;">Hi ${escapeHtml(firstName)},</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#52525b;">Quick summary below — the full breakdown is at the link.</p>
        </td></tr>

        <!-- Score block -->
        <tr><td style="padding:8px 28px 20px;" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td align="center" style="background:${colour.bg};border-radius:12px;padding:32px 16px;">
              <div style="font-size:60px;line-height:1;font-weight:700;color:${colour.fg};letter-spacing:-0.02em;">${result.score}<span style="font-size:24px;font-weight:500;opacity:0.85;"> /100</span></div>
              <div style="margin-top:10px;font-size:13px;font-weight:600;color:${colour.fg};letter-spacing:0.14em;text-transform:uppercase;opacity:0.92;">${escapeHtml(colour.label)}</div>
              <div style="margin-top:6px;font-size:12px;color:${colour.fg};opacity:0.85;">${escapeHtml(classificationLabel(result.classification))}</div>
            </td></tr>
          </table>
          <div style="margin-top:10px;font-size:11px;color:#a1a1aa;">Directional readiness score · re-runs may vary 5-10 pts</div>
        </td></tr>

        <!-- Diagnosis -->
        <tr><td style="padding:0 28px 20px;">
          <div style="font-size:12px;color:#71717a;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;margin-bottom:8px;">What this means</div>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#27272a;">${escapeHtml(result.diagnosisFull)}</p>
        </td></tr>

        ${
          top3Issues.length > 0
            ? `
        <!-- Top issues -->
        <tr><td style="padding:8px 28px 20px;">
          <div style="font-size:12px;color:#71717a;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;margin-bottom:12px;">Top ${top3Issues.length} issue${top3Issues.length === 1 ? "" : "s"} we found</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${top3Issues
              .map(
                (issue, idx) => `
            <tr><td style="padding:8px 0;border-top:${idx === 0 ? "0" : "1px solid #f4f4f5"};">
              <div style="font-size:14px;font-weight:600;color:#18181b;">
                <span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${severityBg(issue.severity)};color:${severityFg(issue.severity)};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-right:8px;">${escapeHtml(issue.severity)}</span>${escapeHtml(issue.title)}
              </div>
              <div style="margin-top:4px;font-size:13px;line-height:1.5;color:#71717a;">${escapeHtml(issue.explanation)}</div>
            </td></tr>`,
              )
              .join("")}
          </table>
        </td></tr>`
            : ""
        }

        ${
          top3Recs.length > 0
            ? `
        <!-- Top fixes -->
        <tr><td style="padding:8px 28px 24px;">
          <div style="font-size:12px;color:#71717a;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;margin-bottom:12px;">Top ${top3Recs.length} fix${top3Recs.length === 1 ? "" : "es"} ranked by impact</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${top3Recs
              .map(
                (rec, idx) => `
            <tr><td style="padding:8px 0;border-top:${idx === 0 ? "0" : "1px solid #f4f4f5"};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="32" valign="top" style="padding-right:12px;">
                    <div style="width:24px;height:24px;border-radius:999px;background:#18181b;color:#ffffff;font-size:12px;font-weight:700;text-align:center;line-height:24px;">${idx + 1}</div>
                  </td>
                  <td>
                    <div style="font-size:14px;font-weight:600;color:#18181b;">${escapeHtml(rec.title)}</div>
                    <div style="margin-top:4px;font-size:13px;line-height:1.5;color:#71717a;">${escapeHtml(rec.explanation)}</div>
                  </td>
                </tr>
              </table>
            </td></tr>`,
              )
              .join("")}
          </table>
        </td></tr>`
            : ""
        }

        <!-- Primary CTA — bulletproof button technique.
             Drives to the hosted report, which itself drives to a call.
             Two-step flow (email → report → call) outperforms email →
             direct purchase for B2B services at this price point. -->
        <tr><td style="padding:0 28px 20px;" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center" style="background:#18181b;border-radius:999px;">
              <a href="${escapeAttr(reportUrl)}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">
                Open the full report
              </a>
            </td></tr>
          </table>
          <div style="margin-top:10px;font-size:12px;color:#a1a1aa;">Charts, verbatim AI responses, citation breakdown, ranked fixes</div>
        </td></tr>

        <!-- Secondary CTA — book a call. This is where most B2B
             service conversions happen at this price point — the
             conversation, not a self-serve purchase. -->
        <tr><td style="padding:0 28px 24px;border-top:1px solid #e4e4e7;">
          <p style="margin:20px 0 12px;font-size:14px;line-height:1.6;color:#27272a;font-weight:600;">After you've read it — should we talk?</p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#52525b;">
            Most clients book a 15-minute call to walk through the report and pick the right next step. No pitch, no card. If that's useful, reply to this email or send a WhatsApp.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-right:8px;">
                <a href="mailto:${escapeAttr(site.contact.email)}?subject=${encodeURIComponent("Re: scan results for " + profile.businessName)}" style="display:inline-block;padding:10px 18px;font-size:13px;font-weight:600;color:#27272a;text-decoration:none;border:1px solid #d4d4d8;border-radius:999px;">
                  Reply to this email
                </a>
              </td>
              <td>
                <a href="https://wa.me/27760351084" style="display:inline-block;padding:10px 18px;font-size:13px;font-weight:600;color:#27272a;text-decoration:none;border:1px solid #d4d4d8;border-radius:999px;">
                  WhatsApp
                </a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 28px 24px;background:#fafafa;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td>
              <div style="font-size:13px;font-weight:600;color:#18181b;">Kabelo More</div>
              <div style="margin-top:2px;font-size:12px;color:#71717a;">AI Visibility Consultant · Pretoria</div>
              <div style="margin-top:2px;font-size:12px;color:#71717a;"><a href="${escapeAttr(site.url)}" style="color:#71717a;text-decoration:none;">${escapeHtml(site.url.replace(/^https?:\/\//, ""))}</a></div>
            </td></tr>
            <tr><td style="padding-top:12px;">
              <p style="margin:0;font-size:11px;line-height:1.5;color:#a1a1aa;">
                <strong style="color:#71717a;">How this scan works:</strong> we simulate AI-engine queries via Claude with live web search — a proxy for what ChatGPT, Gemini, and Perplexity surface from public web data. Native per-engine adapters land in Phase 1.5. Score is directional (re-runs may vary 5-10 pts).
              </p>
            </td></tr>
          </table>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

// ─── ADMIN completion email ───────────────────────────────────────
//
// Plain text — admin (Kabelo) doesn't need styling. They need:
//   - Score + classification at a glance
//   - Stage report (which scan stages ran successfully)
//   - Top issues + recommendations (so they can write the follow-up)
//   - Detected signals (raw)
//   - Visibility check details (verbatim what AI said)
//   - Competitors + citations
//   - Client contact info (for replies + outreach)

export function buildAdminCompletionEmail(input: {
  result: ScanResult;
  profile: BusinessProfile;
  stageReport?: ScanStageReportShape;
  clientEmailWillBeSent: boolean;
}): CompiledEmail {
  const { result, profile, stageReport, clientEmailWillBeSent } = input;

  const stages = stageReport;
  const stageEmoji = (s: string | undefined) =>
    s === "ok" ? "✅" : s === "partial" ? "⚠️" : s === "failed" ? "❌" : s === "skipped" ? "—" : "?";
  const hasFailures = stages
    ? Object.values(stages).some((s) => s === "failed" || s === "partial")
    : false;
  const confidenceTag = hasFailures
    ? `[LOW CONFIDENCE — manual verification recommended]`
    : `[high confidence]`;

  const subject = `Scan complete — ${profile.businessName} — ${result.score}/100 ${hasFailures ? "⚠️" : ""}`;

  const text = [
    `Scan complete for ${profile.businessName} ${confidenceTag}`,
    "─".repeat(60),
    ``,
    `Score:           ${result.score}/100`,
    `Classification:  ${result.classification}`,
    ``,
    `Client:          ${profile.contactName} <${profile.email}>`,
    `Business:        ${profile.businessName}`,
    `Industry:        ${profile.industry}`,
    `Location:        ${profile.city}, ${profile.country}`,
    `Website:         ${profile.website ?? "—"}`,
    `GBP:             ${profile.gbpUrl ?? "—"}`,
    `Phone:           ${profile.phone ?? "—"}`,
    ``,
    `─── Client email status ───`,
    clientEmailWillBeSent
      ? `✉️  Client completion email DISPATCHED to ${profile.email}`
      : `⚠️  Client email NOT yet sent — review first, then trigger from /admin/scans (Send email button)`,
    ``,
    `─── Stage report ───`,
    stages
      ? [
          `${stageEmoji(stages.discovery)}  Discovery (website + GBP):           ${stages.discovery}`,
          `${stageEmoji(stages.presenceCheck)}  Presence check (HEAD + schema):       ${stages.presenceCheck}`,
          `${stageEmoji(stages.gbpLookup)}  GBP lookup (Places API):              ${stages.gbpLookup}`,
          `${stageEmoji(stages.citationAnalysis)}  Citation analysis (multi-search):     ${stages.citationAnalysis}`,
          `${stageEmoji(stages.visibilitySimulation)}  Visibility simulation (AI queries):   ${stages.visibilitySimulation}`,
        ].join("\n")
      : `  (stage tracking unavailable)`,
    ``,
    `─── Score layers ───`,
    `  Presence:    ${result.layers.presence}/25`,
    `  Authority:   ${result.layers.authority}/40`,
    `  Consistency: ${result.layers.consistency}/20`,
    `  Content:     ${result.layers.content}/15`,
    ``,
    `─── Top issues ───`,
    ...result.issues
      .slice(0, 5)
      .map((i, idx) => `  ${idx + 1}. [${i.severity.toUpperCase()}] ${i.title}`),
    ``,
    `─── Top recommendations ───`,
    ...result.recommendations
      .slice(0, 5)
      .map((r) => `  ${r.rank}. ${r.title}`),
    ``,
    `─── Detected signals ───`,
    `Website reachable:           ${result.detected.websiteReachable ? "yes" : "no"}`,
    `Website schema (any):        ${result.detected.websiteHasSchema ? "yes" : "no"}`,
    `Website LocalBusiness schema: ${result.detected.websiteHasLocalBusinessSchema ? "yes" : "no"}`,
    `Website FAQ schema:           ${result.detected.websiteHasFAQSchema ? "yes" : "no"}`,
    `GBP found:                    ${result.detected.gbpFound ? "yes" : "no"}`,
    typeof result.detected.gbpCompleteness === "number"
      ? `GBP completeness:             ${result.detected.gbpCompleteness}%`
      : null,
    typeof result.detected.gbpRating === "number"
      ? `GBP rating:                   ${result.detected.gbpRating}/5`
      : null,
    typeof result.detected.gbpReviewCount === "number"
      ? `GBP review count:             ${result.detected.gbpReviewCount}`
      : null,
    result.detected.gbpPrimaryCategory
      ? `GBP primary category:         ${result.detected.gbpPrimaryCategory}`
      : null,
    typeof result.detected.gbpHasHours === "boolean"
      ? `GBP has hours:                ${result.detected.gbpHasHours ? "yes" : "no"}`
      : null,
    `Citation count:               ${result.detected.citationCount}`,
    `Citation level:               ${result.detected.citationLevel}`,
    `Citation sources:             ${result.detected.citationSources.slice(0, 8).join(", ") || "—"}`,
    `NAP consistent:               ${result.detected.napConsistent ? "yes" : "no"}`,
    ``,
    `─── Visibility queries ───`,
    ...result.visibilityChecks.map(
      (v) =>
        `  • "${v.query}" → ${v.businessAppears ? "✓ business cited" : "✗ NOT cited"}${v.intent ? ` (${v.intent})` : ""}`,
    ),
    ``,
    `─── Competitors AI surfaced ───`,
    ...result.competitors
      .slice(0, 8)
      .map((c) => `  • ${c.name}${c.context ? ` — ${c.context}` : ""}`),
    ``,
    `Diagnosis: ${result.diagnosisOneLiner}`,
    ``,
    `View full results page: ${site.url}/scan/${result.id}/results`,
    `Admin dashboard: ${site.url}/admin/scans`,
    ``,
    `Scan duration: ${(result.durationMs / 1000).toFixed(1)}s`,
    ``,
    hasFailures
      ? `⚠️  This scan had partial/failed stages — review the detected signals above before sending the client report.`
      : `✅  All scan stages ran successfully.`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  return {
    subject,
    html: `<pre style="font-family:Monaco,Menlo,Consolas,monospace;font-size:13px;white-space:pre-wrap;">${escapeHtml(text)}</pre>`,
    text,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

function severityBg(severity: string): string {
  switch (severity) {
    case "critical":
      return "#fee2e2";
    case "high":
      return "#fef3c7";
    case "medium":
      return "#fef9c3";
    default:
      return "#e4e4e7";
  }
}

function severityFg(severity: string): string {
  switch (severity) {
    case "critical":
      return "#b91c1c";
    case "high":
      return "#b45309";
    case "medium":
      return "#a16207";
    default:
      return "#52525b";
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
