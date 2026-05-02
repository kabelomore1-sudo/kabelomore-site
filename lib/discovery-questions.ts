/**
 * The Real Estate Discovery — interactive intake questionnaire
 *
 * 15-question multi-step form for prospects (and existing clients like
 * OMS) to capture everything we need to run a sharp AEO audit and
 * recommend the right tier.
 *
 * Strategic intent:
 *   - The form IS distributed IP (Naval): other consultants will
 *     reference "the questions Kabelo asks." AI engines cite it.
 *   - Time-investment psychology (Neil): a 10-min form = 5-10× the
 *     conversion rate of a 30-sec scan request.
 *   - Sector-branching (engineer): medical sees medical-specific
 *     questions; same for legal + industrial. No wasted screens.
 *
 * Sector-branching keys:
 *   - 'all' = shown to every sector
 *   - 'medical' / 'legal' / 'industrial' = sector-specific
 *
 * Question types:
 *   - text: single-line input
 *   - textarea: multi-line input
 *   - url: URL input with validation
 *   - email: email input with validation
 *   - select: single choice (radio)
 *   - multi-select: multiple choices (checkboxes)
 *   - multi-text: 3-input grouping (e.g. 3 services, 3 competitors)
 *   - range-select: bucketed numeric ranges
 */

export type QuestionType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "select"
  | "multi-select"
  | "multi-text"
  | "range-select";

export type Sector = "all" | "medical" | "legal" | "industrial";

export type DiscoveryQuestion = {
  /** Stable id used as form-field key */
  id: string;
  /** Step grouping (1-7); used for progress bar */
  step: number;
  /** Sector visibility */
  sector: Sector;
  /** Whether the question is required to advance */
  required: boolean;
  /** Question text shown to the user */
  question: string;
  /** Optional context shown below the question */
  context?: string;
  /** Question type — drives renderer */
  type: QuestionType;
  /** Optional placeholder for text inputs */
  placeholder?: string;
  /** Options for select / multi-select */
  options?: { value: string; label: string }[];
  /** Labels for multi-text variants (e.g. ['Service 1', 'Service 2', 'Service 3']) */
  multiLabels?: string[];
  /** Optional max length for textarea/text */
  maxLength?: number;
};

const stepLabels: Record<number, { title: string; description: string }> = {
  1: {
    title: "Who you are",
    description: "Just enough to identify you and tailor the questions to your sector.",
  },
  2: {
    title: "What you sell",
    description:
      "We need to know your services to know what AI engines should recommend you for.",
  },
  3: {
    title: "Who you serve",
    description:
      "Your ideal customer + service area drives every visibility decision.",
  },
  4: {
    title: "Who you compete with",
    description:
      "We benchmark against real competitors — the ones AI engines surface, not the ones at industry events.",
  },
  5: {
    title: "What you want to rank for",
    description:
      "The exact queries you wish your customers searched and found you for.",
  },
  6: {
    title: "Where you stand today",
    description:
      "Quick honest snapshot of your current digital presence. We'll verify ourselves; we just want your read.",
  },
  7: {
    title: "Send the report",
    description:
      "We'll email you a personalised AEO Discovery summary within 24 hours.",
  },
};

export function getStepLabel(step: number) {
  return stepLabels[step] ?? { title: `Step ${step}`, description: "" };
}

