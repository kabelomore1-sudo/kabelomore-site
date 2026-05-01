/**
 * Message templates — drip messages for email + WhatsApp.
 *
 * Templates are pure functions: ScanResult in, message out. No I/O.
 * The /api/cron/followup endpoint (or manual sending in v1) calls these
 * and dispatches via Resend (email) or Twilio (WhatsApp v3).
 *
 * v1 reality: Kabelo manually sends WhatsApp. Templates render the EXACT
 * text he can copy-paste into his phone. No friction.
 *
 * Drip sequence (per system spec):
 *
 *   Day 1 → score + key issue
 *   Day 2 → why citations matter
 *   Day 3 → who AI is recommending instead (the gut punch)
 *   Day 5 → custom service recommendation
 */

import type { ScanResult, FollowupTemplate } from "@/lib/types/scan";
import { site, whatsappLink } from "@/lib/site";
import { classificationLabel } from "./classification";

// ─── Render helpers ──────────────────────────────────────────────

function resultsUrl(result: ScanResult): string {
  return `${site.url}/scan/${result.id}/results`;
}

function whatsappTextWithScore(result: ScanResult): string {
  return `Hi Kabelo — I just got my AI Visibility scan. My score is ${result.score}/100. Want to talk about fixing it?`;
}

// ─── Email templates ─────────────────────────────────────────────

export type RenderedMessage = {
  subject: string;
  body: string;
};

export function renderEmail(
  template: FollowupTemplate,
  result: ScanResult,
): RenderedMessage {
  switch (template) {
    case "day-1-score":
      return renderDay1Email(result);
    case "day-2-citations":
      return renderDay2Email(result);
    case "day-3-competitors":
      return renderDay3Email(result);
    case "day-5-offer":
      return renderDay5Email(result);
  }
}

function renderDay1Email(r: ScanResult): RenderedMessage {
  const topIssue = r.issues[0];
  return {
    subject: `Your AI Visibility Scan: ${r.score}/100`,
    body: `Hi ${r.contactName},

Your free AI Visibility scan is complete.

  Score:           ${r.score}/100
  Classification:  ${classificationLabel(r.classification)}

The biggest issue we found:
${topIssue?.title ?? "Insufficient AEO infrastructure"}

${topIssue?.explanation ?? r.diagnosisOneLiner}

Read your full report:
${resultsUrl(r)}

Or talk to me on WhatsApp:
${whatsappLink(whatsappTextWithScore(r))}

— Kabelo
   ${site.url}
   ${site.contact.whatsappDisplay}`,
  };
}

function renderDay2Email(r: ScanResult): RenderedMessage {
  return {
    subject: `Why your competitors are getting cited and you aren't`,
    body: `Hi ${r.contactName},

Yesterday you got your AI Visibility score (${r.score}/100). Today, the
single biggest reason your business isn't being recommended by ChatGPT
and Claude isn't your website. It's citations.

What is a citation? A mention of your business on a third-party website
with consistent name, address, phone. Brabys, Cylex, Hellopeter, industry
directories. They're how AI engines verify you exist and are real.

Right now, our scan found you have ${r.detected.citationCount} citation${r.detected.citationCount === 1 ? "" : "s"}.

For comparison: businesses that get consistently recommended by AI in
your category typically have 25-50 citations. The gap isn't subtle.

This is the single highest-leverage fix. We can build the foundational
10+ citations for you in 2-3 weeks as part of the Optimization Pack.

Reply or click WhatsApp to talk:
${whatsappLink("Hi Kabelo — I want to fix my citations.")}

— Kabelo`,
  };
}

