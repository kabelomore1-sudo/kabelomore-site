import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/jsonld";
import { AiDemoSection } from "@/components/ai-demo-section";
import { AeoVsSeo } from "@/components/aeo-vs-seo";
import { faqJsonLd } from "@/lib/seo";
import { tiers } from "@/lib/site";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheck,
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
    a: "No. Most clients keep their existing site. We add the AI visibility layer on top — schema markup, GBP setup, citations, AI-shaped content. Whether you're on WordPress, Wix, Squarespace, Shopify, or a custom builder, AEO works on top of what you have. That's the Optimization Pack (R10,500, 3 weeks). We only recommend a rebuild when your existing site is so slow or broken that fixing it costs more than rebuilding — and we'll tell you honestly during the audit.",
  },
  {
    q: "What's the difference between Foundation Pack, Optimization Pack, Starter, Growth, and Premium?",
    a: "Foundation Pack (R12,500) is for businesses with NO website yet — we build everything from zero. Optimization Pack (R10,500) is for businesses with an EXISTING website that just need the AEO infrastructure layered on. Starter Audit (R5,000) is the diagnostic — find out where you stand with a written plan. Growth (R8,500/month) is ongoing optimisation: articles, GBP posts, schema updates, citations, reports. Premium (R15,000/month) is Growth plus dedicated specialist time and full first-month implementation for businesses where AI visibility is THE growth strategy.",
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
            <Eyebrow className="justify-center">
              AI Visibility · AEO · Pretoria → London
            </Eyebrow>

            <h1 className="mt-6 text-display-xl font-semibold tracking-tight text-ink-900">
              Most businesses are{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">invisible</span>
                <span className="absolute inset-x-0 bottom-1 h-3 -z-0 bg-accent-100" />
              </span>{" "}
              to AI search.
              <br className="hidden md:block" />
              <span className="text-ink-500">I fix that.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-500 md:text-xl">
              When customers ask ChatGPT, Claude, Gemini, or Perplexity to recommend a
              business in your category — does your name come up? For most professional
              firms in South Africa and the UK, the answer is no. That's a revenue
              problem hiding in plain sight.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/scan" variant="primary" size="lg">
                Get a free AI scan <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                See pricing
              </Button>
            </div>

            <p className="mt-5 text-sm text-ink-400">
              24-hour turnaround · No obligation · Real businesses, real before-and-after data
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
                  AI engines tested per audit
                </div>
              </div>
              <div className="md:border-l md:border-rule md:pl-6">
                <div className="text-3xl font-semibold tracking-tight text-ink-900">
                  24h
                </div>
                <div className="mt-1 text-sm text-ink-500">
                  Free scan turnaround
                </div>
              </div>
              <div className="md:border-l md:border-rule md:pl-6">
                <div className="text-3xl font-semibold tracking-tight text-ink-900">
                  R0
                </div>
                <div className="mt-1 text-sm text-ink-500">
                  To find out if AI recommends you
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

      {/* ─── 5-STEP PROCESS ───────────────────────────────────────── */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">How we work</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
            Five disciplined steps.
            <br />
            <span className="text-ink-500">Same process, every client.</span>
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-2xl bg-rule shadow-card md:grid-cols-5">
          {[
            { n: "01", h: "Scan", p: "Test your business across ChatGPT, Claude, Gemini, and Perplexity. Capture verbatim responses." },
            { n: "02", h: "Diagnose", p: "Audit website schema, GBP, third-party citations, review velocity. Map competitive gaps." },
            { n: "03", h: "Build", p: "Deploy schema, optimise GBP, publish answer-shaped content, establish citations." },
            { n: "04", h: "Measure", p: "Rescan at 30 days. Show before-and-after citation data. Prove the work." },
            { n: "05", h: "Compound", p: "Keep optimising as AI models update. Own your category over time." },
          ].map((step) => (
            <div key={step.n} className="bg-white p-6">
              <div className="text-sm font-mono text-accent-600">{step.n}</div>
              <div className="mt-3 text-lg font-semibold text-ink-900">
                {step.h}
              </div>
              <div className="mt-2 text-sm text-ink-500 leading-relaxed">
                {step.p}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/process"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            Full process breakdown <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* ─── PRICING TIERS PREVIEW ────────────────────────────────── */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Services</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
            Where are you starting from?
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            From "I have nothing yet" to "I want serious growth" — pick what fits.
            Pay 50% to start on once-off work, 50% on delivery. Monthly retainers billed in advance, cancel after 3 months.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers
            .filter((t) => ["scan", "foundation", "growth", "premium"].includes(t.id))
            .map((tier) => (
            <div
              key={tier.id}
              className={
                tier.highlight
                  ? "relative rounded-2xl bg-ink-900 p-7 text-white shadow-lift ring-1 ring-ink-900"
                  : "rounded-2xl border border-rule bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
              }
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-7 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  Most popular
                </div>
              )}
              <div
                className={
                  tier.highlight
                    ? "text-xs font-semibold uppercase tracking-[0.14em] text-accent-400"
                    : "text-xs font-semibold uppercase tracking-[0.14em] text-accent-600"
                }
              >
                {tier.category === "scan" && "Try us"}
                {tier.category === "foundation" && "No website yet"}
                {tier.category === "audit" && "Just clarity"}
                {tier.category === "retainer" && (tier.id === "premium" ? "Serious growth" : "Ongoing growth")}
              </div>
              <div className="mt-3 text-xl font-semibold">{tier.name}</div>
              <div className="mt-3">
                <div className={tier.highlight ? "text-2xl font-semibold" : "text-2xl font-semibold text-ink-900"}>
                  {tier.price.sa}
                </div>
                <div className={tier.highlight ? "text-xs text-ink-300" : "text-xs text-ink-400"}>
                  {tier.price.intl}
                </div>
              </div>
              <div
                className={
                  tier.highlight
                    ? "mt-3 inline-flex rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-accent-300"
                    : "mt-3 inline-flex rounded-full bg-accent-50 px-2 py-1 text-[10px] uppercase tracking-wider text-accent-700"
                }
              >
                {tier.payment}
              </div>
              <p className={tier.highlight ? "mt-4 text-sm text-ink-300 leading-relaxed" : "mt-4 text-sm text-ink-500 leading-relaxed"}>
                {tier.bestFor}
              </p>
              <ul className="mt-5 space-y-2">
                {tier.receives.slice(0, 4).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <CircleCheck
                      className={
                        tier.highlight
                          ? "mt-0.5 h-4 w-4 flex-shrink-0 text-accent-400"
                          : "mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500"
                      }
                    />
                    <span className={tier.highlight ? "text-ink-100" : "text-ink-700"}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  href={tier.cta.href}
                  variant={tier.highlight ? "ink" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  {tier.cta.label}
                </Button>
              </div>
            </div>
          ))}
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
            Find out if AI recommends your business.
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            Submit your business name and website. You'll have a 2-page report in your
            inbox within 24 hours. Free. No follow-up unless you want one.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/scan" variant="primary" size="lg">
              Request your free scan <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="ghost" size="lg">
              Or see services first
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
