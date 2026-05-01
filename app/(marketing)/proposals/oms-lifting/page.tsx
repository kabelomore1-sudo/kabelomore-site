import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wrench,
  Search,
  TrendingUp,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

const PROPOSAL_DATE = "1 May 2026";
const VALID_THROUGH = "31 May 2026";
const CLIENT_NAME = "OMS Lifting Solutions";

export const metadata: Metadata = {
  title: `Proposal — ${CLIENT_NAME} · AI Visibility Optimization`,
  description: `Custom proposal from Kabelomore for ${CLIENT_NAME}. AEO infrastructure deployment to get cited by ChatGPT, Claude, Gemini, Perplexity within 90 days.`,
  alternates: { canonical: `${site.url}/proposals/oms-lifting` },
  robots: {
    // Proposals shouldn't be search-indexed — they're transactional, not informational
    index: false,
    follow: false,
  },
};

const auditFindings = {
  whatsGood: [
    "Title tags on every page — well-structured, includes location + certifications + services (e.g. \"OMS Lifting Solutions | ECSA & LME Registered Lifting Equipment & Inspections | South Africa\")",
    "Comprehensive meta descriptions referencing DMR 18, load testing, and full service area (Gauteng, North West, Limpopo)",
    "OpenGraph + Twitter Card meta tags for clean social sharing",
    "Geo-tagged with lat/long coordinates (-25.7579, 28.1627) for Pretoria",
    "Canonical URLs declared correctly",
    "Robots.txt properly configured with Googlebot/Bingbot priority access",
    "Sitemap.xml present at /sitemap.xml with all 17 pages and current lastmod dates",
    "Two-location architecture (/locations/pretoria, /locations/rustenburg) — well-structured for multi-region AEO",
    "Service pages with deeply specific content — DMR 18 inspection intervals, OHS Act references, ECSA-registered LMI/LTI terminology, SANS standards",
    "Real, verifiable credentials cited: ECSA registration, LME registered, LEEASA member, BBBEE Level 1 (100% Black-owned)",
  ],
  whatsMissing: [
    "Zero JSON-LD schema markup on any page (LocalBusiness, Organization, Service, FAQ all absent)",
    "No llms.txt file at site root — AI crawlers like GPTBot and ClaudeBot have no structured business overview to read",
    "AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai) not explicitly allowed in robots.txt",
    "Excellent regulatory content (DMR 18, OHS Act, SANS) written as authoritative paragraphs — not structured as Q&A blocks that AI engines can quote directly",
    "Google Business Profile state needs verification (likely incomplete or unlinked from site for both Pretoria and Rustenburg)",
    "No FAQPage schema deployed — even though the inspection content is 90% answer-shaped already",
    "Internal directory citations (Brabys, Cylex, Hellopeter, etc.) need NAP consistency audit",
  ],
};

