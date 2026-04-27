import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const ScanRequestSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(200),
  city: z.string().min(1, "City is required").max(200),
  website: z.string().url().or(z.literal("")).optional(),
  industry: z.string().max(200).optional(),
  contactName: z.string().min(1, "Your name is required").max(200),
  email: z.string().email("Valid email is required"),
  services: z.string().max(2000).optional(),
  tier: z.string().max(40).optional(),
  // Honeypot — humans won't fill this; bots will
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

  const parsed = ScanRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid submission.",
      },
      { status: 400 },
    );
  }

  // Honeypot tripped — silently succeed (don't tell bots they're caught)
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const data = parsed.data;
  const submittedAt = new Date().toISOString();

  // Always log — Vercel surfaces these in the deployment logs
  console.log("[scan-request]", {
    submittedAt,
    business: data.businessName,
    city: data.city,
    website: data.website || "—",
    industry: data.industry || "—",
    contact: data.contactName,
    email: data.email,
    tier: data.tier || "free",
    services: data.services || "—",
  });

  // If RESEND_API_KEY is set, also email Kabelo directly
  const apiKey = process.env.RESEND_API_KEY;
  const inboxEmail = process.env.SCAN_INBOX_EMAIL ?? site.contact.email;
  const fromEmail = process.env.SCAN_FROM_EMAIL ?? "scan@kabelomore.com";

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: `Kabelomore Scans <${fromEmail}>`,
        to: [inboxEmail],
        replyTo: data.email,
        subject: `New AI Scan request — ${data.businessName}`,
        text: [
          "New free AI Visibility Scan request",
          "—".repeat(40),
          `Business: ${data.businessName}`,
          `Location: ${data.city}`,
          `Website:  ${data.website || "—"}`,
          `Industry: ${data.industry || "—"}`,
          "",
          `From:     ${data.contactName}`,
          `Email:    ${data.email}`,
          `Tier:     ${data.tier || "free"}`,
          "",
          "Services they want to be found for:",
          data.services || "—",
          "",
          `Submitted at ${submittedAt}`,
        ].join("\n"),
      });
    } catch (err) {
      // Don't fail the form submission if email sending fails — we already logged
      console.error("[scan-request] Resend failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
