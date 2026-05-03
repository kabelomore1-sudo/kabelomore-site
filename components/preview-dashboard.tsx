/**
 * Preview Dashboard — composes all 5 chart components with sample data.
 *
 * Used in two places:
 *   1. /scan submit success screen (FallbackBanner) — shows prospects
 *      what their personalised report will look like, so they SEE the
 *      Semrush-quality output even before Kabelo runs the manual scan
 *   2. /scan/preview public route — standalone demo for marketing /
 *      LinkedIn share / OMS-type pre-pitch
 *
 * EXPLICIT SAMPLE FRAMING:
 *   Every section is clearly labelled "Sample" / "Illustrative" so we
 *   never imply this is the prospect's actual data. Trust before
 *   personalisation.
 */

import { ScoreGauge } from "@/components/scan-charts/score-gauge";
import { LayerRadar } from "@/components/scan-charts/layer-radar";
import { EngineHeatmap } from "@/components/scan-charts/engine-heatmap";
import { CitationBenchmark } from "@/components/scan-charts/citation-benchmark";
import { IssueDistribution } from "@/components/scan-charts/issue-distribution";
import { Sparkles, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  generateSampleReport,
  mapIndustryToSector,
} from "@/lib/sample-report-data";

interface PreviewDashboardProps {
  /** Industry from form submission, used to tailor the sample data */
  industry?: string;
  /** Business name personalises the chart titles */
  businessName?: string;
  /** When true, hides the 'Preview' label (e.g. on /scan/preview standalone page) */
  hideSampleLabel?: boolean;
  /** When true, shows the standalone marketing intro at top */
  showMarketingIntro?: boolean;
}