const deliverables = [
  {
    icon: Search,
    title: "JSON-LD schema deployed across all 17 pages",
    items: [
      "LocalBusiness schema on homepage + each location page (Pretoria + Rustenburg as separate verified entities)",
      "Organization schema with verified BBBEE Level 1, ECSA, LME, LEEASA credentials",
      "Service schema on each of your 7 service pages",
      "FAQPage schema on inspection content (turning DMR 18 paragraphs into structured Q&A)",
      "BreadcrumbList on all inner pages",
      "Person schema on About if owner-led",
      "All schema validated in Google Rich Results Test before sign-off",
    ],
  },
  {
    icon: Wrench,
    title: "AI-specific files + crawler permissions",
    items: [
      "llms.txt deployed at omslifting.co.za/llms.txt (structured business overview for ChatGPT, Claude, Perplexity)",
      "Robots.txt updated to explicitly allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai",
      "Sitemap.xml validated and re-submitted to Google Search Console",
    ],
  },
  {
    icon: TrendingUp,
    title: "Content layer — 3 priority pages rewritten in answer-shape",
    items: [
      "Inspection, Testing & Certification page (already 80% answer-shape; converting to explicit Q&A blocks)",
      "Lifting Equipment Supply & Sales page",
      "Workshop Maintenance & Repairs page",
      "Each page gets 6-8 question-answer blocks structured for AI quotation",
      "Existing content preserved — we add structure, not replace voice",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Google Business Profile rebuild — both locations",
    items: [
      "Pretoria HQ (385 Charlotte Maxeke) — claim/verify, 100% completion",
      "Rustenburg location — claim/verify as separate GBP entity",
      "Categories: Industrial Equipment Supplier (primary), with Lifting Equipment, Crane Services as secondary",
      "Hours, services list, photos (10+ per location), Q&A seeded",
      "BBBEE attributes set, woman-owned/Black-owned attributes set",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Citation cleanup + 10 new directory listings",
    items: [
      "NAP audit across existing listings (Brabys, Cylex, etc.) — fix any inconsistencies",
      "10 new citations: Brabys, Cylex SA, Yellosa, Showme, SAYellow, Hellopeter, Bing Places, Apple Business Connect",
      "Industry-specific: SA Mining, LEEASA member directory linkage, ECSA register linkage",
      "All NAP-consistent (\"OMS Lifting Solutions (Pty) Ltd\" everywhere)",
    ],
  },
  {
    icon: Mail,
    title: "Documentation + handover",
    items: [
      "Before/after AI scan data captured across all 4 engines (10 priority queries each) — yours to keep",
      "PDF documentation of every change made + every login + every URL touched",
      "30-min handover call + 15-min self-edit walkthrough",
      "60-day support window for small fixes (free)",
    ],
  },
];

const timeline = [
  {
    week: "Week 1",
    title: "Audit deep-dive + GBP verification",
    items: [
      "Day 1-2: kickoff call, deposit clears, internal scoping",
      "Day 3-4: full technical audit + competitor benchmark across 3 SA lifting equipment competitors",
      "Day 5-7: GBP verification process kicks off (postcard or video) for both Pretoria + Rustenburg",
    ],
  },
  {
    week: "Week 2",
    title: "Schema + content layer",
    items: [
      "Day 8-12: JSON-LD schema deployment across all 17 pages (working with cousin if available, or via shared admin / GTM)",
      "Day 12-14: 3 priority pages rewritten in Q&A shape; FAQPage schema added",
    ],
  },
  {
    week: "Week 3",
    title: "Citations + AI files + handover",
    items: [
      "Day 15-17: 10 directory citations established + existing NAP cleanup",
      "Day 17-18: llms.txt deployed, robots.txt updated, AI crawlers explicitly allowed",
      "Day 19: final 4-engine AI rescan captures BEFORE/AFTER data",
      "Day 21: handover call, final invoice, 60-day support window starts",
    ],
  },
];

const founderPricingTrade = [
  "Public case study rights — OMS named on kabelomore.com with before/after AI citation data, verified by you before publishing",
  "60-second testimonial video on phone (1 take, your real words, no script) — captured during the trip we discussed",
  "Permission to track 10 OMS-relevant queries in our daily AI tracker for 6 months — data goes into the public case study",
  "Reference call rights — 1-2 calls per quarter to a future prospect asking \"do you have industrial clients?\"",
];

export default function OmsProposalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Proposals", href: "/proposals" },
          { label: CLIENT_NAME, href: "/proposals/oms-lifting" },
        ])}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Custom proposal · {PROPOSAL_DATE}</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            For the {CLIENT_NAME} team:
            <br />
            <span className="text-ink-500">
              get cited by ChatGPT, Claude, Gemini, and Perplexity within 90 days.
            </span>
          </h1>
          <p className="mt-7 text-lg text-ink-500 leading-relaxed">
            Customers are increasingly asking AI engines for &quot;best lifting
            equipment supplier in Pretoria&quot; or &quot;BBBEE Level 1 ECSA-registered
            lifting company.&quot; Right now, AI engines recommend your competitors —
            not because their work is better, but because their AEO infrastructure
            is in place and yours isn&apos;t. This proposal lays out exactly what
            we&apos;d deploy, in 3 weeks, to fix that.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-rule bg-white p-5 shadow-soft">
              <div className="text-sm text-ink-500">Investment</div>
              <div className="mt-1 text-2xl font-semibold text-ink-900">R5,500</div>
              <div className="text-xs text-ink-400">founder pricing</div>
            </div>
            <div className="rounded-2xl border border-rule bg-white p-5 shadow-soft">
              <div className="text-sm text-ink-500">Timeline</div>
              <div className="mt-1 text-2xl font-semibold text-ink-900">3 weeks</div>
              <div className="text-xs text-ink-400">start to handover</div>
            </div>
            <div className="rounded-2xl border border-rule bg-white p-5 shadow-soft">
              <div className="text-sm text-ink-500">Site impact</div>
              <div className="mt-1 text-2xl font-semibold text-ink-900">Zero rebuild</div>
              <div className="text-xs text-ink-400">we add a layer, not replace</div>
            </div>
          </div>

          <div className="mt-8 text-sm text-ink-500">
            Proposal valid through {VALID_THROUGH}. Reply to{" "}
            <a
              href={`mailto:${site.contact.email}?subject=OMS%20Lifting%20-%20Proposal%20Acceptance`}
              className="text-accent-600 hover:text-accent-700"
            >
              {site.contact.email}
            </a>{" "}
            or via WhatsApp to accept.
          </div>
        </div>
      </Section>

      {/* What we found */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>What we found in the audit</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Your site is properly built. The AEO layer is missing.
        </h2>
        <p className="mt-5 text-base text-ink-700 leading-relaxed">
          Before we describe the work, let&apos;s be specific about what&apos;s already
          good — because we&apos;re not selling you on a rebuild. We&apos;re selling
          you on adding the next layer to a foundation that already shows real
          craft. Whoever built your site cared about quality.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              What&apos;s already strong
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
              {auditFindings.whatsGood.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              The AEO gap (what we fix)
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-700">
              {auditFindings.whatsMissing.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Deliverables */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Exactly what you receive</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            6 specific deliverables. No vagueness.
          </h2>
          <p className="mt-4 text-base text-ink-500">
            Every line below is something you can log into, point to, or hand to
            your accountant. If we don&apos;t deliver what&apos;s listed here, you
            don&apos;t pay the second 50%.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl space-y-5">
          {deliverables.map((d, idx) => {
            const Icon = d.icon;
            return (
              <article
                key={d.title}
                className="rounded-2xl border border-rule bg-white p-6 shadow-soft md:p-7"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ink-900 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-accent-600">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-semibold tracking-tight text-ink-900">
                        {d.title}
                      </h3>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {d.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-ink-700"
                        >
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Timeline */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Week-by-week</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          21 days from kickoff to handover.
        </h2>

        <div className="mt-10 space-y-5">
          {timeline.map((phase, idx) => (
            <div
              key={phase.week}
              className="rounded-2xl border border-rule bg-white p-7 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-accent-600">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  {phase.week}
                </span>
              </div>
              <div className="mt-2 text-xl font-semibold tracking-tight text-ink-900">
                {phase.title}
              </div>
              <ul className="mt-4 space-y-1.5">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-ink-700"
                  >
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-700" />
            <div className="text-sm text-ink-700 leading-relaxed">
              <span className="font-semibold text-ink-900">
                Status update every 3 working days.
              </span>{" "}
              You always know where things stand. If a milestone slips,
              you&apos;ll know about it before it slips. No surprises.
            </div>
          </div>
        </div>
      </Section>

      {/* Investment + founder pricing */}
      <Section variant="ink" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow className="text-accent-400">Investment</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-white">
            R5,500 once-off — founder pricing.
            <br />
            <span className="text-ink-300">
              Standard rate is R10,500. The discount has a real trade.
            </span>
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-400">
                Founder pricing — R5,500
              </div>
              <div className="mt-3 text-base text-white">
                R2,750 deposit to start
                <br />
                R2,750 due on delivery (Day 21)
              </div>
              <div className="mt-5 text-xs uppercase tracking-wider text-ink-300">
                What you give in return:
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-ink-200">
                {founderPricingTrade.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-300">
                Standard pricing — R10,500
              </div>
              <div className="mt-3 text-base text-white">
                R5,250 deposit to start
                <br />
                R5,250 due on delivery (Day 21)
              </div>
              <div className="mt-5 text-xs uppercase tracking-wider text-ink-400">
                Standard, no case study commitment:
              </div>
              <ul className="mt-3 space-y-2.5 text-sm text-ink-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                  Identical scope and deliverables
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                  No requirement to be a public case study
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                  No testimonial or reference call obligation
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                  Full privacy — your engagement stays private
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-accent-400/30 bg-accent-500/10 p-6 backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-400">
              Optional · After delivery
            </div>
            <div className="mt-3 text-lg font-semibold text-white">
              Growth Retainer — R6,000/mo (founder rate; standard is R8,500)
            </div>
            <p className="mt-3 text-sm text-ink-300 leading-relaxed">
              Once-off Optimization is the foundation. The Growth Retainer is the
              compounding work — 2 articles per month, schema updates, ongoing
              citation building, monthly competitor monitoring, monthly AI
              citation reports. AEO compounds for 12-24 months; the businesses
              that maintain through that window widen the gap from those that
              don&apos;t. 3-month minimum, then month-to-month with 30 days
              notice. Discovery & Strategy Sprint (R3,500 value) included free
              in month 1.
            </p>
          </div>
        </div>
      </Section>

      {/* Honest commitment */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Honest commitment</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          What I commit to. What I don&apos;t.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-rule bg-white p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              I commit to
            </div>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
                Delivering every item on the list above within 21 days, or
                you don&apos;t pay the second 50%
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
                A status update every 3 working days throughout the engagement
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
                Working alongside (not around) your existing developer; full
                credit in the public case study
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
                Before/after AI citation data captured and shared, verified
                across all 4 engines
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-600" />
                60 days of free email support after delivery
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-rule bg-ink-50/30 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink-500">
              <XCircle className="h-4 w-4" />
              I don&apos;t commit to
            </div>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                Specific outcomes from specific AI engines on specific dates
                (anyone who promises that is dishonest about how AEO works)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                Quantity guarantees on lead volume or revenue from this work
                (those depend on too many factors outside AEO)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                Touching your existing site code without your developer&apos;s
                involvement (we collaborate or use Google Tag Manager —
                never bypass)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                Generic SEO promises like &quot;rank #1 on Google&quot; (AEO
                is the new game; SEO ranking is a side effect, not the goal)
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-gradient p-10 text-center text-white shadow-lift md:p-12">
          <h2 className="text-display-md font-semibold tracking-tight">
            Ready to be the business AI engines recommend?
          </h2>
          <p className="mt-5 text-base text-ink-300 leading-relaxed">
            Reply &quot;accept&quot; via email or WhatsApp. I send the deposit
            invoice within 1 hour. Kickoff call within 48 hours. Work starts the
            moment your deposit clears.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={`mailto:${site.contact.email}?subject=OMS%20Lifting%20-%20Proposal%20Acceptance%20(R5,500%20Founder%20Pricing)&body=Hi%20Kabelo%2C%0A%0AWe%20accept%20the%20Founder%20Pricing%20proposal%20for%20OMS%20Lifting%20Solutions%20at%20R5%2C500%20with%20case%20study%20rights.%0A%0APlease%20send%20the%20deposit%20invoice%20to%3A%0A%0A%5BBilling%20email%5D%0A%0AThanks%2C%0A%5BYour%20name%5D`}
              variant="ink"
              size="lg"
            >
              Accept founder pricing (R5,500) <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href={`mailto:${site.contact.email}?subject=OMS%20Lifting%20-%20Standard%20Pricing%20Acceptance%20(R10,500)`}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              Or accept standard (R10,500)
            </Button>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-2 text-sm text-ink-400 sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              {site.contact.email}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              WhatsApp on the same number you reached me on
            </span>
          </div>
          <div className="mt-8 text-xs text-ink-500">
            Proposal valid through {VALID_THROUGH}. After that, founder pricing
            may not be available — only standard pricing.
          </div>
        </div>
      </Section>

      {/* Trust footer */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="text-center text-sm text-ink-500">
          <p>
            Prepared by Kabelo More on {PROPOSAL_DATE}.{" "}
            <a
              href={`${site.url}`}
              className="text-accent-600 hover:text-accent-700"
            >
              kabelomore.com
            </a>
            {" · "}
            <a
              href="/blog/aeo-vs-seo-2026-south-african-business-guide"
              className="text-accent-600 hover:text-accent-700"
            >
              Read &quot;AEO vs SEO 2026&quot;
            </a>
            {" · "}
            <a href="/scan" className="text-accent-600 hover:text-accent-700">
              Free AI Scan
            </a>
          </p>
          <p className="mt-2 text-xs text-ink-400">
            This proposal is private. URL not indexed by search engines.
            Share at your discretion.
          </p>
        </div>
      </Section>
    </>
  );
}
