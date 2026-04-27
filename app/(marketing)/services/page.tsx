import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { tiers, site } from "@/lib/site";
import { CircleCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Four ways to work with Kabelomore on AI Visibility (AEO). Free scan, audit (R3,500 / $295), implementation (R12,500 / $1,195), or monthly retainer (R4,950 / $595).",
  alternates: { canonical: `${site.url}/services` },
};

const servicesFaqs = [
  {
    q: "Why do you charge in both ZAR and USD/GBP?",
    a: "We deliver work to international standards from a South African cost base. SA clients pay local rates that reflect the local market. International clients pay rates aligned with global AEO consulting market. Same work, transparent pricing for each region.",
  },
  {
    q: "Is there a discount for paying upfront?",
    a: "No standard upfront discount, but Foundation Partners (first case studies in a new vertical) receive 50% off in exchange for case study rights. Limited availability — message me directly to discuss.",
  },
  {
    q: "What's the cancellation policy on the Visibility Partner retainer?",
    a: "3-month minimum, then month-to-month. Cancel anytime after the 3-month minimum with 30 days' notice. We'll deliver everything that's been paid for and hand over all work cleanly — no holding work hostage.",
  },
  {
    q: "Do you take equity instead of fees?",
    a: "Not at this stage. Cash for work keeps the relationship clean and lets us focus on outcomes. If your business is in a position where equity-for-work makes more sense than cash, you're probably not yet at the stage where AEO is your top priority.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
          ]),
          ...tiers.map((t) =>
            serviceJsonLd({
              name: t.name,
              description: t.description,
              price: t.price,
            }),
          ),
          faqJsonLd(servicesFaqs),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Services & Pricing</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Transparent pricing.
            <br />
            <span className="text-ink-500">Cancel anytime.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Four ways to work together. Same disciplined process at every level.
            Start free, upgrade when the fit is clear.
          </p>
        </div>
      </Section>

      {/* Tier cards — full detail */}
      <Section variant="default" padding="default">
        <div className="grid gap-8 md:gap-10">
          {tiers.map((tier) => (
            <article
              key={tier.id}
              id={tier.id}
              className={
                tier.highlight
                  ? "relative overflow-hidden rounded-3xl bg-ink-900 p-8 text-white shadow-lift md:p-12"
                  : "rounded-3xl border border-rule bg-white p-8 shadow-soft md:p-12"
              }
            >
              {tier.highlight && (
                <div className="absolute right-8 top-8 hidden rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white md:block">
                  Most popular
                </div>
              )}

              <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-5">
                  <div
                    className={
                      tier.highlight
                        ? "text-xs font-semibold uppercase tracking-[0.14em] text-accent-400"
                        : "text-xs font-semibold uppercase tracking-[0.14em] text-accent-600"
                    }
                  >
                    Tier 0{tier.rank}
                  </div>
                  <h2 className="mt-3 text-display-md font-semibold tracking-tight">
                    {tier.name}
                  </h2>
                  <p
                    className={
                      tier.highlight
                        ? "mt-5 text-base text-ink-300 leading-relaxed"
                        : "mt-5 text-base text-ink-500 leading-relaxed"
                    }
                  >
                    {tier.description}
                  </p>

                  <div className="mt-8 space-y-3">
                    <div>
                      <div
                        className={
                          tier.highlight
                            ? "text-xs uppercase tracking-wider text-ink-300"
                            : "text-xs uppercase tracking-wider text-ink-400"
                        }
                      >
                        South Africa
                      </div>
                      <div className="text-3xl font-semibold tracking-tight">
                        {tier.price.sa}
                      </div>
                    </div>
                    <div>
                      <div
                        className={
                          tier.highlight
                            ? "text-xs uppercase tracking-wider text-ink-300"
                            : "text-xs uppercase tracking-wider text-ink-400"
                        }
                      >
                        International
                      </div>
                      <div
                        className={
                          tier.highlight
                            ? "text-xl font-semibold tracking-tight text-ink-100"
                            : "text-xl font-semibold tracking-tight text-ink-700"
                        }
                      >
                        {tier.price.intl}
                      </div>
                    </div>
                    <div
                      className={
                        tier.highlight
                          ? "text-sm text-ink-300"
                          : "text-sm text-ink-500"
                      }
                    >
                      {tier.cadence}
                    </div>
                  </div>

                  <div className="mt-10">
                    <Button
                      href={tier.cta.href}
                      variant={tier.highlight ? "ink" : "primary"}
                      size="md"
                    >
                      {tier.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <div
                    className={
                      tier.highlight
                        ? "text-xs font-semibold uppercase tracking-[0.14em] text-ink-300"
                        : "text-xs font-semibold uppercase tracking-[0.14em] text-ink-400"
                    }
                  >
                    What's included
                  </div>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {tier.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm">
                        <CircleCheck
                          className={
                            tier.highlight
                              ? "mt-0.5 h-5 w-5 flex-shrink-0 text-accent-400"
                              : "mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500"
                          }
                        />
                        <span
                          className={
                            tier.highlight ? "text-ink-100" : "text-ink-700"
                          }
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Executive tier — by application */}
        <div className="mt-12 rounded-3xl border-2 border-dashed border-rule bg-ink-50/50 p-8 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                Tier 05 — by application
              </div>
              <h3 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
                Executive
              </h3>
              <p className="mt-3 text-base text-ink-500 leading-relaxed">
                Custom AI strategy consulting, Cowork automation, team training,
                quarterly advisory. Typical engagement: from R25,000 setup +
                R8,500/month retainer (or international equivalent). For firms with
                10+ professionals, multiple practice areas, or enterprise compliance
                needs.
              </p>
            </div>
            <Button href="/contact" variant="secondary" size="md">
              Request a discovery call
            </Button>
          </div>
        </div>
      </Section>

      {/* Common questions / FAQs */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Common questions</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Things people ask before they buy.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {servicesFaqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-rule bg-white p-6 transition-shadow open:shadow-card"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-semibold text-ink-900 list-none">
                {faq.q}
                <span className="mt-1 flex-shrink-0 text-accent-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4 text-base text-ink-700 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-gradient p-12 text-center text-white shadow-lift">
          <h2 className="text-display-md font-semibold tracking-tight">
            Start with the free scan.
          </h2>
          <p className="mt-4 text-base text-ink-300">
            Find out exactly what AI engines say about your business right now. No
            obligation. 24-hour turnaround.
          </p>
          <div className="mt-8">
            <Button href="/scan" variant="ink" size="lg">
              Get a free AI scan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
