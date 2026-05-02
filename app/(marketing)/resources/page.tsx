import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { sectorChecklistList } from "@/lib/sector-checklists";
import { NewsletterSignup } from "@/components/newsletter-signup";
import {
  ArrowRight,
  Stethoscope,
  Scale,
  Wrench,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Resources — Free AEO Checklists for Medical, Legal & Industrial Firms",
  description:
    "Free 47-point AEO checklists tailored to medical practices, law firms, and industrial businesses. Covers website, GBP, LinkedIn, citations, reviews, and AI engine visibility. Download as PDF, no email required.",
  alternates: { canonical: `${site.url}/resources` },
};

const sectorIcons: Record<string, typeof Stethoscope> = {
  medical: Stethoscope,
  legal: Scale,
  industrial: Wrench,
};

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
        ])}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Free resources</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Free AEO checklists,
            <br />
            <span className="text-ink-500">tailored to your sector.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            47 specific checks each. Built for medical practitioners, legal
            counsellors, and industrial businesses. Public, ungated, and
            print-to-PDF friendly. The same methodology I use for paying clients
            — distilled into something you can use today.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {sectorChecklistList.map((cl) => {
            const Icon = sectorIcons[cl.slug] ?? Stethoscope;
            return (
              <Link
                key={cl.slug}
                href={`/resources/${cl.slug}`}
                className="group flex flex-col rounded-3xl border border-rule bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-lift md:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 transition-colors group-hover:bg-accent-500 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-ink-900">
                  {cl.title.replace("47-Point AEO Checklist for ", "")}
                </h2>
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                  {cl.audience}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {cl.totalItems} checks · 7 properties
                </div>
                <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent-600 group-hover:text-accent-700">
                  Read the checklist
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Why these exist */}
      <Section variant="default" padding="default" containerSize="narrow">
        <Eyebrow>Why these are free</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          The checklist is the proof.
        </h2>
        <div className="prose-kabelo mt-8 max-w-none">
          <p>
            Most AI visibility content is either too generic to act on or hidden
            behind a sales call. These checklists are neither — they&apos;re the
            actual operating standard I run for paying clients, structured by
            the seven properties that matter for your sector.
          </p>
          <p>
            If you can complete 35+ of the 47 checks for your firm, you&apos;ll
            be in the top 5% of SA businesses on AI visibility — most never
            score above 12. If reading the list and realising the gap is enough
            to act on, that&apos;s a great outcome.
          </p>
          <p>
            If you&apos;d rather have me run an audit and tell you exactly which
            of the 47 you&apos;re missing — and how to fix the highest-leverage
            ones first — the free AI Scan is at{" "}
            <Link href="/scan">kabelomore.com/scan</Link>. 24-hour turnaround,
            no card.
          </p>
        </div>
      </Section>

      {/* Newsletter capture — soft conversion path for readers not ready
          to commit to a scan or audit yet */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-2xl">
          <NewsletterSignup variant="card" source="resources-index" />
        </div>
      </Section>
    </>
  );
}
