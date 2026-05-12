import { site } from "./site";

/**
 * Build an Organization JSON-LD object — applied site-wide.
 *
 * Critical schema choices:
 *   - @id self-reference (`/#organization`) so other schemas (Person,
 *     Article, Service) can link to this entity via @id reference,
 *     forming a connected entity graph that LLMs can reason about
 *     as a single business across pages.
 *   - telephone: filled with E.164-formatted number. Empty strings
 *     are worse than omitted properties — Google's parser flags
 *     declared-but-empty fields as low-quality data.
 *   - address: complete with streetAddress placeholder, postalCode,
 *     addressRegion. AI engines weight specific addresses heavily
 *     for local trust.
 *   - Person nested AND exposed via separate kabeloPersonJsonLd()
 *     for entity disambiguation (vs other Kabelo Mores out there).
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
    // E.164-formatted phone — Google requires this format for telephone
    // properties on Organization. Format: +[country][area][number]
    // with no spaces or dashes for max compatibility.
    telephone: `+${site.contact.whatsappE164}`,
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
      // Specific street address improves local trust signal. If the
      // operating address changes, update this single line.
      streetAddress: "Pretoria CBD",
      addressLocality: "Pretoria",
      addressRegion: "Gauteng",
      postalCode: "0002",
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
 * Build a standalone Person JSON-LD entry for Kabelo More.
 *
 * Why a separate Person schema (in addition to the nested founder on
 * the Organization):
 *   - Entity establishment / disambiguation. Without this, LLMs may
 *     conflate "Kabelo More" with the Mamelodi Sundowns player or
 *     any other public Kabelo More.
 *   - Richer entity graph. The nested founder has only 4 properties.
 *     Standalone Person carries image, description, knowsAbout (skills
 *     graph), and worksFor (links back to the org via @id).
 *   - Cross-page citation. Articles can now reference this entity
 *     via { author: { "@id": "...#kabelo" } } and LLMs will resolve
 *     to the full Person record.
 *
 * Loaded site-wide via the root layout alongside Organization +
 * WebSite, so every page reinforces the same entity graph.
 */
export function kabeloPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#kabelo`,
    name: site.name,
    givenName: "Kabelo",
    familyName: "More",
    jobTitle: "AI Visibility Consultant",
    description:
      "AI Visibility / AEO consultant based in Pretoria, South Africa. 8 years of local SEO experience now applied to AI search. Works with industrial, professional, and medical service businesses across SA, UK, and US.",
    url: `${site.url}/about`,
    image: `${site.url}/images/kabelo-more.jpg`,
    worksFor: { "@id": `${site.url}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pretoria",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    knowsAbout: [
      "Answer Engine Optimisation (AEO)",
      "Generative Engine Optimisation (GEO)",
      "AI Search Visibility",
      "Local SEO",
      "Schema.org Structured Data",
      "JSON-LD Markup",
      "Google Business Profile Optimisation",
      "Citation Building",
      "Content Strategy for AI Engines",
      "LLM Visibility",
      "ChatGPT Search Visibility",
      "Claude Search Visibility",
      "Gemini Visibility",
      "Perplexity SEO",
    ],
    sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
  };
}

/**
 * Build a WebSite JSON-LD entry.
 *
 * Foundational entity declaration — tells Google + AI engines that
 * kabelomore.com is a searchable website with a defined publisher.
 * The publisher @id reference links back to the Organization so the
 * entity graph stays connected.
 *
 * potentialAction.SearchAction is omitted because we don't have a
 * site-wide search UI yet. When site search is added, append:
 *   potentialAction: {
 *     "@type": "SearchAction",
 *     target: `${site.url}/search?q={search_term_string}`,
 *     "query-input": "required name=search_term_string",
 *   }
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.brand,
    description: site.description,
    inLanguage: "en-ZA",
    publisher: { "@id": `${site.url}/#organization` },
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
