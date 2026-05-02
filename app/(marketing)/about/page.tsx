import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { FounderAvatarLandscape } from "@/components/founder-avatar";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Kabelo More — AI Visibility Consultant, Pretoria",
  description:
    "Kabelo More is an AI Visibility / AEO consultant based in Pretoria, South Africa. 8 years of local SEO experience now applied to the AI search era. Serving clients in SA, UK, and US.",
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${site.url}/#kabelo`,
            name: site.name,
            jobTitle: "AI Visibility Consultant",
            worksFor: { "@id": `${site.url}/#organization` },
            description:
              "AI Visibility / AEO consultant based in Pretoria, South Africa. 8 years of local SEO experience now applied to the AI search era. Works with industrial, professional, and medical service businesses across SA, UK, and US.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Pretoria",
              addressCountry: "ZA",
            },
            url: site.url,
            sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
            knowsAbout: [
              "AEO",
              "Answer Engine Optimisation",
              "AI Search Visibility",
              "Local SEO",
              "Digital Marketing",
              "Schema.org Structured Data",
              "Google Business Profile Optimisation",
            ],
          },
        ]}
      />

      {/* Hero — photo + headline */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 md:grid-cols-5 md:items-center md:gap-14">
            {/* Photo column */}
            <div className="md:col-span-2">
              <FounderAvatarLandscape className="w-full max-w-sm" />
            </div>

            {/* Copy column */}
            <div className="md:col-span-3">
              <Eyebrow>About Kabelo More</Eyebrow>
              <h1 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900 md:text-display-xl">
                I help businesses
                <br />
                <span className="text-ink-500">
                  get cited by ChatGPT, Claude, Gemini, and Perplexity
                </span>{" "}
                when their customers ask AI for what they do.
              </h1>
              <p className="mt-7 text-lg text-ink-500 leading-relaxed">
                8 years of local SEO out of Pretoria. Then the search layer
                changed. I now apply the same first-principles work to AI
                engines — on whatever website my clients have, for a flat fee,
                without forcing anyone into packages they don&apos;t need.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Credibility strip — quick credential scan */}
      <Section variant="default" padding="default">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-white p-6 text-center shadow-soft">
            <div className="text-3xl font-semibold tracking-tight text-ink-900">
              8 years
            </div>
            <div className="mt-1.5 text-sm text-ink-500">
              Local SEO experience
            </div>
          </div>
          <div className="rounded-2xl border border-rule bg-white p-6 text-center shadow-soft">
            <div className="text-3xl font-semibold tracking-tight text-ink-900">
              4 AI engines
            </div>
            <div className="mt-1.5 text-sm text-ink-500">
              Tested on every scan
            </div>
          </div>
          <div className="rounded-2xl border border-rule bg-white p-6 text-center shadow-soft">
            <div className="text-3xl font-semibold tracking-tight text-ink-900">
              SA · UK · US
            </div>
            <div className="mt-1.5 text-sm text-ink-500">
              Pretoria-built, internationally served
            </div>
          </div>
        </div>
      </Section>

      {/* Story */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="prose-kabelo max-w-none">
          <h2>The path to AI Visibility</h2>
          <p>
            For most of the last decade, &quot;search&quot; meant Google&apos;s blue
            links. I spent eight years getting South African service businesses
            found there — local citations, Google Business Profile builds, schema
            deployment, content production. The fundamentals of being{" "}
            <em>findable.</em>
          </p>
          <p>
            That definition of search is changing fast. By Q3 2026, more service
            queries happen in ChatGPT, Claude, Gemini, and Perplexity than on
            Google&apos;s blue links. The signals that move AI engines aren&apos;t
            the same as classic SEO — schema markup, entity consistency, third-party
            citation breadth, answer-shaped content, all matter more. And almost
            no business in South Africa or the UK mid-market has done the work
            yet.
          </p>
          <p>
            I&apos;m spending the next decade closing that gap. The discipline is
            called AEO — Answer Engine Optimisation — and it&apos;s the next
            foundation layer for any business that depends on being found.
          </p>

          <h2>Who I work with</h2>
          <p>
            Three buyer types I&apos;m best suited to:
          </p>
          <ul>
            <li>
              <strong>Industrial &amp; B2B specialists</strong> in South Africa —
              equipment suppliers, fabricators, contractors, BBBEE-certified
              firms targeting enterprise and mining procurement. One AI
              recommendation in this segment can be worth a R50,000 to R500,000
              contract.
            </li>
            <li>
              <strong>Professional firms</strong> — law firms, medical
              specialists, accountants, consultancies. SA mid-market is a
              wide-open AEO frontier; UK mid-market is moving faster.
            </li>
            <li>
              <strong>UK and US service businesses</strong> wanting first-mover
              advantage in AI search before the category gets crowded in 2027.
            </li>
          </ul>

          {/* Mid-page CTA — warm visitors here are ready to act */}
          <div className="my-10 rounded-2xl border border-accent-200 bg-accent-50 px-8 py-6 text-center not-prose">
            <p className="mb-1 font-semibold text-ink-900">
              Ready to find out where you stand?
            </p>
            <p className="mb-4 text-sm text-ink-600">
              Free scan. 24 hours. No card required.
            </p>
            <a
              href="/scan"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-[0.95rem] font-medium text-white shadow-soft transition-all duration-200 hover:bg-ink-800 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
            >
              Get my free AI scan →
            </a>
          </div>

          <h2>Where I work from</h2>
          <p>
            I&apos;m based in Pretoria, South Africa. I serve clients across SA,
            the UK, and the US. The currency arbitrage is real and intentional —
            I deliver work to international standards from a local cost base, so
            international clients get London-quality service at significantly
            below London rates. Same skills, different cost structure, fair
            pricing for both sides.
          </p>
          <p>
            Most of my deep work happens in cafes around Menlyn and Brooklyn,
            on hiking trails in Magaliesberg, or at home with a flat white. The
            lifestyle isn&apos;t a perk — it&apos;s the compounding loop. Outdoor
            time sharpens thinking, content emerges from real life, expertise
            builds through public documentation.
          </p>

          <h2>What makes this hard to copy</h2>
          <p>
            By 2027, every freelance marketer will claim &quot;AI visibility.&quot;
            What won&apos;t be replicable is the specific stack:
          </p>
          <ul>
            <li>
              <strong>Pretoria-based operator</strong> with deep SA local SEO
              fluency (BBBEE scoring nuance, SARS implications, SA directory
              ecosystem)
            </li>
            <li>
              <strong>First-principles AEO understanding</strong> built during
              the emergence window, not retrofitted from old SEO playbooks
            </li>
            <li>
              <strong>Hybrid SA/UK/US practice</strong> with currency arbitrage
              that lets me deliver below London rates without below-London
              quality
            </li>
            <li>
              <strong>Tools I built myself</strong> — including the AI visibility
              tracker that runs on this site daily
            </li>
          </ul>

          <h2>What I actually do in a week</h2>
          <p>
            More transparency than testimonials at this stage:
          </p>
          <ul>
            <li>
              Run 2–4 AI scans for prospective clients (24h turnaround each)
            </li>
            <li>
              Schema deployment and Google Business Profile builds for active
              engagements
            </li>
            <li>
              Writing answer-shaped content — service pages structured as
              buyer questions
            </li>
            <li>
              Citation outreach across SA, UK, and global industry directories
            </li>
            <li>
              Documenting everything publicly on LinkedIn so clients can
              verify the methodology
            </li>
          </ul>

          <p className="mt-10 text-base italic text-ink-500">
            &quot;Escape competition through authenticity.&quot; — Naval Ravikant
          </p>
          <p>That&apos;s the bet.</p>
        </div>

        <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button href="/scan" variant="primary" size="md">
            Get a free AI scan <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/services" variant="secondary" size="md">
            See how we work together
          </Button>
        </div>
      </Section>
    </>
  );
}
