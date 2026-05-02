/**
 * Sector AEO Checklists — 47 points each across 7 properties
 *
 * These are public lead magnets distilled from the AUDIT-PLAYBOOK.md
 * methodology. Three sectors matching the locked ICP:
 *   - medical (practitioners, dentists, aesthetics, GP groups)
 *   - legal (attorneys, advocates, advisers, mid-market firms)
 *   - industrial (B2B equipment, fabricators, contractors, BBBEE suppliers)
 *
 * Structure mirrors the AUDIT-PLAYBOOK: every checklist follows the same
 * 7 properties so a buyer who reads one can recognise the pattern across
 * all three. Differentiation is in the SECTOR-SPECIFIC items (Discovery
 * Network for medical, LSSA for legal, CSD for industrial, etc.).
 *
 * Public + ungated by design. These pages are also AEO assets — schema-
 * marked-up HowTo content that AI engines will cite as authoritative
 * when buyers ask 'how do I improve AI visibility for my law firm.'
 */

export type ChecklistItem = {
  /** Stable id used for # anchor + key */
  id: string;
  /** The actual check, written as a question or imperative */
  text: string;
  /** Why this matters — shown as expandable detail */
  why: string;
  /** Effort filter — 'quick' (under 1 hr), 'medium' (1-3 days), 'compounding' (ongoing) */
  effort: "quick" | "medium" | "compounding";
  /** Impact filter — used to render a colored marker */
  impact: "foundation" | "growth" | "authority";
  /** Optional tool / link / example */
  tool?: string;
};

export type ChecklistSection = {
  property: string;
  description: string;
  items: ChecklistItem[];
};

export type SectorChecklist = {
  sector: "medical" | "legal" | "industrial";
  slug: string;
  title: string;
  audience: string;
  hook: string;
  totalItems: number;
  sections: ChecklistSection[];
  /** Concluding paragraph rendered before CTAs */
  closing: string;
  /** Schema.org HowTo "supply" examples — feed AI engines with concrete tools */
  toolsRequired: string[];
};

// ============================================================
// MEDICAL CHECKLIST
// ============================================================

