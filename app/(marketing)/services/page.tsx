import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { tiers, addOns, site } from "@/lib/site";
import { publicPackages } from "@/lib/public-packages";
import { PublicPackagesGrid } from "@/components/public-packages-grid";
import { SerpRealEstateMap } from "@/components/serp-real-estate-map";
import { TierComparisonTable } from "@/components/tier-comparison-table";
import { TrackPageView } from "@/components/track-page-view";
import { TrustStrip } from "@/components/trust-strip";
import { ArrowRight, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Pricing — Three guided paths, not 14 options",
  description:
    "Three packages for medical, legal, and industrial firms: Starter (basics first), Growth (compound visibility every month), Premium (visibility + automation). Take the 10-min Discovery to get matched — or browse all options.",
  alternates: { canonical: `${site.url}/services` },
};

const servicesFaqs = [
  {
    q: "Why only 3 packages? I expected more options.",
    a: "Three packages because three is the right number of decisions to make at first contact. Starter (foundations), Growth (compounding monthly visibility — where most clients land), or Premium / Systems (visibility plus automation). Each one branches into a custom scope after Discovery — we have 14 internal tiers we map to behind the scenes. You don't pick from 14. We pick the right fit from your answers.",
  },
  {
    q: "What if my situation is unusual?",
    a: "Take the 10-min Discovery. If your answers don't trigger a confident match, we surface the 'Talk to Kabelo' option directly — no automated recommendation that doesn't fit. For complex cases (multi-region firms, atypical sectors, custom integrations), Kabelo personally reviews your answers and recommends a custom scope.",
  },
  {
    q: "Why pay 50% deposit and 50% on delivery?",
    a: "Splitting payment is the industry standard for project work. It builds trust both ways: we don't get paid in full until you sign off, and you don't risk full payment to a stranger. If we don't deliver what's quoted, you don't pay the second half. Monthly retainers work differently — billed in advance, cancel anytime after the minimum.",
  },
  {
    q: "Why monthly retainers? Aren't subscriptions just adding overhead?",
    a: "AI visibility compounds. A once-off citation pack gets you 30 listings on day 30 — but on day 90, three of them have died, no new ones have appeared, and your competitors who run a retainer have added 18 more. Retainers exist because the work that moves AI engines (citations, content velocity, schema updates, GBP freshness) is repetitive maintenance, not a one-time setup.",
  },
  {
    q: "I hate subscriptions. What's the cancellation policy?",
    a: "Same as your gym, but actually honoured. 3-month minimum on all retainers. After that, cancel via email — no phone call, no retention pitch, no fine print. We deliver everything paid for and hand over all logins, content, and citations cleanly. Nothing held hostage.",
  },
  {
    q: "Are these retainers just social media management?",
    a: "No — and we deliberately don't do Instagram, TikTok, or generic Facebook posting. We focus on properties where medical, legal, and industrial buyers actually make decisions: Google Business Profile, LinkedIn, industry-specific directories, reviews, industry publications, and AI engines. Every property feeds the same AEO strategy. We own the search results page across every platform your buyers actually use.",
  },
  {
    q: "How do you handle my website if I don't have one?",
    a: "We build what fits your business — from a single AI-readable landing page to a full multi-page business website — all optimised for visibility, trust, and conversion. We don't sell rigid 'X-page' packages. After your scan + Discovery, we recommend the right scope based on your actual services and customers. Sometimes that's one page. Sometimes it's six. The work is positioned as AI-optimised infrastructure, not generic web design.",
  },
  {
    q: "Why do you charge in ZAR, USD, and GBP?",
    a: "We deliver work to international standards from a South African cost base. SA clients pay local rates. International clients pay rates aligned with the global AEO consulting market — but still meaningfully below London/NYC agency pricing. Same work, fair pricing for each region.",
  },
  {
    q: "Is there a discount for first-case-study clients?",
    a: "Yes — Foundation Partners (first clients in a new vertical) receive up to 50% off in exchange for case study publication rights. Limited availability, message Kabelo directly to discuss.",
  },
];

