import { Button } from "@/components/ui/button";
import { Section, Eyebrow } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/jsonld";
import { AiDemoSection } from "@/components/ai-demo-section";
import { AeoVsSeo } from "@/components/aeo-vs-seo";
import { AiResponseMockup } from "@/components/ai-response-mockup";
import { VisualPillars } from "@/components/visual-pillars";
import { FounderAvatar } from "@/components/founder-avatar";
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
  Zap,
  ClipboardList,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { CredentialsBadgeRow } from "@/components/credentials";
import { BeforeAfter } from "@/components/before-after";

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
    a: "Three core packages. Starter at R5,000 (foundations for solo professionals), Optimization Pack at R10,500 (the full AEO layer in 3 weeks — most clients start here), and Growth retainer at R5,500/month for compounding monthly work. Once-off projects bill 50% deposit, 50% on delivery. Monthly retainers bill in advance, 3-month minimum. Full price list at /pricing.",
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
      <section className="relative overflow-hidden bg-hero-gradient pb-14 pt-10 md:pb-20 md:pt-14">
        <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_top,white,transparent_70%)]" />

        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Photo + name signature — personal brand anchor */}
            <div className="mx-auto flex flex-col items-center gap-3">
              <FounderAvatar size={112} className="ring-4" />
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

            {/* Hero headline — promise-first, not question-first.
                Previous copy asked "does your business come up?" which
                forced the visitor into a thinking pose before they could
                act. Replaced with a declarative promise that names the
                ICP (SA medical / legal / industrial) and the outcome
                (get cited by AI engines). */}
            {/* Hero headline — promise-first, fully visible at all
                breakpoints. `whitespace-nowrap` was previously applied
                to the highlighted engine list which caused horizontal
                overflow on narrow viewports (375-640px). Now the engine
                names wrap naturally; the accent underline still works
                because `inline` allows multi-line span backgrounds via
                box-decoration-break. */}
            <h1 className="mt-6 text-display-xl font-semibold tracking-tight text-ink-900">
              Get your business cited by{" "}
              <span className="relative inline-block">
                <span className="relative z-10">
                  ChatGPT, Claude, Gemini, Perplexity
                </span>
                <span
                  className="absolute inset-x-0 bottom-1 h-3 -z-0 bg-accent-100"
                  aria-hidden="true"
                />
              </span>{" "}
              <br className="hidden md:block" />
              <span className="text-ink-500">— where your customers ask first.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-500 md:text-xl">
              For SA medical, legal, and industrial firms. We run a free
              30-second scan, deliver a personalised report in 24 hours, and
              fix what&apos;s broken with{" "}
              <Link
                href="/about"
                className="font-semibold text-ink-700 underline decoration-accent-300 underline-offset-4 hover:text-accent-700 hover:decoration-accent-500"
              >
                The Real Estate Method
              </Link>{" "}
              — covering all 7 places your customers actually search.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/scan"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-7 text-base font-semibold text-white shadow-lift transition-all duration-200 hover:bg-ink-800 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                style={{ height: "3rem" }}
              >
                Free 30-second scan
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-7 text-base font-semibold text-ink-900 transition-all duration-200 hover:bg-ink-50 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                style={{ height: "3rem" }}
              >
                Take the 10-min Discovery
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-5 text-sm text-ink-400">
              24h turnaround · No card · No forced packages
            </p>

            {/* Pricing pre-qualifier — reduces post-scan sticker shock */}
            <p className="mt-2 text-sm text-ink-500">
              Most engagements:{" "}
              <span className="font-semibold text-ink-700">
                R5,500–R12,500 once-off
              </span>{" "}
              ·{" "}
              <Link
                href="/services"
                className="text-accent-600 hover:text-accent-700"
              >
                See full pricing
              </Link>
            </p>
          </div>

          {/* Trust strip — solid bg + shadow-card per polish sprint */}
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-rule bg-white p-6 shadow-card md:p-8">
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
                  Free
                </div>
                <div className="mt-1 text-sm text-ink-500">
                  To find out where you stand. No card, no obligation.
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-rule pt-5">
              <CredentialsBadgeRow />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── VISUAL PROOF: AI BEFORE/AFTER ────────────────────────────
          Sits directly after the hero so prospects who scrolled past
          the headline land on a visual demonstration of the gap.
          Two states they can toggle between:
            BEFORE — AI cites a competitor, prospect not in answer
            AFTER  — AI cites the prospect by name
          Higher-impact than copy because most visitors don't know
          what "AI visibility" looks like until they see it. */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">See the gap</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            What AI says about your category — before and after.
          </h2>
          <p className="mt-4 text-base text-ink-500 leading-relaxed">
            Toggle below to see what ChatGPT (or a Claude+web search proxy)
            returns for a typical customer query — first as most SA firms
            appear today, then after AEO work compounds.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <BeforeAfter
            caption="Customer query: &quot;Best lifting equipment supplier in Pretoria&quot;"
            subcaption="Industrial supplier — illustrative example based on real scan patterns"
            beforeLabel="❌ Before AEO"
            afterLabel="✓ After AEO"
            before={<AiConversationBefore />}
            after={<AiConversationAfter />}
          />
        </div>
      </Section>

      {/* ─── PICK YOUR PATH — three cards into the funnel ────────────
          Reinforces nav with body content. Each card is a real
          conversion path, not a marketing hook. */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Where to start</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Three free ways to see where you stand.
          </h2>
          <p className="mt-4 text-base text-ink-500 leading-relaxed">
            All free. All public. Pick whichever matches the time you have.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
          {[
            {
              icon: Zap,
              accent: "bg-ink-900 text-white",
              eyebrow: "30 seconds",
              title: "Quick scan",
              body: "Submit your business + city. We run customer-style queries via Claude + live web search (a proxy for ChatGPT, Gemini, Perplexity) and deliver a personalised report within 24h.",
              cta: "Run the free scan",
              href: "/scan",
            },
            {
              icon: ClipboardList,
              accent: "bg-accent-500 text-white",
              eyebrow: "10 minutes",
              title: "Deep Discovery",
              body: "15-question intake covering services, customers, competitors, goals. Personalised SEO + AI report in 24h.",
              cta: "Take the Discovery",
              href: "/discover",
            },
            {
              icon: BookOpen,
              accent: "bg-emerald-500 text-white",
              eyebrow: "Read it now",
              title: "Sector checklists",
              body: "47-point AEO checklists for medical, legal, and industrial firms. Public, ungated, print-friendly.",
              cta: "Read the checklists",
              href: "/resources",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-rule bg-white p-7 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lift"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                  {card.eyebrow}
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink-900">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-sm text-ink-700 leading-relaxed">
                  {card.body}
                </p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent-600 group-hover:text-accent-700">
                  {card.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Methodology + Index secondary links — for visitors who want
            more before they click into a tool */}
        <div className="mx-auto mt-10 max-w-3xl text-center text-sm text-ink-500">
          Want context first?{" "}
          <Link
            href="/about"
            className="font-medium text-accent-600 hover:text-accent-700"
          >
            Read The Real Estate Method
          </Link>
          {" · "}
          <Link
            href="/leaderboard"
            className="font-medium text-accent-600 hover:text-accent-700"
          >
            See the SA AEO Index
          </Link>
        </div>
      </Section>

      {/* ─── VISUAL: AI Response Mockup (the gut punch) ───────────── */}
      <AiResponseMockup />

      {/* ─── EXISTING: 4-engine video demo (industrial vertical) ──── */}
      <AiDemoSection />

      {/* ─── VISUAL: Three pillars with code/visual examples ──────── */}
      <VisualPillars />

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
                  <div className="flex-1 text-sm text-ink-700 leading-relaxed">
                    Your business could be next. Free scan, 24h turnaround.
                    <div className="mt-3">
                      <Button href="/scan" variant="primary" size="sm">
                        Get a free AI scan <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── HOMEPAGE FAQ — visible HTML mirrors the FAQPage schema ─
          Critical: the FAQPage schema in the JsonLd at the top of this
          page declares 9 questions + answers. Per Google's structured-
          data guidelines, the same content MUST be visible to users on
          the page. Without this section the schema was orphaned data
          and Google's parser could downgrade or ignore the FAQ markup
          entirely. Rendering visibly closes the data/markup mismatch. */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Eyebrow className="justify-center">Frequently asked</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
              Questions clients actually ask.
            </h2>
            <p className="mt-3 text-base text-ink-500">
              The most common questions about AEO, pricing, and what to
              expect from working together.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {homepageFaqs.map((faq, idx) => (
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

// ─── Local visuals for the BeforeAfter homepage section ─────────────
// These render as the "before" and "after" panes inside the toggle.
// Inline rather than separate files because they're hard-coded copy
// for ONE specific homepage placement — extracting them creates a
// component with one caller, which adds indirection for no reuse.
//
// Visual pattern matches the existing AiResponseMockup style so the
// comparison feels consistent with the rest of the site.

function AiConversationBefore() {
  return (
    <div className="space-y-3">
      {/* Engine chrome */}
      <div className="flex items-center gap-2 border-b border-rule pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-ink-900">ChatGPT</div>
          <div className="text-[10px] text-ink-500">Web search · 2s ago</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-700">
          <XCircle className="h-3 w-3" />
          You: not cited
        </span>
      </div>

      {/* Customer query */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink-900 px-3.5 py-2 text-xs leading-relaxed text-white md:text-[13px]">
          Best lifting equipment supplier in Pretoria?
        </div>
      </div>

      {/* AI response */}
      <div className="flex justify-start">
        <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-ink-50 px-3.5 py-2.5 text-xs leading-relaxed text-ink-700 md:text-[13px]">
          For lifting equipment suppliers in Pretoria, the top names that come
          up include <strong className="text-ink-900">Integrate Lifting SA</strong>,{" "}
          <strong className="text-ink-900">Elephant Lifting Equipment</strong>, and{" "}
          <strong className="text-ink-900">RGM Cranes</strong> — all with strong
          local presence and customer reviews. Each offers a range of hoists,
          gantries, and certified inspection services for the Gauteng market.
        </div>
      </div>

      {/* Footer alert */}
      <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-600" />
        <p className="text-[11px] leading-relaxed text-ink-700">
          <strong className="text-rose-700">Your business not in this answer.</strong>{" "}
          Customers asking AI for your service are being sent to your competitors —
          and you never see the lost lead.
        </p>
      </div>
    </div>
  );
}

function AiConversationAfter() {
  return (
    <div className="space-y-3">
      {/* Engine chrome */}
      <div className="flex items-center gap-2 border-b border-rule pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-ink-900">ChatGPT</div>
          <div className="text-[10px] text-ink-500">Web search · just now</div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          You: cited
        </span>
      </div>

      {/* Customer query — same as before */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink-900 px-3.5 py-2 text-xs leading-relaxed text-white md:text-[13px]">
          Best lifting equipment supplier in Pretoria?
        </div>
      </div>

      {/* AI response with prospect now featured */}
      <div className="flex justify-start">
        <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-ink-50 px-3.5 py-2.5 text-xs leading-relaxed text-ink-700 md:text-[13px]">
          For lifting equipment suppliers in Pretoria, the leading providers
          include <strong className="text-emerald-700">your business</strong>{" "}
          — verified BBBEE Level 1 supplier with industrial cranes, hoists, and
          certified LME inspections — alongside Integrate Lifting SA and
          Elephant Lifting Equipment. Your business is frequently cited for
          mining-sector procurement in Gauteng.
        </div>
      </div>

      {/* Footer success */}
      <div className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2.5">
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
        <p className="text-[11px] leading-relaxed text-ink-700">
          <strong className="text-emerald-700">Your business is in the answer.</strong>{" "}
          AI recommends you for high-intent buyer queries — same customer, same
          query, different outcome.
        </p>
      </div>
    </div>
  );
}
