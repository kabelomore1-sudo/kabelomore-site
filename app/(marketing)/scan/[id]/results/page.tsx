import { Suspense } from "react";
import type { Metadata } from "next";
import { ScanResultsClient } from "@/components/scan-results-client";
import { getProfile, getResult, getStatus } from "@/lib/storage/scanStore";
import { site } from "@/lib/site";

/**
 * Results page is a server component shell that wraps the client-side
 * results renderer in a Suspense boundary. The client component reads
 * the result from sessionStorage (set by the scan form on success) OR
 * fetches from /api/scan/[id]/status if KV is configured and we landed
 * here fresh (e.g. shared URL, refresh).
 *
 * generateMetadata pulls the scan profile from KV at request time so
 * shared URLs (WhatsApp, LinkedIn, Slack) get a personalised OG card:
 *   - Title: business name + score
 *   - Description: completed-on date + classification
 *   - OG image: the default site OG (per-scan image is a Phase 1.5
 *     follow-up — would need /opengraph-image/scan/[id]/route.tsx
 *     dynamically rendering the score gauge)
 *
 * If the scan doesn't exist or KV is unreachable, we fall back to
 * generic copy without crashing the page.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const fallback: Metadata = {
    title: "Your AI Visibility Scan Results",
    description:
      "Your custom AI Visibility scan results — customer-style queries run via Claude with live web search as a proxy for ChatGPT, Gemini, and Perplexity.",
    robots: { index: false, follow: false },
  };

  try {
    const [profile, status, result] = await Promise.all([
      getProfile(id),
      getStatus(id),
      getResult(id),
    ]);

    if (!profile) return fallback;

    const businessName = profile.businessName;
    const score = result?.score;
    const classification = result?.classification;

    const title =
      status === "complete" && typeof score === "number"
        ? `${businessName} — AI Visibility Score: ${score}/100`
        : `${businessName} — AI Visibility Report`;

    const description =
      status === "complete" && classification
        ? `${businessName} ranked ${classification.replace(/-/g, " ")} for AI search visibility. Honest, hedged, no overclaiming — directional readiness score based on Claude + live web search (proxy for ChatGPT, Gemini, Perplexity).`
        : `${businessName}'s AI Visibility report — customer-style queries run via Claude + live web search proxy. Delivered within 24h of submission.`;

    return {
      title,
      description,
      // Reports contain personal business data — keep out of search
      // index regardless of share-card behaviour. Robots/noindex does
      // NOT prevent og: cards from rendering when the URL is shared in
      // a WhatsApp/LinkedIn/Slack preview, which is what we want.
      robots: { index: false, follow: false, nocache: true },
      openGraph: {
        type: "article",
        url: `${site.url}/scan/${id}/results`,
        title,
        description,
        siteName: site.brand,
        images: [
          {
            url: site.ogImage,
            width: 1200,
            height: 630,
            alt: `${businessName} — AI Visibility Report by ${site.brand}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [site.ogImage],
      },
    };
  } catch (err) {
    // KV outage / parse failure — log + return fallback, never crash
    // the request. SSR resilience matters more than perfect cards.
    console.error("[scan/[id]/results] generateMetadata failed:", err);
    return fallback;
  }
}

export default async function ScanResultsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-ink-500">
          Loading your results…
        </div>
      }
    >
      <ScanResultsClient scanId={id} />
    </Suspense>
  );
}
