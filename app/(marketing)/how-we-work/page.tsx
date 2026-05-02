import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  ArrowRight,
  Receipt,
  ClipboardList,
  Hammer,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How we work — From buying to delivery, step by step",
  description:
    "Four clear steps from first contact to delivery. Pay 50% to start, 50% on delivery. Brief takes 10 minutes. Updates every 3 days. One round of revisions included.",
  alternates: { canonical: `${site.url}/how-we-work` },
};

const faqs = [
  {
    q: "Why 50% deposit and 50% on delivery?",
    a: "Splitting payment is the industry standard for project work in South Africa and abroad. It builds trust both ways: we don't get paid in full until you sign off, and you don't risk a full payment to a stranger. If we don't deliver what's quoted, you don't pay the second half.",
  },
  {
    q: "What happens if I'm not happy with the delivery?",
    a: "Every once-off project includes one round of revisions. We'll discuss what's not right, agree on what changes, and deliver the revised version within 5 working days. If after revisions you still don't see what was quoted, you don't pay the second half — though in practice this almost never happens because the brief is signed off before work starts.",
  },
  {
    q: "How quickly do you respond when I have a question?",
    a: "During active work: 3-day update cadence baked in (we send a status update every 3 days even if you don't ask). For ad-hoc questions, 48 hours on Growth tier and 24 hours on Premium. WhatsApp is fine for quick things.",
  },
  {
    q: "What if I just want to talk before paying anything?",
    a: "Book a free 20-minute call. No pitch, no pressure. We'll talk through your situation, tell you honestly whether we're the right fit, and recommend a starting point — even if that's not us.",
  },
];

const steps = [
  {
    number: "01",
    title: "You buy or book",
    icon: Receipt,
    accentColor: "bg-ink-900",
    timeFrame: "5 minutes",
    description:
      "Pick a service, pay 50% via card or EFT. Or book a free 20-minute call first if you'd rather chat before committing.",
    youDo: [
      "Choose your service from the pricing page",
      "Click 'Get Started' — pay 50% deposit via card or EFT",
      "Or book a free 20-min discovery call",
    ],
    weDo: [
      "Send confirmation + payment receipt within 1 hour",
      "Schedule the kickoff call within 48 hours",
      "Send the project brief link",
    ],
  },
  {
    number: "02",
    title: "You fill the brief",
    icon: ClipboardList,
    accentColor: "bg-accent-500",
    timeFrame: "10 minutes",
    description:
      "Structured 8-question form covering everything we need to do the work properly. No jargon, no fluff. If you can answer the questions a customer asks you, you can answer these.",
    youDo: [
      "Answer 8 questions about your business and goals",
      "Upload your logo, photos, brand colours (if you have them)",
      "List 3 competitors you respect or want to beat",
      "Submit — done.",
    ],
    weDo: [
      "Review your brief within 24 hours",
      "Send any clarification questions in 1 batch (not piecemeal)",
      "Confirm scope, timeline, and what comes next",
      "Begin work the moment your brief is complete",
    ],
  },
  {
    number: "03",
    title: "We deliver",
    icon: Hammer,
    accentColor: "bg-gold-500",
    timeFrame: "Varies by service",
    description:
      "We do the work. You get clear updates every 3 days even if you don't ask. Final delivery comes with a walkthrough call so you actually understand what we built.",
    youDo: [
      "Read the 3-day status updates (60 seconds each)",
      "Be available for the final walkthrough call",
      "Reply to any unblocking questions promptly",
    ],
    weDo: [
      "Status updates every 3 days (Mon, Thu cadence)",
      "Deliver the actual work (website, schema, citations, content — whatever the service is)",
      "Final delivery as a PDF + walkthrough call",
      "Hand over all login details and documentation",
    ],
  },
  {
    number: "04",
    title: "You approve, we wrap",
    icon: CheckCircle2,
    accentColor: "bg-emerald-500",
    timeFrame: "1-5 days",
    description:
      "You review what we delivered. One round of revisions is included if anything's off. Pay the second 50%. Optionally roll into a monthly retainer.",
    youDo: [
      "Review the deliverables (we'll wait — no pressure)",
      "Send any revisions you want — one round is free",
      "Approve the final version",
      "Pay the second 50% via card or EFT",
    ],
    weDo: [
      "Implement any revisions within 5 working days",
      "Send final invoice for the second 50%",
      "Document everything we did + login details",
      "Stay available for 30 days for any small fixes",
    ],
  },
];

