import { Suspense } from "react";
import { ScanResultsClient } from "@/components/scan-results-client";

/**
 * Results page is a server component shell that wraps the client-side
 * results renderer in a Suspense boundary. The client component reads
 * the result from sessionStorage (set by the scan form on success) OR
 * fetches from /api/scan/[id]/status if KV is configured and we landed
 * here fresh (e.g. shared URL, refresh).
 */

export const metadata = {
  title: "Your AI Visibility Scan Results",
  description:
    "Your custom AI Visibility scan results — customer-style queries run via Claude with live web search as a proxy for ChatGPT, Gemini, and Perplexity. Score, classification, ranked issues, and recommended next steps.",
  // Results pages contain personal business data — keep out of search index
  robots: { index: false, follow: false },
};

export default async function ScanResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="py-24 text-center text-ink-500">Loading your results…</div>}>
      <ScanResultsClient scanId={id} />
    </Suspense>
  );
}
