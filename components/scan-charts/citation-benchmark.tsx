/**
 * CitationBenchmark — bar comparison showing user vs targets.
 *
 * Replaces the plain "Citation count: 6" number with a visual that
 * tells the story: "you're at X, you need Y, top performers are at Z."
 *
 * The key benchmarks (industry-validated heuristics):
 *  - 0 citations  = Type A (invisible)
 *  - 1-5          = Type B (weak)
 *  - 6-15         = Type C (moderate)
 *  - 25+          = AI confidently recommends
 *  - 50+          = Top-of-category dominance
 */

import type { CitationLevel } from "@/lib/types/scan";

type Props = {
  count: number;
  level: CitationLevel;
};

const TARGET_CITATIONS_FOR_AI = 25;
const TOP_PERFORMERS = 50;

export function CitationBenchmark({ count, level }: Props) {
  // Cap visualization at TOP_PERFORMERS to keep the chart readable
  const max = TOP_PERFORMERS;

  const userPct = Math.min((count / max) * 100, 100);
  const targetPct = (TARGET_CITATIONS_FOR_AI / max) * 100;
  const topPct = 100;

  const userColor =
    level === "high"
      ? "bg-emerald-500"
      : level === "medium"
        ? "bg-amber-500"
        : level === "low"
          ? "bg-amber-400"
          : "bg-rose-500";

  const userTextColor =
    level === "high"
      ? "text-emerald-700"
      : level === "medium"
        ? "text-amber-700"
        : level === "low"
          ? "text-amber-700"
          : "text-rose-700";

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Third-party citations found
          </div>
          <div className={`mt-0.5 text-3xl font-semibold ${userTextColor}`}>
            {count}
            <span className="ml-2 text-sm uppercase tracking-wider text-ink-500">
              {level === "none" && "none"}
              {level === "low" && "low"}
              {level === "medium" && "moderate"}
              {level === "high" && "strong"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* User's count */}
        <BenchmarkRow
          label="You"
          count={count}
          pct={userPct}
          color={userColor}
          highlight
        />

        {/* Target line — what AI engines need to confidently recommend */}
        <BenchmarkRow
          label="Required for AI to confidently recommend"
          count={TARGET_CITATIONS_FOR_AI}
          pct={targetPct}
          color="bg-ink-700"
          dashed
        />

        {/* Top performers */}
        <BenchmarkRow
          label="Top-performing competitors"
          count={TOP_PERFORMERS}
          pct={topPct}
          color="bg-ink-300"
          subdued
        />
      </div>

      {/* Interpretation */}
      <div className="mt-5 rounded-xl bg-ink-50/40 p-4 text-sm text-ink-700 leading-relaxed">
        {count < TARGET_CITATIONS_FOR_AI ? (
          <>
            <span className="font-semibold text-ink-900">The gap is real:</span>{" "}
            AI engines need ~{TARGET_CITATIONS_FOR_AI} consistent citations
            before they confidently recommend a business. You&apos;re at{" "}
            <span className="font-semibold text-ink-900">{count}</span>. The
            difference of{" "}
            <span className="font-semibold text-ink-900">
              {TARGET_CITATIONS_FOR_AI - count}
            </span>{" "}
            citations is what separates &ldquo;cited&rdquo; from
            &ldquo;invisible.&rdquo;
          </>
        ) : (
          <>
            <span className="font-semibold text-ink-900">Strong position:</span>{" "}
            You&apos;re above the AI confidence threshold. The compounding work
            now is moving toward top-performer levels and maintaining
            consistency.
          </>
        )}
      </div>
    </div>
  );
}

function BenchmarkRow({
  label,
  count,
  pct,
  color,
  highlight = false,
  dashed = false,
  subdued = false,
}: {
  label: string;
  count: number;
  pct: number;
  color: string;
  highlight?: boolean;
  dashed?: boolean;
  subdued?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span
          className={
            highlight
              ? "font-semibold text-ink-900"
              : subdued
                ? "text-ink-500"
                : "text-ink-700"
          }
        >
          {label}
        </span>
        <span
          className={`font-mono ${
            highlight ? "text-ink-900" : subdued ? "text-ink-500" : "text-ink-700"
          }`}
        >
          {count}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-ink-100">
        <div
          className={`h-full ${color} ${dashed ? "border-y-2 border-dashed border-white" : ""}`}
          style={{
            width: `${pct}%`,
            transition: "width 1.2s ease-out",
          }}
        />
      </div>
    </div>
  );
}
