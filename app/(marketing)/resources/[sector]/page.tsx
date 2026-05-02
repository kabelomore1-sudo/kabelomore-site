import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import {
  breadcrumbJsonLd,
  howToJsonLd,
  articleJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  getSectorChecklist,
  sectorChecklistList,
} from "@/lib/sector-checklists";
import { SectorChecklistRenderer } from "@/components/sector-checklist";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ sector: string }>;
}

// Pre-render all 3 sector pages at build time
export function generateStaticParams() {
  return sectorChecklistList.map((cl) => ({ sector: cl.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sector } = await params;
  const cl = getSectorChecklist(sector);
  if (!cl) {
    return { title: "Resource not found" };
  }
  return {
    title: cl.title,
    description: cl.hook,
    alternates: { canonical: `${site.url}/resources/${cl.slug}` },
    openGraph: {
      title: cl.title,
      description: cl.hook,
      url: `${site.url}/resources/${cl.slug}`,
      type: "article",
    },
  };
}

export default async function SectorChecklistPage({ params }: PageProps) {
  const { sector } = await params;
  const checklist = getSectorChecklist(sector);
  if (!checklist) {
    notFound();
  }

  const url = `${site.url}/resources/${checklist.slug}`;
  // Today's date for article schema (in production this would be the
  // commit date or content-author date — for now, build time is fine
  // because the content was authored at deploy time)
  const datePublished = new Date().toISOString().split("T")[0];

  // Map checklist items to HowTo steps for schema
  const allItems = checklist.sections.flatMap((s) => s.items);
  const howToSteps = allItems.map((item) => ({
    name: item.text,
    text: item.why,
    url: `${url}#${item.id}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Resources", href: "/resources" },
            {
              label: checklist.title,
              href: `/resources/${checklist.slug}`,
            },
          ]),
          articleJsonLd({
            url,
            headline: checklist.title,
            description: checklist.hook,
            datePublished,
          }),
          howToJsonLd({
            name: checklist.title,
            description: checklist.hook,
            toolsRequired: checklist.toolsRequired,
            steps: howToSteps,
          }),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <div className="text-sm">
            <Link
              href="/resources"
              className="text-ink-500 hover:text-ink-700"
            >
              ← All resources
            </Link>
          </div>
          <Eyebrow className="mt-6">Free AEO checklist</Eyebrow>
          <h1 className="mt-3 text-display-lg font-semibold tracking-tight text-ink-900 md:text-display-xl">
            {checklist.title}
          </h1>
          <p className="mt-5 text-lg text-ink-700 leading-relaxed">
            {checklist.hook}
          </p>
          <p className="mt-4 text-sm text-ink-500">
            <strong className="text-ink-900">Built for:</strong>{" "}
            {checklist.audience}
          </p>
        </div>
      </Section>

      {/* The checklist itself */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <SectorChecklistRenderer checklist={checklist} />
      </Section>

      {/* CTA — convert the read into an audit booking or newsletter signup */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <div className="rounded-3xl bg-ink-gradient p-10 text-center text-white shadow-lift md:p-12">
          <h2 className="text-display-md font-semibold tracking-tight">
            Want me to run this for you?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-300">
            The free AI Visibility Scan tests how all 4 AI engines respond to
            your customers&apos; queries. 24-hour turnaround. PDF report. No card.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/scan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-ink-900 shadow-md transition-all duration-200 hover:bg-ink-50 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
            >
              Get a free AI scan
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/services"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-base font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
            >
              See services
            </a>
          </div>
        </div>
      </Section>

      {/* Newsletter capture — softer conversion path */}
      <Section variant="default" padding="default" containerSize="narrow">
        <NewsletterSignup
          variant="card"
          source={`resource-${checklist.slug}`}
        />
      </Section>

      {/* Other resources */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>More checklists</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            For your colleagues in other sectors.
          </h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-2">
          {sectorChecklistList
            .filter((cl) => cl.slug !== checklist.slug)
            .map((cl) => (
              <Link
                key={cl.slug}
                href={`/resources/${cl.slug}`}
                className="group rounded-2xl border border-rule bg-white p-6 shadow-soft transition-all hover:border-accent-300 hover:shadow-card"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                  Free checklist
                </div>
                <h3 className="mt-2 text-lg font-semibold text-ink-900">
                  {cl.title.replace("47-Point AEO Checklist for ", "")}
                </h3>
                <p className="mt-2 text-sm text-ink-600 leading-snug">
                  {cl.audience}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-600 group-hover:text-accent-700">
                  Read it <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
        </div>
      </Section>
    </>
  );
}
