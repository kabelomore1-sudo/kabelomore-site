import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { DiscoveryForm } from "@/components/discovery-form";
import { AuthorByline } from "@/components/author-byline";
import { Clock, Lock, Mail, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "The Real Estate Discovery — Free 10-min AEO Intake",
  description:
    "Tell us about your firm in 10 minutes — we'll send you a personalised AEO Discovery summary within 24 hours. Free, no card. Built for medical, legal, and industrial firms running The Real Estate Method.",
  alternates: { canonical: `${site.url}/discover` },
};

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
              "10-minute interactive intake form. Free. Personalised AEO summary within 24 hours.",
            datePublished: "2026-05-02",
          }),
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

      {/* The form */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="mb-8">
          <AuthorByline />
        </div>
        <DiscoveryForm />
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
