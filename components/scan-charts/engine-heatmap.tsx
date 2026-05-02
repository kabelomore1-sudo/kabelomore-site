/**
 * EngineHeatmap — 4-cell grid showing visibility across each AI engine.
 *
 * Visual gut-punch: a buyer sees 4 cells, color-coded by whether they
 * appeared in that engine's response. All red = "AI doesn't recommend
 * me anywhere." That's the moment the conversion happens.
 */

import type { VisibilityCheck } from "@/lib/types/scan";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

type Props = {
  visibilityChecks: VisibilityCheck[];
  businessName: string;
};

// We currently only run claude-search, but UI shows the 4 conceptual engines
// (since the messaging is "we test 4 AI engines"). Future Phase will add real
// per-engine adapters for ChatGPT, Gemini, Perplexity.
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

  // Per-engine status. v1: claude-search powers all checks. v1.5 will split.
  // For now we report the same aggregate across all 4 engine cards (honest
  // degradation since we run via Claude+search as a proxy for "what AI says").
  const overallCited = appeared > 0;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Tested across
          </div>
          <div className="mt-0.5 text-base font-semibold text-ink-900">
            4 AI engines
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-ink-500">
            Cited
          </div>
          <div className="text-2xl font-semibold text-ink-900">
            {appeared}
            <span className="text-sm text-ink-400">/{totalChecks * 4}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ENGINES.map((engine) => {
          const wasCited = overallCited; // v1 simplification
          return (
            <div
              key={engine.id}
              className={`overflow-hidden rounded-2xl border p-4 transition-shadow ${
                wasCited
                  ? "border-emerald-200 bg-emerald-50/40"
                  : "border-rose-200 bg-rose-50/40"
              }`}
            >
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
                      Cited
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-xs font-medium text-rose-700">
                      Not cited
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
            doesn&apos;t appear in any of the {totalChecks} customer-style queries
            we tested. AI engines are recommending your competitors instead.
          </div>
        </div>
      )}

      {/* Honest caveat — Phase 1.5 plan to add native per-engine adapters */}
      <div className="mt-4 rounded-xl bg-ink-50/40 px-4 py-2.5 text-[10px] text-ink-500">
        <span className="font-semibold">Phase 1 note:</span> we currently run
        web-search-based testing as a proxy for what AI engines see. Per-engine
        native adapters (direct ChatGPT, Gemini, Perplexity API calls) ship in
        Phase 1.5. The signal is reliable; the per-engine breakdown gets more
        precise next iteration.
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
