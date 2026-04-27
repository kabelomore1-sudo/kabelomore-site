import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { ArrowRight, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Build-in-public notes on AI Visibility, AEO methodology, and what's actually moving in AI search. Plus the OMS case study, posted in real time.",
  alternates: { canonical: `${site.url}/blog` },
};

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ])}
      />

      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Blog & Insights</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Notes from
            <br />
            <span className="text-ink-500">building in public.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            What's actually moving in AI search, what we're learning from real
            client work, and the occasional hike-talk on long-term thinking.
          </p>
        </div>
      </Section>

      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="rounded-3xl border-2 border-dashed border-rule bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
            Posts launching with the first case study.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-ink-500">
            The blog goes live alongside the OMS case study results in early May 2026.
            In the meantime, follow on LinkedIn for daily updates — every published
            post here will be cross-posted there first.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={site.social.linkedin}
              variant="primary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow on LinkedIn
            </Button>
            <Button href="/scan" variant="secondary" size="md">
              Get a free AI scan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
