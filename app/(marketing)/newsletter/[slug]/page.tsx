import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import {
  breadcrumbJsonLd,
  articleJsonLd,
} from "@/lib/seo";
import { site } from "@/lib/site";
import {
  getNewsletterIssue,
  newsletterIssues,
} from "@/lib/newsletter-issues";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { AuthorByline } from "@/components/author-byline";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return newsletterIssues.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = getNewsletterIssue(slug);
  if (!issue) {
    return { title: "Issue not found" };
  }
  return {
    title: `${issue.title} — The AEO Letter Issue ${issue.number}`,
    description: issue.subtitle,
    alternates: { canonical: `${site.url}/newsletter/${issue.slug}` },
    openGraph: {
      title: issue.title,
      description: issue.subtitle,
      url: `${site.url}/newsletter/${issue.slug}`,
      type: "article",
      publishedTime: issue.date,
    },
  };
}

/**
 * Render an issue body — paragraphs separated by blank lines, with a
 * minimal Markdown-lite for **bold** runs (since the body is plain text).
 */
function renderParagraph(text: string, idx: number) {
  // Split on **bold** sequences and render alternately
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={idx} className="text-base text-ink-700 leading-relaxed md:text-lg">
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} className="text-ink-900">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </p>
  );
}

export default async function NewsletterIssuePage({ params }: PageProps) {
  const { slug } = await params;
  const issue = getNewsletterIssue(slug);
  if (!issue) notFound();

  const url = `${site.url}/newsletter/${issue.slug}`;
  const olderIssues = newsletterIssues.filter((i) => i.slug !== issue.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Newsletter", href: "/newsletter" },
            { label: issue.title, href: `/newsletter/${issue.slug}` },
          ]),
          articleJsonLd({
            url,
            headline: issue.title,
            description: issue.subtitle,
            datePublished: issue.date,
          }),
        ]}
      />

      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-2xl">
          <div className="text-sm">
            <Link href="/newsletter" className="text-ink-500 hover:text-ink-700">
              ← The AEO Letter archive
            </Link>
          </div>
          <Eyebrow className="mt-6">
            The AEO Letter · Issue {issue.number}
          </Eyebrow>
          <h1 className="mt-3 text-display-lg font-semibold tracking-tight text-ink-900 md:text-display-xl">
            {issue.title}
          </h1>
          <p className="mt-5 text-lg text-ink-700 leading-relaxed">
            {issue.subtitle}
          </p>
          <div className="mt-8">
            <AuthorByline date={issue.date} />
          </div>
        </div>
      </Section>

      <Section variant="default" padding="lg" containerSize="narrow">
        <article className="prose-kabelo max-w-none">
          <div className="space-y-5 md:space-y-6">
            {issue.body.map((p, idx) => renderParagraph(p, idx))}
          </div>
        </article>

        {issue.cta && (
          <div className="mt-12">
            <Link
              href={issue.cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-base font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-lift"
            >
              {issue.cta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </Section>

      {/* Subscribe at end of read */}
      <Section variant="tinted" padding="default" containerSize="narrow">
        <NewsletterSignup
          variant="card"
          source={`newsletter-issue-${issue.slug}`}
        />
      </Section>

      {/* Older issues */}
      {olderIssues.length > 0 && (
        <Section variant="default" padding="default">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Other issues</Eyebrow>
            <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
              From the archive
            </h2>
          </div>
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {olderIssues.map((i) => (
              <Link
                key={i.slug}
                href={`/newsletter/${i.slug}`}
                className="group block rounded-2xl border border-rule bg-white p-5 transition-all hover:border-accent-300 hover:shadow-card"
              >
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-400">
                  Issue {i.number} ·{" "}
                  {new Date(i.date).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-ink-900 group-hover:text-accent-700">
                  {i.title}
                </h3>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
