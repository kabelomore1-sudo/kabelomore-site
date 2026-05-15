# Competitive analysis — Ubersuggest "AI Search Visibility"

**Date:** 2026-05-14
**Analyst:** Kabelo More (assisted)
**Subject:** Neil Patel / Ubersuggest AI Search Visibility tool (`app.neilpatel.com/en/ai-search`)
**Method:** 14 genuine Ubersuggest mobile screenshots (scan of "Omslifting" / OMS Lifting Solutions — industrial lifting equipment, South Africa) reviewed by OCR triage + true image vision. 2 additional screenshots in the source set were our own `kabelomore.com/scan` and set aside as current-state baseline.

> Source set: 16 unique images (24 files incl. duplicate `- Copy` variants). 14 Ubersuggest, 2 kabelomore.com. Of the 14: 6 are loading-splash tip screens, 8 are real product screens (1 signup gate + 7 data views).

---

## 1. What Ubersuggest's tool actually is

A self-serve, automated AI-visibility dashboard. You enter a brand + topic, it tells you how often AI engines mention you, who gets mentioned instead, and what people ask the AI in your category. **Refresh cadence is monthly** — the UI states "Next AI Update Cycle in 30 days". Default engine is **ChatGPT**; **Gemini is a paid upsell**.

It is diagnosis-only. There is no remediation, no verbatim AI answer text, and no methodology disclosure.

## 2. Data model (the metrics it exposes)

| Metric | What it shows | Tier |
|---|---|---|
| **Brand Visibility %** | Share of AI responses mentioning you (our OMS scan: **0%**) | Free |
| **Your Industry Rank** | Ordinal vs competitors (OMS: blank "—", i.e. absent) | Free |
| **Top Prompts** | The actual queries users ask the AI in your category, with **intent badges** (Informational / Navigational / Transactional) | Free (list) |
| **Top Brands (table)** | Competitor name + logo + **Avg. rank** (position when cited) | Free (top ~5) |
| **Brands Visibility By Topic** | Per-topic competitor visibility scores | **Paid** |
| **Top Brands Visibility (chart)** | Bar chart of competitor share | **Paid** |
| **Prompts Intent (chart)** | Intent distribution donut/scatter | **Paid** |
| **Multi-engine (Gemini)** | ChatGPT vs Gemini comparison | **Paid** |
| **Prompt "+" expansion** | (Inferred) per-prompt detail / why a brand was cited | **Paid** |

Filters: topic, date range ("Last 30 days"), engine.

### The competitor set it surfaced for OMS
Top Brands table (free, with Avg. rank): **Machine Moving & Engineering (MME) 1.00**, **Condra Cranes & Hoists 2.00**, **Hoist Factory 2.50**, **JGS Lifting 3.00**, **Elephant Lifting Equipment 4.50**. (Lower avg. rank = cited earlier/more prominently.)

### The prompts it mined (free, full list)
1. "What's the best industrial lifting equipment for heavy machinery in South Africa?" — *Informational*
2. "Where can I find reliable industrial lifting equipment suppliers near me?" — *Navigational*
3. "Industrial lifting equipment vs hydraulic cranes: which is better for factory use?" — *Informational*
4. "Recommendations for industrial lifting equipment that supports loads over 10 tons." — *Informational*
5. "Which industrial lifting equipment should I choose for warehouse operations?" — *Informational*

### Their "fixes" vocabulary (from loading-splash tips)
HTTPS is non-negotiable · Link to authority sources · Search Console is your friend · Write like you're talking to a friend (conversational) · Create FAQ goldmines · Make it scannable (break text every 150–200 words). Generic SEO hygiene — **no business-specific remediation anywhere in the actual product**.

## 3. Free vs paid boundary

**Free (after mandatory signup):** headline Brand Visibility %, Industry Rank value, competitor names + logos, full Top Prompts list with intent badges, Top Brands table with Avg. rank for ~top 5.

**Paid (Upgrade):** all chart *values*, per-topic visibility scores, intent distribution, extended rankings beyond top 5, Gemini/multi-engine, and (inferred) the prompt-level "why".

## 4. The funnel psychology (worth stealing the framing, not the model)

- **Gut-punch first.** The first authenticated number is a stark **"0%"** plus an empty Industry Rank dash. Instant "you are invisible".
- **Curiosity-gap monetisation.** Competitor *names and logos* are free (concrete threat) but their *scores* are padlocked — you can see who beat you, not by how much, unless you pay.
- **Consistent paywall UI.** Orange padlock + "Upgrade to unlock data" + button, overlaid on a *faintly visible* (teased) chart so structure is shown but data isn't.
- **Two upsell flavours:** hard modal locks (charts) and soft banner upsells (Gemini "now available!").
- Clean single-column mobile layout, sticky filter dropdowns, "?" help icons everywhere that imply depth but never explain methodology.

## 5. Where a manual expert report beats this

| Ubersuggest weakness | Our advantage |
|---|---|
| No verbatim AI responses — shows *that* you're at 0%, never the actual answer text | We quote the exact AI response and name who got recommended and why |
| No methodology transparency (model? runs? region?) | We disclose proxy engine, date, query rationale (already in /scan FAQ) |
| Pure diagnosis, **zero remediation** | We ship the 3 highest-leverage fixes, tailored to the business |
| Monthly-only, ChatGPT-default | On-demand, multi-engine proxy (Claude + live web standing in for ChatGPT/Gemini/Perplexity), re-test after fixes |
| Generic auto-generated prompts | Buyer-language, SA-localised queries we can validate |
| Core actionable data is paywalled | Fixed-fee report delivers the *full* picture — "see your problem, pay to see how bad" is the model we out-position |

## 6. Net takeaway

Ubersuggest validates the market and the metric vocabulary, but its product is **"see your problem, pay to see how bad it is."** Its single strongest feature is **prompt mining + intent classification** — it surfaces the real category questions users ask the AI, which makes the diagnosis credible and specific. That is the one capability we should adopt fastest. Everything else they gate or omit (verbatim answers, remediation, methodology, multi-engine) is already our differentiation surface — we should make it louder, not just present.

See `2026-05-14-scan-engine-upgrades.md` for the prioritised ticket list.
