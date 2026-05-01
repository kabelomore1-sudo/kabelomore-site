import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/jsonld";
import { AiDemoSection } from "@/components/ai-demo-section";
import { AeoVsSeo } from "@/components/aeo-vs-seo";
import { faqJsonLd } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowRight,
  ScanSearch,
  Stethoscope,
  Building2,
  Briefcase,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const homepageFaqs = [
  {
    q: "Is this just social media management?",
    a: "No, and this is the most important question to answer up front. A social media manager schedules posts on Instagram and Facebook — that's mostly visible work. We do mostly invisible work: structured data (the code AI engines read), third-party citations (verified mentions on trusted sites), schema markup, answer-shaped content, and AI citation monitoring. Some of our work shows up on your social feeds. Most of it shows up where you can't see it — but where the AI's decision to recommend you is actually made. If you just need pretty posts on Instagram, hire a social media manager (R3-6K/month is fair for that). If you want AI engines to recommend your business when customers ask, that's our work — and it costs more because the leverage on outcomes is different.",
  },
  {
    q: "What does AEO actually mean for my business, in plain words?",
    a: "AEO stands for Answer Engine Optimisation. In plain words: when your customer asks ChatGPT or Claude 'who's the best [your service] in [your city]', AEO is the work we do to make sure your business is in the answer. Different from SEO (which is about Google's blue links). Same goal — get found — different game.",
  },
  {
    q: "Why pay 50% deposit and 50% on delivery?",
    a: "Splitting payment is the industry standard for project work. It builds trust both ways. We don't get paid in full until you sign off, and you don't risk full payment to a stranger. If we don't deliver what's quoted, you don't pay the second half. Monthly retainers work differently — billed monthly in advance, cancel anytime after the 3-month minimum.",
  },
  {
    q: "How long does it take to see results?",
    a: "Most clients see citation movement within 30 days. Meaningful improvement takes 60-90 days. Unlike paid ads, AEO results compound — the work we do today keeps paying off as AI engines re-train and update. We rescan you every 30 days and show before/after data.",
  },
  {
    q: "Do you guarantee my business will be recommended by ChatGPT?",
    a: "No — and avoid anyone who does. We guarantee a disciplined process: structured data, GBP optimisation, third-party citations, and authoritative content. We measure citation rate before and after. If our process doesn't move the needle, we refine it together. Specific outcome promises in AI search are dishonest.",
  },
  {
    q: "Why are you based in South Africa if you serve UK and US clients?",
    a: "Currency arbitrage. We deliver work to international standards but operate from a lower cost base, so clients get London-quality service at significantly below London rates. The work is entirely online — location doesn't affect outcomes.",
  },
  {
    q: "Can a small South African business really rank in international AI search?",
    a: "Yes. AI engines don't penalise businesses based on country origin — they reward strong structured data, citations, and authoritative content. South African industrial suppliers, professional services, and BBBEE Level 1 firms have a particularly strong opportunity because the local AEO market is undersaturated.",
  },
  {
    q: "I already have a website on WordPress / Wix / Squarespace. Do I need to start over?",
    a: "No. Most clients keep their existing site. We add the AI visibility layer on top — schema markup, GBP setup, citations, AI-shaped content. Whether you're on WordPress, Wix, Squarespace, Shopify, or a custom builder, AEO works on top of what you have. We only recommend a rebuild when your existing site is so slow or broken that fixing it costs more than rebuilding — and we'll tell you honestly during the audit.",
  },
  {
    q: "How much does it cost?",
    a: "We don't have one fixed package. After your free scan we send a custom quote based on what we found — typically R5,500 to R12,500 once-off, plus an optional monthly partnership (R8,500-15,000/mo) for ongoing work. Once-off projects bill 50% deposit, 50% on delivery. Monthly retainers bill in advance, 3-month minimum. Full price list at /pricing if you want to see the menu before booking the scan.",
  },
];

const trustClients = [
  { name: "OMS Lifting Solutions", category: "Industrial · BBBEE Level 1" },
];

