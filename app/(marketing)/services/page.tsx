import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { faqJsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { tiers, addOns, site } from "@/lib/site";
import { CircleCheck, ArrowRight, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Pick a service that fits where you are. Foundation Pack for businesses starting from zero. Starter Audit for those with a website wanting clarity. Growth and Premium retainers for ongoing AI visibility work. Pay 50% to start, 50% on delivery.",
  alternates: { canonical: `${site.url}/services` },
};

const servicesFaqs = [
  {
    q: "Why pay 50% deposit and 50% on delivery?",
    a: "Splitting payment is the industry standard for project work. It builds trust both ways: we don't get paid in full until you sign off, and you don't risk full payment to a stranger. If we don't deliver what's quoted, you don't pay the second half. Monthly retainers work differently — billed in advance, cancel after 3 months.",
  },
  {
    q: "Is the Growth retainer just social media management?",
    a: "No. A social media manager schedules posts on Instagram. We do mostly invisible technical work: structured data, third-party citations, schema markup, answer-shaped content, AI citation monitoring. Some of our work shows on social. Most of it shows up in the signals AI engines use to decide who to recommend. Different work, different price.",
  },
  {
    q: "What if I'm not happy with the delivery?",
    a: "Every once-off project includes one round of revisions free. We'll discuss what's not right, agree on changes, deliver the revised version within 5 working days. If after revisions you still don't see what was quoted, you don't pay the second half.",
  },
  {
    q: "Why do you charge in ZAR, USD, and GBP?",
    a: "We deliver work to international standards from a South African cost base. SA clients pay local rates. International clients pay rates aligned with global AEO consulting market. Same work, fair pricing for each region.",
  },
  {
    q: "Is there a discount for first-case-study clients?",
    a: "Yes — Foundation Partners (first clients in a new vertical) receive up to 50% off in exchange for case study publication rights. Limited availability, message us directly to discuss.",
  },
  {
    q: "What's the cancellation policy on monthly retainers?",
    a: "3-month minimum, then month-to-month with 30 days' notice. We deliver everything paid for and hand over all work cleanly — no holding work hostage.",
  },
];

const categoryLabels = {
  scan: { label: "Try us first", color: "text-ink-500" },
  foundation: { label: "Build from zero", color: "text-accent-700" },
  audit: { label: "Get clarity", color: "text-gold-600" },
  retainer: { label: "Ongoing growth", color: "text-emerald-700" },
};

const addOnCategoryLabels: Record<string, { label: string; description: string }> = {
  setup: {
    label: "Setup & Foundations",
    description: "One-time technical and listing work that builds the base.",
  },
  content: {
    label: "Content & Authority",
    description: "Once-off content production for AI citation and clarity.",
  },
  growth: {
    label: "Growth Tools",
    description: "Once-off automation setups that keep working long after we stop.",
  },
  ongoing: {
    label: "Monthly Add-Ons",
    description: "Recurring services that attach to any retainer or stand alone.",
  },
};

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
            Pick what fits where you are.
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            From "I have nothing yet" to "I want serious growth" — there's a starting point for everyone.
            Pay 50% to start on once-off work. 50% on delivery. No surprises.
          </p>
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            "50% deposit, 50% on delivery",
            "One round of revisions included",
            "Updates every 3 days",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-rule bg-white p-4 text-center text-sm font-medium text-ink-700 shadow-soft"
            >
              ✓ {item}
            </div>
          ))}
        </div>
      </Section>

      {/* Tiers */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Core services</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Choose your starting point.
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:gap-10">
          {tiers.map((tier) => {
            const cat = categoryLabels[tier.category];
            return (
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
                          : `text-xs font-semibold uppercase tracking-[0.14em] ${cat.color}`
                      }
                    >
                      {cat.label}
                    </div>
                    <h2 className="mt-3 text-display-md font-semibold tracking-tight">
                      {tier.name}
                    </h2>
                    <p
                      className={
                        tier.highlight
                          ? "mt-4 text-base text-ink-200 leading-relaxed"
                          : "mt-4 text-base text-ink-700 leading-relaxed"
                      }
                    >
                      <strong className={tier.highlight ? "text-white" : "text-ink-900"}>
                        Best for:
                      </strong>{" "}
                      {tier.bestFor}
                    </p>
                    <p
                      className={
                        tier.highlight
                          ? "mt-4 text-sm text-ink-300 leading-relaxed"
                          : "mt-4 text-sm text-ink-500 leading-relaxed"
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
                            ? "inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent-300"
                            : "inline-flex rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700"
                        }
                      >
                        {tier.payment}
                      </div>
                      <div
                        className={
                          tier.highlight
                            ? "text-sm text-ink-300"
                            : "text-sm text-ink-500"
                        }
                      >
                        Delivery: {tier.delivery}
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
                      What you receive
                    </div>
                    <ul className="mt-5 space-y-3">
                      {tier.receives.map((b) => (
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

                    {/* Monthly work clarity block — for retainers only */}
                    {tier.monthlyWork && (
                      <div
                        className={
                          tier.highlight
                            ? "mt-8 rounded-2xl border border-white/10 bg-white/5 p-6"
                            : "mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-6"
                        }
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle
                            className={
                              tier.highlight
                                ? "mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400"
                                : "mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
                            }
                          />
                          <div className="flex-1">
                            <div
                              className={
                                tier.highlight
                                  ? "text-xs font-semibold uppercase tracking-[0.14em] text-amber-300"
                                  : "text-xs font-semibold uppercase tracking-[0.14em] text-amber-700"
                              }
                            >
                              Why monthly? What's actually happening?
                            </div>
                            <p
                              className={
                                tier.highlight
                                  ? "mt-2 text-sm text-ink-200 leading-relaxed"
                                  : "mt-2 text-sm text-ink-700 leading-relaxed"
                              }
                            >
                              {tier.monthlyWork.intro}
                            </p>
                            <ul className="mt-4 space-y-1.5">
                              {tier.monthlyWork.items.map((item) => (
                                <li
                                  key={item.task}
                                  className="flex items-start justify-between gap-3 text-xs"
                                >
                                  <span
                                    className={
                                      tier.highlight ? "text-ink-100" : "text-ink-700"
                                    }
                                  >
                                    · {item.task}
                                  </span>
                                  <span
                                    className={
                                      tier.highlight
                                        ? "flex-shrink-0 font-mono text-amber-300"
                                        : "flex-shrink-0 font-mono text-amber-700"
                                    }
                                  >
                                    {item.effort}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <p
                              className={
                                tier.highlight
                                  ? "mt-4 text-xs italic text-ink-300 leading-relaxed"
                                  : "mt-4 text-xs italic text-ink-500 leading-relaxed"
                              }
                            >
                              {tier.monthlyWork.notSocialMedia}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Add-Ons */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Add-ons</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Specialty services. Buy alone or attach to any tier.
          </h2>
          <p className="mt-4 text-base text-ink-500 leading-relaxed">
            Need just one specific thing fixed? Buy any add-on standalone — no commitment to a retainer required.
            Or attach to your tier for the work that fits.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {(["setup", "content", "growth", "ongoing"] as const).map((category) => {
            const items = addOns.filter((a) => a.category === category);
            const meta = addOnCategoryLabels[category];
            return (
              <div key={category}>
                <div className="mb-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                    {meta.label}
                  </div>
                  <p className="mt-2 text-sm text-ink-500">{meta.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((addon) => (
                    <article
                      key={addon.id}
                      className="rounded-2xl border border-rule bg-white p-6 shadow-soft transition-all hover:shadow-card"
                    >
                      <h3 className="text-lg font-semibold text-ink-900">
                        {addon.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-xl font-semibold text-ink-900">
                          {addon.price.sa}
                        </span>
                        <span className="text-sm text-ink-500">
                          {addon.price.intl}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex rounded-full bg-accent-50 px-2 py-1 text-[10px] uppercase tracking-wider text-accent-700">
                        {addon.payment}
                      </div>
                      <p className="mt-4 text-sm text-ink-700 leading-relaxed">
                        {addon.description}
                      </p>
                      <details className="mt-4 group">
                        <summary className="cursor-pointer text-xs font-medium text-accent-600 hover:text-accent-700 list-none">
                          What you receive →
                        </summary>
                        <ul className="mt-3 space-y-1.5">
                          {addon.receives.map((r) => (
                            <li
                              key={r}
                              className="flex items-start gap-2 text-xs text-ink-600"
                            >
                              <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-accent-500" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </details>
                      <div className="mt-5">
                        <Button
                          href={addon.cta.href}
                          variant="secondary"
                          size="sm"
                        >
                          {addon.cta.label}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* FAQs */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Common questions</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Things people ask before they buy.
        </h2>

        <div className="mt-10 space-y-3">
          {servicesFaqs.map((faq) => (
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
              <div className="mt-4 text-base text-ink-700 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-gradient p-12 text-center text-white shadow-lift">
          <h2 className="text-display-md font-semibold tracking-tight">
            Not sure where to start?
          </h2>
          <p className="mt-4 text-base text-ink-300">
            Get a free AI scan. We tell you exactly what AI says about your business today.
            No card, no follow-up. 24-hour turnaround.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/scan" variant="ink" size="lg">
              Get a free AI scan <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/how-we-work"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              See how we work
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