export const medicalChecklist: SectorChecklist = {
  sector: "medical",
  slug: "medical",
  title: "47-Point AEO Checklist for Medical Practices",
  audience:
    "Medical specialists, GP groups, dentists, aesthetics practices — solo or multi-doctor.",
  hook: "How to make sure ChatGPT, Claude, Gemini, and Perplexity recommend your practice when patients ask AI for specialists in your field.",
  totalItems: 47,
  toolsRequired: [
    "Web browser",
    "Google Business Profile Manager access",
    "LinkedIn account",
    "Practice management system (for review request automation)",
  ],
  sections: [
    {
      property: "Website + Schema",
      description: "Your owned property. AI engines and search engines read it first.",
      items: [
        {
          id: "med-w1",
          text: "Title tag includes your specialty + city (e.g. 'Cardiologist in Sandton — Dr X Practice')",
          why: "AI engines pattern-match queries to title tags. 'Best cardiologist Sandton' won't surface a tag that says 'Welcome to our practice.'",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-w2",
          text: "Meta description: 140-160 chars, leads with primary specialty + practice positioning",
          why: "First touchpoint in search results. AI engines use this as snippet source.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-w3",
          text: "MedicalBusiness or Physician schema deployed on homepage",
          why: "Tells AI what you are. Without this, AI has to infer from text — and gets it wrong.",
          effort: "medium",
          impact: "foundation",
          tool: "Google Rich Results Test",
        },
        {
          id: "med-w4",
          text: "Each procedure listed as MedicalProcedure schema (separate URL)",
          why: "Lets AI engines recommend you for specific procedures, not just specialty queries.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-w5",
          text: "Person schema for each practitioner with HPCSA registration + qualifications",
          why: "AI engines cite credentials. 'Trust' signals to LLMs come from structured data, not prose.",
          effort: "medium",
          impact: "foundation",
        },
        {
          id: "med-w6",
          text: "FAQ schema deployed for common patient questions (10+ questions answered)",
          why: "AI engines pull FAQ schema directly into answers. Your questions become AI's quotes.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-w7",
          text: "/llms.txt file added with practice description, services, and credentials",
          why: "Almost no SA medical practice has this. It's how AI engines self-discover entity information. 15-min job, 30-day citation lift.",
          effort: "quick",
          impact: "authority",
        },
        {
          id: "med-w8",
          text: "Mobile responsiveness ≥ 90 (Lighthouse mobile score)",
          why: "70% of patient queries start on mobile. AI engines penalise unreadable mobile sites.",
          effort: "medium",
          impact: "foundation",
          tool: "Chrome DevTools → Lighthouse",
        },
        {
          id: "med-w9",
          text: "Page speed ≥ 80 (Lighthouse performance score)",
          why: "Slow pages don't get crawled deeply by AI training pipelines.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-w10",
          text: "Each specialty/procedure has its own URL — not bullets in description",
          why: "Granular URLs let AI cite specific procedures, not just brand. Compounds over time.",
          effort: "medium",
          impact: "growth",
        },
      ],
    },
    {
      property: "Google Business Profile",
      description: "The single biggest local SERP block. AI engines harvest GBP heavily.",
      items: [
        {
          id: "med-g1",
          text: "Primary category: most specific (e.g. 'Cardiologist' not 'Doctor')",
          why: "Specificity drives AI matching. Generic categories get filtered out for specialty queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-g2",
          text: "5-9 secondary categories covering all sub-specialties + procedures",
          why: "Each category = a query you can rank for. Free real estate.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-g3",
          text: "All medical aid plans accepted listed in description (Discovery, Bonitas, Momentum, GEMS, etc.)",
          why: "Buyer-intent queries like 'cardiologist who accepts Discovery in Sandton' need this exact match.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-g4",
          text: "HPCSA registration number visible in description or services section",
          why: "Trust signal. AI engines cite verified credentials over unverified claims.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-g5",
          text: "30+ photos including practice exterior, waiting room, equipment, team",
          why: "Photos are the single biggest GBP ranking factor in 2026. AI uses image counts as activity signal.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-g6",
          text: "Weekly GBP posts mixing patient education + practice updates",
          why: "Stale GBPs lose ranking. Consistent posting tells AI engines the practice is active.",
          effort: "compounding",
          impact: "growth",
        },
        {
          id: "med-g7",
          text: "Q&A section: 10+ common questions answered by practice (not random patients)",
          why: "Owned answers > random answers. AI engines weight practice-authored Q&A higher.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-g8",
          text: "Appointment booking link integrated (Snapscan/Bookem/Healthbridge)",
          why: "Removes friction. Conversion lift + GBP feature priority.",
          effort: "medium",
          impact: "growth",
        },
      ],
    },
    {
      property: "LinkedIn (practitioner + practice)",
      description: "Powers AI search results — especially Perplexity and ChatGPT.",
      items: [
        {
          id: "med-l1",
          text: "Practice company page complete with industry tagged ('Hospital & Health Care' or specialty)",
          why: "LinkedIn is heavily indexed by AI engines for B2B/professional queries. Untagged pages get skipped.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-l2",
          text: "Practitioner personal page headline includes specialty + qualifications (MBChB, FCS, FCP, etc.)",
          why: "Headline is the most-cited LinkedIn field by AI engines. 'CEO at Practice' is wasted real estate.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-l3",
          text: "About section tells the practice story — patient outcomes, philosophy — not just credentials list",
          why: "AI engines pull narrative for 'tell me about Dr X' queries. Bullet lists get ignored.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-l4",
          text: "Posting cadence: 1+ post/week, educational > promotional ratio",
          why: "Active LinkedIn profiles get cited 3-5× more by Perplexity. Educational posts compound.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "med-l5",
          text: "Tagged credentials/awards from professional bodies (SA Heart Association, SASOG, etc.)",
          why: "Verified-via-tag credentials are AI's gold standard. Plain-text credentials get less weight.",
          effort: "quick",
          impact: "growth",
        },
      ],
    },
    {
      property: "Industry citations + directories",
      description: "Third-party trust signals. The most under-invested area in SA medical.",
      items: [
        {
          id: "med-c1",
          text: "HPCSA registry profile verified + complete",
          why: "Highest-trust medical citation in SA. AI engines cross-reference HPCSA before recommending.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-c2",
          text: "Discovery Health Network listing (if accepting Discovery)",
          why: "Discovery covers ~50% of SA private medical aid market. Direct buyer-intent platform.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-c3",
          text: "Bonitas / Momentum / GEMS provider lists (where accepting)",
          why: "Same logic as Discovery — direct buyer-intent platforms tied to medical aid plans.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-c4",
          text: "South African Medical Association (SAMA) member directory",
          why: "Industry-body trust signal. Cited by AI engines as professional verification.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-c5",
          text: "Sector-specific specialist body listings — SA Heart Association, SASOG, Plastic Surgery Society of SA, SADA (SA Dental Association), Aesthetic Medicine Society of SA",
          why: "Specialty-specific trust = highest-trust citation for specialty queries. SADA and Aesthetic Medicine Society are particularly underused by SA dentists and aesthetics practices.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-c6",
          text: "FindADoc / RateMDs / Vermeulen Specialists — claimed profiles",
          why: "Patient-facing directories. AI engines surface these in 'reviews for' queries.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-c7",
          text: "Brabys + Yellow Pages SA basic listings",
          why: "Tier-1 SA citation foundation. Cheap to set up, baseline trust signal.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-c8",
          text: "Hospital affiliation pages: practice listed on each hospital's specialist directory",
          why: "Hospital domains are high-trust. Affiliations get AI to associate practice with institution.",
          effort: "medium",
          impact: "authority",
        },
      ],
    },
    {
      property: "Reviews velocity",
      description: "Trust at scale. AI engines weigh review count + recency heavily.",
      items: [
        {
          id: "med-r1",
          text: "Google reviews: 25+ with average ≥ 4.5 stars",
          why: "Below 25 reviews = AI engines treat as 'unverified.' Above 25 + 4.5★ = recommended.",
          effort: "compounding",
          impact: "foundation",
        },
        {
          id: "med-r2",
          text: "HelloPeter profile claimed and active (SA's largest review platform)",
          why: "Critical for SA. ~70% of SA buyers check HelloPeter before booking. AI engines harvest it.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-r3",
          text: "Sector-specific platforms: RateMDs (medical), Realself (aesthetics)",
          why: "Specialty-specific review platforms get cited above general ones for specialty queries.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-r4",
          text: "Response rate: ≥ 80% of reviews responded to within 7 days",
          why: "Engagement signal. AI engines penalise practices that ignore reviews.",
          effort: "compounding",
          impact: "growth",
        },
        {
          id: "med-r5",
          text: "Review request automation: post-procedure email/SMS asking for review (POPI-compliant — explicit opt-in for testimonial use)",
          why: "Reviews don't happen organically at scale. Automated request = 5-10× review volume. POPI requires explicit consent for using patient identifiers in testimonials — bake this into the request workflow.",
          effort: "medium",
          impact: "authority",
        },
      ],
    },
    {
      property: "AI engines (test + monitor)",
      description: "The output layer. If you don't measure, you can't improve.",
      items: [
        {
          id: "med-a1",
          text: "Test 'Best [specialty] in [city]' on ChatGPT, Claude, Gemini, Perplexity — appear in answer? (Apple Intelligence + Microsoft Copilot integration coming Q1 2027)",
          why: "The headline test. If you're not in the answer for your home query, nothing else compounds. Apple Intelligence reaches every iPhone user — the 5th major engine to optimize for.",
          effort: "quick",
          impact: "foundation",
          tool: "Free AI Visibility Scan at kabelomore.com/scan",
        },
        {
          id: "med-a2",
          text: "Test 'Best [specialty] who accepts [medical aid]' across all 4 engines",
          why: "Buyer-intent query that converts. Need to appear here even more than generic specialty queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-a3",
          text: "Test 'Reviews for [practice name]' — accurate info returned?",
          why: "Branded query — patients due-dilly check this. Inaccurate AI info kills trust.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-a4",
          text: "Branded search reveals: hospital affiliations, qualifications, specialties — all accurate?",
          why: "AI engines compose your introduction. Make sure they have the right facts.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-a5",
          text: "Daily AI monitoring tool deployed (tracks visibility across 4 engines)",
          why: "AI engines update weekly. You need to know when your visibility shifts before patients do.",
          effort: "medium",
          impact: "authority",
          tool: "Local Growth Lite from R2,950/mo",
        },
        {
          id: "med-a6",
          text: "Quarterly re-scan with documented before/after",
          why: "Improvement requires measurement. Quarterly cadence catches drift + validates retainer ROI.",
          effort: "compounding",
          impact: "growth",
        },
      ],
    },
    {
      property: "Competitive intelligence",
      description: "Where the gap actually is — versus where you assume it is.",
      items: [
        {
          id: "med-x1",
          text: "Identified the 3 specialists/practices AI engines recommend INSTEAD of you",
          why: "Your real digital competitors are who AI surfaces — not who you see at industry events.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "med-x2",
          text: "Documented gap analysis: their schema vs yours, citations vs yours, content vs yours",
          why: "Forces objectivity. Closes the 'we're better' delusion.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "med-x3",
          text: "Hospital affiliations: are competitors more visibly affiliated?",
          why: "Affiliation density matters. AI weights institutional credentials.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "med-x4",
          text: "Specialty associations: are competitors more visible (publications, talks, conferences)?",
          why: "Conference talks + papers = high-trust citations. Compounds for years.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "med-x5",
          text: "Patient testimonials: do competitors have more public testimonials with permission?",
          why: "POPI-compliant testimonials are scarce — but high-trust. Competitors who solve this dominate.",
          effort: "compounding",
          impact: "authority",
        },
      ],
    },
  ],
  closing:
    "If you complete all 47, your practice will be in the top 5% of SA medical practices on AI visibility. Most practices score 8-15 out of 47. The compounding effect of getting to 35+ shows up within 60-90 days as new patient inquiries from 'I asked ChatGPT and your name came up.'",
};

