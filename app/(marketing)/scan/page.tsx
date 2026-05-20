import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { ScanForm } from "@/components/scan-form";
import { TrustStrip } from "@/components/trust-strip";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free AI Visibility Scan",
  description:
    "Find out what an AI proxy (Claude + live web search, standing in for ChatGPT, Gemini, and Perplexity) returns when your customers search for businesses like yours. Free, no obligation, 24-hour turnaround.",
  alternates: { canonical: `${site.url}/scan` },
};

const scanFaqs = [
  {
    q: "What do I get from the free scan?",
    a: "A personalised written report — delivered as a hosted web link plus summary email (PDF available on request) — showing what an AI proxy returns when customers search for businesses like yours. Includes verbatim responses, names that surfaced instead of you, and the 3 highest-leverage fixes. Methodology: we currently use Claude with live web search as a proxy for ChatGPT, Gemini, and Perplexity (native engine adapters land Phase 1.5).",
  },
  {
    q: "What does it cost?",
    a: "Nothing. The scan is genuinely free and there's no follow-up call unless you request one. We use scans to build case study volume and demonstrate the methodology before any paid engagement.",
  },
  {
    q: "How long does it take?",
    a: "24 hours from submission. We run scans manually so each report is reviewed before it goes out.",
  },
  {
    q: "What happens to my information?",
    a: "We use it only to deliver your scan. We don't sell, share, or add you to any mailing lists without your explicit consent. Scan submissions are auto-deleted after 30 days. Full disclosure of every processor we use (Anthropic, Resend, Vercel, Microsoft Clarity, Google Analytics) is in our Privacy Notice at /privacy.",
  },
];

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Free AI Scan", href: "/scan" },
          ]),
          faqJsonLd(scanFaqs),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Free · No obligation · 24h turnaround</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            See what AI says about
            <br />
            <span className="text-ink-500">your business.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Free report in 24 hours. No card. No follow-up unless you ask.
          </p>
        </div>
      </Section>

      {/* Trust strip — placed between the hero promise and the form so
          social proof lands at the decision point (where the visitor
          is about to hand over data). Adds named first case (OMS),
          method coverage, delivery promise, and the "no card" reassurance. */}
      <Section variant="default" padding="default" containerSize="narrow">
        <TrustStrip />
      </Section>

      {/* Show, don't tell. People are lazy to read — so instead of
          describing the report in text cards, render a visual at-a-
          glance preview (pure flow layout: score number + bar +
          classification chip + competitor list — exactly what the real
          report opens with) and drive to the full LIVE sample at
          /scan/preview. No absolute positioning, no overlay, no
          coordinate math (that was the bug we removed). The live
          sample IS the screenshot — always current, never stale. */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <Eyebrow className="justify-center">What you&apos;ll get</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
              A report that looks like this.
            </h2>
          </div>

          {/* At-a-glance visual preview — flow layout only */}
          <div className="overflow-hidden rounded-3xl border border-rule bg-white shadow-card">
            <div className="border-b border-rule bg-ink-50/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
              Sample report · live preview
            </div>
            <div className="space-y-5 p-6 md:p-8">
              {/* Score row */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight text-amber-600 md:text-6xl">
                    32
                  </span>
                  <span className="text-lg text-ink-400">/100</span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full w-[32%] rounded-full bg-amber-500" />
                </div>
                <div className="mt-2 text-sm text-ink-500">
                  Barely visible · directional readiness
                </div>
              </div>

              {/* Classification chip */}
              <div className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white">
                Type B — Partial Presence
              </div>

              {/* Competitor list */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  Names that surfaced instead of you
                </div>
                <ul className="mt-2.5 space-y-1.5 text-sm text-ink-700">
                  <li className="flex items-baseline gap-2">
                    <span className="font-mono text-ink-400">1.</span>
                    Integrate Lifting SA{" "}
                    <span className="text-ink-400">· 32 citations</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="font-mono text-ink-400">2.</span>
                    Elephant Lifting Equip.{" "}
                    <span className="text-ink-400">· 28 citations</span>
                  </li>
                  <li className="flex items-baseline gap-2">
                    <span className="font-mono text-ink-400">3.</span>
                    RGM Cranes{" "}
                    <span className="text-ink-400">· 21 citations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Drive to the real live sample */}
          <div className="mt-5 text-center">
            <a
              href="/scan/preview"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-6 text-sm font-semibold text-ink-900 transition-all hover:bg-ink-50"
            >
              See the full live sample report
              <span aria-hidden="true">→</span>
            </a>
            <p className="mt-3 text-xs text-ink-400">
              Sample data · your report uses YOUR business
            </p>
          </div>
        </div>
      </Section>

      {/* Form */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="rounded-3xl border border-rule bg-white p-8 shadow-soft md:p-12">
          <ScanForm defaultTier={params.tier} />
        </div>

        <p className="mt-6 text-center text-sm text-ink-400">
          Prefer email? Send your details directly to{" "}
          <a
            href={`mailto:${site.contact.email}?subject=Free%20AI%20Visibility%20Scan%20Request`}
            className="text-accent-600 hover:text-accent-700"
          >
            {site.contact.email}
          </a>
        </p>
        <p className="mt-2 text-center text-sm text-ink-400">
          Or{" "}
          <a
            href={`https://wa.me/${site.contact.whatsappE164}?text=${encodeURIComponent("Hi Kabelo — I want a free AI Visibility scan for my business.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-600 hover:text-accent-700"
          >
            WhatsApp Kabelo directly
          </a>{" "}
          ({site.contact.whatsappDisplay})
        </p>
      </Section>

      {/* DELETED the redundant "Inside your scan / What's actually in
          the report" 4-card section. It explained the report contents
          a SECOND time (the visual preview above + the FAQ already
          cover this). Two text-card sections saying the same thing was
          the wall-of-text problem. The methodology nuance (proxy, 4
          query shapes) lives in the FAQ where someone who actually
          wants it can find it — not forced on every visitor. */}

      {/* FAQ */}
      <Section variant="default" padding="default" containerSize="narrow">
        <Eyebrow>Common questions</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Before you submit.
        </h2>

        <div className="mt-10 space-y-3">
          {scanFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-rule bg-white p-6 transition-shadow open:shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink-900">
                {faq.q}
                <span className="mt-1 flex-shrink-0 text-accent-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-base text-ink-700 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
