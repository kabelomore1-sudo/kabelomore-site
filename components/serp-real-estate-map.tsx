/**
 * SERP Real Estate Map
 *
 * A visual table showing what each retainer tier covers across the
 * properties that actually matter for medical / legal / industrial buyers.
 *
 * The buyer mental model isn't "AI citation count" — it's "how much of
 * the search result page do I own when my customer Googles me." This
 * component makes that explicit.
 *
 * Notably absent: Instagram, TikTok, generic Facebook posting. Our ICP
 * (professional firms with R5k-R500k customer value) does not buy through
 * those platforms.
 */

import { Check, Minus } from "lucide-react";

type Coverage = "full" | "partial" | "none";

type PlatformRow = {
  platform: string;
  description: string;
  // Coverage per tier — and short descriptor when included
  lite: { level: Coverage; note?: string };
  growth: { level: Coverage; note?: string };
  authority: { level: Coverage; note?: string };
  partner: { level: Coverage; note?: string };
};

const platforms: PlatformRow[] = [
  {
    platform: "Google Business Profile",
    description: "Map pack, reviews, photos — the biggest local SERP block",
    lite: { level: "full", note: "4 posts/wk + 2 touch-ups" },
    growth: { level: "full", note: "4 posts/wk + 2 touch-ups" },
    authority: { level: "full", note: "8 posts/mo + active" },
    partner: { level: "full", note: "8 posts/mo + multi-region" },
  },
  {
    platform: "Website (schema + content)",
    description: "Your owned property — schema, articles, FAQ pages",
    lite: { level: "partial", note: "Schema validated" },
    growth: { level: "full", note: "2 articles/mo + schema" },
    authority: { level: "full", note: "4 articles/mo + schema" },
    partner: { level: "full", note: "4+ articles/mo + multi-region" },
  },
  {
    platform: "LinkedIn — company page",
    description: "Right-rail SERP block + AI engine source",
    lite: { level: "partial", note: "1 post/wk" },
    growth: { level: "full", note: "3 posts/wk" },
    authority: { level: "full", note: "5 posts/wk + engagement" },
    partner: { level: "full", note: "5 posts/wk + multi-region" },
  },
  {
    platform: "LinkedIn — founder personal brand",
    description: "Ghost-written thought leadership; cited by AI",
    lite: { level: "none" },
    growth: { level: "partial", note: "1 post/wk" },
    authority: { level: "full", note: "3 posts/wk" },
    partner: { level: "full", note: "3 posts/wk + by-lines" },
  },
  {
    platform: "Industry-specific citations",
    description: "Medical Board · Law Society · BBBEE · sector dirs",
    lite: { level: "none" },
    growth: { level: "full", note: "5/quarter" },
    authority: { level: "full", note: "Ongoing build + refresh" },
    partner: { level: "full", note: "Multi-region + maintenance" },
  },
  {
    platform: "Reviews velocity",
    description: "Google + HelloPeter (SA) · Trustpilot · Realself · Avvo · sector-specific",
    lite: { level: "partial", note: "Quarterly Google + HelloPeter request" },
    growth: { level: "full", note: "5 responses/mo + 1 campaign (Google + HelloPeter)" },
    authority: { level: "full", note: "10 responses + 2 campaigns/mo (multi-platform)" },
    partner: { level: "full", note: "Multi-region velocity + crisis response" },
  },
  {
    platform: "Industry press / PR",
    description: "Medical Brief · De Rebus · Engineering News · BizCommunity",
    lite: { level: "none" },
    growth: { level: "none" },
    authority: { level: "full", note: "2 pitches/mo + HARO" },
    partner: { level: "full", note: "1-2 placements/mo target" },
  },
  {
    platform: "YouTube (educational)",
    description: "Owned video; ranks in SERP + cited by AI engines",
    lite: { level: "none" },
    growth: { level: "none" },
    authority: { level: "full", note: "1 video/mo" },
    partner: { level: "full", note: "1 video/mo + edits" },
  },
  {
    platform: "Podcast / speaking pipeline",
    description: "Industry podcasts + conference speaking",
    lite: { level: "none" },
    growth: { level: "none" },
    authority: { level: "none" },
    partner: { level: "full", note: "1-2 bookings/quarter" },
  },
  {
    platform: "Knowledge panel / entity",
    description: "Wikipedia + branded knowledge panel optimization",
    lite: { level: "none" },
    growth: { level: "none" },
    authority: { level: "partial", note: "Eligibility + setup" },
    partner: { level: "full", note: "Active management" },
  },
  {
    platform: "AI engine tracking",
    description: "Daily scan: ChatGPT · Claude · Gemini · Perplexity",
    lite: { level: "full", note: "Daily, 4 engines" },
    growth: { level: "full", note: "Daily, 4 engines" },
    authority: { level: "full", note: "Daily + competitor monitoring" },
    partner: { level: "full", note: "Daily + multi-region" },
  },
];

