import type { Metadata } from "next";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site, tiers, addOns, addOnCategories } from "@/lib/site";
import { PricingPrintButton } from "@/components/pricing-print-button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Pricing — Kabelomore AI Visibility Services 2026",
  description:
    "Full price list for AI Visibility services from Kabelomore: Foundation Pack, Foundation Lite, Discovery Sprint, Starter Audit, Growth & Premium retainers, plus 14 modular add-ons.",
  alternates: { canonical: `${site.url}/pricing` },
};

const generatedDate = new Date().toLocaleDateString("en-ZA", {
  year: "numeric",
  month: "long",
});

// Helper: tier category in human-friendly label
const categoryLabel: Record<string, string> = {
  scan: "Try us",
  foundation: "No website yet",
  audit: "Just clarity",
  retainer: "Ongoing growth",
};

const addOnCategoryLabel: Record<string, string> = {
  setup: "Setup & Foundations",
  content: "Content & Authority",
  growth: "Growth Tools",
  ongoing: "Monthly Add-Ons",
};

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
        ])}
      />

      {/* Print + screen styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4; margin: 1.4cm 1.2cm; }
              header, nav, footer, .no-print { display: none !important; }
              body { background: white !important; color: black !important; }
              .print-page { box-shadow: none !important; border: none !important; }
              .tier-card, .addon-card { break-inside: avoid; page-break-inside: avoid; }
              .pricing-section { break-inside: avoid; }
              .print-only { display: block !important; }
              h1, h2 { page-break-after: avoid; }
              a { color: black !important; text-decoration: none !important; }
              .pricing-tier-grid { gap: 0.4rem !important; }
              .accent-bar { border-color: #000 !important; }
            }
            .print-only { display: none; }
          `,
        }}
      />

      <Container className="py-10 md:py-16">
        {/* Action bar — hidden on print */}
        <div className="no-print mb-8 flex flex-col items-start justify-between gap-3 rounded-2xl border border-rule bg-ink-50/40 p-5 sm:flex-row sm:items-center">
          <div className="text-sm text-ink-700">
            <span className="font-semibold text-ink-900">Want a copy to share?</span>{" "}
            Print this page or save as PDF — same content, always up to date.
          </div>
          <div className="flex gap-2">
            <PricingPrintButton />
            <a
              href="/downloads/kabelomore-pricing-2026.pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-rule bg-white px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-ink-50"
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="print-page mb-10 border-b border-rule pb-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-600">
                Kabelo More · AI Visibility
              </div>
              <h1 className="mt-2 text-display-lg font-semibold tracking-tight text-ink-900">
                2026 Pricing
              </h1>
              <p className="mt-3 max-w-2xl text-base text-ink-500">
                AI Visibility / AEO services for South African, UK, and US service
                businesses. All once-off projects bill 50% deposit to start, 50%
                on delivery. Monthly retainers bill in advance with a 3-month
                minimum.
              </p>
            </div>
            <div className="text-right text-xs text-ink-500">
              <div>Effective from {generatedDate}</div>
              <div className="mt-1">{site.url.replace("https://", "")}</div>
              <div>{site.contact.email}</div>
            </div>
          </div>
        </div>

        {/* Tiers */}
        <section className="pricing-section mb-12">
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">
            Service tiers
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            From a free scan to ongoing retainers — pick what fits your stage.
          </p>

          <div className="pricing-tier-grid mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="tier-card flex flex-col rounded-2xl border border-rule bg-white p-5"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-600">
                  {categoryLabel[tier.category]}
                </div>
                <div className="mt-2 text-base font-semibold text-ink-900">
                  {tier.name}
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-semibold text-ink-900">
                    {tier.price.sa}
                  </div>
                  <div className="text-xs text-ink-500">{tier.price.intl}</div>
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-wider text-accent-700">
                  {tier.payment}
                </div>
                <div className="mt-1 text-[11px] text-ink-400">
                  Delivery: {tier.delivery}
                </div>
                <p className="mt-3 text-xs text-ink-700 leading-relaxed">
                  {tier.bestFor}
                </p>
                <ul className="mt-4 space-y-1 text-[11px] text-ink-700">
                  {tier.receives.slice(0, 4).map((r) => (
                    <li key={r} className="flex gap-2">
                      <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-accent-500" />
                      <span>{r}</span>
                    </li>
                  ))}
                  {tier.receives.length > 4 && (
                    <li className="text-[10px] italic text-ink-400">
                      + {tier.receives.length - 4} more · see kabelomore.com/services
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Add-ons */}
        <section className="pricing-section mb-12">
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">
            Modular add-ons ({addOns.length})
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Specialty services that attach to any tier or stand alone. All bill
            on the same 50/50 (once-off) or in-advance (monthly) terms.
          </p>

          <div className="mt-6 space-y-6">
            {(["setup", "content", "growth", "ongoing"] as const).map(
              (category) => {
                const items = addOnCategories[category];
                if (items.length === 0) return null;
                return (
                  <div key={category} className="pricing-section">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-ink-500">
                      {addOnCategoryLabel[category]}
                    </h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {items.map((addon) => (
                        <div
                          key={addon.id}
                          className="addon-card rounded-xl border border-rule bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-sm font-semibold text-ink-900">
                              {addon.name}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-ink-900">
                                {addon.price.sa}
                              </div>
                              <div className="text-[10px] text-ink-400">
                                {addon.price.intl}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-[11px] text-ink-700 leading-relaxed">
                            {addon.description}
                          </p>
                          <div className="mt-2 text-[10px] text-ink-500">
                            Delivery: {addon.delivery} · {addon.payment}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>

        {/* Terms */}
        <section className="pricing-section mb-10 rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-6">
          <h2 className="text-base font-semibold text-ink-900">
            Payment, delivery and cancellation terms
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>
              <span className="font-semibold text-ink-900">Once-off projects:</span>{" "}
              50% deposit to start, 50% on delivery. Card or EFT. If after one
              round of revisions you still don&apos;t see what was quoted, you
              don&apos;t pay the second half.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Monthly retainers:</span>{" "}
              billed in advance, 3-month minimum, cancel after month 3 with 30
              days written notice. Discovery & Strategy Sprint (R3,500 value) is
              included free in month 1.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Revisions:</span> one
              full round included on every once-off project. Additional rounds
              billed at R750/hour.
            </li>
            <li>
              <span className="font-semibold text-ink-900">Communication:</span>{" "}
              status updates every 3 days during active work. WhatsApp for quick
              questions, email for everything that needs a paper trail.
            </li>
            <li>
              <span className="font-semibold text-ink-900">International pricing:</span>{" "}
              SA pricing reflects local cost base. UK and US clients get the same
              quality at currency-arbitraged rates while year-one case study
              volume builds. This pricing is not guaranteed past 2026.
            </li>
          </ul>
        </section>

        {/* Contact footer */}
        <section className="pricing-section border-t border-rule pt-6 text-sm text-ink-700">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Get started
              </div>
              <div className="mt-2">
                Free AI scan: <a className="text-accent-600" href={`${site.url}/scan`}>kabelomore.com/scan</a>
              </div>
              <div>
                Book a 20-min call: <a className="text-accent-600" href={`${site.url}/contact`}>kabelomore.com/contact</a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Direct contact
              </div>
              <div className="mt-2">{site.contact.email}</div>
              <div>{site.contact.location}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Web
              </div>
              <div className="mt-2">{site.url.replace("https://", "")}</div>
              <div>
                LinkedIn:{" "}
                <a className="text-accent-600" href={site.social.linkedin}>
                  /in/kabelomore
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 text-xs text-ink-400">
            Pricing effective from {generatedDate}. Subject to update — always
            check kabelomore.com/pricing for the live version.
          </div>
        </section>
      </Container>
    </>
  );
}
