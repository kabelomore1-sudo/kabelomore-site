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
    a: "We use it only to deliver your scan. We don't sell, share, or add you to any mailing lists without your explicit consent.",
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
            Find out if AI engines
            <br />
            <span className="text-ink-500">recommend your business.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Submit your business details. We run customer-style queries via
            Claude with live web search (a proxy for ChatGPT, Gemini, and
            Perplexity) and deliver a personalised report in 24 hours. Free.
            No follow-up unless you want one.
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

      {/* What's in your report — static, mobile-safe card.
          REPLACED the AnnotatedScreenshot overlay (numbered hotspots
          absolutely-positioned by % over a responsive CSS mockup).
          That approach broke below the md breakpoint: the mockup's
          2-col grids collapsed to 1-col, the container reflowed, and
          the hardcoded % coords landed on the wrong elements — markers
          overlaying the score, floating beside it, sitting on the
          competitor list. Conversion page; a broken overlay is worse
          than a clean list. This card conveys the same four points
          with zero coordinate math and no absolute positioning. */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <Eyebrow className="justify-center">What you&apos;ll get</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
              Inside the scan report.
            </h2>
            <p className="mt-3 text-base text-ink-500">
              Four things, delivered as a hosted report within 24 hours.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                n: "1",
                title: "Your AI visibility score",
                body: "A 0-100 directional readiness score. Where you stand without false precision — re-runs may vary 5-10 pts.",
              },
              {
                n: "2",
                title: "Type classification",
                body: "Type A / B / C / D — invisible, partially visible, actively cited, or dominant. Each maps to a recommended next step.",
              },
              {
                n: "3",
                title: "Names that surfaced instead",
                body: "The businesses AI cited when yours wasn't in the answer. The most actionable part — verify these match your real competitive set.",
              },
              {
                n: "4",
                title: "Top 3 highest-leverage fixes",
                body: "Three prioritised recommendations ranked by impact ÷ effort. Concrete actions — DIY or with us.",
              },
            ].map((item) => (
              <div
                key={item.n}
                className="rounded-2xl border border-rule bg-white p-5 shadow-soft md:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
                    {item.n}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-ink-400">
            Sample structure · your real report uses YOUR business data
          </p>
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

      {/* What you get */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Inside your scan</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            What's actually in the report.
          </h2>

          <div className="mt-10 grid gap-4">
            {[
              {
                h: "What an AI proxy returns",
                p: "Verbatim text from Claude with live web search — a stand-in for what ChatGPT, Gemini, and Perplexity blend from public web data. Native per-engine adapters land Phase 1.5.",
              },
              {
                h: "Across 4 buyer-intent queries",
                p: "We run 4 distinct query shapes (best, top, problem-form, brand) so the result distinguishes 'no AI footprint at all' from 'no footprint for this query'.",
              },
              {
                h: "Who surfaced instead of you",
                p: "Names of the businesses our test answers cited when yours wasn't there. Verify they're your actual competitors — search sometimes surfaces adjacent firms.",
              },
              {
                h: "Top 3 fixes",
                p: "Three concrete, prioritised recommendations. The ones that move the needle most for least effort — based on what we observed.",
              },
            ].map((item) => (
              <div
                key={item.h}
                className="rounded-2xl border border-rule bg-white p-6"
              >
                <div className="font-semibold text-ink-900">{item.h}</div>
                <div className="mt-2 text-sm text-ink-500 leading-relaxed">
                  {item.p}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

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
