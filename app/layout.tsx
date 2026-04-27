import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { JsonLd } from "@/components/ui/jsonld";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} — ${site.tagline}`,
    template: `%s — ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.brand,
  keywords: [
    "GEO specialist",
    "Generative Engine Optimization",
    "AEO consultant",
    "Answer Engine Optimization",
    "AI Search Visibility",
    "LLM Visibility",
    "Schema Markup",
    "JSON-LD",
    "ChatGPT visibility",
    "Claude visibility",
    "Gemini visibility",
    "Perplexity SEO",
    "AI search consultant",
    "GEO consultant South Africa",
    "AEO specialist UK",
    "Pretoria AI consultant",
    "BBBEE digital marketing",
    "industrial AEO",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: site.url,
    siteName: site.brand,
    title: `${site.brand} — ${site.tagline}`,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.brand} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: site.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <JsonLd data={organizationJsonLd()} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <StickyMobileCta />
      </body>
    </html>
  );
}
