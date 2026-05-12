import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

/**
 * Pricing page — rebuilt around 3 tiers + 1 Foundation Pack.
 *
 * Replaces the previous 11-package + 9-add-on layout that caused
 * decision paralysis. Decision rule for this page: if a SA business
 * owner can't pick a tier within 10 seconds of landing here, the
 * page has failed. Three cards. One highlighted. Done.
 *
 * Stripe-ready: every CTA button carries data-tier, data-setup-price,
 * data-monthly-price, and data-currency attributes. When Stripe
 * Checkout is wired up later (next sprint), these attributes map to
 * Price IDs. For now all CTAs route to /scan because every paid path
 * starts with a free scan.
 *
 * NOT YET CONSISTENT WITH (separate cleanup sprint):
 *   - /services (still uses Starter / Growth / Premium naming)
 *   - lib/public-packages.ts (Starter/Growth/Premium copy)
 *   - lib/site.ts internal tier registry
 *   - Recommendation engine in scan results
 *   - conversion-block + /brief/[tier] routes
 */

export const metadata: Metadata = {
  title: "Pricing — Fix your AI visibility. Get recommended.",
  description:
    "Three plans built around your AI visibility score: Fix It (R7,500 once-off), Grow It (setup + R2,950/mo), Own It (setup + R5,500/mo). Foundation Pack for businesses without a website yet.",
  alternates: { canonical: `${site.url}/pricing` },
};

const pricingFaqs = [
  {
    q: "What's included in the R7,500 setup?",
    a: "Everything to build your AEO foundation: 30 directory citations, full schema markup deployment (LocalBusiness + FAQ + Service), Google Business Profile optimisation, NAP consistency audit, 12 FAQs written and published with schema, review acquisition system, and a 60-day AI re-scan to measure the improvement.",
  },
  {
    q: "Can I start with Fix It and upgrade later?",
    a: "Yes. Fix It builds the foundation. You can add Grow It monthly at any time to keep building momentum without rebuilding the foundation.",
  },
  {
    q: "What happens after the 3-month minimum?",
    a: "You continue month-to-month or cancel anytime. No lock-in after the minimum. Most clients stay on Grow It for 6-12 months because AEO compounds — citation density builds quarter by quarter.",
  },
  {
    q: "How quickly will I see results?",
    a: "Citations go live within 1-2 weeks. GBP changes take effect within days. Schema markup is parsed by AI engines on their next crawl (typically 7-14 days). Your 60-day re-scan measures the full impact and is included in every tier.",
  },
  {
    q: "What if I don't have a website?",
    a: "Start with the Foundation Pack (R12,500 once-off). We build your website, set up your GBP, and deploy schema. Then add any tier above to drive AI visibility on top of the new foundation.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Setup costs: 50% to start, 50% on delivery. Monthly tiers are billed monthly in advance, 3-month minimum. All payments via card or EFT in South African Rand. International clients can pay in USD or GBP at the displayed equivalent.",
  },
];

