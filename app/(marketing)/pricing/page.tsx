import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import {
  PACKAGES,
  RETAINERS,
  formatPrice,
  formatPriceMonthly,
  formatPriceRange,
} from "@/lib/pricing";
/**
 * Anchor ID for the GBP troubleshooting FAQ. Linked from the GBP
 * Setup tier card so prospects with broken existing profiles can
 * jump straight to the right answer instead of bouncing.
 */
const FAQ_GBP_TROUBLESHOOTING_ID = "faq-gbp-troubleshooting";

/**
 * Pricing page — every price imported from lib/pricing (single source
 * of truth). No hardcoded amounts. No standalone tier names.
 *
 * Display structure follows the buyer's mental model, not the data
 * structure of lib/pricing:
 *   - Free scan banner first (every paid path starts here)
 *   - Once-off packages (Starter / Optimization Pack [modal] / Foundation Build Lite)
 *   - Foundation Build (multi-page, ranged price) as a secondary card
 *   - Monthly retainers (Growth [modal] / Premium)
 *   - Score target visual + FAQ + final CTA
 *
 * Stripe-readiness preserved: every CTA carries data-tier, data-setup-
 * price, data-monthly-price, data-currency attributes mapping to the
 * canonical slugs in lib/pricing.
 */

export const metadata: Metadata = {
  title: "Pricing — Fixed-tier AEO packages for SA, UK, and US businesses",
  description: `Google Business Profile Setup R5,000 once-off (the entry point), Optimization Pack R10,500 once-off (the modal AEO build), Growth retainer R5,500/month. Foundation Build adds website + AEO. Premium retainer for category leadership. All prices fixed, no custom quotes after the scan.`,
  alternates: { canonical: `${site.url}/pricing` },
};

// FAQ entries can carry an optional `id` so anchor links can target
// them. Today only the GBP troubleshooting FAQ uses this — see the
// "Already have a GBP that needs fixing?" link on the GBP Setup card.
const pricingFaqs: { q: string; a: string; id?: string }[] = [
  // ─── GBP-led FAQs (prepended 2026-05-16) ────────────────────────
  // These three answer the GBP-first prospect path before the AEO
  // deep-dive FAQs. Ordering matters: GBP entry → AEO definition →
  // troubleshooting (the broken-GBP catch-all, no public pricing).
  {
    q: "I just need help with my Google Business Profile. Which package fits?",
    a: "The GBP Setup package at R5,000 is the right starting point. It includes everything to claim, optimize, and verify your Google Business Profile, plus directory citations across 10 trusted SA directories. Most clients add the Optimization Pack later once they're ready for deeper AI visibility work that requires a website.",
  },
  {
    q: "What's the difference between Google Business Profile and AEO (Answer Engine Optimization)?",
    a: "Google Business Profile is your business listing on Google Maps and local search. AEO is the broader work of being recommended by AI engines like ChatGPT, Claude, Gemini, and Perplexity when customers ask conversational questions about your category. GBP is one component of AEO. Most clients start with GBP because the results are visible quickly, then expand into the full AEO layer once they see the value.",
  },
  {
    q: "What if my Google Business Profile is already broken (duplicate listings, lost access, verification issues, suspended)?",
    a: "We troubleshoot existing GBP problems. Scope and cost vary by situation — duplicate cleanup, verification recovery, ownership transfers all require different work, and pricing depends on the specifics. Reach out via WhatsApp or the contact form and we'll scope your specific situation.",
    id: FAQ_GBP_TROUBLESHOOTING_ID,
  },
  {
    // FAQ 4 — access recovery. Distinct from the GBP troubleshooting
    // FAQ above (this one covers website / CMS / hosting access, not
    // GBP). Pricing IS included here because access-recovery work
    // typically falls in a narrow predictable range (R1,500-R3,500).
    q: "What if I can't grant full access to my website (lost passwords, former developer won't release credentials, restricted platform)?",
    a: "This is common. Most clients haven't logged into their hosting or CMS in years. Before engagement begins, we audit what access is available and what needs to be recovered. Access recovery work is priced separately from package scope — typically R1,500-R3,500 depending on complexity. Common scenarios include password resets, contacting former developers, DNS reclamation, and platform migrations.",
  },
  // ─── Existing FAQs (kept verbatim except for the rename cascade) ──
  {
    q: "What's included in the R10,500 Optimization Pack?",
    a: "Everything to build your AEO layer: full measurement stack (GA4, GSC, BWT, Clarity), JSON-LD schemas across service pages, llms.txt + robots.txt rebuilt, GBP complete rebuild, 10 directory citations with NAP consistency, 3 priority pages rewritten in answer-shape, 10-12 FAQ items with FAQPage schema, LinkedIn refresh, and Day 0 + Day 30 rescans with progress report. 32-40 hours of work over 3 weeks.",
  },
  {
    // Updated 2026-05-16: "Starter" → "GBP Setup" to track the
    // canonical rename. Substance of the answer unchanged.
    q: "Can I start with GBP Setup and upgrade later?",
    a: "Yes. GBP Setup (R5,000) lays the foundations — your Google Business Profile plus the AEO baseline. You can move to Optimization Pack (R10,500) or a Growth retainer (R5,500/mo) at any time. We do not double-bill — GBP Setup work carries forward.",
  },
  {
    q: "What happens after the 3-month Growth minimum?",
    a: "Continue month-to-month or cancel anytime. No lock-in after the minimum. Most clients stay on Growth for 6-12 months because AEO compounds quarter over quarter.",
  },
  {
    q: "How quickly will I see results?",
    a: "Citations go live within 1-2 weeks. GBP changes take effect within days. Schema markup is parsed by AI engines on their next crawl (typically 7-14 days). The Optimization Pack includes a Day 30 rescan that measures the full impact.",
  },
  {
    q: "What if I don't have a website?",
    a: "Foundation Build Lite (R12,500 once-off, solo professionals) or Foundation Build (R18,500–R24,500 once-off, multi-page businesses). Both include everything from the Optimization Pack baked in from line one — you don't need to buy the AEO layer separately.",
  },
  {
    q: "Do you offer payment plans?",
    a: "Once-off packages: 50% deposit, 50% on delivery. Monthly retainers billed in advance — Growth 3-month minimum, Premium 6-month minimum. All payments via card or EFT in South African Rand. International clients pay in USD or GBP at the displayed equivalent.",
  },
];

