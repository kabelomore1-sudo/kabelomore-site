/**
 * Newsletter Subscribe Route
 *
 * Captures email subscriptions for "The AEO Letter."
 *
 * MVP behaviour:
 *  1. Validate email + capture source (where on the site they signed up)
 *  2. Log to Vercel deployment logs (always — visible to Kabelo)
 *  3. If RESEND_API_KEY present: send Kabelo a notification email
 *     AND send the subscriber a welcome email confirming subscription
 *  4. Return ok:true
 *
 * Future upgrade path:
 *  - Wire to a Resend Audience (resend.audiences.create / contacts.create)
 *    so subscribers land in a managed list automatically
 *  - Add double opt-in flow if regulatory pressure increases
 *  - Fire a webhook to ConvertKit / Beehiiv / similar if Kabelo migrates off
 *    Resend for newsletter delivery
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const SubscribeSchema = z.object({
  email: z.string().email("Valid email is required"),
  // 'source' tells us where they subscribed from (footer, scan-page, etc.)
  source: z.string().max(40).optional(),
  // Honeypot — humans won't fill this; bots will
  company: z.string().max(0).optional(),
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

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid submission.",
      },
      { status: 400 },
    );
  }

  // Honeypot tripped — silently succeed
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { email, source = "unknown" } = parsed.data;
  const subscribedAt = new Date().toISOString();

  console.log("[newsletter-subscribe]", {
    subscribedAt,
    email,
    source,
  });

  // Audience management + emails — only if Resend is configured
  const apiKey = process.env.RESEND_API_KEY;
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "newsletter@kabelomore.com";
  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;

  if (apiKey) {
    const resend = new Resend(apiKey);

    // 1. Add to Resend Audience (if configured) — non-blocking
    if (audienceId) {
      try {
        await resend.contacts.create({
          email,
          audienceId,
          unsubscribed: false,
        });
      } catch (err) {
        // Don't fail the request if audience add fails — they're still
        // logged + the notification email still goes to Kabelo
        console.error("[newsletter-subscribe] audience add failed", err);
      }
    }

    // 2. Notify Kabelo
    try {
      await resend.emails.send({
        from: `The AEO Letter <${fromEmail}>`,
        to: [inboxEmail],
        replyTo: email,
        subject: `New AEO Letter subscriber — ${email}`,
        text: [
          "New newsletter subscriber",
          "—".repeat(40),
          `Email:  ${email}`,
          `Source: ${source}`,
          `Time:   ${subscribedAt}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[newsletter-subscribe] notify-kabelo failed", err);
    }

    // 3. Welcome the subscriber — enriched welcome that delivers value
    //    immediately. Source-aware: if they came from a sector resource
    //    page, link them straight back to that checklist.
    const sectorLinkLine = (() => {
      if (source.includes("medical"))
        return `  Direct link back to your checklist:\n  ${site.url}/resources/medical`;
      if (source.includes("legal"))
        return `  Direct link back to your checklist:\n  ${site.url}/resources/legal`;
      if (source.includes("industrial"))
        return `  Direct link back to your checklist:\n  ${site.url}/resources/industrial`;
      return `  All three sector checklists (Medical, Legal, Industrial):\n  ${site.url}/resources`;
    })();

    try {
      await resend.emails.send({
        from: `Kabelo More <${fromEmail}>`,
        to: [email],
        subject: "Welcome to The AEO Letter — and The Real Estate Method",
        text: [
          "Hi,",
          "",
          "Thanks for subscribing. Quick framing on what you've signed up for:",
          "",
          "EVERY ISSUE delivers one of three things:",
          "  1. A pattern from a real audit I just ran (anonymised)",
          "  2. A specific fix that moves AI engines (with the exact step)",
          "  3. A quotable insight you can share with colleagues",
          "",
          "ALWAYS Thursday morning, SA time. Always one email. Never a 'limited offer.'",
          "",
          "WHAT TO READ NOW:",
          "",
          "  The Real Estate Method — the 7-property framework I run for every",
          "  client. The full methodology lives at kabelomore.com/about and the",
          "  47-point sector checklists live at kabelomore.com/resources.",
          "",
          sectorLinkLine,
          "",
          "WHAT'S NEXT:",
          "",
          "  Issue 1 arrives next Thursday. It walks through one industrial",
          "  audit I ran last week — the firm went from 0 AI citations to 4 in",
          "  21 days by fixing one schema property. The exact steps will be",
          "  in the email.",
          "",
          "WANT A FREE SCAN BEFORE THAT?",
          "",
          `  Request one at ${site.url}/scan — 24-hour turnaround, PDF report,`,
          "  no card. I run 2-4 of these a week and write up patterns from each.",
          "",
          "If The Real Estate Method isn't relevant to your firm right now,",
          "unsubscribe in one click — no hard feelings, no retention dance.",
          "",
          "— Kabelo More",
          "  AI Visibility Consultant · Pretoria",
          `  ${site.url}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[newsletter-subscribe] welcome-email failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