const verticals = [
  {
    icon: Building2,
    title: "Industrial & B2B",
    description:
      "Equipment suppliers, fabricators, contractors. One AI recommendation = R50K-500K contract.",
  },
  {
    icon: Stethoscope,
    title: "Medical Practices",
    description:
      "Specialists, dentists, fertility clinics. Patient acquisition through AI-led search.",
  },
  {
    icon: Briefcase,
    title: "Professional Services",
    description:
      "Law firms, accountants, consultancies. SA mid-market is a wide-open AEO frontier.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(homepageFaqs)} />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-gradient pb-20 pt-16 md:pb-32 md:pt-24">
        <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_top,white,transparent_70%)]" />

        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Photo + name signature — personal brand anchor */}
            <div className="mx-auto flex flex-col items-center gap-3">
              <div
                className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-lift ring-4 ring-white md:h-28 md:w-28"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 45%, rgb(245 158 11) 130%)",
                }}
                aria-label="Kabelo More — photo placeholder"
              >
                <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  KM
                </span>
                {/* When the real photo lands: replace the gradient + KM
                    monogram above with:
                    <Image
                      src="/kabelo-headshot.jpg"
                      alt="Kabelo More"
                      fill
                      sizes="(max-width: 768px) 96px, 112px"
                      priority
                      className="object-cover"
                    /> */}
              </div>
              <div className="text-sm font-semibold tracking-tight text-ink-900">
                Kabelo More
              </div>
              <div className="-mt-2 text-xs text-ink-500">
                AI Visibility Consultant · Pretoria, South Africa
              </div>
            </div>

            <Eyebrow className="mt-10 justify-center">
              Serving SA · UK · US · Built in Pretoria
            </Eyebrow>

            <h1 className="mt-6 text-display-xl font-semibold tracking-tight text-ink-900">
              When your customer asks AI for{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">your service</span>
                <span className="absolute inset-x-0 bottom-1 h-3 -z-0 bg-accent-100" />
              </span>
              ,
              <br className="hidden md:block" />
              <span className="text-ink-500">does your business come up?</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-500 md:text-xl">
              For most South African and UK firms, the answer is no. We fix that —
              on whatever website you currently have, in 2-4 weeks, for a flat fee.
              Free scan first, so you see exactly what AI says about you before
              you spend a cent.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/scan" variant="primary" size="lg">
                See what AI says about you — free scan{" "}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="mt-5 text-sm text-ink-400">
              24h turnaround · No card · No forced packages · Custom quote after scan
            </p>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-rule bg-white/60 p-6 shadow-soft backdrop-blur md:p-8">
            <div className="grid gap-6 text-center md:grid-cols-3 md:text-left">
              <div>
                <div className="text-3xl font-semibold tracking-tight text-ink-900">
                  4
                </div>
                <div className="mt-1 text-sm text-ink-500">
                  AI engines tested — ChatGPT, Claude, Gemini, Perplexity
                </div>
              </div>
              <div className="md:border-l md:border-rule md:pl-6">
                <div className="text-3xl font-semibold tracking-tight text-ink-900">
                  Any platform
                </div>
                <div className="mt-1 text-sm text-ink-500">
                  WordPress, Wix, Squarespace, Shopify, custom — works on all
                </div>
              </div>
              <div className="md:border-l md:border-rule md:pl-6">
                <div className="text-3xl font-semibold tracking-tight text-ink-900">
                  R0
                </div>
                <div className="mt-1 text-sm text-ink-500">
                  To find out where you stand. No obligation.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── AI DEMO — see real queries, real engines ─────────────── */}
      <AiDemoSection />

      {/* ─── WHAT'S BROKEN (Problem framing) ──────────────────────── */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">The shift</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
            Search isn't a list of links any more.
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            A growing share of customers ask AI engines first — before they ever see a
            search result page. The AI decides which 2-5 businesses to recommend.
            If your business isn't in that list, you're not in the running.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            {
              h: "Schema",
              p: "AI engines need structured signals (LocalBusiness, Service, FAQ schema) to trust your business. Most SA mid-market sites have none.",
            },
            {
              h: "Citations",
              p: "Third-party mentions in industry directories, professional bodies, and review platforms give AI engines verification anchors. Most businesses haven't built these.",
            },
            {
              h: "Content",
              p: "AI engines quote answer-shaped content — pages that mirror customer questions. Most websites read like brochures, not answers.",
            },
          ].map((item) => (
            <div
              key={item.h}
              className="rounded-2xl border border-rule bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-600">
                {item.h}
              </div>
              <div className="mt-3 text-base text-ink-700 leading-relaxed">
                {item.p}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── AEO vs TRADITIONAL SEO ───────────────────────────────── */}
      <AeoVsSeo />

      {/* ─── HOW WE WORK WITH YOU — single customer-facing flow ──── */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">How we work with you</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
            Four steps. One outcome.
            <br />
            <span className="text-ink-500">Your business, cited by AI.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            No menu of packages to choose from. No pressure to buy.
            Free scan first, custom quote second, work third, results fourth.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "01",
              h: "Scan",
              accent: "bg-ink-900 text-white",
              p: "Request a free scan. We test 4 AI engines on the queries your customers actually run. 24-hour turnaround. PDF report. Free.",
            },
            {
              n: "02",
              h: "Quote",
              accent: "bg-accent-500 text-white",
              p: "We send a custom quote based on what your scan revealed. Typically R5,500 to R12,500 once-off. No standard packages forced on you.",
            },
            {
              n: "03",
              h: "Work",
              accent: "bg-gold-500 text-white",
              p: "We make you findable by AI engines. 2-4 weeks depending on starting point. Works on whatever platform you're on — WordPress, Wix, Squarespace, custom.",
            },
            {
              n: "04",
              h: "Result",
              accent: "bg-emerald-500 text-white",
              p: "You're cited by ChatGPT, Claude, Gemini, Perplexity within 30-90 days. We measure before and after, and send you proof.",
            },
          ].map((step) => (
            <article
              key={step.n}
              className="rounded-2xl border border-rule bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm ${step.accent}`}
              >
                {step.n}
              </div>
              <div className="mt-5 text-2xl font-semibold tracking-tight text-ink-900">
                {step.h}
              </div>
              <p className="mt-3 text-sm text-ink-700 leading-relaxed">
                {step.p}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-ink-500">
            Want to see the menu before booking the scan?
          </p>
          <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              Full price list <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <span className="hidden text-ink-300 sm:inline">·</span>
            <Link
              href="/how-we-work"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              Detailed delivery process <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── WHO IT'S FOR ─────────────────────────────────────────── */}
      <Section variant="ink" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Who we work with</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-white">
            Built for businesses that win on
            <br />
            <span className="text-accent-400">a single recommendation.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-300">
            If one new customer is worth R5,000 or more to your business, AI visibility
            usually pays for itself before the project ends.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
          {verticals.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-colors hover:bg-white/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/20 text-accent-400">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-5 text-lg font-semibold text-white">{title}</div>
              <div className="mt-2 text-sm text-ink-300 leading-relaxed">
                {description}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── PROOF / TRUST ────────────────────────────────────────── */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <Eyebrow>Proof in progress</Eyebrow>
              <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
                First case study being built in public.
              </h2>
              <p className="mt-5 text-base text-ink-500 leading-relaxed">
                <strong className="text-ink-900">OMS Lifting Solutions</strong> — a
                BBBEE Level 1 industrial supplier in Pretoria — is the first live AEO
                case study. Going from invisible across all four AI engines to cited,
                with full before-and-after data published once the 30-day rescan lands.
              </p>
              <div className="mt-7">
                <Link
                  href="/case-studies/oms-lifting-solutions"
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
                >
                  Follow the OMS case study <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {trustClients.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-rule bg-white p-6"
                >
                  <div className="text-base font-semibold text-ink-900">
                    {c.name}
                  </div>
                  <div className="mt-1 text-sm text-ink-500">{c.category}</div>
                </div>
              ))}
              <div className="rounded-2xl bg-ink-50 p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600" />
                  <div className="text-sm text-ink-700 leading-relaxed">
                    Your business could be next. Free scan, 24h turnaround.{" "}
                    <Link
                      href="/scan"
                      className="font-medium text-accent-600 hover:text-accent-700"
                    >
                      Request one →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── FINAL CTA ────────────────────────────────────────────── */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-white">
            <ScanSearch className="h-6 w-6" />
          </div>
          <h2 className="mt-7 text-display-lg font-semibold tracking-tight text-ink-900">
            See what AI says about your business.
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            Submit your business name and website. We test 4 AI engines on the queries
            your customers actually run. 2-page report in your inbox within 24 hours.
            No card. No obligation. No follow-up unless you ask for one.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/scan" variant="primary" size="lg">
              Request your free scan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-5 text-sm text-ink-400">
            After the scan we send a custom quote, scoped to what your business
            actually needs. No forced packages.
          </p>
        </div>
      </Section>
    </>
  );
}