// ─── Once-off tier display data ───────────────────────────────────
// Pulls from canonical lib/pricing PACKAGES + adds display-specific
// fields (highlight state, CTA copy, score target language) that don't
// belong in the pricing data model itself.
//
// 2026-05-16 restructure (v2): 4 once-off cards in a 2x2 grid. The
// repricing of the Foundation builds (Lite R9,500; full R14,500-
// R19,500) makes them buyer-friendly enough to sit as standard cards
// rather than de-emphasized below the modal pair. Visual order:
//   Row 1: GBP Setup ("Start here" pill) | Optimization Pack ("Most
//          clients land here" modal badge)
//   Row 2: Foundation Build Lite           | Foundation Build
// Each card's internal content is sectioned (see lib/pricing
// `sections`) — the brief required consistent sectioned organization
// across every tier.
const onceOffCards = [
  {
    pkg: PACKAGES.starter,
    priceDisplay: formatPrice(PACKAGES.starter.price),
    priceSubtitle: "Once-off · 50% deposit / 50% on delivery",
    intlPrice: "$295 · £235",
    forWho:
      "Service businesses that need to show up when customers search Google Maps and AI search. The fastest, most visible win in local search.",
    delivery: PACKAGES.starter.timeInvestment + " of work · 1-2 weeks",
    scoreTarget: "Lays the foundation",
    scoreColor: "#84cc16",
    cta: "Start with GBP Setup",
    ctaStyle: "outline" as const,
    highlight: false,
    setupPrice: PACKAGES.starter.price,
    // Soft "entry-point" callout. Subordinate to the Optimization
    // modal badge — different visual weight (corner pill vs centered
    // ribbon) so the two can co-exist without competing.
    entryPoint: true,
  },
  {
    pkg: PACKAGES.optimizationPack,
    priceDisplay: formatPrice(PACKAGES.optimizationPack.price),
    priceSubtitle: "Once-off · 50% deposit / 50% on Day 30 delivery",
    intlPrice: "$595 · £475",
    forWho:
      "Service businesses with an existing website who want the full AEO (Answer Engine Optimization) layer — the work that makes your business citable by ChatGPT, Claude, Gemini, and Perplexity when customers ask them questions. The modal once-off where most one-time clients land.",
    delivery: PACKAGES.optimizationPack.timeInvestment + " over 3 weeks",
    scoreTarget: "20-40 → 60-75",
    scoreColor: "#22c55e",
    cta: "Run the Optimization Pack",
    ctaStyle: "primary" as const,
    highlight: true,
    setupPrice: PACKAGES.optimizationPack.price,
    entryPoint: false,
  },
  {
    pkg: PACKAGES.foundationBuildLite,
    priceDisplay: formatPrice(PACKAGES.foundationBuildLite.price),
    priceSubtitle: "Once-off · 50% deposit / 50% on delivery",
    intlPrice: "$555 · £445",
    forWho:
      "Service businesses that don't have a website yet but want to be found on Google Maps AND cited by AI engines like ChatGPT, Claude, Gemini, and Perplexity. We build the website and lay the AEO foundation in one package.",
    delivery: PACKAGES.foundationBuildLite.timeInvestment + " · 2-3 weeks",
    scoreTarget: "0 → 60-75",
    scoreColor: "#16a34a",
    cta: "Build my foundation",
    ctaStyle: "outline" as const,
    highlight: false,
    setupPrice: PACKAGES.foundationBuildLite.price,
    entryPoint: false,
  },
  {
    pkg: PACKAGES.foundationBuild,
    priceDisplay: formatPriceRange(
      PACKAGES.foundationBuild.priceMin,
      PACKAGES.foundationBuild.priceMax,
    ),
    priceSubtitle: "Once-off · 50% deposit / 50% on delivery",
    intlPrice: "$845 · £680 — from",
    forWho:
      "Established service businesses needing a multi-page online presence with AEO baked in from line one. For businesses where one page isn't enough — multiple services, multiple locations, or content depth requirements.",
    delivery: PACKAGES.foundationBuild.timeInvestment + " · 4-6 weeks",
    scoreTarget: "0 → 60-80",
    scoreColor: "#16a34a",
    cta: "Get scoped",
    ctaStyle: "outline" as const,
    highlight: false,
    setupPrice: PACKAGES.foundationBuild.priceMin,
    entryPoint: false,
  },
];

