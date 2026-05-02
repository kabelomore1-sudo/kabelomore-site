/**
 * Tier Comparison Table
 *
 * One-glance side-by-side of all 9 tiers (scan + foundations + audits + retainers).
 * Built so a buyer can scroll once and answer "which one is for me."
 *
 * Sticky first column on horizontal scroll — works on mobile.
 *
 * Each tier card links into its anchor on the same page (#tier-id).
 */

import { tiers } from "@/lib/site";
import { ArrowRight } from "lucide-react";

const categoryColor: Record<string, { bg: string; text: string; border: string }> = {
  scan: { bg: "bg-ink-50", text: "text-ink-600", border: "border-ink-200" },
  foundation: {
    bg: "bg-accent-50",
    text: "text-accent-700",
    border: "border-accent-200",
  },
  audit: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  retainer: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

const categoryLabel: Record<string, string> = {
  scan: "Try us first",
  foundation: "Build / optimize",
  audit: "Get clarity",
  retainer: "Ongoing growth",
};

export function TierComparisonTable() {
  return (
    <div className="rounded-3xl border border-rule bg-white p-4 shadow-soft md:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-ink-900">
          All 9 services at a glance
        </h3>
        <p className="text-xs text-ink-500">
          Scroll horizontally on mobile · click any tier to jump to detail
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-rule">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="bg-ink-50 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              <th
                scope="col"
                className="sticky left-0 bg-ink-50 px-4 py-3 md:px-5"
              >
                Service
              </th>
              <th scope="col" className="px-4 py-3 md:px-5">
                Type
              </th>
              <th scope="col" className="px-4 py-3 md:px-5">
                Price (SA)
              </th>
              <th scope="col" className="hidden px-4 py-3 md:table-cell md:px-5">
                Price (Intl)
              </th>
              <th scope="col" className="px-4 py-3 md:px-5">
                Delivery
              </th>
              <th scope="col" className="hidden px-4 py-3 md:table-cell md:px-5">
                Best for
              </th>
              <th scope="col" className="px-4 py-3 md:px-5"></th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => {
              const cat = categoryColor[tier.category];
              return (
                <tr
                  key={tier.id}
                  className="border-t border-rule align-top hover:bg-ink-50/40"
                >
                  <th
                    scope="row"
                    className="sticky left-0 bg-white px-4 py-4 text-left md:px-5"
                  >
                    <a
                      href={`#${tier.id}`}
                      className="font-semibold text-ink-900 hover:text-accent-700"
                    >
                      {tier.name}
                      {tier.highlight && (
                        <span className="ml-2 inline-block rounded-full bg-accent-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Popular
                        </span>
                      )}
                    </a>
                  </th>
                  <td className="px-4 py-4 md:px-5">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cat.bg} ${cat.text} ${cat.border}`}
                    >
                      {categoryLabel[tier.category]}
                    </span>
                  </td>
                  <td className="px-4 py-4 md:px-5">
                    <div className="font-semibold text-ink-900">
                      {tier.price.sa}
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell md:px-5">
                    <div className="text-xs text-ink-600">{tier.price.intl}</div>
                  </td>
                  <td className="px-4 py-4 md:px-5">
                    <div className="text-xs text-ink-600">{tier.delivery}</div>
                  </td>
                  <td className="hidden max-w-[280px] px-4 py-4 md:table-cell md:px-5">
                    <div className="text-xs leading-snug text-ink-600">
                      {/* Truncate bestFor to first sentence for table density */}
                      {tier.bestFor.split(". ")[0]}
                      {tier.bestFor.split(". ").length > 1 ? "." : ""}
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-5">
                    <a
                      href={`#${tier.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent-600 hover:text-accent-700"
                    >
                      Details <ArrowRight className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
