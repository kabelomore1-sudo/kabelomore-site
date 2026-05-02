"use client";

/**
 * SectorChecklist Renderer
 *
 * Renders a SectorChecklist as a structured, scannable, print-friendly
 * page. Each section is collapsible on desktop (open by default), each
 * item shows its effort + impact tag, and a 'Print as PDF' CTA at top
 * triggers window.print() with a tuned print stylesheet.
 *
 * Design principles:
 *   - Mobile-readable (single column, large tap targets)
 *   - Print-clean (hide nav/footer/CTAs in print, optimize page breaks)
 *   - Scannable (effort + impact chips, sticky section headers on long pages)
 *   - Trust-building (each item has a "why" expand for credibility)
 */

import { useState } from "react";
import { Printer, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { SectorChecklist, ChecklistItem } from "@/lib/sector-checklists";

const effortLabel: Record<ChecklistItem["effort"], string> = {
  quick: "Quick",
  medium: "1-3 days",
  compounding: "Ongoing",
};

const effortColor: Record<ChecklistItem["effort"], string> = {
  quick: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  compounding: "bg-accent-50 text-accent-700 border-accent-200",
};

const impactLabel: Record<ChecklistItem["impact"], string> = {
  foundation: "Foundation",
  growth: "Growth",
  authority: "Authority",
};

const impactColor: Record<ChecklistItem["impact"], string> = {
  foundation: "text-ink-600",
  growth: "text-accent-600",
  authority: "text-emerald-700",
};

export function SectorChecklistRenderer({
  checklist,
}: {
  checklist: SectorChecklist;
}) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="checklist-print">
      {/* Print-only header — hidden on screen, shown on print */}
      <div className="hidden print:mb-6 print:block">
        <h1 className="text-2xl font-semibold text-ink-900">{checklist.title}</h1>
        <p className="mt-1 text-sm text-ink-600">
          kabelomore.com/resources/{checklist.slug} · {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Action bar — hidden on print */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="text-sm text-ink-500">
          <span className="font-semibold text-ink-900">{checklist.totalItems} checks</span>{" "}
          across <span className="font-semibold text-ink-900">{checklist.sections.length} properties</span>
          {" · "}
          <span>last updated {new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}</span>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full border border-rule bg-white px-4 py-2 text-sm font-medium text-ink-900 shadow-soft transition-all hover:border-accent-300 hover:bg-accent-50 hover:text-accent-700"
        >
          <Printer className="h-4 w-4" />
          Print or save as PDF
        </button>
      </div>

      {/* Legend — hidden on print to save space */}
      <div className="mb-10 rounded-2xl border border-rule bg-ink-50/50 p-5 print:hidden">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          How to read this checklist
        </div>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <div className="font-semibold text-ink-900">Effort tags</div>
            <ul className="mt-2 space-y-1 text-xs text-ink-600">
              <li>
                <span className="mr-1 inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                  Quick
                </span>{" "}
                = under an hour, mostly setup
              </li>
              <li>
                <span className="mr-1 inline-block rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-700">
                  1-3 days
                </span>{" "}
                = needs focused work
              </li>
              <li>
                <span className="mr-1 inline-block rounded-full border border-accent-200 bg-accent-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-700">
                  Ongoing
                </span>{" "}
                = compounding monthly work
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-ink-900">Impact tiers</div>
            <ul className="mt-2 space-y-1 text-xs text-ink-600">
              <li>
                <span className="font-medium text-ink-700">Foundation</span> = required to be findable at all
              </li>
              <li>
                <span className="font-medium text-accent-700">Growth</span> = compounds visibility over weeks
              </li>
              <li>
                <span className="font-medium text-emerald-700">Authority</span> = compounds for years; market-leadership work
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-12 print:space-y-8">
        {checklist.sections.map((section, sIdx) => (
          <SectionBlock
            key={section.property}
            section={section}
            sectionNumber={sIdx + 1}
          />
        ))}
      </div>

      {/* Closing — print-friendly */}
      <div className="mt-16 rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 md:p-10 print:mt-10 print:bg-white print:p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
          What happens when you complete it
        </div>
        <p className="mt-3 text-base text-ink-700 leading-relaxed">
          {checklist.closing}
        </p>
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  sectionNumber,
}: {
  section: SectorChecklist["sections"][number];
  sectionNumber: number;
}) {
  return (
    <section className="checklist-section">
      <div className="border-b border-rule pb-4">
        <div className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-accent-600">
          Property {sectionNumber} of 7
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
          {section.property}
        </h2>
        <p className="mt-2 text-base text-ink-500 leading-relaxed">
          {section.description}
        </p>
      </div>

      <ol className="mt-6 space-y-3 print:space-y-2">
        {section.items.map((item, idx) => (
          <ChecklistItemRow key={item.id} item={item} number={idx + 1} />
        ))}
      </ol>
    </section>
  );
}

function ChecklistItemRow({
  item,
  number,
}: {
  item: ChecklistItem;
  number: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li
      id={item.id}
      className="rounded-2xl border border-rule bg-white p-4 transition-shadow hover:shadow-soft md:p-5 print:break-inside-avoid print:p-3"
    >
      <div className="flex items-start gap-3">
        {/* Checkbox-style circle (decorative — for printing in real life) */}
        <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 border-ink-300 print:border-ink-500">
          <span className="font-mono text-[10px] font-medium text-ink-400 print:text-ink-700">
            {number}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <p className="text-sm font-medium text-ink-900 md:text-base">
              {item.text}
            </p>
          </div>

          {/* Tags row */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium uppercase tracking-wider ${effortColor[item.effort]}`}
            >
              {effortLabel[item.effort]}
            </span>
            <span
              className={`inline-flex items-center font-medium uppercase tracking-wider ${impactColor[item.impact]}`}
            >
              · {impactLabel[item.impact]} ·
            </span>
            {item.tool && (
              <span className="inline-flex items-center gap-1 text-ink-500">
                <ExternalLink className="h-2.5 w-2.5" />
                {item.tool}
              </span>
            )}
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="ml-auto inline-flex items-center gap-1 text-ink-500 hover:text-ink-700 print:hidden"
              aria-expanded={expanded}
              aria-controls={`${item.id}-why`}
            >
              {expanded ? (
                <>
                  Hide why <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Why? <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>

          {/* Why expand — hidden by default on screen, always shown on print */}
          <div
            id={`${item.id}-why`}
            className={
              expanded
                ? "mt-3 border-l-2 border-accent-200 pl-3 text-xs leading-relaxed text-ink-600 md:text-sm print:mt-2 print:block"
                : "mt-3 hidden border-l-2 border-accent-200 pl-3 text-xs leading-relaxed text-ink-600 md:text-sm print:mt-2 print:block"
            }
          >
            {item.why}
          </div>
        </div>
      </div>
    </li>
  );
}