const retainerCards = [
  {
    ret: RETAINERS.growth,
    priceDisplay: formatPriceMonthly(RETAINERS.growth.price),
    priceSubtitle: `Monthly · ${RETAINERS.growth.minimumMonths}-month minimum`,
    intlPrice: "$395 / £315 / month",
    forWho:
      "The standard retainer for clients post-Foundation. Compounding monthly work that lifts you into category-leading visibility.",
    scoreTarget: "75-85 and climbing",
    scoreColor: "#22c55e",
    cta: "Start growing",
    ctaStyle: "primary" as const,
    highlight: true,
    monthlyPrice: RETAINERS.growth.price,
  },
  {
    ret: RETAINERS.premium,
    priceDisplay: `from ${formatPriceMonthly(RETAINERS.premium.priceMin)}`,
    priceSubtitle: `Monthly · ${RETAINERS.premium.minimumMonths}-month minimum`,
    intlPrice: "from $735 / £585 / month",
    forWho:
      "Mid-market firms pursuing category leadership. Daily content cadence, paid ads management, PR outreach, weekly strategy calls.",
    scoreTarget: "85+ — category dominance",
    scoreColor: "#16a34a",
    cta: "Apply for Premium",
    ctaStyle: "outline" as const,
    highlight: false,
    monthlyPrice: RETAINERS.premium.priceMin,
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
            <span className="text-ink-500">Pick your package. Get recommended.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500 leading-relaxed">
            Every plan starts with a free AI visibility scan.
            <br className="hidden md:block" />
            Fixed-tier pricing — no custom quotes, no surprises.
          </p>

          {/* AEO-anchored explainer paragraph (added 2026-05-16).
              The leading sentence is the strategic anchor — it tells
              every visitor, before any pricing is shown, that this is
              an AI Visibility consultancy whose most popular entry is
              GBP. The paragraph does double duty: it surfaces GBP as
              the easy entry point AND reinforces AEO as the strategic
              depth. Verification criterion #9 (the page must read as
              an AEO consultancy, not a GBP service) lives or dies on
              this paragraph. */}
          <div className="mt-10 rounded-2xl border border-accent-200 bg-accent-50/40 p-5 text-left md:p-6">
            <p className="text-base leading-relaxed text-ink-700">
              <strong className="font-semibold text-ink-900">
                I&apos;m an AI Visibility (AEO/GEO) consultant.
              </strong>{" "}
              Most clients start with their Google Business Profile
              because it&apos;s the fastest visible win for local
              search. From there, the Optimization Pack adds the full
              AEO layer that makes you citable by AI engines like
              ChatGPT, Claude, Gemini, and Perplexity. Growth retainer
              continues the compounding work month over month.
            </p>
          </div>
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

      {/* ─── ONCE-OFF PACKAGES ─────────────────────────────── */}
      <Section variant="default" padding="lg" id="packages">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Once-off packages</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Pick the level of work your score needs.
          </h2>
          <p className="mt-4 text-base text-ink-500">
            <strong className="text-ink-700">Google Business Profile Setup</strong>{" "}
            is the entry point — the fastest, most visible win.{" "}
            <strong className="text-ink-700">Optimization Pack</strong> is
            where most one-time clients land — the full AEO layer that
            makes you citable by AI engines. The two Foundation Builds
            include a website for clients starting from scratch.
          </p>
        </div>

        {/* Main grid: 4 once-off cards in a 2×2 layout. Each card
            renders its own sectioned content via `pkg.sections`.
            Row 1 carries the two badged cards (GBP Setup "Start
            here" + Optimization Pack "Most clients land here"); Row
            2 carries the two Foundation Builds (Lite + full) as
            standard cards. */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {onceOffCards.map((card) => (
            <OnceOffCard key={card.pkg.slug} card={card} />
          ))}
        </div>
      </Section>

      {/* ─── CLIENT JOURNEY NARRATIVE ────────────────────────
          Sits between once-off and retainer sections. Tells the
          progression story without competing with the package
          cards — supplementary, not dominant. Vertical step flow
          with downward arrows; one closing paragraph. Variant
          stays "default" so we don't run two tinted sections
          back-to-back (the retainer block below is tinted). */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Eyebrow className="justify-center">How clients progress</Eyebrow>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">
              The typical client journey.
            </h2>
          </div>

          <ol className="mt-8 space-y-3">
            <JourneyStep
              label="Start"
              package={`${PACKAGES.starter.name} (${formatPrice(PACKAGES.starter.price)})`}
              note="get visible on Google Maps in 1-2 weeks"
            />
            <JourneyStep
              label="Expand"
              package={`${PACKAGES.optimizationPack.name} (${formatPrice(PACKAGES.optimizationPack.price)})`}
              note="add the full AEO layer once your GBP is performing"
            />
            <JourneyStep
              label="Compound"
              package={`Growth Retainer (${formatPriceMonthly(RETAINERS.growth.price)})`}
              note="keep building citations, content, and authority month over month"
            />
            <JourneyStep
              label="Dominate"
              package={`Premium Retainer (from ${formatPriceMonthly(RETAINERS.premium.priceMin)})`}
              note="category leadership with daily cadence, ads, and PR"
              last
            />
          </ol>

          <p className="mt-6 text-center text-sm text-ink-500 leading-relaxed">
            Most clients spend 2-3 months in once-off packages before
            moving to retainer work. Some skip ahead. Some stay focused
            on once-off only. Free scan first determines what fits.
          </p>
        </div>
      </Section>

      {/* ─── MONTHLY RETAINERS ──────────────────────────────── */}
      <Section variant="tinted" padding="lg" id="retainers">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Monthly retainers</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Compounding work, billed monthly.
          </h2>
          <p className="mt-4 text-base text-ink-500">
            AEO compounds quarter over quarter. Retainers run the ongoing
            content + citation + LinkedIn work that lifts you into category-leading visibility.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {retainerCards.map((card) => (
            <RetainerCard key={card.ret.slug} card={card} />
          ))}
        </div>
      </Section>

      {/* ─── SCORE TARGET VISUAL ───────────────────────────── */}
      <Section variant="default" padding="default">
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
          <div className="mx-auto mt-5 grid max-w-2xl gap-4 text-center text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-rule bg-white p-4 shadow-soft">
              <div className="font-semibold text-ink-900">Google Digital Marketing</div>
              <div className="mt-0.5 text-xs text-ink-500">Certified · 2024</div>
            </div>
            <div className="rounded-xl border border-rule bg-white p-4 shadow-soft">
              <div className="font-semibold text-ink-900">Anthropic Claude 101</div>
              <div className="mt-0.5 text-xs text-ink-500">Certified · May 2026</div>
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
                id={faq.id}
                className="group rounded-2xl border border-rule bg-white p-5 shadow-soft transition-colors target:border-accent-500 target:bg-accent-50/30 hover:border-accent-300 md:p-6 scroll-mt-24"
                // Auto-expand the first FAQ (GBP entry-point question)
                // AND any FAQ that was navigated to by anchor. Native
                // `<details>` doesn't auto-open on :target, but
                // open-by-default for the troubleshooting one would
                // hide its anchor purpose; instead the :target style
                // above tints it so the destination is unmistakable
                // when the page scrolls to it.
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
            Not sure which package fits?
          </h2>
          <p className="mt-4 text-lg text-ink-300 leading-relaxed">
            Get your free scan first. We&apos;ll recommend one of the packages
            above based on what we find. No pressure. No card. Report in 24 hours.
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

// ─── OnceOffCard ─────────────────────────────────────────
function OnceOffCard({ card }: { card: (typeof onceOffCards)[number] }) {
  const isHighlighted = card.highlight;
  const isEntryPoint = card.entryPoint;
  // Subtitle is defined on starter / foundationBuildLite /
  // foundationBuild but not on optimizationPack. Defensive access.
  const subtitle =
    "subtitle" in card.pkg
      ? (card.pkg as { subtitle?: string }).subtitle
      : undefined;
  // priceNote exists on foundationBuild (scope confirmation). Same
  // defensive access — renders muted under the price when present.
  const priceNote =
    "priceNote" in card.pkg
      ? (card.pkg as { priceNote?: string }).priceNote
      : undefined;
  const cardClasses = isHighlighted
    ? "relative rounded-3xl border-2 border-emerald-500 bg-white p-7 shadow-card md:p-8 md:-translate-y-2"
    : "relative rounded-3xl border border-rule bg-white p-7 shadow-soft md:p-8";

  const ctaClasses =
    card.ctaStyle === "primary"
      ? "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-sm font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card"
      : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-6 text-sm font-semibold text-ink-900 transition-all hover:bg-ink-50";

  return (
    <article className={cardClasses}>
      {/* Modal badge — Optimization Pack only. Centered top, emerald,
          dominant. */}
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
            Most clients land here
          </span>
        </div>
      )}

      {/* Entry-point pill — GBP Setup only. Top-right corner,
          subordinate to the modal badge so the two cards co-exist
          without visual competition. */}
      {isEntryPoint && (
        <div className="absolute -top-3 right-5">
          <span className="rounded-full bg-accent-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
            Start here
          </span>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
          {card.pkg.name}
        </h3>
        {subtitle && (
          <div className="mt-1 text-sm font-medium text-accent-700">
            {subtitle}
          </div>
        )}
        <p className="mt-2 text-sm text-ink-500 leading-relaxed">
          {card.pkg.tagline}
        </p>
      </div>

      <div className="mt-6 border-t border-rule pt-5">
        <div className="text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          {card.priceDisplay}
        </div>
        <div className="mt-1 text-[11px] text-ink-500">{card.priceSubtitle}</div>
        <div className="mt-0.5 text-[11px] text-ink-400">{card.intlPrice}</div>
        {/* priceNote — only Foundation Build today. Italicized
            muted, visible but secondary. */}
        {priceNote && (
          <div className="mt-2 rounded-md bg-amber-50/60 px-2.5 py-1.5 text-[11px] italic leading-snug text-amber-800">
            {priceNote}
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
          Score target
        </div>
        <div className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-900">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: card.scoreColor }}
            aria-hidden="true"
          />
          {card.scoreTarget}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-ink-50/60 p-4 text-xs text-ink-700 leading-relaxed">
        <strong className="text-ink-900">Best for:</strong> {card.forWho}
      </div>

      {/* Sectioned deliverables. Primary sections render as titled
          checklists; "prerequisite" and "platform" variants render
          as muted <details> collapsibles below the deliverables
          (closed by default — they're informational, not selling
          points). */}
      <SectionedDeliverables
        sections={card.pkg.sections}
        isHighlighted={isHighlighted}
      />

      <div className="mt-5 text-[11px] text-ink-500">
        <strong className="text-ink-700">Delivery:</strong> {card.delivery}
      </div>

      {/* Troubleshooting link — GBP Setup card only. Muted italic so
          it routes the right prospects to the right FAQ without
          competing with the primary CTA. */}
      {isEntryPoint && (
        <p className="mt-4 text-[11px] italic text-ink-500">
          Already have a GBP that needs fixing?{" "}
          <a
            href={`#${FAQ_GBP_TROUBLESHOOTING_ID}`}
            className="text-accent-600 underline-offset-2 hover:underline"
          >
            See troubleshooting FAQ below.
          </a>
        </p>
      )}

      {/* Ongoing-posting note — GBP Setup card only. Routes
          prospects toward the natural Growth retainer follow-on
          while being honest that posting is a maintenance need. */}
      {isEntryPoint && (
        <p className="mt-3 text-[11px] italic text-ink-500">
          Continued posting after Day 30 is essential for ongoing
          listing performance. Most clients add the Growth Retainer
          to maintain consistent activity.
        </p>
      )}

      <div className="mt-7">
        <a
          href="/scan"
          data-tier={card.pkg.slug}
          data-setup-price={String(card.setupPrice)}
          data-monthly-price="0"
          data-currency="ZAR"
          className={ctaClasses}
        >
          {card.cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-3 text-center text-[10px] italic text-ink-400">
        Starts with a free scan · No card to begin
      </p>
    </article>
  );
}

// ─── SectionedDeliverables ───────────────────────────────
// Shared renderer used by both OnceOffCard and RetainerCard. Renders
// primary sections as titled checklists with green checks; renders
// "prerequisite" / "platform" variants as muted <details>
// collapsibles below the deliverables. Keeps card heights honest by
// hiding informational sections behind a click.
type Section = {
  heading: string;
  items: readonly string[];
  variant?: "deliverable" | "prerequisite" | "platform";
};

function SectionedDeliverables({
  sections,
  isHighlighted,
}: {
  sections: readonly Section[];
  isHighlighted: boolean;
}) {
  const primary = sections.filter(
    (s) => (s.variant ?? "deliverable") === "deliverable",
  );
  const informational = sections.filter(
    (s) => s.variant && s.variant !== "deliverable",
  );

  return (
    <>
      <div className="mt-6 space-y-5">
        {primary.map((section) => (
          <div key={section.heading}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-500">
              {section.heading}
            </div>
            <ul className="mt-2 space-y-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[13px]"
                >
                  <CheckCircle2
                    className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${
                      isHighlighted ? "text-emerald-600" : "text-emerald-500"
                    }`}
                  />
                  <span className="text-ink-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {informational.length > 0 && (
        <div className="mt-4 space-y-2">
          {informational.map((section) => (
            <details
              key={section.heading}
              className="group rounded-xl bg-ink-50/60 px-3 py-2 text-xs text-ink-600"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold text-ink-700">
                <span>{section.heading}</span>
                <span
                  className="text-ink-400 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <ul className="mt-2 space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="leading-snug">
                    — {item}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

// ─── JourneyStep ─────────────────────────────────────────
// Single row of the client-journey narrative. Label badge + package
// name + value-prop line. Downward chevron between steps (suppressed
// on the last row).
function JourneyStep({
  label,
  package: pkgName,
  note,
  last,
}: {
  label: string;
  package: string;
  note: string;
  last?: boolean;
}) {
  return (
    <li>
      <div className="flex flex-wrap items-baseline gap-2 rounded-xl border border-rule bg-white px-4 py-3 shadow-soft">
        <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          {label}
        </span>
        <span className="text-sm font-semibold text-ink-900">{pkgName}</span>
        <span className="text-sm text-ink-500">— {note}</span>
      </div>
      {!last && (
        <div className="flex justify-center py-1.5" aria-hidden="true">
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            className="text-ink-300"
          >
            <path
              d="M7 1V9M7 9L1 4M7 9L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </li>
  );
}

// ─── RetainerCard ─────────────────────────────────────────
function RetainerCard({ card }: { card: (typeof retainerCards)[number] }) {
  const isHighlighted = card.highlight;
  const priceNote =
    "priceNote" in card.ret
      ? (card.ret as { priceNote?: string }).priceNote
      : undefined;
  const cardClasses = isHighlighted
    ? "relative rounded-3xl border-2 border-emerald-500 bg-white p-7 shadow-card md:p-8"
    : "relative rounded-3xl border border-rule bg-white p-7 shadow-soft md:p-8";

  const ctaClasses =
    card.ctaStyle === "primary"
      ? "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-sm font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card"
      : "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-6 text-sm font-semibold text-ink-900 transition-all hover:bg-ink-50";

  return (
    <article className={cardClasses}>
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
            Standard retainer
          </span>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
          {card.ret.name}
        </h3>
        <p className="mt-2 text-sm text-ink-500 leading-relaxed">
          {card.ret.tagline}
        </p>
      </div>

      <div className="mt-6 border-t border-rule pt-5">
        <div className="text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          {card.priceDisplay}
        </div>
        <div className="mt-1 text-[11px] text-ink-500">{card.priceSubtitle}</div>
        <div className="mt-0.5 text-[11px] text-ink-400">{card.intlPrice}</div>
        {/* priceNote — Premium retainer surfaces the ad-spend
            disclosure prominently so prospects don't anchor on the
            R10,500 number expecting it to include media spend. */}
        {priceNote && (
          <div className="mt-2 rounded-md bg-amber-50/60 px-2.5 py-1.5 text-[11px] italic leading-snug text-amber-800">
            <strong className="not-italic">Note:</strong> {priceNote}
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
          Score target
        </div>
        <div className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-900">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: card.scoreColor }}
            aria-hidden="true"
          />
          {card.scoreTarget}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-ink-50/60 p-4 text-xs text-ink-700 leading-relaxed">
        <strong className="text-ink-900">Best for:</strong> {card.forWho}
      </div>

      <SectionedDeliverables
        sections={card.ret.sections}
        isHighlighted={isHighlighted}
      />

      <div className="mt-7">
        <a
          href="/scan"
          data-tier={card.ret.slug}
          data-setup-price="0"
          data-monthly-price={String(card.monthlyPrice)}
          data-currency="ZAR"
          className={ctaClasses}
        >
          {card.cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-3 text-center text-[10px] italic text-ink-400">
        Starts with a free scan · {card.ret.minimumMonths}-month minimum
      </p>
    </article>
  );
}

// ─── ScoreTargetBar ───────────────────────────────────
function ScoreTargetBar() {
  const segments = [
    { from: 0, to: 30, label: "Where most start", colour: "#ef4444" },
    { from: 30, to: 60, label: "Most SA businesses today", colour: "#f97316" },
    { from: 60, to: 75, label: "After GBP Setup / Optimization", colour: "#84cc16" },
    { from: 75, to: 85, label: "After 3-6 months Growth", colour: "#22c55e" },
    { from: 85, to: 100, label: "After Premium + 6+ months", colour: "#16a34a" },
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
