/**
 * MethodologyDisclosure — single source of truth for how we describe
 * what the scan measures, how confident the signals are, and what's
 * a proxy vs a verified fact.
 *
 * Used on:
 *   - Preview dashboard (sample mode)
 *   - Real scan results page
 *   - Anywhere we show AI-engine response data
 *
 * Why this exists: prior copy across the site said "we test 4 AI
 * engines (ChatGPT, Claude, Gemini, Perplexity)" when in fact only
 * Claude + live web_search runs. That overstates the test surface.
 * This component is the standard, honest framing — used everywhere
 * AI visibility data appears so the message is consistent.
 *
 * Three variants:
 *   - "compact"   small inline badge (chart corners)
 *   - "standard"  ~3-line callout (in-section)
 *   - "full"      ~6-line block (top of report / preview)
 */

import { Info, ShieldCheck } from "lucide-react";

type Variant = "compact" | "standard" | "full";

interface Props {
  variant?: Variant;
  className?: string;
}

export function MethodologyDisclosure({
  variant = "standard",
  className = "",
}: Props) {
  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-start gap-1.5 rounded-lg bg-ink-50/60 px-2 py-1 text-[10px] text-ink-600 ${className}`}
      >
        <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
        <span>
          AI engine responses simulated via Claude + live web search (proxy for
          ChatGPT, Gemini, Perplexity). Re-runs may vary 5-10 pts.
        </span>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <section
        className={`rounded-2xl border border-rule bg-white p-5 md:p-6 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-ink-900 md:text-base">
              How this scan works (and what it doesn&apos;t do).
            </h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  What we verify directly
                </div>
                <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-ink-700">
                  <li>· Website reachability (HEAD request)</li>
                  <li>· JSON-LD schema present + types declared</li>
                  <li>· Citation domains surfaced via web search</li>
                  <li>· Verbatim language used by AI when it answers</li>
                </ul>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  What is inferred (not verified)
                </div>
                <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-ink-700">
                  <li>· GBP existence (no Google Maps API yet)</li>
                  <li>· NAP consistency across listings</li>
                  <li>· Competitor list (whoever appears in search)</li>
                  <li>
                    · &quot;What ChatGPT/Gemini/Perplexity say&quot; — we use
                    Claude + live web search as a proxy for these engines, not
                    direct API calls
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-ink-500">
              Score is directional — a readiness signal, not a deterministic
              measurement. Re-runs against the same business may vary 5-10
              points because live web search is non-deterministic. Treat the
              score as a tier indicator (low / mid / high), not a precise
              ranking. Native ChatGPT, Gemini, and Perplexity adapters are
              planned for Phase 1.5 (Q3 2026).
            </p>
          </div>
        </div>
      </section>
    );
  }

  // standard
  return (
    <div
      className={`rounded-xl border border-rule bg-ink-50/40 p-4 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-500" />
        <div className="text-xs leading-relaxed text-ink-700">
          <span className="font-semibold text-ink-900">How we test:</span>{" "}
          AI-engine responses are simulated using Claude with live{" "}
          <code className="rounded bg-white px-1 py-0.5 text-[10px]">
            web_search
          </code>{" "}
          as a proxy for what ChatGPT, Gemini, and Perplexity surface from
          public web data. Native per-engine adapters ship in Phase 1.5. The
          score is directional (re-runs may vary 5-10 pts), not deterministic.
        </div>
      </div>
    </div>
  );
}
