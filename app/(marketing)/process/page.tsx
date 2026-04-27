import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Process — How AI Visibility (AEO) Actually Works",
  description:
    "The five disciplined steps we take to move your business from invisible to AI-cited: scan, diagnose, build, measure, compound. Same process, every client.",
  alternates: { canonical: `${site.url}/process` },
};

const processFaqs = [
  {
    q: "What's the difference between AEO and traditional SEO?",
    a: "SEO targets the blue-link results page on traditional search engines. AEO (Answer Engine Optimisation) targets the conversational answers AI engines like ChatGPT, Claude, Gemini, and Perplexity give. The signals overlap (structured data, citations, content quality), but AEO weighs trust verification and answer-shaped content more heavily than SEO.",
  },
  {
    q: "What is structured data and why does it matter for AI search?",
    a: "Structured data (also called schema.org markup or JSON-LD) is machine-readable code embedded on a webpage that explicitly tells search engines and AI crawlers what the page is about — business name, services, location, hours, ratings. Without it, AI engines have to guess. With it, they have verified data to confidently cite.",
  },
  {
    q: "How does Google Business Profile fit into AI search?",
    a: "Google Business Profile (GBP) data is one of the most heavily weighted signals AI engines use to recommend local businesses. A complete, optimised GBP with categories, services, hours, photos, reviews, and posts dramatically increases the chance an AI engine will recommend you in local-intent queries.",
  },
  {
    q: "Why does third-party citation matter?",
    a: "AI engines cross-reference business information across multiple sources before recommending. A business listed only on its own website is harder to verify than one listed on industry directories, professional bodies, news sites, and review platforms. Third-party citations are trust anchors AI engines use for entity verification.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Process", href: "/process" },
          ]),
          faqJsonLd(processFaqs),
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to make a business visible to AI search engines",
            description:
              "A five-step disciplined process to move a business from AI-invisible to AI-cited.",
            totalTime: "P30D",
            step: [
              { "@type": "HowToStep", position: 1, name: "Scan", text: "Test the business across ChatGPT, Claude, Gemini, and Perplexity. Capture verbatim responses." },
              { "@type": "HowToStep", position: 2, name: "Diagnose", text: "Audit website schema, GBP, third-party citations, review velocity. Map competitive gaps." },
              { "@type": "HowToStep", position: 3, name: "Build", text: "Deploy structured data, optimise GBP, publish answer-shaped content, establish citations." },
              { "@type": "HowToStep", position: 4, name: "Measure", text: "Rescan at 30 days. Compare before and after. Document the lift." },
              { "@type": "HowToStep", position: 5, name: "Compound", text: "Continue optimisation as AI models update. Own the category over time." },
            ],
          },
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">The process</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Five steps.
            <br />
            <span className="text-ink-500">Same process, every client.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            AEO isn't magic. It's a discipline — five clear steps applied consistently.
            Here's exactly what happens between "we start" and "your business gets cited."
          </p>
        </div>
      </Section>

      {/* Steps */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <ol className="space-y-12 md:space-y-16">
          {[
            {
              n: "01",
              t: "Scan",
              w: "What does AI see right now?",
              p: "We query ChatGPT, Claude, Gemini, and Perplexity with the exact questions your customers ask. We capture verbatim responses. If you're not mentioned, we measure the gap. If competitors are, we know who to benchmark.",
              tools: "Tools: Manual queries · Citation tracking · Screenshot capture",
            },
            {
              n: "02",
              t: "Diagnose",
              w: "Why are you invisible?",
              p: "We audit your website's structured data (schema.org JSON-LD), meta signals, and content shape. We check your Google Business Profile for completeness. We look at third-party citations, review velocity, and authority signals. AI engines rank on specific signals — we find which ones you're missing.",
              tools: "Tools: Google Rich Results Test · GBP Insights · Manual citation check",
            },
            {
              n: "03",
              t: "Build",
              w: "Make your business AI-readable.",
              p: "We deploy LocalBusiness, Service, and Organization schema to your website. We optimise your Google Business Profile to 100% completeness. We write answer-shaped content that AI engines actually quote. We establish third-party citations that AI crawlers trust.",
              tools: "Tools: schema.org generator · GBP API · Industry directory submissions",
            },
            {
              n: "04",
              t: "Measure",
              w: "Prove the work moved the needle.",
              p: "We rescan your business across all four AI engines using the same queries from Step 1. We compare before and after. We document citation rate movement, new AI mentions, and updated competitive position. This is the proof we put into your case study.",
              tools: "Tools: Citation tracking · Before/after comparison · GBP metrics",
            },
            {
              n: "05",
              t: "Compound",
              w: "Keep the work going.",
              p: "AI engines update constantly. New competitors catch on. Algorithms shift. The businesses that treat AI visibility as an ongoing practice — monthly tracking, fresh content, proactive citation management — own their category for years. The ones that treat it as a one-off project lose ground.",
              tools: "Available as: Visibility Partner monthly retainer",
            },
          ].map((step) => (
            <li key={step.n} className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <div className="text-5xl font-mono font-light text-accent-500">
                  {step.n}
                </div>
              </div>
              <div className="md:col-span-9">
                <h2 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
                  {step.t} — <span className="text-ink-500">{step.w}</span>
                </h2>
                <p className="mt-4 text-base text-ink-700 leading-relaxed md:text-lg">
                  {step.p}
                </p>
                <p className="mt-4 text-sm text-ink-400">{step.tools}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* What you can expect */}
      <Section variant="ink" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Realistic expectations</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-white">
            What we promise.
            <br />
            <span className="text-accent-400">And what we don't.</span>
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-400">
              We promise
            </div>
            <ul className="mt-5 space-y-3 text-base text-ink-100 leading-relaxed">
              <li>· The same disciplined 5-step process for every client</li>
              <li>· Documented before/after data — citations, screenshots, metrics</li>
              <li>· Honest reporting, including when results are slower than expected</li>
              <li>· Cancel anytime on the Partner tier after 3 months</li>
              <li>· Work delivered by Kabelo personally — no offshoring</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-gold-400">
              We don't promise
            </div>
            <ul className="mt-5 space-y-3 text-base text-ink-100 leading-relaxed">
              <li>· A specific citation rate or "page 1 of ChatGPT" guarantee</li>
              <li>· Overnight results — meaningful change takes 60-90 days</li>
              <li>· Magic formulas, "secret hacks", or AI-prompt tricks</li>
              <li>· To work with anyone — we choose clients carefully</li>
              <li>· Lock-in contracts or cancellation penalties</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Process FAQs</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Questions about how it works.
        </h2>

        <div className="mt-10 space-y-3">
          {processFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-rule bg-white p-6 transition-shadow open:shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink-900">
                {faq.q}
                <span className="mt-1 flex-shrink-0 text-accent-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-base text-ink-700 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-display-md font-semibold tracking-tight text-ink-900">
            Ready to see Step 1 in action on your business?
          </h2>
          <p className="mt-4 text-base text-ink-500">
            Free scan. 24-hour turnaround. The first step of the process,
            run on you.
          </p>
          <div className="mt-8">
            <Button href="/scan" variant="primary" size="lg">
              Get a free AI scan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
