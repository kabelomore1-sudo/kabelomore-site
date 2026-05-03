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
import { ConversionBlock } from "@/components/conversion-block";
import { AiConversationGrid } from "@/components/ai-conversation-grid";
import { MethodologyDisclosure } from "@/components/methodology-disclosure";
import { DashboardSectionToc } from "@/components/dashboard-section-toc";
import { AutoOpenDetails } from "@/components/auto-open-details";

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
      {/* SAMPLE LABEL — strengthened framing so prospects never confuse
          the sample with their real data. CRITICAL: if their actual
          Google rankings are good, the sample (which shows them invisible)
          could break trust before we start. New copy explicitly distinguishes
          Google ranking from AI engine ranking. */}
      {!hideSampleLabel && (
        <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
            <div>
              <h3 className="text-sm font-bold text-ink-900 md:text-base">
                Sample data — not your actual results.
              </h3>
              <p className="mt-2 text-xs text-ink-700 md:text-sm">
                Below shows what a personalised report LOOKS like, using
                illustrative numbers from a typical day-0 baseline for SA{" "}
                {sector} firms. Your actual report — based on your real
                website, GBP, and AI-engine responses to YOUR queries —
                arrives within 24 hours.
              </p>
              <p className="mt-2 text-xs text-ink-700 md:text-sm">
                <strong className="text-ink-900">Important:</strong>{" "}
                if you already rank well on Google or Google Maps, that
                doesn&apos;t automatically mean you rank in AI engines.
                They&apos;re different systems with different signals — see
                the explainer below.
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
            dashboard. 5 charts. Customer-style queries run via Claude + live
            web search (a proxy for ChatGPT, Gemini, Perplexity).
            Sector-specific recommendations. Delivered within 24 hours.
          </p>
        </div>
      )}

      {/* Sticky section TOC — sits below the sample warning, above
          the score. Helps prospects jump between sections without
          having to scroll past content they've already seen. */}
      <DashboardSectionToc />

      {/* HEADLINE — Score + Diagnosis */}
      <section
        id="score"
        className="scroll-mt-20 rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10"
      >
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
              Headline diagnosis (sample)
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
              Sample SA {sector} firm — bottom quartile on AI visibility.
            </h2>
            <p className="mt-4 text-sm text-ink-700 leading-relaxed md:text-base">
              {sampleReport.diagnosisOneLiner}
            </p>
            <p className="mt-3 text-xs italic text-ink-500">
              The score above represents AI engine visibility specifically —
              NOT Google rankings. A sample firm can rank well on Google
              Maps and still score low here. Your real report covers both
              systems with YOUR actual data.
            </p>
          </div>
        </div>
      </section>

      {/* GOOGLE vs AI ENGINES — critical clarification.
          A business can rank #1 on Google Maps AND be invisible to ChatGPT.
          They're different systems with different signals. This callout
          prevents prospects from dismissing the methodology because they
          know they 'rank well on Google.' */}
      <section className="rounded-2xl border border-accent-200 bg-accent-50/40 p-6 md:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-ink-900 md:text-lg">
              Google rankings ≠ AI engine rankings — they&apos;re different games.
            </h3>
            <p className="mt-2 text-sm text-ink-700 leading-relaxed">
              You might rank well on Google Maps for &quot;[your service] near me&quot;
              and STILL be invisible when someone asks ChatGPT or Claude the same
              question. Different systems, different signals, different weightings.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-rule bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Google ranks based on
                </div>
                <ul className="mt-2 space-y-1 text-xs text-ink-700">
                  <li>· GBP completeness + reviews</li>
                  <li>· NAP consistency (proximity matters)</li>
                  <li>· On-page SEO + backlinks</li>
                  <li>· Site speed + mobile responsiveness</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rule bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent-700">
                  AI engines rank based on
                </div>
                <ul className="mt-2 space-y-1 text-xs text-ink-700">
                  <li>· Trusted citations (Wikipedia, news, industry pubs)</li>
                  <li>· Schema markup AI can parse</li>
                  <li>· LinkedIn presence (especially Perplexity)</li>
                  <li>· Verbatim quotability (FAQ-style content)</li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs italic text-ink-600">
              The signals overlap (citations, NAP, schema all matter for both)
              — but the WEIGHTING is different. AI visibility is the next
              layer on top of solid local SEO, not a replacement.
            </p>
          </div>
        </div>
      </section>

      {/* PROOF LAYER — what an AI proxy returns. ANCHOR: #responses */}
      <div id="responses" className="scroll-mt-20" />
      {/* PROOF LAYER — what an AI proxy returns.
          Sits between headline (score) and explanatory charts. The
          score creates the 'ouch' moment. The conversations make it
          felt — 'every query I tested returned my competitor and I'm
          not in the answer.' Then charts explain WHY.
          STRATEGIC ROLE: mockups = proof. Charts = explanation.
          Recommendations = action.
          HONESTY NOTE: previous copy said "4 AI engines say this" —
          we don't natively query ChatGPT/Gemini/Perplexity. Updated
          to reflect the Claude+web_search proxy reality. */}
      <section className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
          What an AI proxy actually returns
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
          See for yourself.
        </h3>
        <p className="mt-3 text-base text-ink-700 leading-relaxed">
          Below are real customer-style queries we run via Claude with live
          web search — a proxy for what ChatGPT, Gemini, and Perplexity
          surface from public web data. Notice who&apos;s in the answer —
          and who isn&apos;t.
        </p>

        <div className="mt-8">
          <AiConversationGrid
            visibilityChecks={sampleReport.visibilityChecks}
            businessName={businessName}
          />
        </div>

        <p className="mt-6 text-xs italic text-ink-500">
          These responses are illustrative — drawn from typical SA{" "}
          {sector === "medical"
            ? "medical practice"
            : sector === "legal"
              ? "law firm"
              : sector === "industrial"
                ? "industrial"
                : "business"}{" "}
          patterns. Your real report shows the actual verbatim responses for{" "}
          <strong className="not-italic text-ink-700">YOUR specific queries</strong>{" "}
          using the same Claude+web_search proxy. Native ChatGPT, Gemini,
          and Perplexity adapters land in Phase 1.5.
        </p>
      </section>

      {/* TWO-COL — Layer Radar + Engine Heatmap. ANCHOR: #layers */}
      <section id="layers" className="scroll-mt-20 grid gap-6 md:grid-cols-2">
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
            Likely cited / not cited
          </h3>
          <p className="mt-2 text-xs text-ink-500">
            Claude+web_search proxy · stand-in for ChatGPT, Gemini, Perplexity
          </p>
          <div className="mt-6">
            <EngineHeatmap
              visibilityChecks={sampleReport.visibilityChecks}
              businessName={businessName}
            />
          </div>
        </div>
      </section>

      {/* CITATION BENCHMARK. ANCHOR: #citations */}
      <section
        id="citations"
        className="scroll-mt-20 rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10"
      >
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

      {/* ISSUE DISTRIBUTION + TOP RECOMMENDATIONS. ANCHOR: #issues */}
      <section id="issues" className="scroll-mt-20 grid gap-6 md:grid-cols-5">
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

      {/* COMPETITOR MENTIONS — collapsed by default to shorten scroll.
          The same names already appear in the AI conversation cards
          and the citation benchmark above — this section is reference,
          not first-read content. ANCHOR: #competitors.
          AutoOpenDetails opens the <details> automatically when the
          URL hash is #competitors, so clicking the TOC chip jumps to
          the section AND reveals the content (no double-click). */}
      <AutoOpenDetails
        targetId="competitors"
        className="rounded-3xl border border-rule bg-white shadow-soft"
      >
        <section id="competitors" className="scroll-mt-24">
        <details className="group p-6 md:p-8">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                Names that surfaced in our test queries
              </div>
              <h3 className="mt-1 text-base font-semibold text-ink-900 md:text-lg">
                Sample competitor mentions ({sampleReport.competitors.length})
              </h3>
              <p className="mt-1 text-xs text-ink-500">
                Click to expand · verify these match your actual competitive set
              </p>
            </div>
            <span className="flex-shrink-0 rounded-full bg-ink-100 px-3 py-1 text-sm font-medium text-ink-700 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

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
                    Surfaced in {c.appearsInEngines.length} of 4 test queries · ~{c.citationCount} citation domains we identified
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </details>
        </section>
      </AutoOpenDetails>

      {/* METHODOLOGY DISCLOSURE — full version, end of dashboard so
          the prospect has the complete honest picture before deciding. */}
      <MethodologyDisclosure variant="full" />

      {/* ─────────────────────────────────────────────────────────
          CONVERSION BLOCK — turns 'interesting insight' into 'clear
          business decision'.
          Includes:
            - Revenue impact (sector-aware ZAR loss math)
            - Urgency (compounds over time)
            - Local visibility signals breakdown
            - What happens next (3-step process)
            - Risk reduction (high-impact fixes first)
            - Decision block (1 primary + 2 secondary CTAs)
          Replaces the previous generic 'Want this for your business?'
          CTA which was too soft — this drives buying decisions.
          ───────────────────────────────────────────────────────── */}
      <div id="decide" className="scroll-mt-20" />
      <ConversionBlock industry={industry} businessName={businessName} />

      {/* If on the standalone /scan/preview page, also show a final
          'submit a real scan' CTA for visitors who got here via marketing.
          On the post-submit fallback, this is redundant — the prospect
          already submitted. */}
      {showMarketingIntro && (
        <section className="rounded-2xl border border-rule bg-ink-50/40 p-6 text-center md:p-8">
          <p className="text-sm text-ink-600">
            Haven&apos;t submitted yet? Get your personalised version of this
            dashboard.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/scan"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-sm font-semibold text-white shadow-soft transition-all hover:bg-ink-800"
            >
              Get my AI Visibility report
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
