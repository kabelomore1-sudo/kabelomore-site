import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import {
  breadcrumbJsonLd,
  articleJsonLd,
  howToJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  getSectorChecklist,
  sectorChecklistList,
} from "@/lib/sector-checklists";
import { AuthorByline } from "@/components/author-byline";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ArrowRight, Zap, ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ sector: string }>;
}

export function generateStaticParams() {
  return sectorChecklistList.map((cl) => ({ sector: cl.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sector } = await params;
  const cl = getSectorChecklist(sector);
  if (!cl) return { title: "Resource not found" };
  const title = cl.title.replace("47-Point AEO Checklist for ", "");
  return {
    title: `5 AEO Quick Wins for ${title} (under 1 hour each)`,
    description: `The five highest-leverage, lowest-effort AEO improvements for ${title}. Each one takes under an hour and moves AI engine visibility within 30 days. Free, no email required.`,
    alternates: {
      canonical: `${site.url}/resources/quick-wins/${cl.slug}`,
    },
  };
}

/**
 * Pull the top 5 'quick effort + foundation impact' items from the full
 * sector checklist. These are the highest-leverage things a busy
 * practitioner can do in a Sunday afternoon to move the needle.
 */
function selectQuickWins(checklist: ReturnType<typeof getSectorChecklist>) {
  if (!checklist) return [];
  const all = checklist.sections.flatMap((s) =>
    s.items.map((item) => ({ ...item, property: s.property })),
  );
  // Filter for quick + foundation, take first 5 across the checklist
  return all
    .filter((i) => i.effort === "quick" && i.impact === "foundation")
    .slice(0, 5);
}

export default async function QuickWinsPage({ params }: PageProps) {
  const { sector } = await params;
  const checklist = getSectorChecklist(sector);
  if (!checklist) notFound();

  const quickWins = selectQuickWins(checklist);
  const sectorLabel = checklist.title.replace(
    "47-Point AEO Checklist for ",
    "",
  );
  const url = `${site.url}/resources/quick-wins/${checklist.slug}`;
  const datePublished = new Date().toISOString().split("T")[0];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Resources", href: "/resources" },
            {
              label: `Quick Wins — ${sectorLabel}`,
              href: `/resources/quick-wins/${checklist.slug}`,
            },
          ]),
          articleJsonLd({
            url,
            headline: `5 AEO Quick Wins for ${sectorLabel}`,
            description: `The five highest-leverage, lowest-effort AEO improvements for ${sectorLabel}. Under 1 hour each.`,
            datePublished,
          }),
          howToJsonLd({
            name: `5 AEO Quick Wins for ${sectorLabel}`,
            description: `Five fast wins from The Real Estate Method, tailored to ${sectorLabel}. Under 1 hour each.`,
            totalTime: "PT5H",
            steps: quickWins.map((w) => ({
              name: w.text,
              text: w.why,
              url: `${url}#${w.id}`,
            })),
          }),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-2xl">
          <div className="text-sm">
            <Link
              href="/resources"
              className="text-ink-500 hover:text-ink-700"
            >
              ← All resources
            </Link>
          </div>
          <Eyebrow className="mt-6">
            Quick wins · {sectorLabel}
          </Eyebrow>
          <h1 className="mt-3 text-display-lg font-semibold tracking-tight text-ink-900 md:text-display-xl">
            5 AEO Quick Wins
            <br />
            <span className="text-ink-500">for {sectorLabel}.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-700 leading-relaxed">
            These are the five highest-leverage, lowest-effort items from the
            full 47-point checklist. Under an hour each. Foundation tier — they
            move AI engines fastest. If you only have one Sunday afternoon to
            spare, do these.
          </p>
          <div className="mt-8">
            <AuthorByline date={datePublished} />
          </div>
        </div>
      </Section>

      {/* The 5 quick wins */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <ol className="space-y-6">
          {quickWins.map((win, idx) => (
            <li
              key={win.id}
              id={win.id}
              className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-8"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-white">
                  <span className="font-mono text-lg font-bold">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold uppercase tracking-wider text-emerald-700">
                      <Zap className="h-3 w-3" />
                      Quick
                    </span>
                    <span className="text-ink-400">·</span>
                    <span className="text-ink-500">{win.property}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink-900 md:text-2xl">
                    {win.text}
                  </h2>
                  <div className="mt-4 rounded-2xl border border-accent-100 bg-accent-50/40 p-4 md:p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                      Why this matters
                    </div>
                    <p className="mt-2 text-sm text-ink-700 leading-relaxed md:text-base">
                      {win.why}
                    </p>
                  </div>
                  {win.tool && (
                    <p className="mt-3 text-xs text-ink-500">
                      <strong className="text-ink-700">Tool:</strong> {win.tool}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
          <p className="text-base font-semibold text-ink-900">
            Done all 5? Move to the full 47-point checklist.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-600">
            The remaining 42 items split across Growth-tier (compounds over
            weeks) and Authority-tier (compounds for years). Quick wins put you
            on the map. The rest is what dominates.
          </p>
          <div className="mt-5">
            <Link
              href={`/resources/${checklist.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card"
            >
              Read the full checklist
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="tinted" padding="default" containerSize="narrow">
        <div className="rounded-3xl bg-ink-gradient p-10 text-center text-white shadow-lift md:p-12">
          <h2 className="text-display-md font-semibold tracking-tight">
            Want me to do all 47 for you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-300">
            Free AI Visibility Scan. 24-hour turnaround. We&apos;ll tell you
            exactly which of the 47 are leaking — and recommend the highest-leverage
            fix for your sector.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/scan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-ink-900 shadow-md transition-all duration-200 hover:bg-ink-50 hover:shadow-lift"
            >
              Get a free scan
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/services"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-base font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/15"
            >
              See services
            </a>
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <Section variant="default" padding="default" containerSize="narrow">
        <NewsletterSignup
          variant="card"
          source={`quick-wins-${checklist.slug}`}
        />
      </Section>
    </>
  );
}
