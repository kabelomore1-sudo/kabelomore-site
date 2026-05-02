/**
 * IssueDistribution — donut chart breaking down issues by severity.
 *
 * Visual summary of "how bad is the situation" — gives buyer the
 * 0-second understanding of scope. Donut shape because sum-of-parts
 * stories work well in donuts.
 */

import type { Issue } from "@/lib/types/scan";

type Props = {
  issues: Issue[];
};

const SEVERITY_COLORS = {
  critical: "#dc2626", // rose-600
  high: "#f59e0b", // amber-500
  medium: "#eab308", // yellow-500
  low: "#94a3b8", // slate-400
} as const;

const SEVERITY_LABELS = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export function IssueDistribution({ issues }: Props) {
  const total = issues.length;

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 text-center">
        <div className="text-4xl">✓</div>
        <div className="mt-2 text-sm font-semibold text-emerald-800">
          No critical issues found
        </div>
      </div>
    );
  }

  // Count by severity
  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
  };

  // Donut geometry
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Segments — render in order critical → low so critical sits at top
  const order: (keyof typeof counts)[] = ["critical", "high", "medium", "low"];
  let cumulativeOffset = 0;
  const segments = order
    .filter((sev) => counts[sev] > 0)
    .map((sev) => {
      const ratio = counts[sev] / total;
      const length = circumference * ratio;
      const segment = {
        sev,
        count: counts[sev],
        ratio,
        length,
        offset: cumulativeOffset,
        color: SEVERITY_COLORS[sev],
      };
      cumulativeOffset += length;
      return segment;
    });

  return (
    <div className="flex flex-col items-center md:flex-row md:gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgb(229 231 235)"
            strokeWidth={strokeWidth}
          />
          {/* Severity segments */}
          {segments.map((seg) => (
            <circle
              key={seg.sev}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.length} ${circumference - seg.length}`}
              strokeDashoffset={-seg.offset}
              transform={`rotate(-90 ${center} ${center})`}
              style={{ transition: "stroke-dasharray 1s ease-out" }}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-semibold tracking-tight text-ink-900">
            {total}
          </div>
          <div className="-mt-1 text-xs uppercase tracking-wider text-ink-500">
            issues found
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-2 md:mt-0">
        {order.map((sev) => {
          const count = counts[sev];
          if (count === 0) return null;
          return (
            <div key={sev} className="flex items-center gap-3">
              <span
                className="block h-3 w-3 rounded-sm"
                style={{ backgroundColor: SEVERITY_COLORS[sev] }}
              />
              <span className="text-sm font-medium text-ink-900">
                {SEVERITY_LABELS[sev]}
              </span>
              <span className="ml-auto font-mono text-xs text-ink-500">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