const addOnCategoryLabels: Record<string, { label: string; description: string }> = {
  setup: {
    label: "Setup & Foundations",
    description: "One-time technical and listing work that builds the base.",
  },
  content: {
    label: "Content & Authority",
    description: "Once-off content production for AI citation and clarity.",
  },
  growth: {
    label: "Growth Tools",
    description: "Once-off automation setups that keep working long after we stop.",
  },
  ongoing: {
    label: "Monthly Add-Ons",
    description: "Recurring services that attach to any retainer or stand alone.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <TrackPageView event="services_view" />

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
          ]),
          // Schema still references all internal tiers for AI engine
          // discovery — public face is 3, but the underlying offers are
          // discoverable via structured data.
          ...tiers.map((t) =>
            serviceJsonLd({
              name: t.name,
              description: t.description,
              price: t.price,
            }),
          ),
          faqJsonLd(servicesFaqs),
        ]}
      />

      {/* ─────────────────────────────────────────────────────────────
          HERO — 2 CTAs only.
          Primary: 'Get matched to the right package' → /discover
          Secondary: 'View packages' → scrolls to the 3-card grid below
          ───────────────────────────────────────────────────────────── */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Services</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Most businesses don&apos;t need
            <br />
            <span className="text-ink-500">more options. They need the right next step.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Three packages, all running{" "}
            <Link
              href="/about"
              className="font-medium text-ink-700 underline decoration-accent-300 underline-offset-4 hover:text-accent-700"
            >
              The Real Estate Method
            </Link>
            . Tell us about your business — we&apos;ll match you to the right
            one. Or browse all three if you&apos;d rather choose yourself.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/discover" variant="primary" size="lg">
              Get matched to the right package <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="#packages"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-7 text-base font-semibold text-ink-900 transition-all hover:bg-ink-50 hover:shadow-soft"
            >
              View packages
            </a>
          </div>

          <p className="mt-5 text-sm text-ink-400">
            10-min Discovery · Personalised recommendation in 24 hours · No card
          </p>

          {/* Above-the-fold pricing summary — visitors who came to see
              prices shouldn't have to scroll past two hero sections to
              find them. One-line preview with anchor link to the cards. */}
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-rule bg-white px-5 py-4 shadow-soft md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm">
              <span className="font-semibold text-ink-900">
                Starter <span className="font-normal text-ink-500">from R5,000</span>
              </span>
              <span className="hidden h-3 w-px bg-rule sm:inline-block" aria-hidden="true" />
              <span className="font-semibold text-ink-900">
                Growth <span className="font-normal text-ink-500">R5,500/mo</span>
              </span>
              <span className="hidden h-3 w-px bg-rule sm:inline-block" aria-hidden="true" />
              <span className="font-semibold text-ink-900">
                Premium <span className="font-normal text-ink-500">from R10,500/mo</span>
              </span>
            </div>
            <div className="mt-2 text-center text-[11px] text-ink-400">
              All 50/50 payment terms · Cancel monthly retainers after month 3 ·{" "}
              <a href="#packages" className="text-accent-600 hover:text-accent-700">
                See what each includes ↓
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────────────────
          PUBLIC PACKAGES — 3 cards.
          Growth is highlighted as 'Recommended' with visual amplification.
          TrustStrip sits directly above the cards because this is the
          page's first commercial-commitment moment — visitors deciding
          between R5k once-off and R5.5k+/mo retainers need proof at
          the decision point, not buried in the footer.
          ───────────────────────────────────────────────────────────── */}
      <Section variant="default" padding="lg" id="packages">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Three paths</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Pick what fits where you are.
          </h2>
          <p className="mt-4 text-base text-ink-500 leading-relaxed">
            Most clients land on Growth. But if you don&apos;t have the basics
            in place, start with Starter. If you&apos;re already running at
            scale, Premium fits.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <TrustStrip />
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
          <PublicPackagesGrid />
        </div>

        {/* Soft 'Talk to Kabelo' fallback below the grid */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-rule bg-ink-50/60 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-900">
            <MessageCircle className="h-4 w-4 text-accent-600" />
            Not sure this fits?
          </div>
          <p className="mt-2 text-sm text-ink-600 leading-relaxed">
            Take the{" "}
            <Link
              href="/discover"
              className="font-medium text-accent-600 hover:text-accent-700"
            >
              10-min Discovery
            </Link>{" "}
            and we&apos;ll recommend the right package based on your specific
            answers — or honestly tell you we&apos;re not the right fit yet.
          </p>
          <p className="mt-3 text-xs text-ink-500">
            Prefer a human? WhatsApp Kabelo on{" "}
            <a
              href="https://wa.me/27760351084"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-600 hover:text-accent-700"
            >
              +27 76 035 1084
            </a>{" "}
            — typical reply within 1 business hour.
          </p>
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────────────────
          SERP REAL ESTATE MAP — methodology proof.
          Stays public because it explains what each package actually
          covers across the 7 properties.
          ───────────────────────────────────────────────────────────── */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>The Real Estate Method</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            What every package actually covers.
          </h2>
          <p className="mt-4 text-base text-ink-500 leading-relaxed">
            All 7 properties customers use to find businesses like yours.
            Different packages cover different depths — but the methodology is
            the same. No Instagram fluff. No TikTok dances. Just the platforms
            where your buyers actually decide.
          </p>
        </div>

        <div className="mt-10">
          <SerpRealEstateMap />
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────────────────
          COMPARE ALL OPTIONS — expandable, hidden by default.
          For self-serve buyers who want to see the full internal tier
          ladder. The 14 internal tiers are still in the data — they're
          just not the primary face.
          ───────────────────────────────────────────────────────────── */}
      <Section variant="default" padding="default">
        <details className="group mx-auto max-w-6xl rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-8">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                For self-serve buyers
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
                Compare all internal tiers side-by-side
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                The full ladder — 9 retainer + foundation tiers — for buyers
                who want to choose themselves. Most clients don&apos;t need
                this. Discovery picks the right one for you.
              </p>
            </div>
            <span className="flex-shrink-0 rounded-full bg-ink-100 px-3 py-1 text-sm font-medium text-ink-700 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

          <div className="mt-8">
            <TierComparisonTable />
          </div>
        </details>
      </Section>

      {/* ─────────────────────────────────────────────────────────────
          SPECIALTY ADD-ONS — expandable, hidden by default.
          15 specialty services for specific one-off needs.
          Most clients won't need these. Hidden so they don't add to
          decision fatigue.
          ───────────────────────────────────────────────────────────── */}
      <Section variant="tinted" padding="default">
        <details className="group mx-auto max-w-5xl rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-8">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                For specific one-off needs
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
                Specialty services + standalone add-ons
              </h2>
              <p className="mt-2 text-sm text-ink-500">
                Citation packs, schema deployments, content rewrites, brand
                identity, digital PR. Buy alone or attach to any package. Most
                clients don&apos;t need these — the recommended package
                bundles what matters.
              </p>
            </div>
            <span className="flex-shrink-0 rounded-full bg-ink-100 px-3 py-1 text-sm font-medium text-ink-700 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

          <div className="mt-8 space-y-10">
            {(["setup", "content", "growth", "ongoing"] as const).map(
              (category) => {
                const items = addOns.filter((a) => a.category === category);
                const meta = addOnCategoryLabels[category];
                return (
                  <div key={category}>
                    <div className="mb-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                        {meta.label}
                      </div>
                      <p className="mt-2 text-sm text-ink-500">
                        {meta.description}
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {items.map((addon) => (
                        <article
                          key={addon.id}
                          className="rounded-2xl border border-rule bg-white p-6 shadow-soft transition-all hover:shadow-card"
                        >
                          <h3 className="text-lg font-semibold text-ink-900">
                            {addon.name}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-xl font-semibold text-ink-900">
                              {addon.price.sa}
                            </span>
                            <span className="text-sm text-ink-500">
                              {addon.price.intl}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-ink-700 leading-relaxed">
                            {addon.description}
                          </p>
                          <div className="mt-5">
                            <Button
                              href={addon.cta.href}
                              variant="ink"
                              size="sm"
                            >
                              {addon.cta.label}
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </details>
      </Section>

      {/* ─────────────────────────────────────────────────────────────
          FAQs — kept, with new entries explaining the 3-package model
          ───────────────────────────────────────────────────────────── */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Common questions</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Things people ask before they buy.
        </h2>

        <div className="mt-10 space-y-3">
          {servicesFaqs.map((faq) => (
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
              <div className="mt-4 text-base text-ink-700 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ─────────────────────────────────────────────────────────────
          FINAL CTA — leads with Discovery, secondary scan
          ───────────────────────────────────────────────────────────── */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-gradient p-12 text-center text-white shadow-lift">
          <h2 className="text-display-md font-semibold tracking-tight text-white">
            Stop choosing. Start matching.
          </h2>
          <p className="mt-4 text-base text-ink-300">
            10 minutes. We&apos;ll tell you exactly which package fits — or
            honestly say we&apos;re not the right call.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/discover"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-ink-900 shadow-md transition-all duration-200 hover:bg-ink-50 hover:shadow-lift"
            >
              Take the Discovery <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/scan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-base font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/15"
            >
              Just give me a free scan
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
