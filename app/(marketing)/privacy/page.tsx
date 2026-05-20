import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

/**
 * /privacy — Privacy Notice.
 *
 * Written as plain-English compliance disclosure for POPIA (South
 * Africa) and GDPR (EU/UK prospects). Names every actual processor
 * the site uses today. No "your privacy is important to us" boilerplate
 * — readable, honest, specific.
 *
 * Last-updated date is set as a hard-coded string so it only changes
 * when the policy actually changes (NOT a build-time timestamp — that
 * would flap on every deploy and lose the audit signal).
 *
 * Indexed in search results on purpose: compliance signal + AI engines
 * see it. No noindex.
 */

const LAST_UPDATED = "16 May 2026";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Kabelomore collects, uses, stores, and shares your data. Plain-English POPIA and GDPR disclosure naming every processor.",
  alternates: { canonical: `${site.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Privacy Notice", href: "/privacy" },
        ])}
      />

      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Privacy Notice</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            How we handle your data.
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Plain English. No dark patterns. Every third party we share
            data with is named below.
          </p>
          <p className="mt-3 text-sm text-ink-400">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </Section>

      <Section variant="default" padding="lg" containerSize="narrow">
        <article className="prose-kabelomore space-y-12 text-base text-ink-700 leading-relaxed">
          {/* ─── 1. Who we are ─────────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              1. Who we are
            </h2>
            <p className="mt-4">
              This site is operated by <strong>Kabelo More</strong>{" "}
              trading as <em>Kabelo More — AI Visibility Consulting</em>,
              based in {site.contact.location}. For the purposes of
              POPIA (Protection of Personal Information Act, South
              Africa) and GDPR (General Data Protection Regulation,
              applicable to EU/UK visitors), Kabelo More is the{" "}
              <strong>responsible party / data controller</strong> for
              any personal information collected through this site.
            </p>
            <p className="mt-4">
              Privacy queries:{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-accent-600 hover:text-accent-700"
              >
                {site.contact.email}
              </a>
              .
            </p>
          </section>

          {/* ─── 2. What we collect ────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              2. What we collect
            </h2>

            <h3 className="mt-6 text-lg font-semibold text-ink-900">
              When you submit a Free AI Visibility Scan
            </h3>
            <p className="mt-3">
              We ask for what we need to run the scan and email you the
              result: business name, your name, email address,
              (optionally) phone number, industry, location, website
              and social URLs, and a free-text description of the
              services you offer. We may also infer publicly-available
              information about your business from search results
              during the scan.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-ink-900">
              When you subscribe to the newsletter
            </h3>
            <p className="mt-3">
              Just your email address, plus the source page so we know
              which content prompted you to subscribe.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-ink-900">
              When you browse the site
            </h3>
            <p className="mt-3">
              Two analytics tools record how you use the site:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Microsoft Clarity</strong> records anonymised
                session replays (mouse movement, scroll, clicks),
                heatmaps, and aggregate behavioural insights. Clarity
                automatically masks form inputs and sensitive text by
                default. We use Clarity to find usability bugs and
                understand what visitors actually do — not to identify
                individuals.
              </li>
              <li>
                <strong>Google Analytics 4 (GA4)</strong> records
                pseudonymous behavioural events (page views, clicks,
                referrer, approximate location at city level, device
                type).
              </li>
            </ul>
            <p className="mt-3">
              Neither tool sees the data you type into the scan form
              while you&apos;re typing — that submission is captured
              separately when you click submit. Our admin dashboard
              and any URL that contains an admin authentication token
              are <strong>excluded from Clarity recording entirely</strong>{" "}
              by code-level guards.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-ink-900">
              Server logs
            </h3>
            <p className="mt-3">
              Standard web-server logs (IP address, user agent,
              timestamp, requested URL) are retained transiently by
              our hosting provider for operational and security
              purposes. We don&apos;t use these for marketing or
              profiling.
            </p>
          </section>

          {/* ─── 3. Why we collect it ──────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              3. Why we collect it (purposes + lawful basis)
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <strong>Delivering your scan</strong> — contract /
                performance of a service you requested. Without this
                data we can&apos;t run the scan or email the result.
              </li>
              <li>
                <strong>Replying to your enquiries</strong> — legitimate
                interest (responding to people who contact us).
              </li>
              <li>
                <strong>Improving the site</strong> — legitimate interest
                (fixing bugs, understanding what works). Analytics and
                session replays are aggregated, not used for individual
                profiling or advertising decisions.
              </li>
              <li>
                <strong>Sending you the newsletter</strong> — only with
                your explicit consent (your email opt-in). You can
                unsubscribe at any time from a link inside every
                newsletter we send.
              </li>
              <li>
                <strong>Operating the business</strong> — security,
                fraud prevention, legal obligations.
              </li>
            </ul>
            <p className="mt-4">
              We <strong>do not</strong> sell your data, rent it,
              barter it, or share it with brokers. Ever. We don&apos;t
              build advertising profiles of you.
            </p>
          </section>

          {/* ─── 4. Who else processes your data ───────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              4. Who else processes your data
            </h2>
            <p className="mt-4">
              We use the following operators / sub-processors. Each
              operates under its own published privacy terms; we
              don&apos;t share more than the listed purpose requires.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-rule bg-ink-50/40 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="px-4 py-3">Processor</th>
                    <th className="px-4 py-3">What they do</th>
                    <th className="px-4 py-3">Where data sits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink-700">
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      Microsoft Clarity
                    </td>
                    <td className="px-4 py-3">
                      Session replays, heatmaps, behavioural insights
                    </td>
                    <td className="px-4 py-3">Microsoft Azure (global)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      Google Analytics 4
                    </td>
                    <td className="px-4 py-3">
                      Pseudonymous usage analytics
                    </td>
                    <td className="px-4 py-3">Google (global)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      Resend
                    </td>
                    <td className="px-4 py-3">
                      Transactional email delivery (confirmations, scan
                      reports, replies)
                    </td>
                    <td className="px-4 py-3">USA / EU</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      Anthropic
                    </td>
                    <td className="px-4 py-3">
                      Powers the AI scan engine (Claude + live web
                      search). Processes your business profile during
                      a scan; doesn&apos;t see anything outside the
                      scan inputs.
                    </td>
                    <td className="px-4 py-3">USA</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      Google Places API
                    </td>
                    <td className="px-4 py-3">
                      Looks up your Google Business Profile to read
                      public rating, reviews, categories, hours
                    </td>
                    <td className="px-4 py-3">Google (global)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      Vercel
                    </td>
                    <td className="px-4 py-3">
                      Hosting, edge delivery, and KV storage of scan
                      submissions + results
                    </td>
                    <td className="px-4 py-3">USA / EU</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink-900">
                      Upstash (via Vercel KV)
                    </td>
                    <td className="px-4 py-3">
                      Backing store for scan data (Redis)
                    </td>
                    <td className="px-4 py-3">USA / EU</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-ink-500">
              Several of these processors are based in the United
              States. Where applicable, transfers rely on Standard
              Contractual Clauses (GDPR) and POPIA s72 conditions for
              cross-border transfers (binding agreements + adequate
              protection in the recipient&apos;s domestic law).
            </p>
          </section>

          {/* ─── 5. Cookies ────────────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              5. Cookies and similar technologies
            </h2>
            <p className="mt-4">
              We use a small number of cookies. Plain list:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              <li>
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-sm">
                  kabelomore_admin
                </code>{" "}
                — strictly necessary. Used only on{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-sm">
                  /admin/*
                </code>{" "}
                to keep the admin signed in. HttpOnly + Secure + SameSite=Strict.
                30-day expiry. Visitors never receive this.
              </li>
              <li>
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-sm">
                  _ga
                </code>{" "}
                /{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-sm">
                  _ga_*
                </code>{" "}
                — Google Analytics 4. Pseudonymous client ID for usage
                analytics.
              </li>
              <li>
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-sm">
                  _clck
                </code>{" "}
                /{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-sm">
                  _clsk
                </code>{" "}
                /{" "}
                <code className="rounded bg-ink-50 px-1.5 py-0.5 text-sm">
                  CLID
                </code>{" "}
                — Microsoft Clarity. Anonymous session identifiers and
                replay tracking.
              </li>
            </ul>
            <p className="mt-4 text-sm text-ink-500">
              You can clear these at any time from your browser&apos;s
              cookie settings. We do not currently show a cookie consent
              banner — analytics and session replay are configured under
              legitimate interest with the masking and minimisation
              described in section 2. If you prefer not to be tracked
              by analytics, use your browser&apos;s &ldquo;Do Not
              Track&rdquo; / Global Privacy Control setting or a
              tracker-blocking extension; we will treat these as a
              valid objection signal.
            </p>
          </section>

          {/* ─── 6. How long we keep it ────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              6. How long we keep your data
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Scan submissions and results:</strong> 30 days
                in our storage, then automatically deleted.
              </li>
              <li>
                <strong>Email correspondence:</strong> retained as long
                as needed to handle your enquiry, then archived per
                normal business retention.
              </li>
              <li>
                <strong>Newsletter subscriptions:</strong> until you
                unsubscribe.
              </li>
              <li>
                <strong>Analytics data:</strong> per the default
                retention of GA4 and Clarity (typically 14 months and
                up to ~13 months respectively). We don&apos;t extend
                these.
              </li>
              <li>
                <strong>Invoiced engagements:</strong> kept as long
                as tax and accounting law require (typically 5 years
                in SA).
              </li>
            </ul>
          </section>

          {/* ─── 7. Your rights ────────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              7. Your rights
            </h2>
            <p className="mt-4">
              Under POPIA and GDPR you have the right to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Access</strong> — ask what data we hold about
                you and get a copy.
              </li>
              <li>
                <strong>Correct</strong> — fix anything inaccurate.
              </li>
              <li>
                <strong>Delete</strong> — ask us to remove your data
                (subject to tax / legal retention).
              </li>
              <li>
                <strong>Object</strong> — to processing based on
                legitimate interest, including analytics.
              </li>
              <li>
                <strong>Withdraw consent</strong> — for anything that
                relied on your consent (newsletter, etc.).
              </li>
              <li>
                <strong>Portability</strong> — get your data in a
                machine-readable form.
              </li>
              <li>
                <strong>Lodge a complaint</strong> — with the South
                African Information Regulator (
                <a
                  href="https://inforegulator.org.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-600 hover:text-accent-700"
                >
                  inforegulator.org.za
                </a>
                ) or your local EU/UK data protection authority.
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these, email{" "}
              <a
                href={`mailto:${site.contact.email}?subject=Privacy%20request`}
                className="text-accent-600 hover:text-accent-700"
              >
                {site.contact.email}
              </a>{" "}
              with the subject line &ldquo;Privacy request&rdquo;.
              We respond within 30 days (usually much sooner).
            </p>
          </section>

          {/* ─── 8. Security ───────────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              8. Security
            </h2>
            <p className="mt-4">
              The site runs over HTTPS. Scan submissions are stored
              with TTL-based deletion (30 days). The admin dashboard
              is gated by a long random token, HttpOnly + Secure +
              SameSite=Strict cookies, and constant-time verification.
              We don&apos;t store passwords from visitors because we
              don&apos;t have visitor accounts. No system is perfect,
              but we apply the principle of collecting only what we
              need and keeping it only as long as we need to.
            </p>
          </section>

          {/* ─── 9. Children ───────────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              9. Children
            </h2>
            <p className="mt-4">
              This is a B2B consulting service. We don&apos;t market
              to or knowingly collect information from anyone under
              18. If you believe a child has submitted information,
              email us and we&apos;ll delete it.
            </p>
          </section>

          {/* ─── 10. Changes ───────────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              10. Changes to this notice
            </h2>
            <p className="mt-4">
              When we change this notice in a material way, we update
              the &ldquo;last updated&rdquo; date at the top. For
              significant changes (e.g. adding a new processor, a new
              category of data, or a new purpose) we&apos;ll also
              flag it in the next newsletter and / or on the homepage.
            </p>
          </section>

          {/* ─── 11. Contact ───────────────────────────────────────── */}
          <section>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900">
              11. Contact
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
                href="/terms"
                className="text-accent-600 hover:text-accent-700"
              >
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </article>
      </Section>
    </>
  );
}
