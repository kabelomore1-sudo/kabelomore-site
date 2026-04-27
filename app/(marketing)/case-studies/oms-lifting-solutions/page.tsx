import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "OMS Lifting Solutions — Industrial AI Visibility Case Study",
  description:
    "How a BBBEE Level 1 lifting equipment supplier in Pretoria went from invisible across 4 AI engines to AI-cited. Built in public. Methodology, screenshots, and citation data.",
  alternates: {
    canonical: `${site.url}/case-studies/oms-lifting-solutions`,
  },
};

export default function OmsCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Case Studies", href: "/case-studies" },
            { label: "OMS Lifting Solutions", href: "/case-studies/oms-lifting-solutions" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "OMS Lifting Solutions — Industrial AI Visibility Case Study",
            author: {
              "@type": "Person",
              "@id": `${site.url}/#kabelo`,
              name: site.name,
            },
            publisher: { "@id": `${site.url}/#organization` },
            datePublished: "2026-04-26",
            description:
              "How OMS Lifting Solutions, a BBBEE Level 1 industrial supplier in Pretoria, is going from AI-invisible to AI-cited.",
            mainEntityOfPage: `${site.url}/case-studies/oms-lifting-solutions`,
          },
        ]}
      />

      {/* Header */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
          >
            ← All case studies
          </Link>

          <Eyebrow className="mt-8">Case study · In progress</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            OMS Lifting Solutions
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-ink-500 leading-relaxed">
            From AI-invisible to AI-cited. A BBBEE Level 1 lifting equipment supplier
            in Pretoria — followed in public from baseline scan through 30-day rescan.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: MapPin, label: "Location", value: "Pretoria, South Africa" },
              { icon: Award, label: "BBBEE Status", value: "Level 1" },
              { icon: Calendar, label: "Started", value: "April 2026" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-rule bg-white p-5"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
                <div className="mt-2 text-base font-semibold text-ink-900">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Body */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="prose-kabelo">
          <h2>The starting point</h2>
          <p>
            OMS Lifting Solutions has built five years of trust in South African
            mining, construction, and energy supply chains. 89+ certified
            inspections. Level 1 BBBEE status. Real customers, real contracts, real
            revenue.
          </p>
          <p>
            And yet — when we tested OMS across ChatGPT, Claude, Gemini, and
            Perplexity in April 2026 with the queries OMS's customers actually run
            ("lifting equipment supplier Pretoria", "BBBEE Level 1 crane inspector",
            "load testing certification South Africa"), <strong>OMS was not
            mentioned by any of the four engines</strong>. Neither were most of
            their direct competitors.
          </p>
          <p>
            For an industrial supplier where one new mining contract can be worth
            R50,000 to R500,000+, that's a structural revenue gap. And it's a gap
            that's solvable.
          </p>

          <h2>What we found in the audit</h2>
          <p>
            <em>(This section will be populated with verbatim AI responses,
            screenshots, and competitive benchmarks during Week 2 of the
            engagement.)</em>
          </p>
          <ul>
            <li>Structured data audit — what schema is present, what's missing</li>
            <li>Google Business Profile completeness score and gaps</li>
            <li>Third-party citation map — industry directories, BBBEE registries</li>
            <li>Competitor benchmark — who AI engines recommended instead</li>
          </ul>

          <h2>The 30-day plan</h2>
          <p>
            Following the standard 5-step process. Implementation phase covers
            Weeks 2-4 of the engagement.
          </p>
          <ol>
            <li>
              <strong>Schema deployment</strong> — LocalBusiness, Service, and
              Organization schema embedded across the OMS site.
            </li>
            <li>
              <strong>GBP optimisation</strong> — categories, services, hours,
              photos, posts, and review velocity.
            </li>
            <li>
              <strong>Answer-shaped content</strong> — three new service pages
              built around the queries customers actually run.
            </li>
            <li>
              <strong>Citation establishment</strong> — five third-party industry
              directory and BBBEE registry citations.
            </li>
          </ol>

          <h2>Day 30 results</h2>
          <p>
            <em>(Pending. We rescan all four AI engines on Day 30 of the
            engagement and publish the before/after data here.)</em>
          </p>

          <h2>Methodology</h2>
          <p>
            Every step of this engagement is documented in real time on LinkedIn.
            Methodology, queries, and tools used are described openly. The goal is
            both client value and educational transparency — other businesses
            should be able to read this case study and understand the discipline
            even if they don't hire us.
          </p>
        </div>

        {/* Subscribe CTA */}
        <div className="mt-16 rounded-3xl border border-rule bg-ink-50 p-8 md:p-12">
          <Eyebrow>Stay updated</Eyebrow>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
            Get the OMS case study results in your inbox.
          </h3>
          <p className="mt-3 text-base text-ink-500">
            We publish the Day 30 rescan results, methodology, and a downloadable PDF
            once the data lands. Get notified when it's live.
          </p>
          <div className="mt-6">
            <Button href="/scan" variant="primary" size="md">
              Get a free scan of your business <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
