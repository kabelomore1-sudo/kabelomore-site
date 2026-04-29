import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { briefs, allBriefIds, getBrief } from "@/lib/intake-briefs";
import { TallyEmbed } from "@/components/tally-embed";
import { BriefFallback } from "@/components/brief-fallback";
import { Clock, ShieldCheck, ArrowRight, ListChecks } from "lucide-react";

// Pre-generate every brief route at build time
export function generateStaticParams() {
  return allBriefIds.map((tier) => ({ tier }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tier: string }>;
}): Promise<Metadata> {
  const { tier } = await params;
  const brief = getBrief(tier);
  if (!brief) return { title: "Intake brief not found" };

  return {
    title: `${brief.tierName} — Intake brief`,
    description: brief.subtitle,
    alternates: { canonical: `${site.url}/brief/${tier}` },
    robots: {
      // Keep brief pages out of search — they're transactional, not informational
      index: false,
      follow: false,
    },
  };
}

export default async function BriefPage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = await params;
  const brief = getBrief(tier);
  if (!brief) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: brief.tierName, href: `/brief/${tier}` },
          ]),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{brief.tierName}</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            {brief.title}
          </h1>
          <p className="mt-5 text-lg text-ink-500 leading-relaxed">{brief.subtitle}</p>

          {/* Trust strip */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-rule bg-white p-5 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Clock className="h-4 w-4 text-accent-600" />
                {brief.estimatedMinutes} minutes
              </div>
              <div className="mt-1 text-xs text-ink-500">Realistic, not optimistic</div>
            </div>
            <div className="rounded-2xl border border-rule bg-white p-5 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <ListChecks className="h-4 w-4 text-accent-600" />
                {brief.questions.length} questions
              </div>
              <div className="mt-1 text-xs text-ink-500">Structured, not endless</div>
            </div>
            <div className="rounded-2xl border border-rule bg-white p-5 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <ShieldCheck className="h-4 w-4 text-accent-600" />
                No payment yet
              </div>
              <div className="mt-1 text-xs text-ink-500">Approve brief, then deposit</div>
            </div>
          </div>
        </div>
      </Section>

      {/* The form */}
      <Section variant="default" padding="lg" containerSize="narrow">
        {brief.tallyFormId ? (
          <TallyEmbed formId={brief.tallyFormId} title={`${brief.tierName} intake brief`} />
        ) : (
          <BriefFallback tierId={brief.tierId} tierName={brief.tierName} />
        )}
      </Section>

      {/* What happens next */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <Eyebrow>After you submit</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Here&apos;s exactly what happens.
        </h2>

        <ol className="mt-10 space-y-3">
          {brief.whatHappensNext.map((item, idx) => (
            <li
              key={item}
              className="flex gap-4 rounded-2xl border border-rule bg-white p-5 shadow-soft"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-xs text-white">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div className="text-sm text-ink-700 leading-relaxed">{item}</div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border-2 border-accent-200 bg-accent-50 p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-700">
            Payment terms
          </div>
          <p className="mt-3 text-sm text-ink-700 leading-relaxed">{brief.paymentNote}</p>
        </div>
      </Section>

      {/* Preview of questions (so they know what's coming) */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Questions you&apos;ll be answering</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          No surprises. Here are all {brief.questions.length}.
        </h2>
        <p className="mt-4 text-base text-ink-500 leading-relaxed">
          Each question has a &quot;why we ask&quot; note so you understand what we&apos;ll do
          with the answer. Skip nothing — every answer drives a specific decision.
        </p>

        <ol className="mt-10 space-y-4">
          {brief.questions.map((q) => (
            <li
              key={q.number}
              className="rounded-2xl border border-rule bg-white p-6 shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 font-mono text-xs text-white">
                  {String(q.number).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-ink-900">{q.q}</div>
                  <div className="mt-3 rounded-lg bg-ink-50/60 p-3 text-sm text-ink-700 leading-relaxed">
                    <span className="font-semibold text-ink-900">Why we ask: </span>
                    {q.why}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Help / fallback CTA */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-2xl rounded-3xl border border-rule bg-white p-8 text-center shadow-soft md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Need to talk before filling this in?
          </h2>
          <p className="mt-3 text-base text-ink-500">
            Free 20-min call. No pitch, no pressure. We&apos;ll tell you honestly whether
            this tier is right for you.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" variant="primary" size="md">
              Book a free 20-min call <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="ghost" size="md">
              Compare tiers
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
