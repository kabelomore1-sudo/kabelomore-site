import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
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

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>About Kabelo More</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            8 years of local SEO.
            <br />
            <span className="text-ink-500">Now applied to the AI search era.</span>
          </h1>
          <p className="mt-7 text-lg text-ink-500 leading-relaxed">
            I built local SEO businesses from Pretoria for nearly a decade. Then
            ChatGPT, Claude, Gemini, and Perplexity changed how people search. I
            now do AI Visibility — the same first-principles work, applied to a
            new search layer that almost nobody in South Africa is doing yet.
          </p>
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
