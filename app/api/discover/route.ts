/**
 * Discovery Intake Submission Handler
 *
 * Receives the multi-step Discovery Form submission. Validates, logs,
 * sends Kabelo the full responses for action, sends the user a copy
 * of their answers + next steps, optionally adds to Resend audience.
 *
 * Storage strategy:
 *   - MVP: log to Vercel deployment logs (Kabelo can copy into Notion CRM)
 *   - Future: store in @vercel/kv for in-app dashboard access
 *
 * The full audit work happens manually after this submission — Kabelo
 * uses the answers to inform the AUDIT-PLAYBOOK Stage 1 (pre-audit
 * intake) and skip several minutes of prospect research.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { discoveryQuestions } from "@/lib/discovery-questions";

export const runtime = "nodejs";

const SubmissionSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  sector: z.string().nullable(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = SubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid submission.",
      },
      { status: 400 },
    );
  }

  const { answers } = parsed.data;
  const submittedAt = new Date().toISOString();

  // Extract identification fields for logging convenience
  const businessName = (answers.businessName as string) ?? "Unknown";
  const email = (answers.email as string) ?? "";
  const contactName = (answers.contactName as string) ?? "Unknown";
  const sector = (answers.sector as string) ?? "unknown";

  // Email validation — required field but double-check
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "Valid email is required." },
      { status: 400 },
    );
  }

  // Always log — Kabelo sees these in Vercel deployment logs
  console.log("[discovery-submission]", {
    submittedAt,
    businessName,
    contactName,
    email,
    sector,
    answerCount: Object.keys(answers).length,
  });

  // Build a human-readable summary for both emails
  const summaryLines: string[] = [];
  for (const q of discoveryQuestions) {
    const value = answers[q.id];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === "string" && value.trim().length === 0) continue;

    const formatted = Array.isArray(value)
      ? value.filter(Boolean).join(", ")
      : value;
    summaryLines.push(`Q: ${q.question}`);
    summaryLines.push(`A: ${formatted}`);
    summaryLines.push("");
  }
  const fullSummary = summaryLines.join("\n");

  // Email Kabelo + send user a copy — only if Resend is configured
  const apiKey = process.env.RESEND_API_KEY;
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "discovery@kabelomore.com";

  if (apiKey) {
    const resend = new Resend(apiKey);

    // 1. Notify Kabelo with full responses
    try {
      await resend.emails.send({
        from: `Kabelomore Discovery <${fromEmail}>`,
        to: [inboxEmail],
        replyTo: email,
        subject: `New Discovery — ${businessName} (${sector})`,
        text: [
          "New Real Estate Discovery submission",
          "—".repeat(50),
          `Business: ${businessName}`,
          `Contact:  ${contactName}`,
          `Email:    ${email}`,
          `Sector:   ${sector}`,
          `Time:     ${submittedAt}`,
          "—".repeat(50),
          "",
          "FULL RESPONSES:",
          "",
          fullSummary,
          "—".repeat(50),
          "",
          "NEXT STEPS:",
          "  1. Run the automated AI scan against businessName + websiteUrl",
          "  2. Cross-reference answers with AUDIT-PLAYBOOK.md Stage 1-3",
          "  3. Draft personalised summary",
          "  4. Reply within 24h with the report",
          "",
          `View their site: ${(answers.websiteUrl as string) ?? "(none provided)"}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[discovery-submission] notify-kabelo failed", err);
    }

    // 2. Send user a copy of their answers + next steps
    try {
      await resend.emails.send({
        from: `Kabelo More <${fromEmail}>`,
        to: [email],
        subject: "Your Real Estate Discovery — confirmed",
        text: [
          `Hi ${contactName.split(" ")[0] ?? "there"},`,
          "",
          "Thanks for completing The Real Estate Discovery for " +
            businessName +
            ".",
          "",
          "WHAT HAPPENS NEXT:",
          "",
          "  Within 24 hours, you'll receive your personalised AEO Discovery",
          "  summary covering:",
          "    · How AI engines respond when your customers search your services",
          "    · Where your gaps are vs the competitors you named",
          "    · The single highest-leverage fix for your firm right now",
          "    · A recommended tier (or honest no-pressure assessment if",
          "      we're not the right fit for you yet)",
          "",
          "FOR YOUR RECORDS — your submitted answers:",
          "",
          fullSummary,
          "",
          "If anything's wrong or you want to add context, just reply to this",
          "email or WhatsApp +27 76 035 1084.",
          "",
          "WANT TO READ AHEAD?",
          "",
          "While we prepare your report, the public methodology + sector",
          "checklists are at:",
          `  ${site.url}/about (The Real Estate Method)`,
          `  ${site.url}/resources (47-point sector checklists)`,
          "",
          "— Kabelo More",
          "  AI Visibility Consultant · Pretoria",
          `  ${site.url}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[discovery-submission] user-copy-email failed", err);
    }

    // 3. Add to Resend audience tagged 'discovery-completed' (if configured)
    const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;
    if (audienceId) {
      try {
        await resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
        });
      } catch (err) {
        console.error("[discovery-submission] audience add failed", err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