function CoverageCell({
  coverage,
  highlight = false,
}: {
  coverage: { level: Coverage; note?: string };
  highlight?: boolean;
}) {
  if (coverage.level === "none") {
    return (
      <td className="border-b border-rule px-3 py-3 text-center align-top md:px-4">
        <Minus className="mx-auto h-4 w-4 text-ink-300" aria-label="Not included" />
      </td>
    );
  }
  if (coverage.level === "partial") {
    return (
      <td
        className={
          "border-b border-rule px-3 py-3 align-top md:px-4 " +
          (highlight ? "bg-accent-50/40" : "")
        }
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <Check className="h-4 w-4 text-amber-500" aria-label="Partial coverage" />
          {coverage.note && (
            <span className="text-[10px] leading-tight text-ink-500 md:text-xs">
              {coverage.note}
            </span>
          )}
        </div>
      </td>
    );
  }
  return (
    <td
      className={
        "border-b border-rule px-3 py-3 align-top md:px-4 " +
        (highlight ? "bg-accent-50/40" : "")
      }
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <Check className="h-4 w-4 text-emerald-600" aria-label="Included" />
        {coverage.note && (
          <span className="text-[10px] font-medium leading-tight text-ink-700 md:text-xs">
            {coverage.note}
          </span>
        )}
      </div>
    </td>
  );
}

export function SerpRealEstateMap() {
  return (
    <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-soft">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="bg-ink-50">
            <th
              scope="col"
              className="sticky left-0 bg-ink-50 px-3 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500 md:px-6"
            >
              Property
            </th>
            <th
              scope="col"
              className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-700 md:px-4"
            >
              <div>Lite</div>
              <div className="mt-1 font-mono text-[10px] font-normal text-ink-400">
                R2,950/mo
              </div>
            </th>
            <th
              scope="col"
              className="bg-accent-50/60 px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-accent-700 md:px-4"
            >
              <div>Local Growth</div>
              <div className="mt-1 font-mono text-[10px] font-normal text-accent-600/80">
                R5,500/mo
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-700 md:px-4"
            >
              <div>AI Authority</div>
              <div className="mt-1 font-mono text-[10px] font-normal text-ink-400">
                R10,500/mo
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-ink-700 md:px-4"
            >
              <div>Fractional Head</div>
              <div className="mt-0.5 text-[9px] font-normal normal-case text-ink-500">
                of AI Visibility
              </div>
              <div className="mt-1 font-mono text-[10px] font-normal text-ink-400">
                R20,000/mo
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((row) => (
            <tr key={row.platform} className="hover:bg-ink-50/50">
              <th
                scope="row"
                className="sticky left-0 border-b border-rule bg-white px-3 py-3 align-top text-left md:px-6"
              >
                <div className="font-semibold text-ink-900">{row.platform}</div>
                <div className="mt-0.5 text-[11px] font-normal text-ink-500 md:text-xs">
                  {row.description}
                </div>
              </th>
              <CoverageCell coverage={row.lite} />
              <CoverageCell coverage={row.growth} highlight />
              <CoverageCell coverage={row.authority} />
              <CoverageCell coverage={row.partner} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