// ============================================================
// LEGAL CHECKLIST
// ============================================================

export const legalChecklist: SectorChecklist = {
  sector: "legal",
  slug: "legal",
  title: "47-Point AEO Checklist for Law Firms",
  audience:
    "Attorneys, advocates, advisers, mid-market firms — sole practitioners through 50-attorney firms.",
  hook: "How to make sure ChatGPT, Claude, Gemini, and Perplexity recommend your firm when prospective clients ask AI for legal counsel in your specialty.",
  totalItems: 47,
  toolsRequired: [
    "Web browser",
    "Google Business Profile Manager access",
    "LinkedIn account",
    "Practice management system (for client testimonial workflow)",
  ],
  sections: [
    {
      property: "Website + Schema",
      description: "Your owned property. The first thing AI engines and search engines read.",
      items: [
        {
          id: "leg-w1",
          text: "Title tag includes practice area + city (e.g. 'Commercial Attorney in Johannesburg — X Inc')",
          why: "AI engines pattern-match queries to title tags. Generic titles miss specialty queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-w2",
          text: "Meta description 140-160 chars: practice area + outcome focus (not 'we provide quality legal services')",
          why: "Outcome-led descriptions get cited 3-5× more by AI engines. Service-led ones get filtered.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-w3",
          text: "LegalService or ProfessionalService schema deployed",
          why: "Tells AI what you are. Most law firms have no schema — quick win.",
          effort: "medium",
          impact: "foundation",
          tool: "Google Rich Results Test",
        },
        {
          id: "leg-w4",
          text: "Each practice area listed as separate Service schema with its own URL",
          why: "Granular URLs let AI recommend you for specific matters, not just brand searches.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "leg-w5",
          text: "Person schema for each principal attorney with admission year, qualifications, courts of practice",
          why: "Court-of-practice + admission year are highest-trust legal verification signals.",
          effort: "medium",
          impact: "foundation",
        },
        {
          id: "leg-w6",
          text: "FAQ schema for common client questions (cost, timelines, process, fees) — 10+ questions",
          why: "AI engines pull FAQ schema directly into answers. Owned questions = owned answers.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "leg-w7",
          text: "/llms.txt file added with firm description, practice areas, attorney credentials",
          why: "Almost no SA law firm has this. 15-min effort, 30-day citation lift.",
          effort: "quick",
          impact: "authority",
        },
        {
          id: "leg-w8",
          text: "Mobile responsiveness ≥ 90 (Lighthouse mobile score)",
          why: "Procurement counsel + in-house teams browse on mobile. Slow mobile = filtered out.",
          effort: "medium",
          impact: "foundation",
        },
        {
          id: "leg-w9",
          text: "Page speed ≥ 80 (Lighthouse performance score)",
          why: "Slow pages don't get crawled deeply by AI training pipelines.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "leg-w10",
          text: "Each practice area + each attorney has its own URL",
          why: "Granular structure = granular AI citations. 'Best commercial attorney at X Inc' becomes a citable entity.",
          effort: "medium",
          impact: "growth",
        },
      ],
    },
    {
      property: "Google Business Profile",
      description: "Underweighted by law firms. Massive trust signal for local clients.",
      items: [
        {
          id: "leg-g1",
          text: "Primary category: most specific (e.g. 'Commercial Attorney' not 'Lawyer' or 'Legal Services')",
          why: "Specificity drives AI matching. Generic categories get filtered out for specialty queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-g2",
          text: "Secondary categories: covering all practice areas you actively practice",
          why: "Each category = a query you can rank for. Free real estate.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-g3",
          text: "Court of practice listed in description (Northern Gauteng High Court, Constitutional Court, etc.)",
          why: "Court mentions are high-trust legal verification. AI engines weight them heavily.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "leg-g4",
          text: "LSSA reference + admission date in description",
          why: "Trust signal. Verified credentials get cited above unverified claims.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-g5",
          text: "20+ photos: office, attorney headshots, team, court appearances (where allowed)",
          why: "Photo count is GBP ranking factor. Especially under-done by law firms.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "leg-g6",
          text: "Bi-weekly GBP posts: legal commentary, case wins (with permission), regulatory updates",
          why: "Stale GBPs lose ranking. Active firms signal credibility to AI engines.",
          effort: "compounding",
          impact: "growth",
        },
        {
          id: "leg-g7",
          text: "Q&A section: 10+ common questions answered (fees, processes, what to expect)",
          why: "Practice-authored Q&A = practice-controlled narrative. AI weights it higher than random Q&A.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "leg-g8",
          text: "Consultation booking link integrated",
          why: "Removes friction. GBPs with booking links get higher feature priority.",
          effort: "medium",
          impact: "growth",
        },
      ],
    },
    {
      property: "LinkedIn (firm + principal attorney)",
      description: "Where mid-market clients (especially in-house counsel) shortlist you.",
      items: [
        {
          id: "leg-l1",
          text: "Firm company page complete: industry, size, practice areas tagged",
          why: "Tagged company pages get cited by Perplexity and ChatGPT for B2B legal queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-l2",
          text: "Principal attorney personal page: headline includes admission + specialty (e.g. 'Commercial Attorney admitted 2014, focused on M&A')",
          why: "Headline is most-cited LinkedIn field by AI engines. Be specific.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-l3",
          text: "About section: notable matters, case wins (with permission), thought leadership",
          why: "AI engines pull narrative. Bullet credentials get ignored — case stories get cited.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "leg-l4",
          text: "Posting cadence: 1+ post/week, commentary on legal developments, regulatory analysis",
          why: "Active LinkedIn = AI authority signal. Industry commentary compounds for years.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "leg-l5",
          text: "Bar memberships + professional bodies visible (LSSA, Pan-African Bar, regional society)",
          why: "Verified-via-tag credentials are AI's gold standard. Plain-text credentials get less weight.",
          effort: "quick",
          impact: "growth",
        },
      ],
    },
    {
      property: "Legal industry citations + directories",
      description: "The single most under-invested area for SA mid-market law firms.",
      items: [
        {
          id: "leg-c1",
          text: "Law Society of SA (LSSA) public profile complete",
          why: "Highest-trust legal citation in SA. AI engines cross-reference LSSA before recommending.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-c2",
          text: "Provincial Law Society listing (Cape, Natal, Free State, Northern Provinces)",
          why: "Regional trust signal. AI engines surface provincial citations for regional queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-c3",
          text: "Saflii author profile (if you publish case commentary or articles)",
          why: "Saflii is heavily indexed by AI engines for SA legal content. Author profiles compound.",
          effort: "medium",
          impact: "authority",
        },
        {
          id: "leg-c4",
          text: "LegalCity directory listing",
          why: "SA-specific legal directory. Cheap, foundation-tier citation.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-c5",
          text: "Specialist body listings — Society of Construction Lawyers, IPLA, MLBA, ALSA, CCMA Practitioner Roll (for labour law firms), etc.",
          why: "Specialty-specific = highest-trust citation for specialty queries. CCMA Practitioner Roll is particularly under-claimed by SA labour law firms — direct buyer-intent platform.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "leg-c6",
          text: "International rankings: Chambers, Legal500, Best Lawyers (if at that level)",
          why: "Global high-trust citations. Cited heavily by AI engines for international queries.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "leg-c7",
          text: "Brabys + Yellow Pages SA basic listings",
          why: "Foundation-tier citation density. Cheap, baseline trust signal.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-c8",
          text: "Court roll or appearance listings (where firms publicly mention)",
          why: "Court mentions are high-trust legal verification.",
          effort: "compounding",
          impact: "growth",
        },
      ],
    },
    {
      property: "Reviews + testimonials",
      description: "POPI-compliant social proof. Scarce but high-impact.",
      items: [
        {
          id: "leg-r1",
          text: "Google reviews: 15+ with average ≥ 4.5 stars (legal review counts run lower than retail)",
          why: "Below 15 = AI treats as unverified. Above 15 + 4.5★ = trustworthy.",
          effort: "compounding",
          impact: "foundation",
        },
        {
          id: "leg-r2",
          text: "HelloPeter profile claimed and responsive",
          why: "Critical for SA. AI engines harvest HelloPeter heavily for SA business reputation.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "leg-r3",
          text: "Sector-specific platforms: Avvo (US clients), Lawyers.com, Yell (UK clients), Chambers",
          why: "Specialty-specific review platforms cited above general ones for legal queries.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "leg-r4",
          text: "Response rate: ≥ 80% of reviews responded to within 7 days, professionally",
          why: "Engagement signal. AI engines penalise firms that ignore reviews — even neutral ones.",
          effort: "compounding",
          impact: "growth",
        },
        {
          id: "leg-r5",
          text: "Client testimonial workflow: mandatory request at matter close, POPI-compliant (explicit consent for naming + matter-type disclosure)",
          why: "Testimonials don't happen organically. Workflow = 5-10× testimonial volume. POPI requires explicit, written consent before using a client's name or matter details in testimonials — bake this into your engagement letter clauses to stay compliant from day one.",
          effort: "medium",
          impact: "authority",
        },
      ],
    },
    {
      property: "AI engines (test + monitor)",
      description: "The output layer. Measure or you're guessing.",
      items: [
        {
          id: "leg-a1",
          text: "Test 'Best [practice area] attorney in [city]' across ChatGPT, Claude, Gemini, Perplexity (Apple Intelligence + Copilot tracking added Q1 2027)",
          why: "The headline test. If you're not in the answer, nothing else compounds. Apple Intelligence will be how iPhone-using in-house counsel research firms — must optimize for it once tracking is live.",
          effort: "quick",
          impact: "foundation",
          tool: "Free AI Visibility Scan at kabelomore.com/scan",
        },
        {
          id: "leg-a2",
          text: "Test 'Top commercial law firm for [client type]' (e.g. SaaS startups, mining companies)",
          why: "B2B buyer-intent query. Need to appear specifically for your client type.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-a3",
          text: "Test 'Reviews for [firm name]' — accurate info returned?",
          why: "Branded query during in-house counsel due diligence. Inaccurate AI info kills credibility.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-a4",
          text: "Branded search: AI knows admission year, qualifications, notable matters, court of practice?",
          why: "AI composes your firm's introduction during shortlisting. Make sure facts are right.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "leg-a5",
          text: "Daily AI monitoring tool deployed (tracks visibility across 4 engines)",
          why: "AI engines update weekly. Need awareness of visibility shifts before clients do.",
          effort: "medium",
          impact: "authority",
          tool: "Local Growth Lite from R2,950/mo",
        },
        {
          id: "leg-a6",
          text: "Quarterly re-scan with documented before/after",
          why: "Improvement = measurement. Catches drift + validates retainer ROI.",
          effort: "compounding",
          impact: "growth",
        },
      ],
    },
    {
      property: "Competitive intelligence",
      description: "Where the real gap is — vs where you assume it is.",
      items: [
        {
          id: "leg-x1",
          text: "Identified the 3 firms AI engines recommend INSTEAD of you",
          why: "Your real digital competitors are who AI surfaces — not who you see at CPDs.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "leg-x2",
          text: "Documented gap analysis: their schema vs yours, citations vs yours, LinkedIn cadence vs yours",
          why: "Objective comparison. Closes 'we're better' delusion.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "leg-x3",
          text: "Counsel relationships: are competitors visibly tied to leading counsel chambers?",
          why: "Counsel co-citation = high-trust legal visibility. AI weights chamber affiliations.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "leg-x4",
          text: "Press / commentary: are competitors quoted more in legal media (De Rebus, BizCommunity Legal, Engineering News legal section)?",
          why: "Press citations are high-trust. Compounds for years.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "leg-x5",
          text: "Specialist body engagement: are competitors more active at conferences, papers, CPD sessions?",
          why: "Conference talks + papers = high-trust citations. Build authority at compounding cost.",
          effort: "compounding",
          impact: "authority",
        },
      ],
    },
  ],
  closing:
    "If you complete all 47, your firm will be in the top 5% of SA mid-market law firms on AI visibility. Most firms score 6-12 out of 47. Getting to 35+ shows up within 60-90 days as inbound inquiries from 'I asked ChatGPT for [practice area] firms and your name came up.' For B2B legal, even 1-2 such inquiries per quarter at average matter value pays for the entire programme.",
};

