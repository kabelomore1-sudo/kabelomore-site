# The AEO Audit Playbook

> Your operating manual for every business audit. Built so each one
> generates **revenue (the audit fee or retainer)** and **IP (case study
> material, blog content, leaderboard data, learning that compounds).**
>
> Build → Learn → Earn. Every audit feeds all three.

---

## The 5-Stage System

Every audit follows the same 5 stages. Time-boxed. Repeatable. Scales when
you hire.

| Stage | Time | Output |
|-------|------|--------|
| 1. Pre-audit intake | 15 min | ICP fit confirmed + 3 competitors locked |
| 2. Automated scan | 10 min wait | audit-agent JSON + Phase 2 visual report |
| 3. Manual deep audit | 90 min | Property-by-property findings doc |
| 4. Synthesis | 30 min | Top-10 fixes + tier recommendation |
| 5. Delivery + capture | 15 min | PDF sent + 1 paragraph learning logged |
| **Total per audit** | **~2.5 hrs** | Deliverable + IP capture |

If you run 2-4 audits/week, that's 5-10 hrs/week of free scans → 10-30%
convert to paid → 1 new client every 1-2 weeks → R5-15k/mo new MRR.

---

## Stage 1 — Pre-Audit Intake (15 min)

### Confirm the request

Email from `kabelo@kabelomore.com` within 1 hour of scan request landing:

> Hi [name] — got your scan request for [business]. I'll have your AI
> visibility report in your inbox within 24 hours. While I work, would
> you mind sending me the names of 3 competitors you respect? (Their
> URLs are perfect.) That makes the report 10× sharper.
> — Kabelo

### Confirm ICP fit

Locked ICP: **medical practitioners, legal counsellors, industrial
businesses** with customer value R5k-R500k+.

| ICP fit signals | Decline-and-redirect signals |
|---|---|
| Medical specialist, dentist, aesthetics, GP group | Pure B2C consumer brand (skincare, fashion) |
| Law firm, advocate, advisor | Customer value < R1,000, volume model |
| Industrial supplier, fabricator, contractor, mining services | Agency wanting white-label work |
| BBBEE-certified targeting enterprise/SOE/mining | MLM, crypto, gambling adjacent |

If they're outside ICP: still deliver the scan (free). Add a sentence
to the email: *"Based on what I see, I'm probably not the right fit
for your business model. Here's what I'd recommend instead: [name 1-2
better-fit options]."* Build the karma. Some will refer.

### Pull basic intel before running the scan

Document in Notion / Airtable / spreadsheet:

```
Business name:
Website URL:
GBP URL (search "[business name] [city]" on Google Maps):
LinkedIn — company page:
LinkedIn — founder/principal page (if applicable):
Top 3 services they list (from website):
3 competitor URLs:
ICP segment: [Medical / Legal / Industrial]
Service area:
Customer value estimate: [R5k-50k / R50-500k / R500k+]
```

This 10-line intake is the first input to your **Leaderboard data set**.
Every audit row eventually lives there.

---

## Stage 2 — Automated Scan (10 min)

Trigger via `/api/scan/start` with the URL.

The audit-agent does:
- Discovery (find the entity online)
- Presence check (do AI engines know it exists?)
- Citation analysis (parallel — 4 strategies)
- Visibility simulation (parallel — query 4 engines)
- Recommendation synthesis

**You're free to do other work for 10 min** while it runs. Then the JSON
+ Phase 2 visual report are ready in `/scan/[id]/results`.

### Read the JSON for these signals

| Signal | What it tells you |
|---|---|
| `presenceScore` | Does AI even know they exist? <40 = invisibility crisis |
| `citationCount` | How many third-party trust signals? <10 = foundational gap |
| `engineVisibility` per engine | Where are they weak? (Often: ChatGPT good, Perplexity terrible) |
| `topRecommendations` | The 5-7 fixes audit-agent surfaced |
| `competitorMentions` | Who AI recommends *instead* (the real digital competitors) |

The automated scan is the **floor** of your audit. The next 90 min is
where you 10× the value.

---

## Stage 3 — Manual Deep Audit (90 min)

Where audit-agent sees the surface, the manual layer captures the
**why** — which becomes your IP.

### 3a. Website audit (15 min)

```
Tools: View Source · Google Rich Results Test · Lighthouse · Browser
```

