import { site } from "./site";

/**
 * Build an Organization JSON-LD object — applied site-wide.
 * Surfaces Kabelomore as a Person, the consulting service as an Organization,
 * and the NPC as a separate verifiable entity.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.brand,
    legalName: "Kabelo More — AI Visibility Consulting",
    description: site.description,
    url: site.url,
    email: site.contact.email,
    image: `${site.url}${site.ogImage}`,
    telephone: "",
    founder: {
      "@type": "Person",
      "@id": `${site.url}/#kabelo`,
      name: site.name,
      jobTitle: "AI Visibility Consultant",
      url: site.url,
      sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pretoria",
      addressCountry: "ZA",
    },
    areaServed: [
      { "@type": "Country", name: "South Africa" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United States" },
    ],
    serviceType: "AI Visibility / Answer Engine Optimisation (AEO) Consulting",
    sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
  };
}

/**
 * Build a Service-shaped JSON-LD entry for any of the pricing tiers.
 */
export function serviceJsonLd(tier: {
  name: string;
  description: string;
  price?: { intl: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: tier.name,
    description: tier.description,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: ["South Africa", "United Kingdom", "United States"],
    ...(tier.price?.intl
      ? {
          offers: {
            "@type": "Offer",
            price: tier.price.intl,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/**
 * Build a FAQPage JSON-LD entry from a Q&A list. Strong AEO signal —
 * AI engines love structured Q&A content.
 */
export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/**
 * Build a HowTo JSON-LD entry. Strong AEO signal for guides + checklists —
 * AI engines treat HowTo content as procedural authority and cite it
 * heavily for 'how do I improve X' queries.
 */
export function howToJsonLd(input: {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, e.g. 'PT2H30M'
  toolsRequired?: string[];
  steps: { name: string; text: string; url?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    ...(input.toolsRequired && input.toolsRequired.length > 0
      ? {
          tool: input.toolsRequired.map((name) => ({
            "@type": "HowToTool",
            name,
          })),
        }
      : {}),
    step: input.steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

/**
 * Build an Article JSON-LD entry. For long-form authoritative content
 * like checklists, guides, and case studies.
 */
export function articleJsonLd(input: {
  url: string;
  headline: string;
  description: string;
  datePublished: string; // ISO 8601
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { "@id": `${site.url}/#kabelo` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };
}

/**
 * Build a Breadcrumb JSON-LD entry. Helps AI engines understand site
 * structure when answering category questions.
 */
export function breadcrumbJsonLd(
  items: { label: string; href: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      item: `${site.url}${item.href}`,
    })),
  };
}
