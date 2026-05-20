import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * /terms — Terms of Service.
 *
 * Minimal, real, plain-English. Scoped to what this site actually
 * provides: a free scan, marketing pages, and a newsletter. Paid
 * engagements are governed by their own per-proposal contracts —
 * these terms don't try to override those.
 *
 * Last-updated date is hard-coded; only changes when the terms
 * actually change.
 */

const LAST_UPDATED = "16 May 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use kabelomore.com — the free AI Visibility Scan, the newsletter, and the marketing site.",
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Terms", href: "/terms" },
        ])}
      />

      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Terms of Service</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            What you can expect from us. What we ask of you.
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Short, plain English. No fine print. Paid engagements have
            their own contracts — these terms govern the website,
            the free scan, and the newsletter.
          </p>
          <p className="mt-3 text-sm text-ink-400">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </Section>

      <Section variant="default" padding="lg" containerSize="narrow">
        <article className="space-y-12 text-base text-ink-700 leading-relaxed">
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              1. Who these terms apply to
            </h2>
            <p className="mt-4">
              These terms govern your use of <strong>kabelomore.com</strong>{" "}
              and the free services it provides — the AI Visibility
              Scan, the newsletter, and the marketing content. By
              using the site you accept these terms.
            </p>
            <p className="mt-4">
              Paid engagements (audits, packages, retainers) are
              governed by a separate written proposal and statement
              of work you sign with us. Where a paid-engagement
              contract conflicts with these terms,{" "}
              <strong>that contract wins</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              2. The Free AI Visibility Scan
            </h2>
            <p className="mt-4">
              The free scan is provided in good faith and at no cost.
              Specifically:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                We currently use Claude (Anthropic) with live web
                search as a proxy for ChatGPT, Gemini and Perplexity.
                Native engine adapters land in Phase 1.5. We disclose
                this methodology on the scan page and in the report.
              </li>
              <li>
                AI search results change daily. A scan is a snapshot
                of what AI engines were saying when we ran it — not
                a contractual guarantee of where you stand at any
                later moment.
              </li>
              <li>
                We don&apos;t guarantee a specific score, ranking,
                or commercial outcome. The fixes we recommend are
                based on observed patterns and standard AEO practice.
              </li>
              <li>
                We may decline to run a scan if the business appears
                fraudulent, illegal, or otherwise contrary to our
                values. We&apos;ll tell you if we do, and why.
              </li>
              <li>
                There&apos;s no follow-up call unless you ask for
                one. We don&apos;t add you to a marketing list
                without your explicit consent (see the{" "}
                <Link
                  href="/privacy"
                  className="text-accent-600 hover:text-accent-700"
                >
                  Privacy Notice
                </Link>
                ).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              3. Accuracy of the information you provide
            </h2>
            <p className="mt-4">
              You confirm that the business you submit to the scan
              is yours (or you&apos;re authorised to act on its
              behalf), and that the information you provide is
              accurate. We rely on what you submit to run the scan;
              we can&apos;t deliver a useful report from invented
              business data.
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              4. Intellectual property
            </h2>
            <p className="mt-4">
              The content on this site — articles, methodologies
              (including <em>The Real Estate Method™</em>),
              illustrations, code, and the scan report format — is
              ours. You&apos;re welcome to reference, quote, and
              link to it with attribution.
            </p>
            <p className="mt-4">
              The <strong>contents of your scan report</strong> —
              the specific findings about your business — are yours
              to use however you like (internally, with your team,
              with another agency, anywhere). We don&apos;t claim
              ownership over your business&apos; data.
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              5. Acceptable use
            </h2>
            <p className="mt-4">
              Please don&apos;t use the site to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Submit scans for businesses you don&apos;t represent
                or aren&apos;t authorised to scan.
              </li>
              <li>
                Spam the scan form, the newsletter, or any other
                submission flow.
              </li>
              <li>
                Probe, scrape, or attempt to bypass authentication
                on any part of the site (including{" "}
                <code className="rounded bg-ink-50 px-1 py-0.5 text-sm">
                  /admin/*
                </code>
                ).
              </li>
              <li>Do anything illegal under South African law.</li>
            </ul>
            <p className="mt-4">
              We reserve the right to block access, refuse to run a
              scan, or report abuse to the relevant authorities.
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              6. Limitation of liability
            </h2>
            <p className="mt-4">
              The site and the free scan are provided{" "}
              <strong>&ldquo;as is&rdquo;</strong>. To the maximum
              extent permitted by law, we are not liable for
              indirect, incidental, special or consequential losses
              arising from your use of the site or reliance on the
              free scan — including lost revenue, lost
              opportunities, or business decisions made on the basis
              of the report.
            </p>
            <p className="mt-4">
              For paid engagements the liability terms in your
              signed proposal apply, not this clause.
            </p>
            <p className="mt-4 text-sm text-ink-500">
              Nothing in these terms excludes liability that
              can&apos;t lawfully be excluded — for example, liability
              for fraud or for breaches of consumer-protection
              statute under South African law.
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              7. Newsletter
            </h2>
            <p className="mt-4">
              Subscribing is opt-in. You can unsubscribe at any time
              using the link in every email. We won&apos;t share your
              address with anyone outside the processors named in
              the{" "}
              <Link
                href="/privacy"
                className="text-accent-600 hover:text-accent-700"
              >
                Privacy Notice
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              8. Governing law
            </h2>
            <p className="mt-4">
              These terms are governed by the laws of the Republic
              of South Africa. Disputes you can&apos;t resolve with
              us by email will be handled by the courts of South
              Africa.
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              9. Changes
            </h2>
            <p className="mt-4">
              We update these terms occasionally. The &ldquo;last
              updated&rdquo; date at the top moves when we do. For
              material changes we&apos;ll flag it in the newsletter
              or on the homepage.
            </p>
          </section>

          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              10. Contact
            </h2>
            <p className="mt-4">
              Kabelo More — AI Visibility Consulting
              <br />
              {site.contact.location}
              <br />
              <a
                href={`mailto:${site.contact.email}`}
                className="text-accent-600 hover:text-accent-700"
              >
                {site.contact.email}
              </a>
            </p>
            <p className="mt-6 text-sm text-ink-500">
              See also: our{" "}
              <Link
                href="/privacy"
                className="text-accent-600 hover:text-accent-700"
              >
                Privacy Notice
              </Link>
              .
            </p>
          </section>
        </article>
      </Section>
    </>
  );
}
