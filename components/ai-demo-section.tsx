"use client";

import { Eyebrow } from "./ui/section";
import { Button } from "./ui/button";
import {
  Search,
  AlertOctagon,
  Lightbulb,
  ArrowRight,
  CircleCheck,
  CircleX,
  Play,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * AI Demo — 3-step funnel pattern.
 *
 *   Step 1 — WATCH: Full AI response, captured as video, plays inline.
 *   Step 2 — ISSUE: What's wrong (business missing, competitors winning).
 *   Step 3 — SOLUTION: How we fix it + CTA.
 *
 * Drop videos at /public/videos/<engine>-industrial.mp4 and they will appear
 * in the engine switcher. v1 ships with industrial scenario only — extend
 * to care/legal/medical as more videos land.
 */

type Engine = {
  id: string;
  name: string;
  videoSrc: string;
  posterSrc?: string;
  brandColor: string;
};

const engines: Engine[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    videoSrc: "/videos/chatgpt-industrial.mp4",
    brandColor: "bg-emerald-500",
  },
  {
    id: "claude",
    name: "Claude",
    videoSrc: "/videos/claude-industrial.mp4",
    brandColor: "bg-amber-500",
  },
  {
    id: "gemini",
    name: "Gemini",
    videoSrc: "/videos/gemini-industrial.mp4",
    brandColor: "bg-blue-500",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    videoSrc: "/videos/perplexity-industrial.mp4",
    brandColor: "bg-purple-500",
  },
];

const SCENARIO = {
  industry: "Industrial supply",
  location: "Pretoria, South Africa",
  query:
    "I'm sourcing for a new mining operation in Limpopo, South Africa, and I need a BBBEE Level 1 verified lifting equipment supplier with crane inspection capability. Who are the most reliable suppliers in Pretoria or wider Gauteng I should consider?",
  business: "OMS Lifting Solutions",
  issues: [
    {
      label: "OMS isn't mentioned",
      detail:
        "Despite being BBBEE Level 1 with 89+ certified inspections — the exact specs the buyer asked for.",
    },
    {
      label: "Three competitors are recommended instead",
      detail:
        "AI engines confidently cite other suppliers — and procurement teams treat those citations as shortlist material.",
    },
    {
      label: "The buyer never sees OMS",
      detail:
        "By the time they finish reading the AI response, the consideration set is closed — without OMS in it.",
    },
  ],
  stake:
    "One missed AI recommendation in industrial supply = a R150K-500K mining contract OMS never gets to quote on.",
  solutions: [
    {
      label: "Deploy structured data",
      detail:
        "LocalBusiness, Service, and Organization schema markup so AI engines have verified data they can confidently cite.",
    },
    {
      label: "Optimise GBP + third-party citations",
      detail:
        "100% complete Google Business Profile + verified industry directory listings — AI's trust anchors.",
    },
    {
      label: "Publish answer-shaped content",
      detail:
        "Service pages structured as the queries buyers actually ask AI engines, with FAQ schema for citation extraction.",
    },
    {
      label: "Re-scan at Day 30",
      detail:
        "Same prompt, same engines, side-by-side comparison. Proof the work moved the needle.",
    },
  ],
};

