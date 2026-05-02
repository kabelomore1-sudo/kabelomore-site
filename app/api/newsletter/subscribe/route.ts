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

    // 3. Welcome the subscriber
    try {
      await resend.emails.send({
        from: `Kabelo More <${fromEmail}>`,
        to: [email],
        subject: "Welcome to The AEO Letter",
        text: [
          "Hi,",
          "",
          "Thanks for subscribing to The AEO Letter.",
          "",
          "What you'll get:",
          "  · Weekly tactics drawn from real audits I'm running for medical, legal, and industrial firms",
          "  · One pattern, one fix, one quotable insight per email",
          "  · No fluff. No fake urgency. No 'we have a deal for you'",
          "",
          "First issue arrives Thursday.",
          "",
          "If you'd like a free AI Visibility Scan for your firm in the meantime, you can request one here:",
          `  ${site.url}/scan`,
          "",
          "— Kabelo",
          `  ${site.url}`,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[newsletter-subscribe] welcome-email failed", err);
    }
  }

  return NextResponse.json({ ok: true });
}