export default function HowWeWorkPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "How we work", href: "/how-we-work" },
          ]),
          faqJsonLd(faqs),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">How we work together</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            From first contact
            <br />
            <span className="text-ink-500">to delivery, step by step.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Every engagement runs on{" "}
            <strong className="text-ink-900">The Real Estate Method</strong> —
            our 7-property framework for owning every search-result space your
            customers ever see. Pay 50% to start, 50% on delivery. 10-minute
            brief. Updates every 3 days. One round of revisions included. No
            surprises.
          </p>
        </div>

        {/* Trust bar — distinct top borders per phase color */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              label: "Pay 50% to start",
              sub: "Industry standard",
              border: "border-t-2 border-accent-400",
            },
            {
              label: "Updates every 3 days",
              sub: "Always know status",
              border: "border-t-2 border-amber-400",
            },
            {
              label: "One round of revisions",
              sub: "Included free",
              border: "border-t-2 border-emerald-400",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border border-rule bg-white p-5 text-center shadow-soft ${item.border}`}
            >
              <div className="text-base font-semibold text-ink-900">
                {item.label}
              </div>
              <div className="mt-1 text-sm text-ink-500">{item.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* The 4 steps */}
      <Section variant="default" padding="lg">
        <div className="space-y-12">
          {steps.map((step) => {
            const Icon = step.icon;

            // Phase-based color palette per step number — creates rhythm
            // across the 4-step flow:
            //   01-02 = client phase (accent teal)
            //   03    = work phase (amber)
            //   04    = delivery (emerald)
            const phase = (() => {
              if (step.number === "01" || step.number === "02") {
                return {
                  icon: "bg-accent-500",
                  border: "border-l-4 border-accent-400",
                  label: "text-accent-600",
                };
              }
              if (step.number === "03") {
                return {
                  icon: "bg-amber-500",
                  border: "border-l-4 border-amber-400",
                  label: "text-amber-600",
                };
              }
              return {
                icon: "bg-emerald-500",
                border: "border-l-4 border-emerald-400",
                label: "text-emerald-600",
              };
            })();

            return (
              <article
                key={step.number}
                className={`grid gap-6 rounded-3xl border border-rule bg-white p-8 shadow-soft md:grid-cols-12 md:gap-10 md:p-12 ${phase.border}`}
              >
                {/* Left col: step number + icon */}
                <div className="md:col-span-3">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${phase.icon} text-white shadow-soft`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className={`mt-4 font-mono text-sm ${phase.label}`}>
                    Step {step.number}
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">
                    {step.title}
                  </div>
                  <div className="mt-1 text-sm text-ink-500">{step.timeFrame}</div>
                </div>

                {/* Right col: description + 2-col what-you-do / what-we-do */}
                <div className="md:col-span-9">
                  <p className="text-base text-ink-700 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                        What you do
                      </div>
                      <ul className="mt-3 space-y-2">
                        {step.youDo.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-ink-700"
                          >
                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ink-300" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
                        What we do
                      </div>
                      <ul className="mt-3 space-y-2">
                        {step.weDo.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-ink-700"
                          >
                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <Eyebrow>Common questions</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Things people ask before they pay.
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
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

      {/* CTA — primary button uses white-on-dark for max contrast.
          Teal-on-navy was visually sinking into the dark gradient. */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-gradient p-12 text-center text-white shadow-lift">
          <h2 className="text-display-md font-semibold tracking-tight">
            Ready to start?
          </h2>
          <p className="mt-4 text-base text-ink-300">
            Get a free AI scan first. No card needed. 24-hour turnaround.
            Or browse the services and pick one that fits.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* Primary: white pill, dark text — high contrast on navy */}
            <a
              href="/scan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-ink-900 shadow-md transition-all duration-200 hover:bg-ink-50 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
            >
              Get a free AI scan
              <ArrowRight className="h-4 w-4" />
            </a>
            {/* Secondary: outlined-on-dark for definition */}
            <a
              href="/services"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-base font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
            >
              Browse services
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
