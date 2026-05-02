import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  ArrowRight,
  Eye,
  Zap,
  RefreshCw,
  Bell,
  TrendingUp,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AEO Watch — Daily AI Visibility Tracking on Autopilot ($97/mo)",
  description:
    "Self-serve daily AI visibility tracking across ChatGPT, Claude, Gemini, Perplexity. $97/mo. Ships Q1 2027. Join the waitlist for early-bird pricing.",
  alternates: { canonical: `${site.url}/watch` },
};

const features = [
  {
    icon: Eye,
    title: "Daily scan, 4 engines",
    body: "Every morning we test ChatGPT, Claude, Gemini, and Perplexity (Apple Intelligence + Copilot in Q1 2027) on the queries your customers actually ask.",
  },
  {
    icon: TrendingUp,
    title: "Visibility score over time",
    body: "Track your AEO score across 7 properties. See exactly which engines cite you, which don't, and which competitors take your spot.",
  },
  {
    icon: Bell,
    title: "Smart alerts",
    body: "Get notified the day you drop out of an answer, or the day a competitor overtakes you. Catch drift before clients do.",
  },
  {
    icon: RefreshCw,
    title: "Monthly mini-report",
    body: "First Monday of each month: PDF summary of changes, top wins, biggest losses, and the highest-leverage fix to deploy this month.",
  },
  {
    icon: Zap,
    title: "Built on the Real Estate Method",
    body: "Same 7-property framework we use for paying audit clients. The tool runs the framework — you get the visibility without the consulting cost.",
  },
  {
    icon: Shield,
    title: "Cancel anytime",
    body: "$97/mo, billed monthly. No setup fee. No annual lock-in. If it's not surfacing useful signal, walk away.",
  },
];

const positioning = [
  {
    label: "Self-serve",
    body: "Sign up, paste your URL + 3 competitors + 5 queries, you're tracking from tomorrow.",
  },
  {
    label: "No consulting required",
    body: "If you have someone in-house who can act on the report, you don't need our retainer — just the tool.",
  },
  {
    label: "Upgrade path",
    body: "If patterns get complex enough that you want a human to interpret + fix, our Local Growth retainer (R5,500/mo) takes over from there.",
  },
];

export default function WatchPage() {
  const url = `${site.url}/watch`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "AEO Watch", href: "/watch" },
          ]),
          articleJsonLd({
            url,
            headline: "AEO Watch — Daily AI Visibility Tracking",
            description:
              "Self-serve daily AI visibility tracking across ChatGPT, Claude, Gemini, Perplexity. $97/mo. Ships Q1 2027.",
            datePublished: "2026-05-02",
          }),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Bell className="h-3 w-3" />
            Coming Q1 2027 · Waitlist open
          </div>
          <h1 className="mt-5 text-display-xl font-semibold tracking-tight text-ink-900">
            AEO Watch.
            <br />
            <span className="text-ink-500">
              Daily AI visibility tracking on autopilot.
            </span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Self-serve. $97/mo. Tracks your firm + 3 competitors across
            ChatGPT, Claude, Gemini, Perplexity (and Apple Intelligence +
            Microsoft Copilot when they ship). The tool that runs{" "}
            <Link
              href="/about"
              className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
            >
              The Real Estate Method
            </Link>{" "}
            without the consulting bill.
          </p>

          {/* Waitlist signup — primary CTA */}
          <div className="mx-auto mt-10 max-w-2xl text-left">
            <NewsletterSignup variant="card" source="watch-waitlist" />
            <p className="mt-3 text-center text-xs text-ink-500">
              Waitlist members get 50% off the first 3 months ($48.50/mo) when
              the product ships.
            </p>
          </div>
        </div>
      </Section>

      {/* What it does */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>What it does</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            The 6 things AEO Watch handles for you.
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-rule bg-white p-6 shadow-soft"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Who it's for vs not for */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <Eyebrow>Where AEO Watch fits in our stack</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          The self-serve tier — between the free scan and the Lite retainer.
        </h2>
        <div className="mt-8 space-y-4">
          {positioning.map((p) => (
            <div
              key={p.label}
              className="flex items-start gap-4 rounded-2xl border border-rule bg-white p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600 md:w-32 md:flex-shrink-0">
                {p.label}
              </div>
              <p className="text-sm text-ink-700 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-rule bg-white p-6">
          <h3 className="text-base font-semibold text-ink-900">
            The pricing ladder, top to bottom
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-700">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink-900" />
              <div>
                <strong className="text-ink-900">Free AI Scan:</strong> one-off
                snapshot, 24h turnaround. Free, no card.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-500" />
              <div>
                <strong className="text-ink-900">AEO Watch:</strong> $97/mo
                (~R1,750/mo). Self-serve daily tracking. You act on the data.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
              <div>
                <strong className="text-ink-900">
                  Local Growth Lite (R2,950/mo):
                </strong>{" "}
                Watch + active GBP / LinkedIn maintenance. We act on the data.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
              <div>
                <strong className="text-ink-900">
                  Local Growth → AI Authority → Fractional Head:
                </strong>{" "}
                R5.5k → R10.5k → R20k+/mo. Increasing scope, increasing
                strategic involvement.
              </div>
            </li>
          </ul>
          <p className="mt-5 text-xs italic text-ink-500">
            Watch is for buyers with the in-house capacity (or curiosity) to
            act on the data themselves. Retainers are for buyers who want
            someone else to handle it.
          </p>
        </div>
      </Section>

      {/* Why we're announcing before building */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="rounded-3xl border border-rule bg-white p-8 shadow-soft md:p-10">
          <h3 className="text-xl font-semibold text-ink-900 md:text-2xl">
            Why announce before we ship?
          </h3>
          <p className="mt-4 text-base text-ink-700 leading-relaxed">
            Honest answer: we&apos;re building it because the audit-agent that
            powers our consulting work is already running daily on my own
            infrastructure. Productising it is mostly billing + dashboards on
            top of code that exists. But we want to make sure the demand is
            real before we invest 4 weeks of engineering — so this page is
            partly a product spec and partly market validation.
          </p>
          <p className="mt-4 text-base text-ink-700 leading-relaxed">
            If 50+ firms join the waitlist, we ship in Q1 2027. If 200+ join,
            we ship faster. If only a few join, we keep it as an internal tool
            and you can always book the full audit + retainer instead.
            Naval&apos;s rule: announce before you build. Validate the market
            before the spend.
          </p>
          <div className="mt-6">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              Join the waitlist (scroll to top)
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