export function PreviewDashboard({
  industry = "other",
  businessName = "Your Business",
  hideSampleLabel = false,
  showMarketingIntro = false,
}: PreviewDashboardProps) {
  const sector = mapIndustryToSector(industry);
  const sampleReport = generateSampleReport(sector, businessName);

  return (
    <div className="space-y-8">
      {/* SAMPLE LABEL — clear framing so we never imply real data */}
      {!hideSampleLabel && (
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
            <div>
              <h3 className="text-sm font-bold text-ink-900 md:text-base">
                Below: a sample of what your personalised report will look like.
              </h3>
              <p className="mt-1 text-xs text-ink-700 md:text-sm">
                These are <strong>illustrative numbers</strong> showing a
                typical day-0 baseline for SA {sector} firms. Your actual
                report — with YOUR data, YOUR competitors, YOUR specific
                AI-engine responses — arrives within 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MARKETING INTRO — only on /scan/preview */}
      {showMarketingIntro && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-700">
            <Sparkles className="h-3 w-3" />
            Preview · Sample data
          </div>
          <h1 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900 md:text-display-xl">
            What your AI Visibility report looks like.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-500 md:text-lg">
            Every prospect who submits gets a personalised version of this
            dashboard. 5 charts. Real AI-engine responses. Sector-specific
            recommendations. Delivered within 24 hours.
          </p>
        </div>
      )}

      {/* HEADLINE — Score + Diagnosis */}
      <section className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-10">
          {/* Score Gauge */}
          <div className="flex flex-col items-center">
            <ScoreGauge
              score={sampleReport.score}
              classification={sampleReport.classification}
            />
          </div>

          {/* Diagnosis */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
              Headline diagnosis
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
              You&apos;re in the bottom quartile of SA {sector} firms.
            </h2>
            <p className="mt-4 text-sm text-ink-700 leading-relaxed md:text-base">
              {sampleReport.diagnosisOneLiner}
            </p>
            <p className="mt-3 text-xs italic text-ink-500">
              Your real report includes a longer diagnosis covering the
              specific competitors AI engines recommend instead of you.
            </p>
          </div>
        </div>
      </section>

      {/* TWO-COL — Layer Radar + Engine Heatmap */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
            7-property breakdown
          </div>
          <h3 className="mt-2 text-lg font-semibold text-ink-900">
            Where your visibility is strong vs weak
          </h3>
          <p className="mt-2 text-xs text-ink-500">
            Across the 4 score layers (Presence / Authority / Consistency / Content)
          </p>
          <div className="mt-6">
            <LayerRadar layers={sampleReport.layers} />
          </div>
        </div>

        <div className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
            AI engine visibility
          </div>
          <h3 className="mt-2 text-lg font-semibold text-ink-900">
            Which engines cite you
          </h3>
          <p className="mt-2 text-xs text-ink-500">
            ChatGPT · Claude · Gemini · Perplexity
          </p>
          <div className="mt-6">
            <EngineHeatmap
              visibilityChecks={sampleReport.visibilityChecks}
              businessName={businessName}
            />
          </div>
        </div>
      </section>

      {/* CITATION BENCHMARK */}
      <section className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
          Citation benchmark
        </div>
        <h3 className="mt-2 text-lg font-semibold text-ink-900 md:text-xl">
          You vs the competitors AI is recommending
        </h3>
        <p className="mt-2 text-xs text-ink-500 md:text-sm">
          Your real report names the actual competitors AI cites instead of you.
        </p>
        <div className="mt-6">
          <CitationBenchmark
            count={sampleReport.detected.citationCount}
            level={sampleReport.detected.citationLevel}
          />
        </div>
      </section>

      {/* ISSUE DISTRIBUTION + TOP RECOMMENDATIONS */}
      <section className="grid gap-6 md:grid-cols-5">
        <div className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:col-span-2 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
            Issues by severity
          </div>
          <h3 className="mt-2 text-lg font-semibold text-ink-900">
            What needs fixing
          </h3>
          <p className="mt-2 text-xs text-ink-500">
            {sampleReport.issues.length} issues identified in this sample
          </p>
          <div className="mt-6">
            <IssueDistribution issues={sampleReport.issues} />
          </div>
        </div>

        <div className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:col-span-3 md:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
            Top 3 recommendations
          </div>
          <h3 className="mt-2 text-lg font-semibold text-ink-900">
            Highest-leverage fixes ranked
          </h3>
          <ol className="mt-5 space-y-4">
            {sampleReport.recommendations.slice(0, 3).map((rec) => (
              <li
                key={rec.rank}
                className="rounded-2xl border border-rule bg-ink-50/40 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-xs font-bold text-white">
                    {rec.rank}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-ink-900">
                      {rec.title}
                    </h4>
                    <p className="mt-1 text-xs text-ink-700 leading-relaxed">
                      {rec.explanation}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold uppercase tracking-wider text-emerald-700">
                        Impact: {rec.estimatedImpact}
                      </span>
                      <span className="rounded-full bg-accent-50 px-2 py-0.5 font-semibold uppercase tracking-wider text-accent-700">
                        Effort: {rec.estimatedEffort}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* COMPETITOR MENTIONS — text list */}
      <section className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
          Who AI is recommending instead of you
        </div>
        <h3 className="mt-2 text-lg font-semibold text-ink-900 md:text-xl">
          Sample competitor mentions
        </h3>
        <p className="mt-2 text-xs text-ink-500">
          Your real report names the actual competitors AI engines surface for your specific queries.
        </p>
        <ul className="mt-5 space-y-3">
          {sampleReport.competitors.map((c) => (
            <li
              key={c.name}
              className="flex items-start gap-3 rounded-xl border border-rule bg-ink-50/40 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink-900">{c.name}</div>
                <div className="mt-1 text-xs text-ink-600">
                  Cited by {c.appearsInEngines.length} of 4 AI engines · {c.citationCount} verified citations
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CLOSING CTA */}
      {showMarketingIntro && (
        <section className="rounded-3xl bg-ink-gradient p-8 text-center text-white shadow-lift md:p-12">
          <h2 className="text-display-md font-semibold tracking-tight text-white">
            Want this for your business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-300">
            30-second submission. Personalised report within 24 hours. No card.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/scan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-ink-900 shadow-md transition-all duration-200 hover:bg-ink-50 hover:shadow-lift"
            >
              Get my AI Visibility report <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/discover"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-base font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/15"
            >
              Take the 10-min Discovery
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
