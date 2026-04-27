import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies — AI Visibility in Practice",
  description:
    "Real businesses, real before-and-after data. AI visibility case studies built in public — starting with OMS Lifting Solutions, a BBBEE Level 1 industrial supplier in Pretoria.",
  alternates: { canonical: `${site.url}/case-studies` },
};

const caseStudies = [
  {
    slug: "oms-lifting-solutions",
    company: "OMS Lifting Solutions",
    industry: "Industrial · Lifting Equipment",
    location: "Pretoria, South Africa",
    status: "In progress · Day 30 rescan pending",
    summary:
      "BBBEE Level 1 industrial supplier with 89+ certified inspections and 5 years of mining contracts. Going from 0 citations across 4 AI engines to measurable presence in 30 days.",
    metrics: [
      { label: "AI engines tested", value: "4" },
      { label: "Citation rate (start)", value: "0%" },
      { label: "Schema before", value: "None" },
      { label: "Status", value: "Active" },
    ],
    icon: Building2,
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
        ])}
      />

      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Case studies</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Real businesses.
            <br />
            <span className="text-ink-500">Real before-and-after data.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Every case study is documented in public — methodology, screenshots,
            citation data, and the work itself. Some are still in progress. We
            publish honest results, including the ones that took longer than
            expected.
          </p>
        </div>
      </Section>

      <Section variant="default" padding="default">
        <div className="grid gap-6">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group block rounded-3xl border border-rule bg-white p-8 shadow-soft transition-all hover:border-accent-300 hover:shadow-card md:p-12"
            >
              <div className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-50 text-ink-500">
                      <cs.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                        {cs.industry}
                      </div>
                      <div className="text-sm text-ink-500">{cs.location}</div>
                    </div>
                  </div>

                  <h2 className="mt-6 text-display-md font-semibold tracking-tight text-ink-900">
                    {cs.company}
                  </h2>
                  <p className="mt-3 text-base text-ink-700 leading-relaxed">
                    {cs.summary}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
                    {cs.status}
                  </div>

                  <div className="mt-7 inline-flex items-center gap-1 font-medium text-accent-600 group-hover:text-accent-700">
                    Read the case study{" "}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="grid grid-cols-2 gap-3">
                    {cs.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl bg-ink-50 px-4 py-3"
                      >
                        <div className="text-xs uppercase tracking-wider text-ink-400">
                          {m.label}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-ink-900">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border-2 border-dashed border-rule bg-ink-50/50 p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            More case studies coming.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-500">
            We're documenting the next 5 client engagements in public. Want to be
            number two? Get a free scan first — it's how the conversation starts.
          </p>
          <div className="mt-6">
            <Button href="/scan" variant="primary" size="md">
              Get a free AI scan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
