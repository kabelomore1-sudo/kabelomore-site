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
