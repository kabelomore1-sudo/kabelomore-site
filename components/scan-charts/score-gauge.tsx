/**
 * ScoreGauge — circular SVG donut for the 0-100 AI Visibility Score.
 *
 * The hero number on the results page. Replaces a plain "42/100" with a
 * proper visualization that buyers screenshot and share.
 *
 * Pure SVG — zero JS bundle weight, prints cleanly as PDF, mobile-responsive.
 */

import { scoreLabel } from "@/lib/engines/scoring";
import type { Classification } from "@/lib/types/scan";
import { classificationLabel } from "@/lib/engines/classification";

type Props = {
  score: number;
  classification: Classification;
};

export function ScoreGauge({ score, classification }: Props) {
  // Donut geometry
  const size = 220;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const clampedScore = Math.max(0, Math.min(100, score));
  const dashOffset = circumference * (1 - clampedScore / 100);

  // Color zones — same scale used in scoreLabel()
  const arcColor =
    score < 25
      ? "#dc2626" // rose-600
      : score < 50
        ? "#f59e0b" // amber-500
        : score < 75
          ? "#84cc16" // lime-500
          : "#10b981"; // emerald-500

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgb(229 231 235)" /* zinc-200 */
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>

        {/* Center label — score + /100 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-semibold tracking-tight text-ink-900 md:text-7xl">
            {clampedScore}
          </div>
          <div className="-mt-2 text-base text-ink-500">/100</div>
        </div>
      </div>

      {/* Label below gauge */}
      <div className="mt-6 inline-flex rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
        {scoreLabel(score)}
      </div>
      <div className="mt-3 text-sm text-ink-500">
        {classificationLabel(classification)}
      </div>
      {/* Directional-readiness disclosure — keeps the prospect from
          treating the score as a precise measurement. Live web_search
          is non-deterministic, so re-runs vary 5-10 pts. We prefer to
          say this once, clearly, here than to bury it in the small
          print elsewhere. */}
      <div className="mt-2 text-[10px] text-ink-400">
        Directional readiness score · re-runs may vary 5-10 pts
      </div>
    </div>
  );
}