Checklist:
- [ ] Title tags present + descriptive (not just "Home")?
- [ ] Meta descriptions present + benefit-led?
- [ ] H1 tags present + keyword-aware?
- [ ] Schema markup deployed? (Organization, LocalBusiness, Service, FAQ?)
- [ ] Run schema through Google Rich Results Test — any errors?
- [ ] FAQ blocks anywhere?
- [ ] Service pages: structured (one page per service)?
- [ ] Pricing visible (or at least a clear "request quote" CTA)?
- [ ] About page: who runs the firm? credentials visible?
- [ ] Mobile responsive (Lighthouse mobile score >80?)
- [ ] Page speed (Lighthouse perf >70?)
- [ ] /robots.txt exists + sensible?
- [ ] /sitemap.xml exists + complete?
- [ ] /llms.txt exists? (Almost nobody does — this is a quick win for the report)

**Document as bullet list:** what's missing, what's broken, what to fix.

### 3b. Google Business Profile audit (10 min)

```
Tools: Google Maps + Business Profile Manager (if you have access)
```

Checklist:
- [ ] Categories filled correctly? (Primary + 5-9 secondary?)
- [ ] Services listed individually (not just bullets in description)?
- [ ] Hours present + accurate?
- [ ] Address visible (or service-area set if mobile)?
- [ ] Phone + website + email visible?
- [ ] Photos: how many? (target 30+) When was the last photo added?
- [ ] Posts: how many in last 90 days? (target 1+/week)
- [ ] Q&A section: any questions? answered by the business or randos?
- [ ] Reviews count, average rating, response rate?
- [ ] Special features: appointment link, menu, products, etc.?

Score them on a **GBP Completeness scale 1-10**.

### 3c. LinkedIn audit (10 min)

Company page:
- Followers count, posting cadence (last 30 days), engagement rate
- Industry tag accurate?
- About section keyword-rich + buyer-focused?
- Founder/principal tagged?

Founder/principal personal:
- Headline: "Doctor at X" or "Founder & Principal Surgeon at X"?
- About section: long-form story or just job titles?
- Posting cadence: posts per week, last 30 days?
- Activity: are they commenting on industry posts?

**The signal:** does ChatGPT/Perplexity have ENOUGH LinkedIn content from
this person/firm to recommend them as a category authority? Almost always:
no. This is the easiest compounding win to sell.

### 3d. Citations audit (15 min)

```
Tools: Google search + manual checking + the audit-agent's output
```

Tier 1 citations (everyone should have):
- [ ] Brabys
- [ ] Cylex
- [ ] Yellow Pages SA
- [ ] Snupit
- [ ] dotsa
- [ ] Yelp (if international)

Tier 2 — industry-specific (the high-trust ones):

For **medical**:
- [ ] HPCSA registry
- [ ] Discovery Network (if accepting)
- [ ] Bonitas / Momentum / GEMS provider lists
- [ ] FindADoc / Vermeulen Specialists
- [ ] South African Medical Association directory

For **legal**:
- [ ] Law Society of SA listing
- [ ] LSSA member directory
- [ ] LegalCity / Saflii author profiles
- [ ] HLB Legal (if commercial)
- [ ] State Attorney roll (if applicable)

For **industrial**:
- [ ] BBBEE Verification Agency listing
- [ ] CSD (Central Supplier Database — ESSENTIAL for SOE work)
- [ ] CIDB (Construction Industry Development Board)
- [ ] Mining suppliers — DMRE, Mining Weekly directories
- [ ] BizCommunity industrial listing
- [ ] Engineering News supplier directory
- [ ] SAEEC (Energy efficiency if applicable)
- [ ] BBBEE-Level prominently displayed?

**Document:** which they have, which are missing. The missing list is
half the citation deliverable for the retainer.

### 3e. Reviews audit (10 min)

Platforms by ICP:

| ICP | Primary platform | Secondary | International |
|-----|------------------|-----------|---------------|
| Medical | Google Reviews | HelloPeter | Realself (aesthetics), RateMDs |
| Legal | Google Reviews | HelloPeter | Avvo (US), Yell (UK) |
| Industrial | Google Reviews | HelloPeter | Trustpilot, IndustrialQuoter |

Numbers to capture:
- Total review count
- Average rating
- Last review date (recency matters for AI engines)
- Response rate (responding signals trust)
- Negative reviews — handled professionally?