function renderDay3Email(r: ScanResult): RenderedMessage {
  const firstQuery = r.visibilityChecks[0];
  const competitorsList = r.competitors
    .slice(0, 5)
    .map((c, i) => `  ${i + 1}. ${c.name}`)
    .join("\n");

  return {
    subject: `Here's exactly who AI is recommending instead of you`,
    body: `Hi ${r.contactName},

When we tested "${firstQuery?.query ?? "your category"}" across AI engines:

AI engines recommended:
${competitorsList || "  (No specific competitors named — entire category showed weak data)"}

Your business: not mentioned.

Verbatim of what AI said about your category (without you):

  "${firstQuery?.verbatimExcerpt ?? "(no specific excerpt captured)"}"

That's revenue going to your competitors. Every day.

The fix isn't expensive and it's structured. Want to talk about it?

WhatsApp: ${whatsappLink("Hi Kabelo — saw the day-3 email. Let's talk about the fix.")}

— Kabelo`,
  };
}

function renderDay5Email(r: ScanResult): RenderedMessage {
  const topRec = r.recommendations[0];
  return {
    subject: `Last note from me — recommendation based on your score`,
    body: `Hi ${r.contactName},

Based on your scan (${r.score}/100, ${classificationLabel(r.classification)}),
here's what I'd recommend:

${topRec?.title ?? "A custom AEO engagement"}

${topRec?.explanation ?? "Let's discuss what fits your situation."}

If that fits your situation, the next step is a 20-min call to confirm
scope. No pressure if not.

WhatsApp: ${whatsappLink(`Hi Kabelo — I want to talk about the ${topRec?.mapsToTier ?? "AEO"} option from the day-5 email.`)}

If now's not the right time, no problem. The scan is yours forever and
I'm here whenever you're ready.

— Kabelo`,
  };
}

// ─── WhatsApp templates ──────────────────────────────────────────
// WhatsApp messages are SHORTER than email. Single message ≤ 600 chars
// works best (renders without "see more" truncation in chat).

export function renderWhatsapp(
  template: FollowupTemplate,
  result: ScanResult,
): string {
  switch (template) {
    case "day-1-score": {
      const topIssue = result.issues[0];
      return `Hi ${result.contactName} — your AI Visibility scan is in.

Score: ${result.score}/100
Issue #1: ${topIssue?.title ?? "Insufficient AEO infrastructure"}

Full report: ${resultsUrl(result)}

Want to discuss? Just reply.
— Kabelo`;
    }

    case "day-2-citations":
      return `${result.contactName} — quick follow-up on yesterday's scan.

Your biggest issue is third-party citations: you have ${result.detected.citationCount}, businesses being cited by AI typically have 25-50.

This is the single highest-leverage fix. We can do 10+ in 2-3 weeks.

Want to discuss? — Kabelo`;

    case "day-3-competitors": {
      const top3 = result.competitors
        .slice(0, 3)
        .map((c) => c.name)
        .join(", ");
      return `${result.contactName} — when AI is asked about your category, it's recommending:

${top3 || "(other businesses in your space)"}

Not you. Every day this gap costs revenue.

The fix is 3 weeks of structured work. R10,500 standard or founder pricing if you're open to a case study.

Reply if interested. — Kabelo`;
    }

    case "day-5-offer": {
      const topRec = result.recommendations[0];
      return `${result.contactName} — last quick note.

Based on your ${result.score}/100 scan, my recommendation:

${topRec?.title ?? "Custom AEO engagement"}

20-min call to confirm scope, no pressure. Want to book one?

— Kabelo`;
    }
  }
}

// ─── Drip schedule (Day-1, Day-2, Day-3, Day-5 from scan time) ───

export function generateFollowupSchedule(scanCompletedAt: string): {
  template: FollowupTemplate;
  scheduledFor: string;
}[] {
  const baseTime = new Date(scanCompletedAt).getTime();
  const day = (n: number) => new Date(baseTime + n * 86400 * 1000).toISOString();

  return [
    { template: "day-1-score", scheduledFor: day(0) }, // immediate
    { template: "day-2-citations", scheduledFor: day(2) },
    { template: "day-3-competitors", scheduledFor: day(3) },
    { template: "day-5-offer", scheduledFor: day(5) },
  ];
}
