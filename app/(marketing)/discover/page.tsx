import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import {
  breadcrumbJsonLd,
  articleJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { DiscoveryForm } from "@/components/discovery-form";
import { AuthorByline } from "@/components/author-byline";
import { discoveryQuestions } from "@/lib/discovery-questions";
import { Clock, Lock, Mail, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Free SEO + AI Visibility Scan — 10-min Intake for Medical, Legal & Industrial Firms",
  description:
    "Want more customers from Google + AI? Tell us about your business in 10 minutes — get a personalised SEO + AI Visibility report within 24 hours. Free, no card. Built for medical practices, law firms, and industrial businesses.",
  alternates: { canonical: `${site.url}/discover` },
};

// FAQs about the discovery process — phrased in the language buyers
// actually search. Some use SEO/Google terms (what most people Google
// today), some use AEO/AI terms (the emerging category). Maximum
// long-tail coverage. Wrapped in FAQPage JSON-LD for AI citation.
const discoveryMetaFaqs = [
  {
    q: "What questions should I expect when working with an SEO + AI search consultant?",
    a: "A thorough SEO + AI Visibility consultant asks about 15 questions across 7 areas: your business and website, the services you sell, your ideal customer and service area, your top 3 competitors, the exact words customers would Google to find you, what you have set up online today (Google Business Profile, reviews, LinkedIn, industry directories), and where to send your personalised report. The full list is public on this page so you can read them before committing 10 minutes.",
  },
  {
    q: "How long does the free SEO + AI Visibility intake take?",
    a: "About 10 minutes. The form is multi-step with sector-specific questions for medical, legal, and industrial businesses. It auto-saves to your browser as you go — so you can pause and come back without losing your answers.",
  },
  {
    q: "Why do you ask about my competitors in the intake form?",
    a: "Google and AI engines (ChatGPT, Claude, Gemini, Perplexity) compare businesses against each other. When a customer searches 'best cardiologist in Sandton,' the answer goes to whoever has the strongest combination of website, Google Business Profile, reviews, and industry citations. Knowing your top 3 competitors lets us show you exactly where you're behind — and the fastest way to catch up.",
  },
  {
    q: "What's the difference between this intake and the free AI scan at /scan?",
    a: "The free AI scan at /scan takes 30 seconds and tests how AI engines respond to your business name + city today. It's a quick snapshot. This intake takes 10 minutes and captures everything we need — services, customers, competitors, goals, current setup — to send you a personalised SEO + AI Visibility report within 24 hours, with a clear recommendation on what to fix first.",
  },
  {
    q: "What do I need to prepare before starting the intake form?",
    a: "Have these handy: your business name + website URL, your top 3 services, your top 3 competitor URLs (or names), 3-5 search queries customers would type to find you, the rough value of one typical customer/contract, and your service area cities. Sector-specific: medical practices add medical aid plans accepted, law firms add LSSA listing status, industrial firms add BBBEE Level + certifications.",
  },
  {
    q: "Will my answers be kept private?",
    a: "Yes. Your specific answers are private and used only to prepare your personalised report. The questions themselves are public on the page — that's transparency about the methodology — but your answers stay confidential. We never share, never sell, never enrol you in a sales sequence without explicit opt-in. One-click unsubscribe on any future email.",
  },
  {
    q: "Will you try to sell me a monthly retainer after the report?",
    a: "No automatic pitch. We send the report within 24 hours with our honest read on where you are, what to fix first, and which of our packages (if any) would suit you. If we're not the right fit for your business right now, we'll honestly say so. If you want to talk about it on a free 20-min call, you ask for it — we don't push.",
  },
  {
    q: "How is The Real Estate Method different from regular SEO?",
    a: "Regular SEO focuses on Google rankings only. The Real Estate Method covers all 7 properties customers actually use to find businesses today: your website + Google rankings, Google Business Profile, LinkedIn, industry directories, reviews, industry press, AND the new layer of AI engines (ChatGPT, Claude, Gemini, Perplexity). Most SEO agencies still only do 1-2 of these. We do all 7 — because that's where modern customers actually look.",
  },
];

const valueProps = [
  {
    icon: Clock,
    title: "10 minutes",
    body: "Multi-step. Auto-saves as you go. Close the tab and come back — your answers are kept.",
  },
  {
    icon: Mail,
    title: "Free SEO + AI report",
    body: "Within 24 hours: where you rank on Google + AI engines, what's leaking, and the highest-leverage thing to fix first.",
  },
  {
    icon: Award,
    title: "Same questions we ask paying clients",
    body: "Not a marketing form — the actual intake we use for every project. The depth is the difference.",
  },
  {
    icon: Lock,
    title: "Public + private",
    body: "Your answers stay private. The questions are public — read them before you commit. Transparency before trust.",
  },
];

export default function DiscoverPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "The Real Estate Discovery", href: "/discover" },
          ]),
          articleJsonLd({
            url: `${site.url}/discover`,
            headline: "Free SEO + AI Visibility Intake — 10-min Discovery for Medical, Legal & Industrial Firms",
            description:
              "What questions does an SEO + AI consultant ask before working with you? These 15. 10-minute interactive intake. Free. Personalised report within 24 hours.",
            datePublished: "2026-05-02",
          }),
          // FAQPage schema — direct AI engine citation target for queries
          // like 'what does an AEO consultant ask' / 'how long does an AEO
          // intake take' / 'AEO Discovery vs scan'
          faqJsonLd(discoveryMetaFaqs),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">
            Free intake · The Real Estate Method
          </Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Want more customers from
            <br />
            <span className="text-ink-500">Google AND AI?</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Tell us about your business in 10 minutes — your services, your
            customers, your competitors, what you want to rank for — and
            we&apos;ll email you a personalised SEO + AI Visibility report
            within 24 hours. Free, no card, no sales pressure. Built for
            medical, legal, and industrial firms.
          </p>

          {/* Value props grid */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((vp) => (
              <div
                key={vp.title}
                className="rounded-2xl border border-rule bg-white p-5 text-left shadow-soft"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-700">
                  <vp.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink-900">
                  {vp.title}
                </h3>
                <p className="mt-1 text-xs text-ink-600 leading-relaxed">
                  {vp.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* PREVIEW the questions before starting — pure AEO/GEO content.
          Visible, indexable, citable by AI engines. Reduces form friction
          (transparency = trust) AND adds an indexable list of long-tail
          questions to the page. */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10">
          <Eyebrow>Preview the questions</Eyebrow>
          <h2 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
            What does a good SEO + AI consultant ask before starting?
          </h2>
          <p className="mt-4 text-base text-ink-600 leading-relaxed">
            These 15 questions. They cover the 7 areas that actually
            move the needle: your business, your services, your
            customers, your competitors, what you want to rank for, what
            you have set up online, and where to send the report.
            Sector-specific questions branch in for medical, legal, or
            industrial firms. Read them before committing your 10
            minutes — that&apos;s transparency.
          </p>

          <details className="group mt-6">
            <summary className="flex cursor-pointer items-center justify-between rounded-xl border border-rule bg-ink-50/60 px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-accent-50 hover:text-accent-700">
              See all 15+ questions (sector-branched)
              <span className="text-accent-600 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>

            <div className="mt-6 space-y-8">
              {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => {
                const stepQs = discoveryQuestions.filter(
                  (q) => q.step === stepNum,
                );
                if (stepQs.length === 0) return null;
                return (
                  <div key={stepNum}>
                    <div className="text-xs font-mono font-semibold uppercase tracking-[0.14em] text-accent-600">
                      Step {stepNum} of 7
                    </div>
                    <ol className="mt-3 space-y-3">
                      {stepQs.map((q, idx) => {
                        const sectorTag =
                          q.sector === "all"
                            ? null
                            : q.sector === "medical"
                              ? "Medical"
                              : q.sector === "legal"
                                ? "Legal"
                                : "Industrial";
                        return (
                          <li
                            key={q.id}
                            className="rounded-xl border border-rule bg-white p-4"
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink-100 font-mono text-[10px] font-bold text-ink-600">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-ink-900 leading-snug md:text-base">
                                  {q.question}
                                </p>
                                {q.context && (
                                  <p className="mt-1.5 text-xs text-ink-500 leading-relaxed">
                                    {q.context}
                                  </p>
                                )}
                                {sectorTag && (
                                  <span className="mt-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-700">
                                    {sectorTag}-specific
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-xs italic text-ink-500">
              These questions are public on purpose. Most agencies hide
              their intake forms behind a sales call. We don&apos;t. The
              quality of the questions IS the proof of the methodology —
              if they don&apos;t look like the right questions to ask
              about your business, we&apos;re not the right fit and
              you&apos;ve saved yourself a discovery call.
            </p>
          </details>
        </div>
      </Section>

      {/* The form */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="mb-8">
          <AuthorByline />
        </div>
        <DiscoveryForm />
      </Section>

      {/* FAQ — meta-questions about the discovery itself. Phrased in
          the language buyers actually Google. FAQPage schema is wrapped
          in JsonLd above so AI engines can cite the answers directly. */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Frequently asked</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Questions about working with us.
        </h2>
        <p className="mt-4 text-base text-ink-500 leading-relaxed">
          Common questions business owners ask before booking an SEO + AI
          Visibility audit.
        </p>

        <div className="mt-10 space-y-3">
          {discoveryMetaFaqs.map((faq) => (
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

      {/* Trust footer */}
      <Section variant="tinted" padding="default" containerSize="narrow">
        <div className="prose-kabelo max-w-none">
          <h2>Why we ask 15 questions and not 4</h2>
          <p>
            The 30-second free scan at{" "}
            <Link href="/scan">kabelomore.com/scan</Link> checks how AI engines
            respond to your business today. Useful — but limited. It&apos;s
            a snapshot.
          </p>
          <p>
            This deeper intake gets us to a real plan. By the time you finish,
            we know your services, your competitors, the exact queries you
            want to rank for, your goals, and what&apos;s already set up. The
            report we send back covers Google rankings + Google Business
            Profile + reviews + LinkedIn + industry directories + AI engines
            (ChatGPT, Claude, Gemini, Perplexity) — with specific
            recommendations for YOUR business.
          </p>
          <p>
            10 minutes here. 5 minutes reading the response. That 15-minute
            investment typically saves months of guessing about what to fix
            first — and which agency to spend money with.
          </p>

          <h2>What happens after you submit</h2>
          <ol>
            <li>
              <strong>Within 1 hour:</strong> we email you a copy of your
              answers (so you have a record of what you said).
            </li>
            <li>
              <strong>Within 24 hours:</strong> personalised SEO + AI
              Visibility report covering where you rank now, your gaps versus
              competitors, the highest-leverage fix, and an honest
              recommendation on what to do next.
            </li>
            <li>
              <strong>Optional:</strong> want to talk through it on a free 20-
              min call? Reply with a time that works. No pitch, no pressure.
              If we&apos;re not the right fit for your business, we&apos;ll
              honestly say so.
            </li>
          </ol>

          <p className="text-xs italic text-ink-500">
            Your answers stay private. We never share your data, never sell
            your email, never add you to a sales sequence without explicit
            opt-in. The information is for us to send you the report you asked
            for. Full stop.
          </p>
        </div>
      </Section>
    </>
  );
}