export function AiDemoSection() {
  const [activeEngineId, setActiveEngineId] = useState<string>(engines[0].id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeEngine = engines.find((e) => e.id === activeEngineId)!;

  // Auto-play video when section enters viewport
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {
            /* autoplay blocked — user can click play */
          });
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [activeEngineId]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-section-gradient py-24 md:py-32"
    >
      <div className="absolute inset-0 grid-pattern opacity-25 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Watch the gap, see the fix</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
            Three steps. One unmissable problem.
            <br />
            <span className="text-ink-500">And the system that fixes it.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-500">
            Real conversational prompt. Real AI engines. Real businesses.
            We run this exact test on yours — free, in 24 hours.
          </p>
        </div>

        {/* ─── STEP 1: WATCH ─── */}
        <article className="mt-16">
          <StepHeader number="01" title="Watch" subtitle="What AI tells your customers right now" />

          <div className="mt-6 overflow-hidden rounded-3xl border border-rule bg-white shadow-card">
            {/* Engine tabs */}
            <div className="flex items-center gap-1 border-b border-rule bg-ink-50/50 px-4 py-2">
              {engines.map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => setActiveEngineId(engine.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                    activeEngineId === engine.id
                      ? "bg-ink-900 text-white shadow-soft"
                      : "text-ink-500 hover:bg-ink-100 hover:text-ink-900",
                  )}
                  aria-pressed={activeEngineId === engine.id}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      activeEngineId === engine.id ? engine.brandColor : "bg-ink-300",
                    )}
                  />
                  {engine.name}
                </button>
              ))}
            </div>

            {/* User prompt bar */}
            <div className="border-b border-rule bg-ink-50/30 px-6 py-5">
              <div className="flex items-start gap-3">
                <Search className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400">
                    <span>{SCENARIO.industry}</span>
                    <span className="h-1 w-1 rounded-full bg-ink-300" />
                    <span>{SCENARIO.location}</span>
                    <span className="h-1 w-1 rounded-full bg-ink-300" />
                    <span className="text-accent-600">User prompt</span>
                  </div>
                  <div className="mt-2 text-sm text-ink-900 leading-relaxed">
                    "{SCENARIO.query}"
                  </div>
                </div>
              </div>
            </div>

            {/* Video panel */}
            <div className="relative bg-ink-900">
              <video
                key={activeEngine.id}
                ref={videoRef}
                className="block w-full aspect-video object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={activeEngine.posterSrc}
              >
                <source src={activeEngine.videoSrc} type="video/mp4" />
                {/* Graceful fallback if video missing */}
              </video>

              {/* Bottom overlay: engine label + replay hint */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink-900/80 to-transparent px-5 py-3 text-xs text-white/90">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", activeEngine.brandColor)} />
                  Live response from {activeEngine.name}
                </span>
                <span className="flex items-center gap-1.5 text-white/70">
                  <Play className="h-3 w-3" />
                  Looping
                </span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-sm text-ink-400">
            Click the engine tabs above to see how each AI gives a different answer to the same question.
          </p>
        </article>

        {/* Connector arrow */}
        <div className="my-8 flex justify-center text-ink-300">
          <div className="h-12 w-px bg-rule" />
        </div>

        {/* ─── STEP 2: ISSUE ─── */}
        <article>
          <StepHeader number="02" title="The Issue" subtitle="What you just watched, in plain words" tone="warning" />

          <div className="mt-6 rounded-3xl border-2 border-amber-200 bg-amber-50/50 p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-soft">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
                  Your business doesn't exist in the answer.
                </h3>
                <p className="mt-2 text-base text-ink-700 leading-relaxed">
                  Watch the video again. Note what didn't appear.{" "}
                  <strong>{SCENARIO.business}</strong> isn't on the list.
                  Three competitors are. The buyer's shortlist is now closed.
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-4 md:mt-10">
              {SCENARIO.issues.map((issue) => (
                <li key={issue.label} className="flex items-start gap-3">
                  <CircleX className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div>
                    <div className="font-semibold text-ink-900">{issue.label}</div>
                    <div className="mt-1 text-sm text-ink-600 leading-relaxed">
                      {issue.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-ink-900 px-6 py-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
                What's at stake
              </div>
              <div className="mt-2 text-base leading-relaxed">{SCENARIO.stake}</div>
            </div>
          </div>
        </article>

        {/* Connector arrow */}
        <div className="my-8 flex justify-center text-ink-300">
          <div className="h-12 w-px bg-rule" />
        </div>

        {/* ─── STEP 3: SOLUTION ─── */}
        <article>
          <StepHeader number="03" title="The Solution" subtitle="What we do about it" tone="solution" />

          <div className="mt-6 rounded-3xl border-2 border-accent-200 bg-accent-50/50 p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-white shadow-soft">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
                  Make your business the obvious answer.
                </h3>
                <p className="mt-2 text-base text-ink-700 leading-relaxed">
                  AI engines reward businesses with verified structured data,
                  third-party citations, and answer-shaped content. Most
                  businesses have none. We deploy all three.
                </p>
              </div>
            </div>

            <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
              {SCENARIO.solutions.map((solution) => (
                <li
                  key={solution.label}
                  className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-soft"
                >
                  <CircleCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600" />
                  <div>
                    <div className="font-semibold text-ink-900">{solution.label}</div>
                    <div className="mt-1 text-sm text-ink-600 leading-relaxed">
                      {solution.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-6">
              <div className="text-center sm:text-left">
                <div className="text-base font-semibold text-ink-900">
                  See what AI says about your business.
                </div>
                <div className="text-sm text-ink-500">
                  Free 2-page report. 24-hour turnaround. No sales call.
                </div>
              </div>
              <Button href="/scan" variant="primary" size="lg" className="flex-shrink-0">
                Get my free scan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ─── Step header sub-component ─── */
function StepHeader({
  number,
  title,
  subtitle,
  tone = "default",
}: {
  number: string;
  title: string;
  subtitle: string;
  tone?: "default" | "warning" | "solution";
}) {
  const toneStyles = {
    default: "bg-ink-900 text-white",
    warning: "bg-amber-500 text-white",
    solution: "bg-accent-500 text-white",
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-mono text-sm font-semibold shadow-soft",
          toneStyles[tone],
        )}
      >
        {number}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
          Step {number}
        </div>
        <div className="text-2xl font-semibold tracking-tight text-ink-900">
          {title} <span className="text-ink-400">— {subtitle}</span>
        </div>
      </div>
    </div>
  );
}
