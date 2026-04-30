import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: `${site.url}/blog/${slug}` },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${site.url}/blog/${slug}`,
      type: "article",
      publishedTime: post.frontmatter.date,
      ...(post.frontmatter.updated && { modifiedTime: post.frontmatter.updated }),
      authors: [post.frontmatter.author ?? site.name],
      ...(post.frontmatter.cover && { images: [{ url: post.frontmatter.cover }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    ...(post.frontmatter.updated && { dateModified: post.frontmatter.updated }),
    author: {
      "@type": "Person",
      "@id": `${site.url}/#kabelo`,
      name: post.frontmatter.author ?? site.name,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.brand,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${slug}`,
    },
    ...(post.frontmatter.cover && { image: `${site.url}${post.frontmatter.cover}` }),
    ...(post.frontmatter.category && { articleSection: post.frontmatter.category }),
    ...(post.frontmatter.tags && { keywords: post.frontmatter.tags.join(", ") }),
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.frontmatter.title, href: `/blog/${slug}` },
          ]),
          articleSchema,
        ]}
      />

      {/* Header */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All posts
          </Link>

          <div className="mt-6">
            {post.frontmatter.category && (
              <Eyebrow>{post.frontmatter.category}</Eyebrow>
            )}
            <h1 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
              {post.frontmatter.title}
            </h1>
            <p className="mt-5 text-lg text-ink-500 leading-relaxed">
              {post.frontmatter.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-500">
              <span>
                By{" "}
                <span className="font-semibold text-ink-700">
                  {post.frontmatter.author ?? site.name}
                </span>
              </span>
              <span aria-hidden>·</span>
              <time dateTime={post.frontmatter.date}>
                {formatDate(post.frontmatter.date)}
              </time>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Body */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <article className="prose-kabelo max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Tags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-12 border-t border-rule pt-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Tagged
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* CTA */}
      <Section variant="tinted" padding="default">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-gradient p-10 text-center text-white shadow-lift md:p-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Want to know what AI says about your business?
          </h2>
          <p className="mt-4 text-base text-ink-300">
            24-hour turnaround. No card needed. We test you across 4 AI engines
            and send a 2-page PDF report.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/scan" variant="ink" size="lg">
              Get a free AI scan <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/blog"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              More posts
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
