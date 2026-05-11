/**
 * TrustStrip — a compact trust-signal row dropped near high-intent
 * decision points (forms, package grids, pricing).
 *
 * Why this exists:
 *   The /scan page asks visitors to hand over business + personal data
 *   with no proof beside the form. The /services page asks for
 *   R5,500-R10,500/month commitment with zero social proof on the page.
 *   Both are conversion-critical pages with trust-signal gaps.
 *
 * What it shows:
 *   2-4 short trust items rendered as inline pills with subtle icons.
 *   Real numbers / named clients > vague claims. We surface OMS as the
 *   first live case study (per About page positioning) because the
 *   reader has already met that name on the homepage.
 *
 * Naval-shape: minimum cognitive load (one row, no animation, no
 * scroll-trigger). Maximum proof-density per pixel.
 *
 * Design tokens used:
 *   - bg-white + border-rule for the card chassis (matches site)
 *   - text-ink-* for the type scale
 *   - shadow-soft for elevation that doesn't compete with hero shadows
 */

import { CheckCircle2 } from "lucide-react";

interface TrustItem {
  /** Short label — 2-4 words max. Renders bold. */
  label: string;
  /** Optional sublabel — quick context, e.g. "first live case study" */
  detail?: string;
}

interface Props {
  items?: TrustItem[];
  className?: string;
  /** When true, wraps in a stronger card (white bg + shadow) — for
   *  standalone strips. When false, renders as a plain horizontal
   *  row — for placing inside an already-elevated container. */
  elevated?: boolean;
}

const DEFAULT_ITEMS: TrustItem[] = [
  {
    label: "OMS Lifting Solutions",
    detail: "first live AEO case study",
  },
  {
    label: "4 AI engines covered",
    detail: "ChatGPT, Claude, Gemini, Perplexity (proxy)",
  },
  {
    label: "24h turnaround",
    detail: "manual review before delivery",
  },
  {
    label: "No card required",
    detail: "free scan, no follow-up unless you want one",
  },
];

export function TrustStrip({
  items = DEFAULT_ITEMS,
  className = "",
  elevated = true,
}: Props) {
  const containerClasses = elevated
    ? `rounded-2xl border border-rule bg-white p-5 shadow-soft md:p-6 ${className}`
    : `rounded-xl border border-rule/60 bg-ink-50/40 p-4 ${className}`;

  return (
    <aside
      aria-label="Trust signals"
      className={containerClasses}
    >
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <div className="flex-1">
              <div className="text-sm font-semibold leading-tight text-ink-900">
                {item.label}
              </div>
              {item.detail && (
                <div className="mt-0.5 text-[11px] leading-snug text-ink-500">
                  {item.detail}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
