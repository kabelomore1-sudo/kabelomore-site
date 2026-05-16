"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Section, Eyebrow } from "./ui/section";
import { Button } from "./ui/button";
import { whatsappLink, site } from "@/lib/site";
import { classificationDescription } from "@/lib/engines/classification";
import { ScoreGauge } from "./scan-charts/score-gauge";
import { LayerRadar } from "./scan-charts/layer-radar";
import { EngineHeatmap } from "./scan-charts/engine-heatmap";
import { CitationBenchmark } from "./scan-charts/citation-benchmark";
import { IssueDistribution } from "./scan-charts/issue-distribution";
import { MethodologyDisclosure } from "./methodology-disclosure";
import type { ScanResult } from "@/lib/types/scan";
import {
  PACKAGES,
  RETAINERS,
  formatPrice,
  formatPriceMonthly,
} from "@/lib/pricing";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Mail,
  MessageCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

// Short, human labels for each QueryIntent — used by the mined-prompts
// section so a buyer reads "Comparison" not "comparison". Any intent
// not in the map falls back to its raw value (defensive — the union
// may grow).
const INTENT_LABELS: Record<string, string> = {
  recommendation: "Recommendation",
  research: "Research",
  problem: "Problem",
  brand: "Brand",
  urgency: "Urgency",
  comparison: "Comparison",
  cost: "Cost",
  conversational: "Conversational",
  review: "Review",
};

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; result: ScanResult }
  | { status: "not-found" }
  | { status: "scanning" }
  | { status: "failed"; error: string };

