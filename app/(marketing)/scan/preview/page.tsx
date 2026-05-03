import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { PreviewDashboard } from "@/components/preview-dashboard";

interface PageProps {
  searchParams: Promise<{ sector?: string }>;
}

export const metadata: Metadata = {
  title: "Sample AI Visibility Report — See What Your Scan Looks Like",
  description:
    "Sample AI Visibility report showing what every prospect receives — 5 charts, 4 AI engines tested, 3 ranked recommendations. Personalised version delivered within 24 hours of submission.",
  alternates: { canonical: `${site.url}/scan/preview` },
};

/**
 * /scan/preview — public standalone preview page.
 *
 * Use cases:
 *   1. Marketing — link from LinkedIn / DMs to show prospects what
 *      they'll get before they submit
 *   2. Pre-pitch to OMS-type warm prospects: "Here's what your report
 *      will look like — submit /scan and get the personalised version"
 *   3. Press / press kits — visible reference of deliverable quality
 *
 * Defaults to industrial sector (highest-value vertical) but accepts
 * ?sector=medical or ?sector=legal via query params for sector-specific
 * link sharing.
 */
export default async function ScanPreviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sectorParam = params?.sector?.toLowerCase();

  // Map query param to industry value used by the dashboard
  const industry =
    sectorParam === "medical"
      ? "medical"
      : sectorParam === "legal"
        ? "legal"
        : sectorParam === "industrial"
          ? "industrial-supplier"
          : "industrial-supplier"; // default

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Scan", href: "/scan" },
          { label: "Preview", href: "/scan/preview" },
        ])}
      />

      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-6xl">
          {/* Sector switcher — quick links so you can preview each version */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-ink-500">View sample for:</span>
            <Link
              href="/scan/preview?sector=medical"
              className={`rounded-full border px-4 py-1.5 font-medium transition-colors ${
                sectorParam === "medical"
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-rule bg-white text-ink-700 hover:border-accent-300"
              }`}
            >
              Medical
            </Link>
            <Link
              href="/scan/preview?sector=legal"
              className={`rounded-full border px-4 py-1.5 font-medium transition-colors ${
                sectorParam === "legal"
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-rule bg-white text-ink-700 hover:border-accent-300"
              }`}
            >
              Legal
            </Link>
            <Link
              href="/scan/preview?sector=industrial"
              className={`rounded-full border px-4 py-1.5 font-medium transition-colors ${
                sectorParam === "industrial" || !sectorParam
                  ? "border-accent-500 bg-accent-50 text-accent-700"
                  : "border-rule bg-white text-ink-700 hover:border-accent-300"
              }`}
            >
              Industrial
            </Link>
          </div>

          <PreviewDashboard
            industry={industry}
            businessName="A Sample Business"
            hideSampleLabel
            showMarketingIntro
          />
        </div>
      </Section>
    </>
  );
}
