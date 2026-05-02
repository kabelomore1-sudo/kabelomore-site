import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { newsletterIssues } from "@/lib/newsletter-issues";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The AEO Letter — Weekly tactics for medical, legal, industrial firms",
  description:
    "Weekly newsletter covering AI visibility tactics for medical practitioners, legal counsellors, and industrial businesses. One real audit pattern, one specific fix, one quotable insight per email. Read the public archive.",
  alternates: { canonical: `${site.url}/newsletter` },
};

const sectorLabel: Record<string, string> = {
  general: "General",
  medical: "Medical",
  legal: "Legal",
  industrial: "Industrial",
};

const sectorColor: Record<string, string> = {
  general: "bg-ink-100 text-ink-700",
  medical: "bg-rose-100 text-rose-700",
  legal: "bg-amber-100 text-amber-700",
  industrial: "bg-emerald-100 text-emerald-700",
};

export default function NewsletterIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Newsletter", href: "/newsletter" },
        ])}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">The AEO Letter</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Weekly tactics from real audits.
            <br />
            <span className="text-ink-500">For firms that make real money.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Every Thursday morning, SA time. One pattern from a real audit, one
            specific fix, one quotable insight. Built for medical, legal, and
            industrial firms running The Real Estate Method.
          </p>
        </div>

        {/* Subscribe — primary CTA */}
        <div className="mx-auto mt-10 max-w-2xl">
          <NewsletterSignup variant="card" source="newsletter-index" />
        </div>
      </Section>

      {/* Issues archive */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Read the archive</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Every issue, public + searchable.
          </h2>
          <p className="mt-4 text-base text-ink-500 leading-relaxed">
            Issues are public so they compound — indexed by Google + AI engines,
            shareable with colleagues, citable in your own work. No subscriber-only
            firewall.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {newsletterIssues.map((issue) => (
            <Link
              key={issue.slug}
              href={`/newsletter/${issue.slug}`}
              className="group block rounded-2xl border border-rule bg-white p-6 shadow-soft transition-all hover:border-accent-300 hover:shadow-card md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-semibold uppercase tracking-wider text-ink-400">
                      Issue {issue.number}
                    </span>
                    <span className="text-ink-400">·</span>
                    <span className="text-ink-500">
                      {new Date(issue.date).toLocaleDateString("en-ZA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${sectorColor[issue.sector]}`}
                    >
                      {sectorLabel[issue.sector]}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink-900 group-hover:text-accent-700 md:text-2xl">
                    {issue.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-600 leading-relaxed md:text-base">
                    {issue.subtitle}
                  </p>
                </div>
                <ArrowRight className="mt-2 h-5 w-5 flex-shrink-0 text-accent-500 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Frequency promise — sets expectation, reduces unsubs */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-rule bg-ink-50/60 p-6 text-center text-sm text-ink-600">
          <strong className="text-ink-900">Frequency:</strong> One email every
          Thursday morning, SA time. One unsubscribe click ends it cleanly. No
          retention dance.
        </div>
      </Section>
    </>
  );
}
