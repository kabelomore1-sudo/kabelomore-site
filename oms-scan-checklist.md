# OMS Lifting Solutions — Baseline AI Scan Checklist

Action checklist for capturing the Day-0 baseline data on OMS before kicking off the engagement. This is the data that becomes the BEFORE half of the public case study.

**Why this matters:** the case study is your single biggest sales asset. The Day-30 rescan is meaningless without rigorous Day-0 data captured BEFORE any AEO work begins.

---

## Step 1 — Run all 4 queries on all 4 engines

For each engine below, run ALL 4 queries. Screenshot every response (full page, showing the engine UI). Save with consistent naming so you can find them later.

### Queries to run

1. `lifting equipment supplier Pretoria BBBEE Level 1`
2. `crane inspection company Pretoria South Africa`
3. `load testing certification Gauteng industrial`
4. `BBBEE Level 1 equipment hire Pretoria mining`

### Engines (4 each, total 16 screenshots)

- [ ] **ChatGPT** — chat.openai.com — use GPT-4o or higher, web search ON
- [ ] **Claude** — claude.ai — standard chat
- [ ] **Gemini** — gemini.google.com — standard chat
- [ ] **Perplexity** — perplexity.ai — standard search mode

### Screenshot naming convention

```
oms-chatgpt-q1-lifting.png
oms-chatgpt-q2-crane.png
oms-chatgpt-q3-load-testing.png
oms-chatgpt-q4-bbbee.png

oms-claude-q1-lifting.png
... and so on for Gemini, Perplexity
```

### What to note for each query

In a separate Notion / Google Doc:
- Did OMS appear in the response? **YES / NO**
- If NO: which 3-5 businesses did the engine recommend instead?
- Copy/paste the verbatim AI response text (you'll quote this in the case study)

---

## Step 2 — Structured data audit

- [ ] Run `https://omslifting.co.za` through **https://validator.schema.org**
- [ ] Note: what schema types are present? What's missing?
- [ ] Run through **Google Rich Results Test** (`https://search.google.com/test/rich-results`)
- [ ] Screenshot the validator output

**What to record:**
- Schema types found: [list]
- Schema types missing (LocalBusiness, Service, FAQPage, Organization, etc.): [list]
- Validation errors / warnings: [count]

---

## Step 3 — Google Business Profile audit

- [ ] Search "OMS Lifting Solutions" on Google Maps
- [ ] Check each field, score 0-10 on completeness:
  - Categories set (primary + secondary)?
  - Services listed in detail?
  - All hours complete (regular + special)?
  - Photos present (10+ ideally)?
  - Posts active (recent)?
  - Q&A populated?
  - Reviews + responses?
  - Description ≥ 750 chars with keywords?
  - Attributes set (BBBEE, woman-owned, etc.)?

**Capture:** screenshot of the GBP listing as it appears in Google Maps + Google Search right panel.

---

## Step 4 — Citation audit

Search "OMS Lifting Solutions" on each of these. Note: is the business listed? Is NAP (Name, Address, Phone) consistent?

- [ ] brabys.com
- [ ] cylex.co.za
- [ ] hellopeter.com
- [ ] b2bhint.com
- [ ] yellowpages.co.za
- [ ] sayellow.com
- [ ] showme.co.za
- [ ] LinkedIn company page
- [ ] CIDB register (if applicable)
- [ ] LME register (Department of Labour) — `https://www.labour.gov.za`
- [ ] LEEASA member register (if exists publicly)
- [ ] SAIMM directory (if listed)
- [ ] Bing Places (Bing AI / Copilot signal)
- [ ] Apple Business Connect (Apple Maps + Siri signal)

**Capture:**
- Total citation count
- Number with consistent NAP
- Number with inconsistent NAP (record specific inconsistencies)
- Number missing entirely

---

## Step 5 — Competitor benchmark

From the AI scan results, identify the top 2 competitors that ChatGPT/Claude/Gemini/Perplexity recommended INSTEAD of OMS.

For each top competitor:
- [ ] Check their schema using `validator.schema.org`
- [ ] Count their citations using `"[competitor name]" site:brabys.com` etc.
- [ ] Check their GBP completeness score
- [ ] Note their reviews count

**Why:** this tells you exactly why AI chose them over OMS. The case study will document the gap to close.

---

## Step 6 — Upload to case study

- [ ] Create folder: `/public/images/oms-scan/`
- [ ] Upload all 16 query screenshots (named per the convention above)
- [ ] Upload schema validator screenshot
- [ ] Upload GBP audit screenshot
- [ ] Update `app/(marketing)/case-studies/oms-lifting-solutions/page.tsx` (look for `{/* TODO: INSERT_REAL_DATA */}` markers — drop in the real data per Task 6 of the master brief)

---

## Step 7 — Use it on LinkedIn (the highest-leverage move)

Once Day-0 is captured, immediately:

- [ ] Post the ChatGPT screenshot to LinkedIn with this caption:

> *"OMS Lifting Solutions has been operating in Pretoria for years. They have a website. They have a Google Business Profile. When a procurement manager asks ChatGPT for the best BBBEE Level 1 lifting equipment supplier in Pretoria — OMS doesn't come up."*
>
> *"This is what AEO (Answer Engine Optimisation) actually means in 2026. The work over the next 30 days: schema deployment, GBP rebuild, 10+ citations, answer-shaped content. The Day-30 rescan publishes here."*
>
> *"#AEO #AISearch #LocalSEO #SouthAfrica"*

- [ ] Tag the cousin who built OMS's site (with permission) — preserves the relationship + credits the foundation work
- [ ] Pin the post to your profile featured section

---

## Step 8 — Schedule the Day-30 rescan

- [ ] Add to calendar: 30 days from today, run the EXACT same 4 queries on the EXACT same 4 engines
- [ ] Capture the new screenshots with the same naming convention but `-day30-` suffix
- [ ] Update the case study with the AFTER data
- [ ] Post the before/after on LinkedIn — this is the moment the case study earns its keep

---

## Why this rigor matters

A loose case study with vague before/after claims = 1× the conversion impact.

A rigorous case study with timestamped screenshots, named queries, named competitors, named tools used = 10× the conversion impact. Every prospect will ask: *"can you prove the methodology works?"* This is your proof.

The 8 hours of Day-0 capture work pays back across 50-100 sales conversations over 12 months.
