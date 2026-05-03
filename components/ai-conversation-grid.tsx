/**
 * AI Conversation Grid — the "proof layer" of the preview dashboard.
 *
 * Renders chat-style mockups of customer-style queries we actually
 * ran. Each card shows:
 *   1. The query a customer might ask an AI engine
 *   2. The verbatim excerpt of the response we observed
 *   3. Competitors named in the answer
 *   4. Whether the prospect's business appears in the answer
 *   5. Status pill: "Cited" (green) or "Not cited" (rose)
 *
 * HONEST FRAMING:
 *   We currently run all queries via Claude + live web_search as a
 *   proxy for what ChatGPT / Gemini / Perplexity surface (since their
 *   public answers also blend a model with web retrieval). Native
 *   per-engine adapters ship Phase 1.5. The methodology badge above
 *   the grid makes this explicit so we never imply we tested 4
 *   different engines when we tested 1 with web search.
 *
 * STRATEGIC ROLE (per the 3-layer framing):
 *   - SCREENSHOTS / MOCKUPS = proof (this component)
 *   - CHARTS                = explanation (LayerRadar, EngineHeatmap, etc.)
 *   - RECOMMENDATIONS       = action (top-3 ranked fixes section)
 *
 * Naval-shape: minimal added cognitive load. Same data the user has
 * access to in EngineHeatmap, just shown as a felt experience instead
 * of a numerical abstraction. Repetition across cards is the emotional
 * weapon — "EVERY query I ran returned my competitor instead of me."
 */

import { Sparkles, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { VisibilityCheck, Engine } from "@/lib/types/scan";

interface Props {
  visibilityChecks: VisibilityCheck[];
  businessName: string;
}

// Engine display config — covers the canonical 4 plus our actual
// runtime label "claude-search". Real scans always use claude-search;
// sample data may use the 4 canonical labels for visual variety, but
// the methodology badge above the grid clarifies they're rendered via
// the same Claude + web search proxy under the hood.
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
    name: "Claude + web search",
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

// Whether the displayed source is what literally ran (claude-search)
// or a labelled proxy (chatgpt/gemini/perplexity simulated via Claude+search).
function isProxy(source: Engine | string): boolean {
  return source.toLowerCase() !== "claude-search" && source.toLowerCase() !== "claude";
}

export function AiConversationGrid({
  visibilityChecks,
  businessName,
}: Props) {
  // Show up to 4 conversations
  const checks = visibilityChecks.slice(0, 4);

  if (checks.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Methodology badge — always present so prospects never assume
          we made 4 separate API calls to 4 different engines. */}
      <div className="flex items-start gap-2 rounded-xl border border-rule bg-ink-50/40 px-4 py-2.5 text-[11px] leading-relaxed text-ink-600">
        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-ink-500" />
        <div>
          <span className="font-semibold text-ink-900">How we tested:</span>{" "}
          each card below was generated via Claude with live{" "}
          <code className="rounded bg-white px-1 py-0.5 text-[10px]">
            web_search
          </code>{" "}
          — a proxy for how ChatGPT, Gemini, and Perplexity blend a model with
          public web retrieval. Native per-engine adapters ship in Phase 1.5.
          The signal is reliable directionally; per-engine breakdown gets more
          precise next iteration.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {checks.map((check, idx) => (
          <ConversationCard
            key={`${check.source}-${idx}`}
            check={check}
            businessName={businessName}
          />
        ))}
      </div>
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
  const proxy = isProxy(check.source);

  return (
    <article className="overflow-hidden rounded-2xl border border-rule bg-white shadow-soft transition-shadow hover:shadow-card">
      {/* Engine header */}
      <header
        className={`flex items-center gap-2 border-b border-rule px-4 py-3 ${config.bgTint}`}
      >
        <div
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${config.color} text-white`}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="text-xs font-semibold text-ink-900">
              {config.name}
            </div>
            {proxy && (
              <span
                className="rounded-full bg-white/80 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-ink-500 ring-1 ring-ink-100"
                title="Generated via Claude + web_search as a proxy for this engine"
              >
                Proxy
              </span>
            )}
          </div>
          <div className="text-[10px] text-ink-500">
            {proxy
              ? "Simulated via Claude + web search"
              : "Live web search · just now"}
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
              <strong className="text-rose-700">{businessName}</strong> not in
              this answer. Names that appeared instead:{" "}
              <strong className="text-ink-900">
                {check.competitorsCited.slice(0, 3).join(", ")}
                {check.competitorsCited.length > 3
                  ? `, +${check.competitorsCited.length - 3} more`
                  : ""}
              </strong>
              <span className="text-ink-500">
                {" "}
                — verify these are your actual competitors.
              </span>
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