// ============================================================
// INDUSTRIAL CHECKLIST
// ============================================================

export const industrialChecklist: SectorChecklist = {
  sector: "industrial",
  slug: "industrial",
  title: "47-Point AEO Checklist for Industrial Businesses",
  audience:
    "B2B equipment suppliers, fabricators, contractors, BBBEE-certified suppliers — particularly those targeting enterprise, mining, and SOE procurement.",
  hook: "How to make sure ChatGPT, Claude, Gemini, and Perplexity recommend your firm when procurement officers ask AI for suppliers in your category.",
  totalItems: 47,
  toolsRequired: [
    "Web browser",
    "Google Business Profile Manager access",
    "LinkedIn account",
    "Capability statement document (or budget to create one)",
  ],
  sections: [
    {
      property: "Website + Schema",
      description: "Your capability statement online. Procurement officers + AI both read it first.",
      items: [
        {
          id: "ind-w1",
          text: "Title tag includes capability + sector + region (e.g. 'Mining Equipment Fabricator in Witbank — X Industrial')",
          why: "Procurement officers search specifically. Generic titles miss specific-capability queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-w2",
          text: "Meta description: primary capability + customer type (e.g. 'BBBEE Level 1 fabricator serving mining and energy clients')",
          why: "Procurement-grade descriptions get cited in B2B AI queries. Service-led generics get filtered.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-w3",
          text: "Manufacturer or LocalBusiness schema deployed with full capability detail",
          why: "Tells AI what you produce. Without schema, AI can't recommend for specific capability queries.",
          effort: "medium",
          impact: "foundation",
          tool: "Google Rich Results Test",
        },
        {
          id: "ind-w4",
          text: "Each capability/product listed as separate Service or Product schema with own URL",
          why: "Granular structure = granular AI citations. 'Best [specific product] supplier' becomes citable.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-w5",
          text: "Person schema for CEO/MD/Directors with sector experience + qualifications",
          why: "Procurement trusts named leadership. AI engines cite verified leadership over anonymous firms.",
          effort: "medium",
          impact: "foundation",
        },
        {
          id: "ind-w6",
          text: "FAQ schema for procurement-style questions (BBBEE Level, lead times, MOQs, certifications) — 10+ questions",
          why: "AI engines pull FAQ schema directly. These are exactly the questions procurement asks.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "ind-w7",
          text: "/llms.txt file added with capability statement, certifications, BBBEE Level",
          why: "Almost no SA industrial supplier has this. 15-min job, 30-day citation lift in B2B AI queries.",
          effort: "quick",
          impact: "authority",
        },
        {
          id: "ind-w8",
          text: "Mobile responsiveness ≥ 90 (procurement officers do search on mobile)",
          why: "70% of procurement queries start on mobile. Slow mobile = filtered out before consideration.",
          effort: "medium",
          impact: "foundation",
        },
        {
          id: "ind-w9",
          text: "Page speed ≥ 80 (Lighthouse performance)",
          why: "Slow industrial sites are notorious. Speed = signal of professional operation.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-w10",
          text: "Capability statement / capability brochure linked or embedded as PDF",
          why: "Procurement officers download and forward. Each forward = an external citation of your capability.",
          effort: "medium",
          impact: "growth",
        },
      ],
    },
    {
      property: "Google Business Profile",
      description: "Cited heavily by AI engines for B2B local supplier queries.",
      items: [
        {
          id: "ind-g1",
          text: "Primary category: most specific industrial vertical (e.g. 'Steel Fabricator' not 'Manufacturing')",
          why: "Specificity drives AI matching. Generic categories miss specialty queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-g2",
          text: "5-9 secondary categories covering all capability types",
          why: "Each category = a procurement query you can rank for.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-g3",
          text: "BBBEE Level prominently shown in description (Level 1, 2 etc.) + verification status",
          why: "BBBEE Level is THE filter for SA enterprise + SOE procurement. AI engines surface this directly.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "ind-g4",
          text: "Service area: covers all delivery regions accurately",
          why: "Procurement queries often include region. 'Within 200km of [mine]' is a real query pattern.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-g5",
          text: "30+ photos: factory, equipment, team, completed project sites, products",
          why: "Photos are GBP ranking factor. Industrial buyers want to see capability evidence.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-g6",
          text: "Monthly GBP posts: capability updates, project showcases, certifications won",
          why: "Stale GBPs lose ranking. Active firms signal operating credibility to AI engines.",
          effort: "compounding",
          impact: "growth",
        },
        {
          id: "ind-g7",
          text: "Q&A section: BBBEE Level, certifications, capacity, lead times, payment terms — answered by firm",
          why: "These are procurement's first questions. Owned answers = controlled procurement narrative.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "ind-g8",
          text: "Capability brochure / spec sheet downloadable from GBP profile",
          why: "Procurement officers download materials directly. Removes friction from supplier evaluation.",
          effort: "medium",
          impact: "growth",
        },
      ],
    },
    {
      property: "LinkedIn (firm + leadership)",
      description: "Where procurement officers shortlist suppliers.",
      items: [
        {
          id: "ind-l1",
          text: "Company page complete: industry tagged correctly, size, headquarters",
          why: "Tagged industrial pages get cited by Perplexity for B2B queries. Untagged ones get skipped.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-l2",
          text: "CEO/MD personal page: headline includes role + sector expertise (e.g. 'CEO at X — Mining Engineering Solutions')",
          why: "Headline is most-cited field. 'CEO at X' alone is wasted real estate.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-l3",
          text: "About section: notable projects, certifications, capability highlights, BBBEE journey",
          why: "AI engines pull narrative for B2B queries. Bullet credentials get ignored.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-l4",
          text: "Posting cadence: bi-weekly minimum — project showcases + sector commentary",
          why: "Active LinkedIn = procurement-trust signal. Compounds for years as AI training data.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "ind-l5",
          text: "Sector body memberships visible (NTC, SAEEC, MEMSA, MSA, etc.)",
          why: "Verified-via-tag credentials are AI's gold standard. Plain-text credentials get less weight.",
          effort: "quick",
          impact: "growth",
        },
      ],
    },
    {
      property: "Industrial citations + procurement databases",
      description: "The most under-invested area for SA industrial — and the most lucrative.",
      items: [
        {
          id: "ind-c1",
          text: "CSD (Central Supplier Database) — registered, complete, active",
          why: "ESSENTIAL for SOE work (Eskom, Transnet, Government departments). Without it, you don't exist for SOE procurement.",
          effort: "medium",
          impact: "foundation",
        },
        {
          id: "ind-c2",
          text: "CIDB (Construction Industry Development Board) — graded + listed",
          why: "Construction tenders require CIDB grading. AI engines surface CIDB listings directly.",
          effort: "medium",
          impact: "foundation",
        },
        {
          id: "ind-c3",
          text: "BBBEE Verification Agency listing with current certificate visible",
          why: "Highest-trust BBBEE verification. AI cross-references this when surfacing 'BBBEE Level X supplier' queries.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-c4",
          text: "Sector-specific procurement portals — DMRE Mining Suppliers, NTC (telecoms), SACEEC (capital equipment exporters), SAFAS (foundries), Black Industrialists Programme (BIP) listings if funded",
          why: "Specialty-specific = highest-trust citation for sector-specific procurement queries. SACEEC, SAFAS, and BIP are particularly underused: SACEEC opens export tender visibility, BIP is the highest-trust trust signal for funded SA-Black industrialists targeting government + corporate procurement.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-c5",
          text: "Engineering News supplier directory listing",
          why: "Highest-traffic SA industrial publication. AI engines harvest it heavily.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "ind-c6",
          text: "BizCommunity industrial listing + press releases",
          why: "BizCommunity is heavily indexed by AI engines. Industrial-focused press releases compound.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-c7",
          text: "Mining Weekly / Coal International / Energize listings (sector-specific)",
          why: "Mining-sector buyers query sector-specific publications. AI engines weight these for mining queries.",
          effort: "medium",
          impact: "authority",
        },
        {
          id: "ind-c8",
          text: "Group / parent company listings (if part of a holding group)",
          why: "Group affiliations are high-trust. AI engines weight institutional context.",
          effort: "quick",
          impact: "growth",
        },
      ],
    },
    {
      property: "Reviews + project case studies",
      description: "Procurement-grade social proof. Case studies > review counts.",
      items: [
        {
          id: "ind-r1",
          text: "Google reviews: 10+ (industrial review counts run lower than consumer)",
          why: "Below 10 = AI treats as unverified. Above 10 + 4.5★ = trustworthy.",
          effort: "compounding",
          impact: "foundation",
        },
        {
          id: "ind-r2",
          text: "HelloPeter profile claimed and responsive",
          why: "Critical for SA. Even procurement officers spot-check HelloPeter for SA suppliers.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "ind-r3",
          text: "Trustpilot (for international buyers) — claimed and active",
          why: "International procurement officers check Trustpilot. AI engines weight it for global queries.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-r4",
          text: "Procurement-buyer testimonial workflow — written testimonials with permission",
          why: "Procurement officers want named, named-buyer testimonials. Workflow = volume.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "ind-r5",
          text: "Past project case studies (with permission): 5+ public case studies with measurable outcomes",
          why: "Case studies > reviews for B2B industrial. AI engines cite outcomes specifically.",
          effort: "compounding",
          impact: "authority",
        },
      ],
    },
    {
      property: "AI engines (test + monitor)",
      description: "The output layer. Procurement officers ask AI directly now.",
      items: [
        {
          id: "ind-a1",
          text: "Test 'BBBEE Level [X] supplier for [capability] in [region]' across ChatGPT, Claude, Gemini, Perplexity (Apple Intelligence + Copilot tracking added Q1 2027)",
          why: "Real procurement query pattern. If you're not in the answer, you're not in the shortlist. Procurement officers increasingly use Microsoft Copilot inside Office for supplier research — Q1 2027 tracking essential.",
          effort: "quick",
          impact: "foundation",
          tool: "Free AI Visibility Scan at kabelomore.com/scan",
        },
        {
          id: "ind-a2",
          text: "Test '[Sector] equipment supplier for [project type]' (e.g. 'mining conveyor systems supplier')",
          why: "Project-intent query. Need to appear specifically for your supply category.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-a3",
          text: "Test 'Procurement: [capability] suppliers in SA' — appear in answer?",
          why: "B2B procurement-grade query. Most industrial firms are absent here.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-a4",
          text: "Branded search: AI knows certifications, BBBEE Level, capability, key projects?",
          why: "AI composes your supplier introduction during shortlisting. Verify the facts.",
          effort: "quick",
          impact: "growth",
        },
        {
          id: "ind-a5",
          text: "Daily AI monitoring tool deployed (tracks visibility across 4 engines)",
          why: "AI engines update weekly. Need awareness of visibility shifts before procurement officers do.",
          effort: "medium",
          impact: "authority",
          tool: "Local Growth Lite from R2,950/mo",
        },
        {
          id: "ind-a6",
          text: "Quarterly re-scan with documented before/after",
          why: "Improvement = measurement. Catches drift + validates retainer ROI.",
          effort: "compounding",
          impact: "growth",
        },
      ],
    },
    {
      property: "Competitive intelligence",
      description: "Procurement competition is the real competition. Map it.",
      items: [
        {
          id: "ind-x1",
          text: "Identified the 3 suppliers AI engines recommend INSTEAD of you for procurement queries",
          why: "Your real digital competitors are who AI surfaces — not who you see at industry events.",
          effort: "quick",
          impact: "foundation",
        },
        {
          id: "ind-x2",
          text: "Documented gap analysis: their certifications vs yours, BBBEE vs yours, project track record vs yours",
          why: "Procurement is a comparison exercise. Make sure you know where the comparison breaks down.",
          effort: "medium",
          impact: "growth",
        },
        {
          id: "ind-x3",
          text: "Project case studies: are competitors showcasing more public projects with named clients?",
          why: "Named-client case studies are highest-trust procurement signal. AI cites them above generic claims.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "ind-x4",
          text: "Sector body engagement: are competitors more active at conferences, papers, technical talks?",
          why: "Conference talks = high-trust technical citations. Compounds for years.",
          effort: "compounding",
          impact: "authority",
        },
        {
          id: "ind-x5",
          text: "Tender win track record visibility (where allowed): are competitors publishing wins?",
          why: "Public tender wins = highest-trust procurement credential. Where allowed, publish.",
          effort: "compounding",
          impact: "authority",
        },
      ],
    },
  ],
  closing:
    "If you complete all 47, your firm will be in the top 5% of SA industrial suppliers on AI visibility — particularly for procurement queries. Most industrial firms score 4-10 out of 47 (the procurement-database category alone is rarely complete). Getting to 35+ shows up within 60-90 days as inbound inquiries from procurement officers who say 'I asked ChatGPT for BBBEE Level [X] suppliers and your name came up.' For industrial B2B with R100k+ deal values, even 1-2 such inquiries per quarter pays for the entire programme several times over.",
};

// ============================================================
// EXPORTS
// ============================================================

export const sectorChecklists: Record<string, SectorChecklist> = {
  medical: medicalChecklist,
  legal: legalChecklist,
  industrial: industrialChecklist,
};

export const sectorChecklistList: SectorChecklist[] = [
  medicalChecklist,
  legalChecklist,
  industrialChecklist,
];

export function getSectorChecklist(slug: string): SectorChecklist | null {
  return sectorChecklists[slug] ?? null;
}
