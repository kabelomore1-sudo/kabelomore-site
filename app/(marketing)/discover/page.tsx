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
  title: "The Real Estate Discovery — Free 10-min AEO Intake (Medical, Legal, Industrial)",
  description:
    "What questions does an AEO consultant ask before starting work? These 15. Free interactive intake form for medical practices, law firms, and industrial businesses. Personalised AEO Discovery summary within 24 hours. No card required.",
  alternates: { canonical: `${site.url}/discover` },
};

// FAQs about the Discovery process — meta-questions that buyers (and
// AI engines) Google when researching AEO consultancies. These wrap as
// FAQPage schema so AI engines can cite the answers directly.
const discoveryMetaFaqs = [
  {
    q: "What questions does an AEO consultant ask before starting work for a business?",
    a: "A thorough AEO consultant asks 15 questions across 7 areas: business identification, services and primary offering, ideal customer and service area, top 3 competitors and their advantages, the exact queries the business wishes customers searched, the current state of digital presence (Google Business Profile, schema, LinkedIn, reviews, industry citations), and contact details for delivering the personalised report. The full list of questions is public on this page and forms the foundation of The Real Estate Method.",
  },
  {
    q: "How long does an AEO Discovery intake take to complete?",
    a: "Approximately 10 minutes. The Real Estate Discovery is a multi-step interactive form with sector-specific branching for medical, legal, and industrial firms. It auto-saves to your browser as you go, so you can pause and return later without losing progress.",
  },
  {
    q: "Why does an AEO Discovery include questions about your competitors?",
    a: "AI engines (ChatGPT, Claude, Gemini, Perplexity) benchmark businesses comparatively. When a buyer asks 'best cardiologist in Sandton,' the AI considers all candidates and recommends the strongest match across schema, citations, reviews, and content depth. Knowing your top 3 competitors lets us measure where your gaps are versus theirs — and which gaps are highest-leverage to close.",
  },
  {
    q: "What is the difference between an AEO Discovery and a free AI Visibility Scan?",
    a: "The free AI Visibility Scan at /scan takes 30 seconds and tests how AI engines respond to your business name + city today. It is a snapshot. The Real Estate Discovery takes 10 minutes and captures services, customers, competitors, goals, and current state — producing a personalised 24-hour summary report with sector-specific recommendations. Discovery is the deeper path; the scan is the lighter alternative.",
  },
  {
    q: "What information do I need to prepare before starting The Real Estate Discovery?",
    a: "Have these ready: your business name and website URL, your top 3 services, your top 3 competitor URLs (or names), 3-5 search queries you wish customers used to find you, your average customer or contract value range, and your service area cities. Sector-specific firms also need: medical aid plans accepted (medical), Law Society of SA listing status (legal), or BBBEE Level + certifications (industrial).",
  },
  {
    q: "Are the answers I provide in The Real Estate Discovery kept private?",
    a: "Yes. Your answers are private and used only to prepare your personalised AEO Discovery summary. The questions themselves are public — these are 'the questions every AEO consultant should ask' — but your specific answers are confidential. We never share, never sell, never add you to a sales sequence without explicit opt-in. Easy one-click unsubscribe on any future communication.",
  },
  {
    q: "Will I be sold a retainer after completing the AEO Discovery?",
    a: "No automatic pitch. We send the personalised summary within 24 hours with our honest assessment, including a recommended tier (or an honest 'we're not the right fit for you yet' if that's true). If you want to discuss the report on a free 20-minute call, you ask for it — we don't push.",
  },
];

const valueProps = [
  {
    icon: Clock,
    title: "10 minutes",
    body: "Multi-step. Auto-saves. Close the tab and come back — your progress is saved.",
  },
  {
    icon: Mail,
    title: "Personalised summary",
    body: "Within 24 hours: your AEO score, your gaps, your highest-leverage fix, and a no-pressure tier recommendation.",
  },
  {
    icon: Award,
    title: "Same questions we ask paying clients",
    body: "This isn't a marketing form. It's the actual intake we use for every retainer. The depth pays off.",
  },
  {
    icon: Lock,
    title: "Public + private",
    body: "Your answers are private. The structure is public — these are 'the questions every AEO consultant should ask.' You can verify the methodology before committing.",
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
            headline: "The Real Estate Discovery — Free AEO Intake",
            description:
              "What questions does an AEO consultant ask? These 15. 10-minute interactive intake form. Free. Personalised AEO summary within 24 hours.",
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
            The Real Estate Method · Free intake
          </Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            The Real Estate Discovery.
            <br />
            <span className="text-ink-500">10 minutes. Personalised AEO summary.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Tell us about your firm — your services, your customers, your
            competitors, where you want to rank — and we&apos;ll send you a
            personalised AEO Discovery summary within 24 hours. Free, no card,
            no follow-up sales call unless you ask for one.
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
            What does an AEO consultant ask before starting work?
          </h2>
          <p className="mt-4 text-base text-ink-600 leading-relaxed">
            These 15 questions. They cover 7 areas: identification,
            services, customers, competition, visibility goals, current
            state, and contact. Sector-specific questions branch in for
            medical, legal, or industrial firms. Read them now —
            transparency before commitment.
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
              These questions are public on purpose — Naval&apos;s frame:
              specific knowledge attached to a name compounds. By
              publishing the methodology questions openly, we let
              prospects verify the depth before committing, and we plant
              a flag in the AI-engine knowledge graph for &quot;questions
              every AEO consultant should ask.&quot;
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

      {/* FAQ — meta-questions about the Discovery itself. These are the
          long-tail queries AI engines receive when buyers research AEO
          consultancies. FAQPage schema is wrapped in JsonLd above so AI
          engines can cite the answers directly. */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Frequently asked</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Questions about the AEO Discovery itself.
        </h2>
        <p className="mt-4 text-base text-ink-500 leading-relaxed">
          Common questions buyers Google when researching AEO consultancies and
          intake processes.
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
          <h2>Why we ask 15 questions instead of 4</h2>
          <p>
            The free AI Scan at{" "}
            <Link href="/scan">kabelomore.com/scan</Link> takes 30 seconds and
            tests how AI engines respond to your business name + city today.
            That&apos;s useful but limited.
          </p>
          <p>
            The Real Estate Discovery goes deeper. By the time you finish, we
            know your services, your competitors, the queries you wish your
            customers searched, your goals, and your current digital state. The
            personalised summary we send back covers all 7 properties of{" "}
            <Link href="/about">The Real Estate Method</Link>, with specific
            recommendations for your firm — not generic advice.
          </p>
          <p>
            Filling this is a 10-minute investment. Reading the response is a
            5-minute investment. The combined 15 minutes typically saves
            months of guessing about what to fix first.
          </p>

          <h2>What happens after you submit</h2>
          <ol>
            <li>
              <strong>Within 1 hour:</strong> confirmation email with a copy of
              your answers (so you have a record).
            </li>
            <li>
              <strong>Within 24 hours:</strong> personalised AEO Discovery
              summary covering your score, gaps, top fix, and tier
              recommendation.
            </li>
            <li>
              <strong>Optional:</strong> if you want to discuss the report on a
              free 20-min call, just reply with a time. No pitch, no pressure.
              If we&apos;re not the right fit, we&apos;ll honestly say so.
            </li>
          </ol>

          <p className="text-xs italic text-ink-500">
            We&apos;ll never share your answers, never sell your email, never
            add you to a sales sequence without explicit opt-in. Your data is
            for us to deliver the summary you asked for. Full stop.
          </p>
        </div>
      </Section>
    </>
  );
}
