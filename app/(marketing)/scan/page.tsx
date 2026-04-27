import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { ScanForm } from "@/components/scan-form";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free AI Visibility Scan",
  description:
    "Find out exactly what ChatGPT, Claude, Gemini, and Perplexity say about your business when your customers search. Free, no obligation, 24-hour turnaround.",
  alternates: { canonical: `${site.url}/scan` },
};

const scanFaqs = [
  {
    q: "What do I get from the free scan?",
    a: "A 2-page PDF showing exactly what each of ChatGPT, Claude, Gemini, and Perplexity say about your business when potential customers search. Includes verbatim AI responses, screenshots, and the names of any competitors mentioned in your place.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. The scan is genuinely free and there's no follow-up call unless you request one. We use scans to build case study volume and demonstrate the methodology before any paid engagement.",
  },
  {
    q: "How long does it take?",
    a: "24 hours from submission. We run scans manually so each report is reviewed before it goes out.",
  },
  {
    q: "What happens to my information?",
    a: "We use it only to deliver your scan. We don't sell, share, or add you to any mailing lists without your explicit consent.",
  },
];

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Free AI Scan", href: "/scan" },
          ]),
          faqJsonLd(scanFaqs),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Free · No obligation · 24h turnaround</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Find out if AI engines
            <br />
            <span className="text-ink-500">recommend your business.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Submit your business details. We'll test you across ChatGPT, Claude,
            Gemini, and Perplexity — then send you a 2-page report with exactly what
            each AI said. Free. No follow-up unless you want one.
          </p>
        </div>
      </Section>

      {/* Form */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="rounded-3xl border border-rule bg-white p-8 shadow-soft md:p-12">
          <ScanForm defaultTier={params.tier} />
        </div>

        <p className="mt-6 text-center text-sm text-ink-400">
          Prefer email? Send your details directly to{" "}
          <a
            href={`mailto:${site.contact.email}?subject=Free%20AI%20Visibility%20Scan%20Request`}
            className="text-accent-600 hover:text-accent-700"
          >
            {site.contact.email}
          </a>
        </p>
      </Section>

      {/* What you get */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Inside your scan</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            What's actually in the report.
          </h2>

          <div className="mt-10 grid gap-4">
            {[
              {
                h: "What ChatGPT says",
                p: "Verbatim screenshots of ChatGPT's response when prompted with the queries your customers run.",
              },
              {
                h: "What Claude, Gemini, and Perplexity say",
                p: "Same prompts, three other AI engines. Often three different answers — that itself is useful data.",
              },
              {
                h: "Who AI recommends instead",
                p: "Names of the businesses AI engines cite when they don't cite you. Your real digital competitors, not the ones you assume.",
              },
              {
                h: "Top 3 fixes",
                p: "Three concrete, prioritised recommendations. The ones that move the needle most for least effort.",
              },
            ].map((item) => (
              <div
                key={item.h}
                className="rounded-2xl border border-rule bg-white p-6"
              >
                <div className="font-semibold text-ink-900">{item.h}</div>
                <div className="mt-2 text-sm text-ink-500 leading-relaxed">
                  {item.p}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="default" padding="default" containerSize="narrow">
        <Eyebrow>Common questions</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Before you submit.
        </h2>

        <div className="mt-10 space-y-3">
          {scanFaqs.map((faq) => (
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
    </>
  );
}
