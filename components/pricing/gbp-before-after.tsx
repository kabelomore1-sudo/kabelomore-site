/**
 * GbpBeforeAfter — stylized before/after mockup of a Google Maps
 * listing, sitting inside the GBP Setup pricing card.
 *
 * Deliberate design choices:
 *   - Pure JSX + CSS, no images. Stays well under any image budget
 *     (~few KB of HTML), accessible (real text, no OCR needed),
 *     mobile-responsive by default (CSS does the layout), and
 *     trademark-safe — clearly stylized, not a screenshot.
 *   - Composite/illustrative business name "City Stop Service Station"
 *     (fictional but plausible). No real business names; no Google
 *     Maps UI is copied — the layout is a card abstraction, not the
 *     Maps interface.
 *   - Mobile: vertical stack. md+: side-by-side. Both phones share
 *     identical structure so the difference between "Before" and
 *     "After" reads at a glance.
 *
 * Single-instance rule (pricing-page constraint): this component is
 * rendered ONCE on the page, on the GBP Setup card. Do not reuse on
 * other tier cards — the pricing page is informational, not visual
 * marketing collateral.
 */

import { Star, Phone, Navigation, Globe, Bookmark } from "lucide-react";

export function GbpBeforeAfter() {
  return (
    <figure
      className="my-6"
      aria-label="Before: sparse Google Business Profile with 24 reviews and minimal information. After: optimized profile with 180+ reviews, multiple photos, and complete business information."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PhoneCard variant="before" />
        <PhoneCard variant="after" />
      </div>
      <figcaption className="mt-3 text-center text-[11px] italic text-ink-500">
        Illustrative before / after — stylized representation, not a
        real listing.
      </figcaption>
    </figure>
  );
}

// ─── PhoneCard ────────────────────────────────────────────────────

function PhoneCard({ variant }: { variant: "before" | "after" }) {
  const isAfter = variant === "after";

  return (
    <div className="rounded-2xl border border-rule bg-ink-50/60 p-2.5">
      {/* Caption strip (sits OUTSIDE the phone frame so it doesn't
          masquerade as part of the listing UI) */}
      <div className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-ink-500">
        {isAfter ? "After optimization" : "Before"}
      </div>

      {/* Stylized phone frame — rounded outer + inner viewport */}
      <div className="relative mx-auto w-full max-w-[240px] overflow-hidden rounded-[20px] bg-ink-900 p-1.5 shadow-card">
        <div className="overflow-hidden rounded-[16px] bg-white">
          {/* Search header — abstracted, not a copy of Maps UI */}
          <div className="border-b border-rule bg-ink-50/60 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
              <span className="text-[9px] text-ink-500">
                petrol station near me
              </span>
            </div>
          </div>

          {/* Photo strip — single greyed tile (Before) vs photo strip (After) */}
          {isAfter ? (
            <div className="flex gap-1 px-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 flex-1 rounded-sm bg-gradient-to-br from-amber-100 to-amber-200"
                  aria-hidden="true"
                />
              ))}
            </div>
          ) : (
            <div className="px-2 pt-2">
              <div
                className="h-9 w-12 rounded-sm bg-ink-200"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Listing card body */}
          <div className="px-2.5 pb-2.5 pt-2">
            <div className="text-[10.5px] font-semibold text-ink-900 leading-tight">
              City Stop Service Station
            </div>

            {/* Rating row */}
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`text-[10px] font-bold ${
                  isAfter ? "text-ink-900" : "text-ink-700"
                }`}
              >
                {isAfter ? "4.6" : "3.2"}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2 w-2 ${
                      i < (isAfter ? 5 : 3)
                        ? "fill-amber-400 text-amber-400"
                        : "text-ink-300"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-[9px] text-ink-500">
                ({isAfter ? "180+" : "24"})
              </span>
            </div>

            {/* Open status */}
            <div className="mt-1.5 flex items-center gap-1 text-[9px]">
              {isAfter ? (
                <>
                  <span className="font-semibold text-emerald-600">
                    Open
                  </span>
                  <span className="text-ink-500">· 24 hours</span>
                </>
              ) : (
                <span className="text-ink-400">— hours unavailable</span>
              )}
            </div>

            {/* Category / services chips */}
            {isAfter ? (
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[8px] font-medium text-ink-700">
                  Petrol station
                </span>
                <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[8px] font-medium text-ink-700">
                  Convenience
                </span>
                <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[8px] font-medium text-ink-700">
                  Café
                </span>
              </div>
            ) : (
              <div className="mt-1.5 text-[9px] text-ink-400">
                Petrol station
              </div>
            )}

            {/* Frequently visited badge (After only) */}
            {isAfter && (
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-accent-700">
                  Frequently visited
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-2.5 flex gap-1">
              {isAfter ? (
                <>
                  <ActionPill icon={Phone} label="Call" filled />
                  <ActionPill icon={Navigation} label="Directions" />
                  <ActionPill icon={Globe} label="Site" />
                  <ActionPill icon={Bookmark} label="Save" />
                </>
              ) : (
                <ActionPill icon={Navigation} label="Directions" muted />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionPill({
  icon: Icon,
  label,
  filled,
  muted,
}: {
  icon: typeof Phone;
  label: string;
  filled?: boolean;
  muted?: boolean;
}) {
  const styles = filled
    ? "bg-ink-900 text-white"
    : muted
      ? "border border-rule bg-white text-ink-400"
      : "border border-rule bg-white text-ink-700";
  return (
    <span
      className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1 text-[8px] font-semibold ${styles}`}
    >
      <Icon className="h-2 w-2" aria-hidden="true" />
      {label}
    </span>
  );
}