// ─── Tier data — single source of truth for the page ──────────────
const tiers = [
  {
    id: "fix-it" as const,
    name: "Fix It",
    tagline: "Once-off cleanup. Quick wins from your current foundation.",
    setupPrice: 7500,
    monthlyPrice: 0,
    priceDisplay: "R7,500",
    priceSubtitle: "Once-off · 50% deposit / 50% on delivery",
    intlPrice: "$495 · £395",
    forWho:
      "Businesses with a website scoring below 50 on their AI scan. You have the basics; the AEO layer is missing.",
    delivery: "4 weeks from kickoff",
    scoreTarget: "20-40 → 60-75",
    scoreColor: "#84cc16",
    includes: [
      "30 directory citations built (general + industry-specific)",
      "NAP consistency audit and correction across the web",
      "LocalBusiness + FAQ schema deployed on your website",
      "12 FAQs written and published with schema markup",
      "Google Business Profile fully optimised",
      "Review acquisition system set up (templates + link + QR code)",
      "60-day AI visibility re-scan with before/after report",
    ],
    cta: "Get started",
    ctaStyle: "outline" as const,
    highlight: false,
  },
  {
    id: "grow-it" as const,
    name: "Grow It",
    tagline: "Compound your visibility every month. Where most clients land.",
    setupPrice: 7500,
    monthlyPrice: 2950,
    priceDisplay: "R7,500 + R2,950",
    priceSubtitle: "Setup + monthly · 3-month minimum",
    intlPrice: "$195 · £155 / month",
    forWho:
      "Businesses that want ongoing growth, not just a one-time fix. AI visibility compounds — six months of consistent work doubles or triples cited rate.",
    delivery: "Month 1: implementation. Months 2+: compounding growth.",
    scoreTarget: "20-40 → 75-85 and climbing",
    scoreColor: "#22c55e",
    includes: [
      "Everything in Fix It",
      "4 Google Business Posts per week",
      "2 answer-shaped blog posts per month",
      "Monthly review acquisition campaigns",
      "AI visibility tracking — your score + top 3 competitors",
      "Competitor monitoring — see when they gain or lose visibility",
      "Quarterly re-scan with before/after impact report",
    ],
    cta: "Start growing",
    ctaStyle: "primary" as const,
    highlight: true,
  },
  {
    id: "own-it" as const,
    name: "Own It",
    tagline: "Be the recommendation in your category.",
    setupPrice: 7500,
    monthlyPrice: 5500,
    priceDisplay: "R7,500 + R5,500",
    priceSubtitle: "Setup + monthly · 3-month minimum",
    intlPrice: "$365 · £285 / month",
    forWho:
      "Businesses that want to BE the recommendation in their category. Mid-market firms, multi-region operations, or anyone making AI visibility their primary growth channel.",
    delivery: "Month 1: implementation. Months 2+: category dominance work.",
    scoreTarget: "85+ — category dominance",
    scoreColor: "#16a34a",
    includes: [
      "Everything in Grow It",
      "60+ citations (general + industry + hyper-local)",
      "2 long-form authority articles per month",
      "Authority listicle placement (industry benchmarking)",
      "LinkedIn company page — 3 posts per week",
      "Founder/principal LinkedIn — 1 ghost-written post per week",
      "Active digital PR outreach — 1-2 placements per month target",
      "Monthly strategy call (30 min)",
      "30-day and 90-day re-scans with documented before/after",
    ],
    cta: "Dominate your category",
    ctaStyle: "outline" as const,
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Pricing", href: "/pricing" },
          ]),
          faqJsonLd(pricingFaqs),
        ]}
      />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Pricing</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            See your score.
            <br />
            <span className="text-ink-500">Pick your fix. Get recommended.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500 leading-relaxed">
            Every plan starts with a free AI visibility scan.
            <br className="hidden md:block" />
            We fix exactly what it finds.
          </p>
        </div>
      </Section>

      {/* ─── FREE SCAN BANNER ──────────────────────────────── */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-rule bg-white p-6 shadow-soft md:flex-row md:p-8">
            <div className="flex-1 text-center md:text-left">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                Start here
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">
                Get your free AI visibility scan first
              </h2>
              <p className="mt-2 text-sm text-ink-500 md:text-base">
                We test how 4 AI engines respond when your customers ask. Free.
                No card. Report in 24 hours.
              </p>
            </div>
            <a
              href="/scan"
              data-tier="scan"
              data-setup-price="0"
              data-monthly-price="0"
              data-currency="ZAR"
              className="inline-flex h-12 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-ink-900 px-7 text-base font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card"
            >
              Get your free scan
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>

      {/* ─── THREE TIER CARDS ──────────────────────────────── */}
      <Section variant="default" padding="lg" id="tiers">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Three plans</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Pick the level of work your score needs.
          </h2>
          <p className="mt-4 text-base text-ink-500">
            Each plan starts with the same R7,500 foundation setup. Monthly
            tiers add compounding growth on top.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </Section>

      {/* ─── SCORE TARGET VISUAL ───────────────────────────── */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Eyebrow className="justify-center">Score-to-tier map</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
              Where each tier takes you.
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Same 0-100 score scale you saw in your scan. Pick the tier that
              lifts you to the range you want to live in.
            </p>
          </div>

          <ScoreTargetBar />
        </div>
      </Section>

      {/* ─── FOUNDATION PACK CARD ──────────────────────────── */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-rule bg-ink-50/40 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[250px]">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Need a website first?
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-900">
                  Foundation Pack —{" "}
                  <span className="font-bold">R12,500</span>
                  <span className="text-base font-normal text-ink-500"> once-off</span>
                </h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                  Full website build + Google Business Profile setup + schema
                  + admin panel. After Foundation, add any tier above to drive
                  AI visibility on the new site.
                </p>
              </div>
              <a
                href="/foundation"
                data-tier="foundation"
                data-setup-price="12500"
                data-monthly-price="0"
                data-currency="ZAR"
                className="inline-flex h-11 flex-shrink-0 items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-5 text-sm font-semibold text-ink-900 transition-all hover:bg-ink-50"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── NEED MORE? Enterprise hint ─────────────────────── */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-ink-500">
            Enterprises, multi-location businesses, international firms —{" "}
            <Link
              href="/contact"
              className="font-semibold text-accent-600 underline-offset-2 hover:underline"
            >
              let&apos;s talk →
            </Link>
          </p>
        </div>
      </Section>

      {/* ─── TRUST SIGNALS ────────────────────────────────── */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              Credentials
            </div>
          </div>
          <div className="mt-5 grid gap-4 text-center text-sm sm:grid-cols-3">
            <div className="rounded-xl border border-rule bg-white p-4 shadow-soft">
              <div className="font-semibold text-ink-900">Google Digital Marketing</div>
              <div className="mt-0.5 text-xs text-ink-500">Certified · 2024</div>
            </div>
            <div className="rounded-xl border border-rule bg-white p-4 shadow-soft">
              <div className="font-semibold text-ink-900">Anthropic Claude 101</div>
              <div className="mt-0.5 text-xs text-ink-500">Certified · May 2026</div>
            </div>
            <div className="rounded-xl border border-rule bg-white p-4 shadow-soft">
              <div className="font-semibold text-ink-900">HubSpot Marketing AI</div>
              <div className="mt-0.5 text-xs text-ink-500">In progress</div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink-400">
            8 years of local SEO experience · Pretoria, South Africa · Serving
            SA · UK · US
          </p>
        </div>
      </Section>

      {/* ─── PRICING FAQ ─────────────────────────────────── */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Eyebrow className="justify-center">Pricing FAQ</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
              The questions clients actually ask.
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {pricingFaqs.map((faq, idx) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-rule bg-white p-5 shadow-soft transition-colors hover:border-accent-300 md:p-6"
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <h3 className="text-base font-semibold text-ink-900 md:text-lg">
                    {faq.q}
                  </h3>
                  <span
                    className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink-50 text-base font-medium text-ink-700 transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-ink-700 leading-relaxed md:text-base">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── UPSELL VISUAL (SEMrush-inspired) ────────────────── */}
      <Section variant="tinted" padding="lg">
        <Container>
          <div className="mx-auto max-w-5xl rounded-3xl bg-accent-50 p-8 md:p-12">
            <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
              <div>
                <h2 className="text-display-md font-semibold uppercase tracking-tight text-ink-900 md:text-display-lg">
                  Your current visibility is{" "}
                  <span className="text-accent-700">only the start.</span>
                </h2>
                <p className="mt-5 text-base text-ink-700 leading-relaxed">
                  As AI search accelerates, preparing now secures your
                  visibility tomorrow:
                </p>
                <ul className="mt-5 space-y-3 text-base text-ink-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-700" />
                    <span>
                      Target the prompts where your competitors get mentioned
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-700" />
                    <span>Build presence on sources AI engines trust</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-700" />
                    <span>
                      Get recommended instead of your competitors
                    </span>
                  </li>
                </ul>
                <a
                  href="/scan"
                  className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink-900 px-7 text-base font-semibold text-white shadow-soft transition-all hover:bg-ink-800"
                >
                  Start with a free scan
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <UpsellFlowDiagram />
            </div>
          </div>
        </Container>
      </Section>

      {/* ─── FINAL CTA ──────────────────────────────────── */}
      <Section variant="ink" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-display-md font-semibold tracking-tight md:text-display-lg">
            Not sure which plan fits?
          </h2>
          <p className="mt-4 text-lg text-ink-300 leading-relaxed">
            Get your free scan first. We&apos;ll recommend the right tier based
            on what we find. No pressure. No card. Report in 24 hours.
          </p>
          <a
            href="/scan"
            data-tier="scan"
            data-setup-price="0"
            data-monthly-price="0"
            data-currency="ZAR"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent-500 px-7 text-base font-semibold text-ink-900 shadow-lift transition-all hover:bg-accent-400"
          >
            Get your free AI scan
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Section>
    </>
  );
}

// ─── TierCard ─────────────────────────────────────────
function TierCard({ tier }: { tier: (typeof tiers)[number] }) {
  const isHighlighted = tier.highlight;
  const cardClasses = isHighlighted
    ? "relative rounded-3xl border-2 border-emerald-500 bg-white p-7 shadow-card md:p-8 md:-translate-y-2"
    : "relative rounded-3xl border border-rule bg-white p-7 shadow-soft md:p-8";

  const ctaClasses =
    tier.ctaStyle === "primary"
      ? "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-sm font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card"
      : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-6 text-sm font-semibold text-ink-900 transition-all hover:bg-ink-50";

  return (
    <article className={cardClasses}>
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
            Most popular
          </span>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
          {tier.name}
        </h3>
        <p className="mt-2 text-sm text-ink-500 leading-relaxed">
          {tier.tagline}
        </p>
      </div>

      <div className="mt-6 border-t border-rule pt-5">
        <div className="text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          {tier.priceDisplay}
          {tier.monthlyPrice > 0 && (
            <span className="text-base font-normal text-ink-500">/mo</span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-ink-500">{tier.priceSubtitle}</div>
        <div className="mt-0.5 text-[11px] text-ink-400">{tier.intlPrice}</div>
      </div>

      <div className="mt-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
          Score target
        </div>
        <div className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-900">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: tier.scoreColor }}
            aria-hidden="true"
          />
          {tier.scoreTarget}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-ink-50/60 p-4 text-xs text-ink-700 leading-relaxed">
        <strong className="text-ink-900">Best for:</strong> {tier.forWho}
      </div>

      <ul className="mt-5 space-y-2.5">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2
              className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                isHighlighted ? "text-emerald-600" : "text-emerald-500"
              }`}
            />
            <span className="text-ink-700 leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 text-[11px] text-ink-500">
        <strong className="text-ink-700">Delivery:</strong> {tier.delivery}
      </div>

      <div className="mt-7">
        <a
          href="/scan"
          data-tier={tier.id}
          data-setup-price={String(tier.setupPrice)}
          data-monthly-price={String(tier.monthlyPrice)}
          data-currency="ZAR"
          className={ctaClasses}
        >
          {tier.cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-3 text-center text-[10px] italic text-ink-400">
        Starts with a free scan · No card to begin
      </p>
    </article>
  );
}

// ─── ScoreTargetBar ───────────────────────────────────
function ScoreTargetBar() {
  const segments = [
    { from: 0, to: 30, label: "Where most start", colour: "#ef4444" },
    { from: 30, to: 60, label: "Most SA businesses today", colour: "#f97316" },
    { from: 60, to: 75, label: "After Fix It", colour: "#84cc16" },
    { from: 75, to: 85, label: "After Grow It", colour: "#22c55e" },
    { from: 85, to: 100, label: "After Own It", colour: "#16a34a" },
  ];

  return (
    <div className="mt-10">
      <div className="relative h-12 w-full overflow-hidden rounded-2xl border border-rule shadow-soft">
        <div className="flex h-full w-full">
          {segments.map((seg) => {
            const width = ((seg.to - seg.from) / 100) * 100;
            return (
              <div
                key={`${seg.from}-${seg.to}`}
                className="h-full"
                style={{
                  width: `${width}%`,
                  background: seg.colour,
                }}
                title={seg.label}
              />
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 text-[10px] font-bold text-white drop-shadow-md md:text-xs">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-start gap-2">
            <span
              className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
              style={{ background: seg.colour }}
              aria-hidden="true"
            />
            <div className="leading-tight">
              <div className="font-semibold text-ink-900">
                {seg.from}-{seg.to}
              </div>
              <div className="mt-0.5 text-ink-500">{seg.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── UpsellFlowDiagram ──────────────────────────────────
function UpsellFlowDiagram() {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      <div className="flex h-32 w-24 flex-col rounded-xl border border-rule bg-white p-2 shadow-soft md:h-40 md:w-32">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded-full bg-ink-100" />
          <div className="h-1.5 w-full rounded-full bg-ink-100" />
          <div className="h-1.5 w-2/3 rounded-full bg-ink-100" />
        </div>
        <div className="mt-2 h-8 rounded bg-accent-100/60" />
      </div>

      <Arrow />

      <div className="flex h-32 w-24 flex-col rounded-xl border border-rule bg-white p-2 shadow-soft md:h-40 md:w-32">
        <div className="flex items-center gap-1 border-b border-rule pb-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-500">
            <Sparkles className="h-2.5 w-2.5 text-white" />
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-wider text-ink-700 md:text-[9px]">
            AI assistant
          </span>
        </div>
        <div className="mt-2 text-[8px] font-semibold text-ink-900 md:text-[10px]">
          Brand
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-ink-100" />
          <div className="h-1.5 w-3/4 rounded-full bg-ink-100" />
          <div className="h-1.5 w-2/3 rounded-full bg-ink-100" />
        </div>
      </div>

      <Arrow />

      <div className="flex h-32 w-24 flex-col items-center justify-center rounded-xl border border-rule bg-white p-2 shadow-soft md:h-40 md:w-32">
        <div className="text-3xl font-bold tracking-tight text-emerald-600 md:text-4xl">
          88
        </div>
        <div className="mt-1 text-[8px] font-semibold uppercase tracking-wider text-ink-500 md:text-[10px]">
          AI visibility
        </div>
        <div className="text-[8px] uppercase tracking-wider text-ink-500 md:text-[10px]">
          score
        </div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      className="flex-shrink-0 text-ink-400 md:h-4 md:w-6"
      aria-hidden="true"
    >
      <path
        d="M1 7H18M18 7L12 1M18 7L12 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
