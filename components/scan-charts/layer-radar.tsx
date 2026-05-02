/**
 * LayerRadar — 4-axis radar/spider chart for the score breakdown.
 *
 * Shows how Presence, Authority, Consistency, Content compare against
 * each layer's max. Lets the buyer see "you're strong here, weak there"
 * in one glance. Massively better than 4 horizontal bars.
 */

import type { ScoreLayers } from "@/lib/types/scan";

type Props = {
  layers: ScoreLayers;
};

const MAX_VALUES = {
  presence: 25,
  authority: 40,
  consistency: 20,
  content: 15,
} as const;

const AXIS_LABELS = [
  { key: "presence", label: "Presence", note: "website + GBP" },
  { key: "authority", label: "Authority", note: "citations" },
  { key: "consistency", label: "Consistency", note: "NAP across web" },
  { key: "content", label: "Content", note: "schema + structure" },
] as const;

export function LayerRadar({ layers }: Props) {
  // Radar geometry
  const size = 320;
  const center = size / 2;
  // Leave padding for axis labels around the chart
  const maxRadius = (size / 2) * 0.62;

  // Convert each layer to a normalized 0-1 value, then to radius
  const points = AXIS_LABELS.map((axis, i) => {
    const value = layers[axis.key];
    const max = MAX_VALUES[axis.key];
    const ratio = max > 0 ? value / max : 0;
    const r = ratio * maxRadius;
    // 4 axes: top (0°), right (90°), bottom (180°), left (270°)
    const angle = (i * 90 - 90) * (Math.PI / 180);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, value, max, ratio };
  });

  const dataPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Background grid: concentric squares at 25%, 50%, 75%, 100%
  const gridLevels = [0.25, 0.5, 0.75, 1];

  // Axis lines (4 spokes from center to outer)
  const axisLines = AXIS_LABELS.map((_, i) => {
    const angle = (i * 90 - 90) * (Math.PI / 180);
    const x2 = center + maxRadius * Math.cos(angle);
    const y2 = center + maxRadius * Math.sin(angle);
    return { x1: center, y1: center, x2, y2 };
  });

  // Label positions (slightly outside the maxRadius)
  const labelPositions = AXIS_LABELS.map((axis, i) => {
    const angle = (i * 90 - 90) * (Math.PI / 180);
    const labelRadius = maxRadius + 36;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      label: axis.label,
      note: axis.note,
      value: layers[axis.key],
      max: MAX_VALUES[axis.key],
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background grid */}
        {gridLevels.map((level) => {
          const points = AXIS_LABELS.map((_, i) => {
            const angle = (i * 90 - 90) * (Math.PI / 180);
            const r = maxRadius * level;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          });
          return (
            <polygon
              key={level}
              points={points.join(" ")}
              fill="none"
              stroke="rgb(229 231 235)" /* zinc-200 */
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgb(229 231 235)"
            strokeWidth={1}
          />
        ))}

        {/* Data polygon — filled translucent + outlined */}
        <path
          d={dataPath}
          fill="rgba(245, 158, 11, 0.18)" /* accent-500 alpha */
          stroke="rgb(245 158 11)" /* accent-500 */
          strokeWidth={2.5}
          style={{ transition: "all 1.2s ease-out" }}
        />

        {/* Data points (small dots at each vertex) */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill="rgb(245 158 11)"
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Axis labels */}
        {labelPositions.map((pos, i) => (
          <g key={i}>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ink-900 text-xs font-semibold"
            >
              {pos.label}
            </text>
            <text
              x={pos.x}
              y={pos.y + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ink-500 text-[10px]"
            >
              {pos.value}/{pos.max}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 text-xs text-ink-500">
        Bigger shape = stronger AI visibility foundation
      </div>
    </div>
  );
}
