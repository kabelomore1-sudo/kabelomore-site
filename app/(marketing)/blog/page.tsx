import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { ArrowRight, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Build-in-public notes on AI Visibility, AEO methodology, and what's actually moving in AI search. Plus live case studies from real client work.",
  alternates: { canonical: `${site.url}/blog` },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ])}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Blog & Insights</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Notes from
            <br />
            <span className="text-ink-500">building in public.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            What&apos;s actually moving in AI search, what we&apos;re learning from
            real client work, and the occasional hike-talk on long-term thinking.
          </p>
        </div>
      </Section>

      {/* Posts list */}
      <Section variant="default" padding="lg" containerSize="narrow">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-rule bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                  <time dateTime={post.frontmatter.date}>
                    {formatDate(post.frontmatter.date)}
                  </time>
                  {post.frontmatter.category && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="font-mono uppercase tracking-wider text-accent-600">
                        {post.frontmatter.category}
                      </span>
                    </>
                  )}
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingMinutes} min read
                  </span>
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-accent-600"
                  >
                    {post.frontmatter.title}
                  </Link>
                </h2>

                <p className="mt-3 text-base text-ink-700 leading-relaxed">
                  {post.frontmatter.description}
                </p>

                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
                  >
                    Read post <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-rule bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">
        <Mail className="h-6 w-6" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
        First posts shipping with the OMS case study results.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-base text-ink-500">
        Every published post here will be cross-posted to LinkedIn first.
        Follow there for daily build-in-public updates.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          href={site.social.linkedin}
          variant="primary"
          size="md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on LinkedIn
        </Button>
        <Button href="/scan" variant="secondary" size="md">
          Get a free AI scan <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
