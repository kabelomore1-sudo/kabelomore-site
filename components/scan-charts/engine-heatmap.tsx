/**
 * EngineHeatmap — visualises visibility across the 4 AI engines we
 * track conceptually (ChatGPT, Claude, Gemini, Perplexity).
 *
 * HONESTY NOTE:
 *   We currently run all queries via Claude + live `web_search` as a
 *   proxy for ChatGPT / Gemini / Perplexity (their public answers all
 *   blend a model with web retrieval, so a single search-grounded
 *   call is a directionally reliable stand-in until we ship native
 *   per-engine adapters in Phase 1.5).
 *
 *   The chart shows the same aggregate state across the 4 engine
 *   cells with an explicit "Proxy" label and Phase 1.5 note. Naval
 *   shape: never let the visual imply we did 4 separate engine
 *   calls when we did 1 web-search-grounded call.
 *
 * Visual gut-punch: a buyer sees 4 cells, color-coded by whether they
 * appeared in our test answers. All red = "AI doesn't recommend me
 * anywhere." Real per-engine differentiation lands Phase 1.5.
 */

import type { VisibilityCheck } from "@/lib/types/scan";
import { CheckCircle2, XCircle, Sparkles, Info } from "lucide-react";

type Props = {
  visibilityChecks: VisibilityCheck[];
  businessName: string;
};

const ENGINES = [
  { id: "chatgpt", name: "ChatGPT", color: "emerald", brand: "OpenAI" },
  { id: "claude", name: "Claude", color: "orange", brand: "Anthropic" },
  { id: "gemini", name: "Gemini", color: "blue", brand: "Google" },
  { id: "perplexity", name: "Perplexity", color: "violet", brand: "AI search" },
] as const;

export function EngineHeatmap({ visibilityChecks, businessName }: Props) {
  // Aggregate: count how many checks the business appeared in
  const totalChecks = visibilityChecks.length;
  const appeared = visibilityChecks.filter((c) => c.businessAppears).length;

  // v1: claude-search powers all checks. v1.5 will split per-engine.
  const overallCited = appeared > 0;

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Tested via
          </div>
          <div className="mt-0.5 text-base font-semibold text-ink-900">
            Claude + web search proxy
          </div>
          <div className="mt-0.5 text-[10px] text-ink-500">
            Stands in for the 4 engines below
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-ink-500">
            Queries returning you
          </div>
          <div className="text-2xl font-semibold text-ink-900">
            {appeared}
            <span className="text-sm text-ink-400">/{totalChecks}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ENGINES.map((engine) => {
          const wasCited = overallCited; // v1 simplification — same state across the 4 cards
          return (
            <div
              key={engine.id}
              className={`relative overflow-hidden rounded-2xl border p-4 transition-shadow ${
                wasCited
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-rose-200 bg-rose-50/40"
              }`}
            >
              {/* Proxy badge — top-right of every card so prospects
                  always see we're stand-in testing, not native testing. */}
              <span
                className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-ink-500 ring-1 ring-ink-100"
                title="Result inferred from a Claude + web_search proxy run"
              >
                Proxy
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${colorBg(engine.color)}`}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="mt-3 text-sm font-semibold text-ink-900">
                {engine.name}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-ink-400">
                {engine.brand}
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {wasCited ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">
                      Likely cited
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-xs font-medium text-rose-700">
                      Likely not cited
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!overallCited && totalChecks > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">{businessName}</span>{" "}
            didn&apos;t appear in any of the {totalChecks} customer-style
            queries we tested via Claude + live web search. Names that came up
            instead are listed in the citation benchmark and conversation
            cards below.
          </div>
        </div>
      )}

      {/* Methodology disclosure — anchored honestly to current state */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-ink-50/40 px-4 py-2.5 text-[10px] leading-relaxed text-ink-500">
        <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
        <div>
          <span className="font-semibold text-ink-700">Phase 1 method:</span>{" "}
          we run customer-style queries via Claude with live{" "}
          <code className="rounded bg-white px-1 py-0.5 text-[10px]">
            web_search
          </code>{" "}
          as a proxy for ChatGPT, Gemini, and Perplexity (all of which blend a
          model with web retrieval in their answers). Native per-engine
          adapters land Phase 1.5. Use the &quot;Likely cited&quot; signal as
          directional, not deterministic.
        </div>
      </div>
    </div>
  );
}

function colorBg(color: "emerald" | "orange" | "blue" | "violet"): string {
  switch (color) {
    case "emerald":
      return "bg-emerald-500";
    case "orange":
      return "bg-orange-500";
    case "blue":
      return "bg-blue-500";
    case "violet":
      return "bg-violet-500";
  }
}