export function ScanResultsClient({ scanId }: { scanId: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    // 1. Try sessionStorage first (set by scan-form on success)
    try {
      const stored = sessionStorage.getItem(`scan_${scanId}_result`);
      if (stored) {
        const result = JSON.parse(stored) as ScanResult;
        setState({ status: "loaded", result });
        return;
      }
    } catch {
      // sessionStorage may be disabled — fall through to API fetch
    }

    // 2. Fall back to API (works only if KV is configured server-side)
    let cancelled = false;
    fetch(`/api/scan/${scanId}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.ok) {
          setState({ status: "not-found" });
          return;
        }
        if (data.status === "complete" && data.result) {
          setState({ status: "loaded", result: data.result });
        } else if (data.status === "scanning") {
          setState({ status: "scanning" });
          // Poll every 3s while still scanning
          const interval = setInterval(async () => {
            const res = await fetch(`/api/scan/${scanId}/status`);
            const d = await res.json();
            if (d.ok && d.status === "complete" && d.result) {
              clearInterval(interval);
              setState({ status: "loaded", result: d.result });
            } else if (d.ok && d.status === "failed") {
              clearInterval(interval);
              setState({ status: "failed", error: d.error ?? "Scan failed" });
            }
          }, 3000);
        } else if (data.status === "failed") {
          setState({ status: "failed", error: data.error ?? "Scan failed" });
        } else {
          setState({ status: "not-found" });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "not-found" });
      });

    return () => {
      cancelled = true;
    };
  }, [scanId]);

  if (state.status === "loading" || state.status === "scanning") {
    return <LoadingView scanning={state.status === "scanning"} />;
  }

  if (state.status === "not-found") {
    return <NotFoundView />;
  }

  if (state.status === "failed") {
    return <FailedView error={state.error} />;
  }

  return <ResultsView result={state.result} />;
}

// ─── Main results view (the conversion engine) ──────────────────
function ResultsView({ result }: { result: ScanResult }) {
  return (
    <>
      {/* HERO — Score gauge + classification + diagnosis */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow>AI Visibility Scan · {result.businessName}</Eyebrow>
            {/* Save-as-PDF hint — uses the existing @media print
                stylesheet in globals.css. Browser's native "Save as
                PDF" appears in the print dialog. No PDF generation
                dependency needed; everything works offline. */}
            <PrintButton />
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14 md:items-center">
            {/* Left: Score gauge (the hero number) */}
            <div className="flex justify-center">
              <ScoreGauge
                score={result.score}
                classification={result.classification}
              />
            </div>

            {/* Right: diagnosis + 1-line summary */}
            <div>
              <div className="rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                  What this means
                </div>
                <p className="mt-3 text-sm text-ink-700 leading-relaxed">
                  {classificationDescription(result.classification)}
                </p>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Plain-English diagnosis
                </div>
                <p className="mt-3 text-base text-ink-900 leading-relaxed">
                  {result.diagnosisFull}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SCORE BREAKDOWN — Layer Radar chart */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <Eyebrow>Score breakdown</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
              Where your AI visibility is strong vs weak.
            </h2>
            <p className="mt-4 text-base text-ink-700 leading-relaxed">
              Your score breaks down into four layers AI engines weight when
              deciding whether to recommend a business. Bigger area in the
              radar = stronger foundation. The dominant layer is{" "}
              <span className="font-semibold text-ink-900">Authority</span> —
              third-party citations that verify you exist.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <LayerLine label="Presence" value={result.layers.presence} max={25} note="website + GBP" />
              <LayerLine label="Authority" value={result.layers.authority} max={40} note="citations — DOMINANT" />
              <LayerLine label="Consistency" value={result.layers.consistency} max={20} note="NAP across web" />
              <LayerLine label="Content" value={result.layers.content} max={15} note="schema + structure" />
            </div>
          </div>
          <div className="order-1 flex justify-center md:order-2">
            <LayerRadar layers={result.layers} />
          </div>
        </div>
      </Section>

      {/* AI ENGINES VISIBILITY — heatmap.
          Honest framing: we run via Claude+web_search as a proxy.
          The heatmap component carries its own methodology badge,
          but the section headline + eyebrow now match reality. */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <Eyebrow>Visibility in our test queries</Eyebrow>
        <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
          Where you&apos;re likely recommended — and where you&apos;re not.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-500 leading-relaxed">
          Each cell shows the same aggregate result across our 4 conceptual
          engines. We currently test via Claude with live web search as a
          proxy; native ChatGPT, Gemini, and Perplexity adapters land in
          Phase 1.5.
        </p>
        <div className="mt-8">
          <EngineHeatmap
            visibilityChecks={result.visibilityChecks}
            businessName={result.businessName}
          />
        </div>
      </Section>

      {/* CITATIONS BENCHMARK */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Citations — the dominant signal</Eyebrow>
        <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
          The single biggest factor in AI recommendation.
        </h2>
        <p className="mt-4 text-base text-ink-700 leading-relaxed">
          AI engines verify businesses by counting third-party mentions on
          trusted sites. Below the AI confidence threshold, consistent
          recommendation is rare — no matter how good your website is. The
          domains below are what our directory + industry searches surfaced;
          if you have listings we missed, share them and we&apos;ll re-check.
        </p>
        <div className="mt-8">
          <CitationBenchmark
            count={result.detected.citationCount}
            level={result.detected.citationLevel}
          />
        </div>

        {/* Show citation sources if any found */}
        {result.detected.citationSources.length > 0 && (
          <div className="mt-8 rounded-2xl border border-rule bg-white p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Domains where we surfaced you ({result.detected.citationSources.length})
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.detected.citationSources.slice(0, 12).map((source) => (
                <span
                  key={source}
                  className="rounded-full bg-ink-50 px-3 py-1 font-mono text-xs text-ink-700"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Top issues */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <Eyebrow>Issues found</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          What&apos;s blocking AI engines from recommending you.
        </h2>

        {/* Issue distribution donut */}
        <div className="mt-8 rounded-2xl border border-rule bg-white p-6 md:p-8">
          <IssueDistribution issues={result.issues} />
        </div>

        <div className="mt-8 space-y-4">
          {result.issues.slice(0, 5).map((issue, idx) => (
            <article
              key={issue.id}
              className="flex gap-4 rounded-2xl border border-rule bg-white p-6 shadow-soft"
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white ${
                  issue.severity === "critical"
                    ? "bg-red-600"
                    : issue.severity === "high"
                      ? "bg-amber-600"
                      : issue.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-ink-400"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-ink-500">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      issue.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : issue.severity === "high"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-ink-100 text-ink-600"
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink-900">
                  {issue.title}
                </h3>
                <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                  {issue.explanation}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* QUESTIONS YOUR CUSTOMERS ASK AI — the mined prompt set
          (Ticket 1). Cheap to surface (generated, not web-searched) and
          high-signal: it shows the prospect the *actual* language their
          buyers use with AI, intent-tagged. The subset marked "tested
          live" was run through web_search — those verbatim results are
          in the next section. */}
      {result.minedPrompts && result.minedPrompts.length > 0 && (
        <Section variant="default" padding="lg" containerSize="narrow">
          <Eyebrow>What your customers actually ask AI</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            The questions buyers type — before they know you exist.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-ink-500 leading-relaxed">
            We mined these for your specific category and location — the
            real phrasing customers use with ChatGPT, Gemini, and
            Perplexity, not keyword strings. The ones marked{" "}
            <span className="font-semibold text-emerald-700">tested live</span>{" "}
            were run through live{" "}
            <code className="rounded bg-ink-50 px-1 py-0.5 text-[11px]">
              web_search
            </code>{" "}
            this scan — their verbatim results are in the next section.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {result.minedPrompts.map((p, idx) => (
              <div
                key={`${p.query}-${idx}`}
                className="flex flex-col gap-3 rounded-2xl border border-rule bg-white p-5 shadow-soft"
              >
                <p className="text-sm font-medium text-ink-900 leading-relaxed">
                  &ldquo;{p.query}&rdquo;
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-ink-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-600">
                    {INTENT_LABELS[p.intent] ?? p.intent}
                  </span>
                  {p.executed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Tested live
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-ink-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                      Listed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs italic text-ink-500">
            We deep-test an intent-diverse subset live each scan to keep
            turnaround fast; the full set above is what your buyers are
            asking. Want any specific question tested? Reply and we&apos;ll
            run it.
          </p>
        </Section>
      )}

      {/* What AI says (the gut punch).
          Honest framing: ran live via Claude+web_search proxy. The
          per-card "AI recommended these instead" wording softened to
          "Names that surfaced instead" so we don't claim AI authoritatively
          ranked anyone — we just observed names in proxy responses. */}
      {result.visibilityChecks.length > 0 && (
        <Section variant="tinted" padding="lg" containerSize="narrow">
          <Eyebrow>What an AI proxy returned for your category</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            We tested live. Here&apos;s what surfaced.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-ink-500 leading-relaxed">
            Each query was run via Claude with live{" "}
            <code className="rounded bg-ink-50 px-1 py-0.5 text-[11px]">
              web_search
            </code>{" "}
            — a proxy for ChatGPT, Gemini, and Perplexity. Verbatim text
            below is what the proxy returned, not text quoted from a specific
            AI engine&apos;s native output.
          </p>

          <div className="mt-10 space-y-5">
            {result.visibilityChecks.map((check, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-rule bg-white p-6 shadow-soft"
              >
                <div className="text-xs font-mono text-accent-600">QUERY {idx + 1}</div>
                <p className="mt-2 text-base font-medium text-ink-900">
                  &ldquo;{check.query}&rdquo;
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-ink-50/40 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink-700">
                      {check.businessAppears ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          {result.businessName} cited
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          {result.businessName} NOT cited
                        </>
                      )}
                    </div>
                    {check.competitorsCited.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs uppercase tracking-wider text-ink-500">
                          Names that surfaced instead:
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-ink-700">
                          {check.competitorsCited.slice(0, 5).map((c, i) => (
                            <li key={`${c}-${i}`} className="flex gap-2">
                              <span className="font-mono text-ink-400">{i + 1}.</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 text-[10px] italic text-ink-500">
                          Verify these are your actual competitors — search may surface adjacent firms.
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl bg-ink-50/40 p-4">
                    <div className="text-xs uppercase tracking-wider text-ink-500">
                      Verbatim — what AI said
                    </div>
                    <p className="mt-2 text-sm italic text-ink-700 leading-relaxed">
                      {check.verbatimExcerpt || "(no specific excerpt captured)"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* COMPETITOR LEADERBOARD (Ticket 2) — turns the flat "names that
          surfaced" list into a ranked table. avgRank = mean position the
          AI proxy named each business across the queries it appeared in;
          lower = more dominant. Framed honestly as observed proxy
          ordering, not an authoritative market ranking. Only renders
          when rank data exists (new scans) — older cached scans simply
          skip it, no regression. */}
      {(() => {
        const ranked = (result.competitors ?? []).filter(
          (c) => typeof c.avgRank === "number",
        );
        if (ranked.length === 0) return null;
        const totalQueries = result.visibilityChecks.length;
        return (
          <Section variant="default" padding="lg" containerSize="narrow">
            <Eyebrow>Competitor leaderboard</Eyebrow>
            <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
              Who AI names instead of you — ranked.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink-500 leading-relaxed">
              <span className="font-semibold text-ink-700">
                Avg. position
              </span>{" "}
              is how early the AI proxy named each business across the
              queries it returned them in — lower means it dominates the
              answer. This is observed ordering in our{" "}
              <code className="rounded bg-ink-50 px-1 py-0.5 text-[11px]">
                web_search
              </code>{" "}
              proxy responses, not an authoritative market ranking.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-rule bg-white shadow-soft">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-rule bg-ink-50/50 text-[11px] uppercase tracking-wider text-ink-500">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Business</th>
                    <th className="px-4 py-3 font-semibold">
                      Appears in
                    </th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Avg. position
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((c, idx) => (
                    <tr
                      key={`${c.name}-${idx}`}
                      className="border-b border-rule last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-ink-400">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-ink-900">
                          {c.name}
                        </span>
                        {c.context && (
                          <span className="mt-0.5 block text-xs text-ink-500">
                            {c.context}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink-700">
                        {typeof c.mentionCount === "number"
                          ? totalQueries > 0
                            ? `${c.mentionCount} of ${totalQueries} queries`
                            : `${c.mentionCount} queries`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-base font-semibold text-ink-900">
                          {c.avgRank?.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs italic text-ink-500">
              {result.visibilityChecks.some((v) => v.businessAppears)
                ? `${result.businessName} surfaced in some queries (see above) but is not among the dominant names AI returns — these businesses are.`
                : `${result.businessName} did not surface for any tested query — these businesses took those answers instead.`}{" "}
              Verify these are your actual competitors; live search can
              surface adjacent firms.
            </p>
          </Section>
        );
      })()}

      {/* Recommendations + CTA */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>What to do about it</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Your prioritized fix list.
        </h2>
        <p className="mt-4 text-base text-ink-500">
          Ranked by impact ÷ effort. The first one is the highest leverage.
        </p>

        <div className="mt-10 space-y-4">
          {result.recommendations.map((rec) => (
            <article
              key={rec.rank}
              className="rounded-2xl border border-rule bg-white p-6 shadow-soft md:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink-900 font-mono text-sm text-white">
                  {String(rec.rank).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold tracking-tight text-ink-900">
                    {rec.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                    {rec.explanation}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold uppercase tracking-wider text-emerald-700">
                      {rec.estimatedImpact} impact
                    </span>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 font-semibold uppercase tracking-wider text-ink-600">
                      {rec.estimatedEffort} effort
                    </span>
                    {rec.mapsToTier && (
                      <Link
                        href={
                          rec.mapsToTier === "foundation"
                            ? "/foundation"
                            : `/services#${rec.mapsToTier}`
                        }
                        className="text-accent-600 hover:text-accent-700"
                      >
                        See pricing →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* METHODOLOGY DISCLOSURE — full version, anchored just before the
          CTA so the prospect has the complete honest picture before deciding
          whether to engage. Single source of truth for what we measure,
          what's a proxy, and what's directional. */}
      <Section variant="default" padding="default" containerSize="narrow">
        <Eyebrow>Methodology</Eyebrow>
        <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
          What this scan measured (and what it didn&apos;t).
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-500 leading-relaxed">
          Honest disclosure of what we verified directly versus what we
          inferred via proxy. Trust before performance.
        </p>
        <div className="mt-6">
          <MethodologyDisclosure variant="full" />
        </div>
      </Section>

      {/* Conversion CTA — drives toward a CALL, not a self-serve purchase.
          For B2B services at R5.5k-R10.5k/mo retainer pricing, the call
          is where pricing flexibility happens, scope gets defined, and
          trust is built. Per Neil Patel: skipping the call costs ~10×
          conversion at this price point. Per Naval: the conversation is
          your specific knowledge — the moat. Don't automate it away
          before you've proven the manual model converts. */}
      <Section variant="ink" padding="lg" id="next-step">
        <div className="mx-auto max-w-3xl text-center text-white">
          <Eyebrow className="text-accent-400 justify-center">Next step</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight">
            Book a 15-minute call. No pitch.
          </h2>
          <p className="mt-5 text-lg text-ink-300 leading-relaxed">
            {result.diagnosisOneLiner}
          </p>
          <p className="mt-4 text-base text-ink-300">
            On the call we go through your scan together — what&apos;s real,
            what&apos;s a quick fix, what actually moves the needle for
            your business. You ask whatever. I tell you honestly which
            package (if any) fits, or whether you can DIY this. No card,
            no pressure, typical reply within one business hour.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row print:hidden">
            <Button
              href={whatsappLink(
                `Hi Kabelo — I just read my AI Visibility scan for ${result.businessName}. Can we book a 15-min call?`,
              )}
              variant="ink"
              size="lg"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp to book a call
            </Button>
            <Button
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent("15-min call request — " + result.businessName)}&body=${encodeURIComponent("Hi Kabelo,\n\nI've read my AI Visibility scan for " + result.businessName + " (score: " + result.score + "/100). Can we book a 15-minute call to talk through it?\n\nMy availability:\n[a few options]\n\nThanks,\n" + result.contactName)}`}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              <Mail className="h-4 w-4" /> Reply by email
            </Button>
          </div>
          {/* Package menu — visible but secondary. Pulls names + prices
              from lib/pricing canonical source so any change there
              propagates here automatically. Shows the three most-
              likely paths from a scan result:
                - Starter (entry-level once-off)
                - Optimization Pack (the modal once-off — recommended)
                - Growth (the modal monthly retainer)
              Foundation Build options + Premium retainer live on
              /pricing for high-end visitors. */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent-400">
              Or browse packages first
            </div>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
              <a
                href="/pricing"
                className="rounded-xl bg-white/10 p-3 hover:bg-white/15"
              >
                <div className="font-semibold text-white">{PACKAGES.starter.name}</div>
                <div className="mt-0.5 text-xs text-ink-300">
                  {formatPrice(PACKAGES.starter.price)} once-off
                </div>
                <div className="mt-1 text-[11px] text-ink-400">
                  {PACKAGES.starter.description}
                </div>
              </a>
              <a
                href="/pricing"
                className="rounded-xl border border-accent-500/40 bg-accent-500/10 p-3 hover:bg-accent-500/15"
              >
                <div className="font-semibold text-white">
                  {PACKAGES.optimizationPack.name}{" "}
                  <span className="text-[9px] uppercase tracking-wider text-accent-400">
                    · Most clients land here
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-ink-300">
                  {formatPrice(PACKAGES.optimizationPack.price)} once-off
                </div>
                <div className="mt-1 text-[11px] text-ink-400">
                  {PACKAGES.optimizationPack.tagline}
                </div>
              </a>
              <a
                href="/pricing"
                className="rounded-xl bg-white/10 p-3 hover:bg-white/15"
              >
                <div className="font-semibold text-white">{RETAINERS.growth.name}</div>
                <div className="mt-0.5 text-xs text-ink-300">
                  {formatPriceMonthly(RETAINERS.growth.price)}
                </div>
                <div className="mt-1 text-[11px] text-ink-400">
                  {RETAINERS.growth.tagline}
                </div>
              </a>
            </div>
          </div>
          <p className="mt-8 text-xs text-ink-400 print:hidden">
            Scan ID: {result.id} · Completed in {(result.durationMs / 1000).toFixed(1)}s
          </p>
        </div>
      </Section>

      {/* Trust footer */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="grid gap-6 md:grid-cols-3 text-sm text-ink-500">
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <Clock className="h-4 w-4 text-accent-600" />
              Compounding window
            </div>
            <p className="mt-2">
              AEO citations compound for 6-24 months. The businesses that fix
              their AEO infrastructure in 2026 dominate their categories
              through 2027-28.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <ShieldCheck className="h-4 w-4 text-accent-600" />
              No surprises
            </div>
            <p className="mt-2">
              Every project is 50% deposit / 50% on delivery. If we don&apos;t
              deliver what was quoted, you don&apos;t pay the second half.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <TrendingUp className="h-4 w-4 text-accent-600" />
              Proof, not promises
            </div>
            <p className="mt-2">
              We can&apos;t guarantee specific outcomes from specific AI engines
              on specific dates. We can guarantee a disciplined process and
              measure before/after.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── Print / Save-as-PDF button ───────────────────────────────────
// Triggers the browser's native print dialog. The @media print
// stylesheet in globals.css already strips nav/footer/CTAs and
// reformats for paper. Most browsers offer "Save as PDF" as a
// destination in the print dialog — works offline, no server-side
// PDF generation needed.
function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-1.5 rounded-full border border-rule bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-50"
      title="Open the print dialog — most browsers offer 'Save as PDF' as a destination"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect width="12" height="8" x="6" y="14" />
      </svg>
      Save as PDF
    </button>
  );
}

// ─── Helper components ───────────────────────────────────────────
// Compact per-layer line (used alongside the LayerRadar) — value/max + small bar
function LayerLine({
  label,
  value,
  max,
  note,
}: {
  label: string;
  value: number;
  max: number;
  note: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-baseline gap-3">
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-ink-900">{label}</span>
          <span className="font-mono text-xs text-ink-500">
            {value}/{max}
          </span>
        </div>
        <div className="mt-1 text-xs text-ink-500">{note}</div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
          <div
            className={
              pct >= 80
                ? "h-full bg-emerald-500 transition-all duration-700"
                : pct >= 50
                  ? "h-full bg-accent-500 transition-all duration-700"
                  : pct >= 25
                    ? "h-full bg-amber-500 transition-all duration-700"
                    : "h-full bg-red-500 transition-all duration-700"
            }
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// LEGACY (unused after Phase 2 redesign) — kept for emergency rollback
function LayerBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-ink-700">{label}</span>
        <span className="font-mono text-ink-500">
          {value}/{max}
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            pct >= 80
              ? "bg-emerald-500"
              : pct >= 50
                ? "bg-accent-500"
                : pct >= 25
                  ? "bg-amber-500"
                  : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function LoadingView({ scanning }: { scanning: boolean }) {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
          {scanning ? "Your scan is still running…" : "Loading your results…"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-ink-500">
          {scanning
            ? "This page will update automatically when the scan finishes (~30-60s total)."
            : "Just a moment."}
        </p>
      </div>
    </Section>
  );
}

function NotFoundView() {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
          Your results were emailed to you.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-ink-500">
          We don&apos;t hold scan results in browser storage permanently. Check
          your email — your full report is there. If you can&apos;t find it,
          email kabelo@kabelomore.com and Kabelo will resend it manually.
        </p>
        <div className="mt-8">
          <Button href="/scan" variant="primary" size="md">
            Run another scan <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Section>
  );
}

function FailedView({ error }: { error: string }) {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 md:p-12">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-ink-900">
              Scan didn&apos;t complete cleanly
            </h2>
            <p className="mt-3 text-sm text-ink-700 leading-relaxed">{error}</p>
            <p className="mt-4 text-sm text-ink-700">
              Don&apos;t worry — Kabelo has been notified with your details.
              He&apos;ll deliver your scan manually within 24 hours via email.
            </p>
            <div className="mt-6 flex gap-3">
              <Button href="/scan" variant="primary" size="md">
                Try again
              </Button>
              <Button
                href={`mailto:${site.contact.email}?subject=Scan%20issue&body=Hi%20Kabelo%2C%0A%0AI%20got%20a%20scan%20error.%20Could%20you%20resend%20my%20results%20manually%3F`}
                variant="secondary"
                size="md"
              >
                Email support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