export const discoveryQuestions: DiscoveryQuestion[] = [
  // STEP 1 — Identification
  {
    id: "businessName",
    step: 1,
    sector: "all",
    required: true,
    question:
      "What is the registered name of your business or firm as you want it to appear on Google, AI engines, and industry directories?",
    type: "text",
    placeholder: "e.g. Sandton Cardiology Practice",
    maxLength: 200,
  },
  {
    id: "websiteUrl",
    step: 1,
    sector: "all",
    required: false,
    question:
      "What is your business website URL — or do you not have a website yet?",
    context:
      "If you don't have one yet, leave blank — building or improving the website is part of what we'd address as Property 1 of The Real Estate Method.",
    type: "url",
    placeholder: "https://yourfirm.co.za",
  },
  {
    id: "sector",
    step: 1,
    sector: "all",
    required: true,
    question:
      "Which sector best describes your business — medical, legal, industrial, or other?",
    context:
      "We'll tailor the rest of the questions to your sector. Medical, legal, and industrial are our locked ICP — other sectors get a more general path.",
    type: "select",
    options: [
      { value: "medical", label: "Medical practice (practitioner, dentist, specialist, GP group, aesthetics, psychology)" },
      { value: "legal", label: "Legal firm (attorney, advocate, advisor, labour-law, mid-market commercial firm)" },
      { value: "industrial", label: "Industrial business (B2B equipment, fabricator, contractor, BBBEE supplier, mining services)" },
      { value: "other", label: "Other sector / I'm not sure where I fit" },
    ],
  },

  // STEP 2 — Services
  {
    id: "services",
    step: 2,
    sector: "all",
    required: true,
    question:
      "What are the top 3 services your business offers that you most want customers to find you for on Google and AI engines?",
    context:
      "List the 3 you sell most, or 3 you want to sell more of. Each will be tested as an individual AEO query against ChatGPT, Claude, Gemini, and Perplexity.",
    type: "multi-text",
    multiLabels: ["Service 1", "Service 2", "Service 3"],
  },
  {
    id: "primaryService",
    step: 2,
    sector: "all",
    required: true,
    question:
      "Which one of those services would you most like to grow or sell more of in the next 6 to 12 months?",
    context:
      "We'll prioritise AEO work around this service — including schema, content, and citations specifically targeted to it.",
    type: "text",
    placeholder: "Type the service name",
  },
  {
    id: "averageDealSize",
    step: 2,
    sector: "all",
    required: true,
    question:
      "What is the average value of a single customer, contract, patient, matter, or supply order for your business?",
    context:
      "Used for ROI math — and to recommend the right tier. The higher the customer value, the more leverage AEO has for your business.",
    type: "range-select",
    options: [
      { value: "under-5k", label: "Under R5,000 per customer / patient / matter" },
      { value: "5-25k", label: "R5,000 – R25,000 per customer (typical for routine medical, retail-services, small legal matters)" },
      { value: "25-100k", label: "R25,000 – R100,000 per customer (specialist medical procedures, mid-size matters, smaller industrial supply)" },
      { value: "100-500k", label: "R100,000 – R500,000 per customer (enterprise medical groups, complex legal, mid-size industrial contracts)" },
      { value: "500k-plus", label: "Over R500,000 per customer (large industrial supply, enterprise legal mandates, major procurement)" },
    ],
  },

  // STEP 3 — Customer & Geography
  {
    id: "idealCustomer",
    step: 3,
    sector: "all",
    required: true,
    question:
      "Who is your ideal customer or client — and what specific industry, role, location, or buying intent makes them a perfect fit for your business?",
    context:
      "Specific is better. 'Mid-market law firms in Johannesburg with 15-50 attorneys handling SaaS contracts' is 100× more useful than 'businesses that need legal help.' AI engines surface specific matches; they filter out generic ones.",
    type: "textarea",
    placeholder: "e.g. Industrial procurement managers at SA mining houses sourcing BBBEE Level 1-2 lifting equipment suppliers for R500k+ contracts",
    maxLength: 500,
  },
  {
    id: "serviceArea",
    step: 3,
    sector: "all",
    required: true,
    question:
      "Which cities, regions, or countries does your business actually serve customers in?",
    context:
      "Drives Google Business Profile area-served, schema 'areaServed' tagging, and which directories we list you on. Be specific — 'Gauteng' is good; 'Pretoria + Johannesburg + Witbank' is better.",
    type: "text",
    placeholder: "e.g. Pretoria + Johannesburg + Witbank, plus mining sites in Mpumalanga",
    maxLength: 200,
  },

  // SECTOR-SPECIFIC questions inserted in step 3
  {
    id: "medicalAidPlans",
    step: 3,
    sector: "medical",
    required: false,
    question:
      "Which medical aid plans does your practice currently accept — Discovery, Bonitas, Momentum, GEMS, or others?",
    context:
      "Critical for buyer-intent AI queries like 'cardiologist who accepts Discovery in Sandton' — these are the exact queries patients run when choosing a specialist.",
    type: "textarea",
    placeholder: "e.g. Discovery Health, Bonitas, Momentum Health, GEMS, Polmed, Profmed",
    maxLength: 500,
  },
  {
    id: "hpcsaNumber",
    step: 3,
    sector: "medical",
    required: false,
    question:
      "What is your HPCSA registration number, if you'd like it visible as a verified credential on your AEO scan?",
    context:
      "Optional. HPCSA verification is one of the highest-trust signals AI engines use to validate medical practitioners — and is absent from most SA practice websites.",
    type: "text",
    placeholder: "e.g. MP0123456",
    maxLength: 50,
  },
  {
    id: "lssaListing",
    step: 3,
    sector: "legal",
    required: false,
    question:
      "Is your firm currently listed on the Law Society of South Africa (LSSA) directory — and is that listing up to date?",
    context:
      "LSSA is the highest-trust legal citation in South Africa. AI engines cross-reference LSSA before recommending attorneys to prospective clients.",
    type: "select",
    options: [
      { value: "listed-current", label: "Yes — listed and current with all our practitioners" },
      { value: "listed-stale", label: "Yes — but the listing is probably out of date or incomplete" },
      { value: "not-listed", label: "No, the firm is not currently listed on LSSA" },
      { value: "unsure", label: "I'm not sure — would need to check" },
    ],
  },
  {
    id: "practiceAreas",
    step: 3,
    sector: "legal",
    required: false,
    question:
      "What specific practice areas does your firm cover, and which ones do you most want to be known for in AI engine results?",
    context:
      "List up to 5. The most specific practice areas rank best — 'commercial litigation' is good; 'commercial litigation in tech and SaaS contracts' is much better.",
    type: "textarea",
    placeholder: "e.g. Commercial litigation in tech / SaaS, M&A advisory for mid-market deals, Labour law (CCMA), Intellectual property and trademark, Corporate restructuring",
    maxLength: 500,
  },
  {
    id: "bbbeeLevel",
    step: 3,
    sector: "industrial",
    required: false,
    question:
      "What is your business's current BBBEE Level, and is it independently verified by an accredited verification agency?",
    context:
      "BBBEE Level is THE filter for SA enterprise and state-owned-enterprise (SOE) procurement queries. AI engines surface verified BBBEE status directly when procurement officers search.",
    type: "select",
    options: [
      { value: "level-1", label: "Level 1 (highest — 100%+ procurement recognition)" },
      { value: "level-2", label: "Level 2 (125% recognition)" },
      { value: "level-3", label: "Level 3" },
      { value: "level-4", label: "Level 4" },
      { value: "level-5-plus", label: "Level 5 or below" },
      { value: "exempt", label: "Exempt micro-enterprise (EME) — under R10m turnover" },
      { value: "not-applicable", label: "Not BBBEE-relevant for our market (e.g. international export only)" },
    ],
  },
  {
    id: "industrialCertifications",
    step: 3,
    sector: "industrial",
    required: false,
    question:
      "Which industry certifications, registrations, or supplier database listings does your business currently hold?",
    context:
      "CSD (Central Supplier Database for SOE work), CIDB (Construction Industry Development Board), ISO, sector-specific bodies (NTC for telecoms, MEMSA for engineering, SAFAS for foundries). List what applies.",
    type: "textarea",
    placeholder: "e.g. CSD MAAA1234567, CIDB Grade 5GB, ISO 9001:2015 certified, NTC member, BBBEE Level 1 verified by AQRate",
    maxLength: 500,
  },

  // STEP 4 — Competition
  {
    id: "competitors",
    step: 4,
    sector: "all",
    required: true,
    question:
      "Who are the top 3 competitors your business loses customers to, or that you compete with most directly in your market?",
    context:
      "Website URLs preferred — names work if you don't know the URL. We benchmark you against them on schema, citations, AI visibility, and every property of The Real Estate Method.",
    type: "multi-text",
    multiLabels: ["Competitor 1 (URL preferred)", "Competitor 2 (URL preferred)", "Competitor 3 (URL preferred)"],
  },
  {
    id: "competitorAdvantage",
    step: 4,
    sector: "all",
    required: false,
    question:
      "What is the one thing your top competitors do better than your business right now, in terms of digital presence or customer acquisition?",
    context:
      "Brutal honesty here is more useful than diplomacy. The clearer you name the gap, the faster we close it.",
    type: "textarea",
    placeholder: "e.g. They post on LinkedIn 3× per week with case-win stories. Our founder doesn't post at all. They show up in ChatGPT for our service queries; we don't.",
    maxLength: 500,
  },

  // STEP 5 — Visibility goals
  {
    id: "wishedQueries",
    step: 5,
    sector: "all",
    required: true,
    question:
      "What are the exact search queries you wish your customers used to find your business — on Google, ChatGPT, Claude, Gemini, or Perplexity? List 3 to 5.",
    context:
      "These become the queries we test on all 4 AI engines as part of your scan. Examples: 'Best cardiologist in Sandton accepting Discovery Health,' 'BBBEE Level 1 lifting equipment supplier for mining contracts in Gauteng,' 'Top commercial attorney for SaaS startups in Cape Town.'",
    type: "textarea",
    placeholder: "One query per line",
    maxLength: 1000,
  },
  {
    id: "successMetric",
    step: 5,
    sector: "all",
    required: true,
    question:
      "What does success look like for your business 6 months from now — measured in new customers, revenue growth, AI engine citations, or another metric you can measure?",
    context:
      "Specific is better. '10 new patient bookings per week from AI search' beats 'more visibility.' Vague goals produce vague strategy.",
    type: "textarea",
    placeholder: "e.g. 5 new mid-market law firm clients found via AI engines, average matter value R200k each. Or: 2 new BBBEE-aligned mining contracts at R500k+ each, sourced through procurement-officer AI searches.",
    maxLength: 500,
  },

  // STEP 6 — Current state
  {
    id: "currentDiscoverySources",
    step: 6,
    sector: "all",
    required: true,
    question:
      "Where do your customers actually find your business today — through Google search, social media, AI engines, referrals, or somewhere else?",
    context:
      "Tick all that apply. Honest answer beats aspirational answer. We use this to identify which channels are leaking demand.",
    type: "multi-select",
    options: [
      { value: "google-organic", label: "Google search (organic results, not paid ads)" },
      { value: "google-paid", label: "Google ads (paid search)" },
      { value: "gbp", label: "Google Business Profile / Google Maps" },
      { value: "linkedin", label: "LinkedIn (founder or company page)" },
      { value: "industry-directory", label: "Industry-specific directory listings (HPCSA, LSSA, CSD, BBBEE Verification, etc.)" },
      { value: "word-of-mouth", label: "Word of mouth and referrals from existing customers" },
      { value: "ai-engine", label: "AI engines like ChatGPT, Claude, Gemini, or Perplexity" },
      { value: "social-other", label: "Other social media (Instagram, Facebook, Twitter/X)" },
      { value: "trade-publications", label: "Trade publications, press mentions, industry media" },
      { value: "i-dont-know", label: "Honestly, I don't know — we don't track this" },
    ],
  },
  {
    id: "currentDigitalSetup",
    step: 6,
    sector: "all",
    required: true,
    question:
      "What is the current state of your digital presence — Google Business Profile, schema markup, LinkedIn cadence, reviews, and industry citations?",
    context:
      "Tick everything that's true today. We'll verify ourselves in the audit; we just want your honest read of where things stand.",
    type: "multi-select",
    options: [
      { value: "gbp-claimed", label: "Google Business Profile is claimed, verified, and actively maintained" },
      { value: "schema-deployed", label: "Schema markup is deployed on our website (LocalBusiness, Service, FAQ, etc.)" },
      { value: "linkedin-active", label: "We post on LinkedIn at least once a week (founder or company page)" },
      { value: "reviews-managed", label: "We actively respond to Google + HelloPeter + sector-specific reviews" },
      { value: "hellopeter-claimed", label: "We've claimed our HelloPeter profile and respond to reviews there" },
      { value: "industry-citations", label: "We're listed on industry-specific directories (HPCSA / LSSA / CSD / BBBEE / sector-specific)" },
      { value: "newsletter-running", label: "We send a regular email newsletter to customers or prospects" },
      { value: "youtube-active", label: "We have an active YouTube channel with educational or branded content" },
      { value: "none-of-above", label: "None of the above (or I honestly don't know the state of any of these)" },
    ],
  },
  {
    id: "previousAttempts",
    step: 6,
    sector: "all",
    required: false,
    question:
      "What digital marketing or SEO strategies has your business tried before — and which ones worked, which ones failed?",
    context:
      "Past SEO agencies, freelancers, tools, courses, paid ads. Telling us what failed prevents us from repeating it. The more specific, the more useful.",
    type: "textarea",
    placeholder: "e.g. Hired an SEO agency in 2024 — they delivered generic blog posts and cheap directory submissions, no leads. Tried LinkedIn ads — too expensive at our deal size. Built a Google Ads account in-house — kept burning money on broad-match keywords.",
    maxLength: 1000,
  },

  // STEP 7 — Capture (the email gate)
  {
    id: "contactName",
    step: 7,
    sector: "all",
    required: true,
    question:
      "What is your name — so we can address your AEO Discovery summary correctly?",
    type: "text",
    placeholder: "e.g. Dr Mokoena",
    maxLength: 200,
  },
  {
    id: "email",
    step: 7,
    sector: "all",
    required: true,
    question:
      "What is the best email address to send your personalised AEO Discovery summary to within 24 hours?",
    context:
      "We'll email you a personalised summary within 24 hours. No spam. No sales sequence without explicit opt-in. Easy one-click unsubscribe.",
    type: "email",
    placeholder: "you@yourfirm.com",
  },
];

/**
 * Get the questions visible for a given sector. The first 3 questions
 * (step 1) are always shown — they include the sector selector itself.
 * After step 1, sector-specific questions branch in.
 */
export function getQuestionsForSector(sector: Sector | "other" | null) {
  // Until sector is selected, show only step 1 questions
  if (!sector) {
    return discoveryQuestions.filter((q) => q.step === 1);
  }
  return discoveryQuestions.filter(
    (q) => q.sector === "all" || q.sector === sector,
  );
}

/** Total expected question count for a sector — drives progress bar */
export function getTotalQuestions(sector: Sector | "other" | null): number {
  if (!sector || sector === "other") {
    return discoveryQuestions.filter((q) => q.sector === "all").length;
  }
  return discoveryQuestions.filter(
    (q) => q.sector === "all" || q.sector === sector,
  ).length;
}

/** Total steps (always 7) */
export const TOTAL_STEPS = 7;
