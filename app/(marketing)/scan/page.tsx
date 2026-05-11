import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { ScanForm } from "@/components/scan-form";
import { TrustStrip } from "@/components/trust-strip";
import { AnnotatedScreenshot } from "@/components/annotated-screenshot";
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

      {/* Inside-the-report preview — annotated visual showing what's
          actually in the scan report BEFORE the prospect submits.
          Removes the "what am I actually getting" trust gap. Visual
          mockup with 4 numbered hotspots; click any hotspot to read
          what that section of the report shows. */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <Eyebrow className="justify-center">What you&apos;ll get</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
              Inside the scan report.
            </h2>
            <p className="mt-3 text-base text-ink-500">
              Tap the numbered markers to see exactly what each part of your
              personalised report shows.
            </p>
          </div>

          <AnnotatedScreenshot
            caption="Sample report preview · your real report uses YOUR business data"
            hotspots={[
              {
                x: 17,
                y: 22,
                title: "Your AI visibility score",
                description:
                  "A 0-100 directional readiness score. Tells you where you stand without false precision (re-runs may vary 5-10 pts).",
              },
              {
                x: 60,
                y: 22,
                title: "Type classification",
                description:
                  "Type A / B / C / D — describes whether you're invisible, partially visible, actively cited, or dominant. Each type maps to a recommended next step.",
              },
              {
                x: 17,
                y: 65,
                title: "Names that surfaced instead",
                description:
                  "The competitors AI recommended when your business wasn't in the answer. Verify these match your real competitive set — it's the most actionable part of the report.",
              },
              {
                x: 65,
                y: 65,
                title: "Top 3 highest-leverage fixes",
                description:
                  "Three prioritised recommendations ranked by impact ÷ effort. Each maps to a concrete action you can take — DIY or with us.",
              },
            ]}
          >
            <ScanReportMockup />
          </AnnotatedScreenshot>
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

// ─── ScanReportMockup ──────────────────────────────────────────────
// Static visual representation of what a scan report contains. Used
// inside AnnotatedScreenshot on the /scan page to show prospects what
// they'll receive without exposing real client data.
//
// Why not a real screenshot: real screenshots would either be of OMS
// (not yet delivered) or generic — both look worse than a clean
// CSS-rendered mockup. The mockup is also crisp at any size, prints
// well, and is trivially editable. Once we have 3+ real client
// reports we can swap this for a real screenshot.
//
// Layout maps to the AnnotatedScreenshot hotspot coordinates:
//   Hotspot 1 (17, 22) — Score gauge area (top-left)
//   Hotspot 2 (60, 22) — Type classification area (top-right)
//   Hotspot 3 (17, 65) — Competitor list area (bottom-left)
//   Hotspot 4 (65, 65) — Recommendations area (bottom-right)
function ScanReportMockup() {
  return (
    <div className="bg-ink-50/40 p-5 md:p-8">
      <div className="rounded-2xl border border-rule bg-white p-5 shadow-soft md:p-7">
        {/* Header — eyebrow + business name placeholder */}
        <div className="border-b border-rule pb-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-600">
            AI Visibility Report · Sample
          </div>
          <div className="mt-1 font-mono text-[11px] text-ink-400">
            scan_20260503_xxxxxxxxxx
          </div>
        </div>

        {/* Top row — score (left) + classification (right) */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {/* Score gauge mock */}
          <div className="rounded-xl border border-rule bg-ink-50/40 p-4 md:p-5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              Your score
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold tracking-tight text-amber-600 md:text-5xl">
                32
              </span>
              <span className="text-base text-ink-400">/100</span>
            </div>
            {/* Horizontal score bar */}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full w-[32%] bg-amber-500" />
            </div>
            <div className="mt-2 text-[10px] text-ink-500">
              Barely visible · directional readiness
            </div>
          </div>

          {/* Classification mock */}
          <div className="rounded-xl border border-rule bg-ink-50/40 p-4 md:p-5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              Classification
            </div>
            <div className="mt-2 text-lg font-semibold text-ink-900 md:text-xl">
              Type B
            </div>
            <div className="mt-0.5 text-xs font-medium text-ink-700">
              Partial Presence
            </div>
            <div className="mt-2 text-[10px] leading-relaxed text-ink-500">
              AI engines have some record of your business but you&apos;re rarely
              cited. Closeable gap.
            </div>
          </div>
        </div>

        {/* Bottom row — competitors (left) + fixes (right) */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {/* Competitor list mock */}
          <div className="rounded-xl border border-rule bg-ink-50/40 p-4 md:p-5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              Names that surfaced instead
            </div>
            <ul className="mt-3 space-y-1.5 text-[11px] text-ink-700">
              <li className="flex items-center gap-1.5">
                <span className="font-mono text-ink-400">1.</span>
                Integrate Lifting SA{" "}
                <span className="text-ink-400">· 32 citations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-mono text-ink-400">2.</span>
                Elephant Lifting Equip.{" "}
                <span className="text-ink-400">· 28 citations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-mono text-ink-400">3.</span>
                RGM Cranes{" "}
                <span className="text-ink-400">· 21 citations</span>
              </li>
            </ul>
          </div>

          {/* Top fixes mock */}
          <div className="rounded-xl border border-rule bg-ink-50/40 p-4 md:p-5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
              Top 3 fixes
            </div>
            <ul className="mt-3 space-y-1.5 text-[11px] text-ink-700">
              <li className="flex items-start gap-1.5">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[8px] font-bold text-white">
                  1
                </span>
                Deploy LocalBusiness + FAQ schema
              </li>
              <li className="flex items-start gap-1.5">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[8px] font-bold text-white">
                  2
                </span>
                Register with LME + industry directories
              </li>
              <li className="flex items-start gap-1.5">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[8px] font-bold text-white">
                  3
                </span>
                Active LinkedIn for founder
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
