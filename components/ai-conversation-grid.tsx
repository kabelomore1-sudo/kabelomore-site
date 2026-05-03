/**
 * AI Conversation Grid — the "proof layer" of the preview dashboard.
 *
 * Renders 4 chat-style mockups (one per AI engine — ChatGPT, Claude,
 * Gemini, Perplexity) using the prospect's visibilityChecks data.
 *
 * Each card shows:
 *   1. The query a customer might ask the engine
 *   2. The verbatim excerpt of what the engine responded
 *   3. Competitors cited (highlighted)
 *   4. Whether the prospect's business appears in the answer
 *   5. Status pill: "Cited" (green) or "Not cited" (rose)
 *
 * STRATEGIC ROLE (per the 3-layer framing):
 *   - SCREENSHOTS / MOCKUPS = proof (this component)
 *   - CHARTS                = explanation (LayerRadar, EngineHeatmap, etc.)
 *   - RECOMMENDATIONS       = action (top-3 ranked fixes section)
 *
 * Visually consistent with the homepage AiResponseMockup but tighter
 * (no phone frame — too heavy for a 2-col grid). 2-col on desktop,
 * stacked on mobile.
 *
 * Naval-shape: minimal added cognitive load. Same data the user already
 * has access to in EngineHeatmap, just shown as a felt experience instead
 * of a numerical abstraction. Repetition across 4 cards is the emotional
 * weapon — "EVERY engine recommends my competitor."
 */

import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { VisibilityCheck, Engine } from "@/lib/types/scan";

interface Props {
  visibilityChecks: VisibilityCheck[];
  businessName: string;
}

// Engine config — colors match the homepage AiResponseMockup for
// visual consistency across the site
const engineConfig: Record<
  string,
  { name: string; color: string; textColor: string; bgTint: string }
> = {
  chatgpt: {
    name: "ChatGPT",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgTint: "bg-emerald-50/40",
  },
  claude: {
    name: "Claude",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgTint: "bg-orange-50/40",
  },
  "claude-search": {
    name: "Claude",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgTint: "bg-orange-50/40",
  },
  gemini: {
    name: "Gemini",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgTint: "bg-blue-50/40",
  },
  perplexity: {
    name: "Perplexity",
    color: "bg-violet-500",
    textColor: "text-violet-700",
    bgTint: "bg-violet-50/40",
  },
};

function getEngineConfig(source: Engine | string) {
  return (
    engineConfig[source.toLowerCase()] ?? {
      name: source,
      color: "bg-zinc-500",
      textColor: "text-zinc-700",
      bgTint: "bg-zinc-50/40",
    }
  );
}

export function AiConversationGrid({
  visibilityChecks,
  businessName,
}: Props) {
  // Show up to 4 conversations — one per engine. If we have more than 4,
  // prefer the most diverse set (one per engine if possible).
  const checks = visibilityChecks.slice(0, 4);

  if (checks.length === 0) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {checks.map((check, idx) => (
        <ConversationCard
          key={`${check.source}-${idx}`}
          check={check}
          businessName={businessName}
        />
      ))}
    </div>
  );
}

function ConversationCard({
  check,
  businessName,
}: {
  check: VisibilityCheck;
  businessName: string;
}) {
  const config = getEngineConfig(check.source);

  return (
    <article className="overflow-hidden rounded-2xl border border-rule bg-white shadow-soft transition-shadow hover:shadow-card">
      {/* Engine header */}
      <header className={`flex items-center gap-2 border-b border-rule px-4 py-3 ${config.bgTint}`}>
        <div
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${config.color} text-white`}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-ink-900">
            {config.name}
          </div>
          <div className="text-[10px] text-ink-500">
            Searching the web · just now
          </div>
        </div>
        {/* Status pill — Cited or Not cited */}
        {check.businessAppears ? (
          <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Cited
          </span>
        ) : (
          <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-700">
            <AlertTriangle className="h-3 w-3" />
            Not cited
          </span>
        )}
      </header>

      {/* Conversation body */}
      <div className="space-y-3 p-4">
        {/* User query — dark bubble, right-aligned */}
        <div className="flex justify-end">
          <div className="max-w-[88%] rounded-2xl rounded-br-md bg-ink-900 px-3.5 py-2 text-xs leading-relaxed text-white md:text-[13px]">
            {check.query}
          </div>
        </div>

        {/* AI response — light bubble, left-aligned */}
        <div className="flex justify-start">
          <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-ink-50 px-3.5 py-2.5 text-xs leading-relaxed text-ink-700 md:text-[13px]">
            {check.verbatimExcerpt}
          </div>
        </div>
      </div>

      {/* Footer callout — only when business is NOT cited */}
      {!check.businessAppears && check.competitorsCited.length > 0 && (
        <footer className="border-t border-rose-100 bg-rose-50/50 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-600" />
            <p className="text-[11px] leading-relaxed text-ink-700">
              <strong className="text-rose-700">{businessName}</strong> not
              in this answer. Cited instead:{" "}
              <strong className="text-ink-900">
                {check.competitorsCited.slice(0, 3).join(", ")}
                {check.competitorsCited.length > 3
                  ? `, +${check.competitorsCited.length - 3} more`
                  : ""}
              </strong>
            </p>
          </div>
        </footer>
      )}

      {/* Footer when business IS cited — positive but small */}
      {check.businessAppears && (
        <footer className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-600" />
            <p className="text-[11px] leading-relaxed text-ink-700">
              <strong className="text-emerald-700">{businessName}</strong>{" "}
              appears in this answer.
            </p>
          </div>
        </footer>
      )}
    </article>
  );
}