**Quick win to flag:** "You have 12 Google reviews and 0 HelloPeter reviews.
HelloPeter is the largest SA review platform — your competitors with 50+
HelloPeter reviews are getting recommended by ChatGPT in conversations
where you're not even mentioned."

### 3f. AI engine deep-dive (15 min)

Beyond what audit-agent runs, do **3 query types** manually across all 4
engines (ChatGPT, Claude, Gemini, Perplexity):

1. **Generic intent query**:
   - "Best [specialty] in [city]"
   - "Top [type of firm] for [client type]"
   - "Who are the leading [service providers] in [region]?"

2. **Specific buyer query**:
   - For medical: "Best cardiologist in Sandton who accepts Discovery"
   - For legal: "Top commercial law firm in Cape Town for SaaS startups"
   - For industrial: "BBBEE Level 1 fabricator in Gauteng for mining contracts"

3. **Branded query**:
   - "Tell me about [business name]"
   - "Reviews for [business name]"
   - "Is [business name] reputable?"

**Capture verbatim what each engine says + screenshot.** This is GOLD for:
- The deliverable (clients love seeing AI's exact words)
- Case study material (before/after AI responses)
- Blog content ("I asked ChatGPT about 30 SA medical practices. Here's what it said.")
- The Leaderboard

### 3g. Competitive benchmark (15 min)

For each of the 3 competitors, do a **quick version** of 3a-3f. 5 min each.

You're looking for:
- What is competitor doing that this client isn't?
- Where is competitor citation-rich and client citation-poor?
- What schema does competitor have that client lacks?
- Which AI engines mention competitor but not client?

**This is the competitive intel block in the deliverable.** Buyers love this.

---

## Stage 4 — Synthesis (30 min)

Now you turn 90 minutes of findings into a clear recommendation.

### Top 10 fixes ranked by impact × effort

Use this matrix:

```
              LOW EFFORT          HIGH EFFORT
HIGH IMPACT   Quick wins (do      Compounding work
              first / today)      (retainer territory)

LOW IMPACT    Nice-to-have        Don't bother
              (mention,          (don't even mention)
              don't push)
```

Examples:
- **HIGH IMPACT, LOW EFFORT:** Add llms.txt (15 min, AI engines start citing within 30 days)
- **HIGH IMPACT, HIGH EFFORT:** Build founder LinkedIn personal brand (compounding, retainer)
- **LOW IMPACT, LOW EFFORT:** Update business hours on GBP (mention but don't sell)
- **LOW IMPACT, HIGH EFFORT:** Redesign the website (NOT what AEO needs)

### Tier recommendation logic

```
IF presenceScore < 40 AND no GBP claimed:
  RECOMMEND: Foundation Pack (R12,500) — they have nothing yet

ELSE IF website exists BUT no schema, no citations, GBP unclaimed:
  RECOMMEND: Optimization Pack (R10,500) — fix existing site

ELSE IF foundations OK BUT no ongoing growth, missing LinkedIn presence:
  - Solo practitioner → Local Growth Lite (R2,950/mo)
  - Multi-doctor / multi-attorney / 5-30 staff → Local Growth (R5,500/mo)

ELSE IF foundations OK AND wants category leadership:
  - Established firm 10+ doctors / 15+ attorneys / R50M+ industrial → AI Authority (R10,500/mo)
  - Multi-region mid-market+ → Strategy Partner (R20,000/mo)

ELSE IF unclear: book the 20-min discovery call
```

### What goes in the deliverable

A 2-page PDF:

**Page 1 — The headline finding**
- Hero stat (e.g., "Out of 4 AI engines, only 1 recommends you. Your 3 competitors get recommended by all 4.")
- 1-paragraph summary of where they stand
- The visualization (use Phase 2 charts: ScoreGauge, EngineHeatmap, etc.)

**Page 2 — The action plan**
- Top 10 fixes ranked
- Tier recommendation with reasoning
- Next step CTA (book 20-min call OR "Start [Tier Name] today")

---

## Stage 5 — Delivery + Learning Capture (15 min)

### Delivery email template

```
Subject: Your AI Visibility Scan — [Business Name]

Hi [name],

Your AI Visibility Scan is attached. Quick summary:

→ [HEADLINE FINDING in one sentence]
→ Of the 4 AI engines (ChatGPT, Claude, Gemini, Perplexity),
   [N] recommend you when your customers ask.
→ Your top 3 competitors are getting cited [more frequently / on
   X engines vs your Y / for X queries you should also rank for].

The full report is in the PDF. The 3 highest-leverage fixes:

  1. [QUICK WIN]
  2. [COMPOUNDING WIN]
  3. [STRATEGIC WIN]

Want to walk through it on a free 20-min call? Here's my calendar:
[calendly link or "reply with a time that suits"]

If you'd rather just have me start fixing things, the closest tier
is [TIER NAME] at [price] — see kabelomore.com/services/#[tier-id].

— Kabelo
```

### Learning capture (CRITICAL — this is the IP loop)

Before closing the audit file, write 1-3 paragraphs to a file called
`/learnings/YYYY-MM-DD-[business].md`:

```markdown
# Learning: [Business Name] audit, [Date]

**ICP:** [Medical / Legal / Industrial], [size descriptor]

**Top finding:** [the most surprising thing]

**Pattern this confirms:** [link to 2-3 prior audits showing same pattern]

**Pattern this breaks:** [if anything]

**Quotable insight:** [a sentence good enough for LinkedIn or blog]

**Case study eligibility:** [Yes / No] — if yes, capture before-state
fully so we can re-scan in 30/60/90 days.

**Leaderboard add:** [Yes / No] — if yes, ensure they're in the public
SA AEO Index next monthly update.
```

### Where each output flows

| Output | Destination |
|---|---|
| Verbatim AI responses | Case study database (with timestamps) |
| Citation patterns | Industry citation list (becomes a paid PDF over time) |
| Schema findings | Blog content ("Schema patterns in 30 SA medical sites") |
| Quotable insight | LinkedIn post within 24h |
| Tier recommendation | CRM (Notion/Airtable) — track conversion rate by tier |
| Learning file | Private knowledge base — feeds methodology refinement |

---

## The Build / Learn / Earn Loop

Every audit produces:

```
              EARN                LEARN              BUILD
              ─────               ──────             ──────
Audit fee  ──→ R0 (free scan)  + Pattern noticed  + Case study
                R5,000 (Starter)  Quotable insight   Leaderboard row
                R3,500 (Sprint)   Tier conversion    Methodology update
                                  hypothesis tested  Blog post draft
                                                    LinkedIn post
                                                    Newsletter content
```

After 30 audits you have:
- **30 case study candidates** (5-10 will be willing to be public)
- **30 leaderboard rows** (start of "The SA AEO Index")
- **30 LinkedIn posts** (1 per audit, daily content)
- **6-8 blog posts** (each one synthesises 5+ audits)
- **Pattern recognition** that no competitor can match
- **R30,000-R150,000 in audit/Sprint revenue** + ongoing retainer pipeline

This is why the playbook is the most important document. The audits ARE
the marketing engine, the IP factory, AND the revenue stream — at the
same time.

---

## Operational Tools You Need

| Need | Tool | Status |
|---|---|---|
| Audit intake form | scan-form.tsx (built) | ✅ |
| Audit-agent runner | /api/scan/start (built) | ✅ |
| Audit-agent results display | scan-results-client.tsx + 5 SVG charts (built) | ✅ |
| Manual deep-audit checklist | THIS FILE | ✅ |
| Audit tracker / CRM | Notion or Airtable database | TODO |
| Learning capture | /learnings folder + monthly review | TODO |
| Leaderboard generator | Airtable → Vercel page | Phase 3 |
| Newsletter draft engine | Audit findings → weekly email | Phase 3 |

---

## Time Budget — How Many Audits Per Week?

If 1 audit = 2.5 hrs:

| Audits/week | Hours/week | Pipeline value (10% conv to R5,500/mo retainer) |
|---|---|---|
| 2 | 5 hrs | +R1,100/mo MRR per week × 12 weeks = R13,200 added MRR |
| 4 | 10 hrs | +R2,200/mo MRR per week × 12 weeks = R26,400 added MRR |
| 6 | 15 hrs | +R3,300/mo MRR per week × 12 weeks = R39,600 added MRR |

Realistic target year 1: **3-4 audits/week, average 1 retainer signed
every 2 weeks, ~R30k MRR by month 12.**

That funds the leverage build (newsletter, leaderboard, SaaS, book).

---

## Final Note on the Operating Mindset

Every audit should leave you **more knowledgeable than you started**. If
you finish 10 audits and notice no patterns, you're skipping Stage 5's
learning capture. The whole compounding loop fails.

The audits aren't transactions. They're **compounding investments in
your future expertise.** Treat them that way.

— Kabelo
