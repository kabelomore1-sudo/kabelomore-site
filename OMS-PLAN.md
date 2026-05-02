# OMS Lifting Solutions — Operational Plan (the flagship)

> The first real application of every playbook in this repo. OMS is
> already on /case-studies/oms-lifting-solutions and /proposals/oms-lifting,
> already in the leaderboard as the sole 'Verified' entry, and already
> active per the published status: "In progress · Day 30 rescan pending."
>
> This plan integrates AUDIT-PLAYBOOK + CLIENT-OPERATIONS-SYSTEM +
> LINKEDIN-PLAYBOOK + WEEKLY-OPERATING-RHYTHM specifically for OMS.
>
> **Strategic frame**: OMS is the precedent. Every future industrial
> client will compare their experience to "what OMS got." Make this one
> count. Document obsessively. The case study OMS becomes is the trust
> artifact that converts the next 30 industrial prospects.

---

## The Position OMS Holds

| Asset | OMS's role |
|-------|------------|
| Live case study on /case-studies | First (and currently only) real before/after on the site |
| Public proposal at /proposals/oms-lifting | Template for every future named industrial proposal |
| Leaderboard entry (#1, Verified) | Sole consenting entry — defines what "Verified" looks like |
| Newsletter content | Issue 1 of The AEO Letter is built on OMS data |
| LinkedIn content series | 4-week build-in-public sequence anchors your industrial-sector positioning |
| Case study template | Every future named industrial case study mirrors this structure |

**Translation**: OMS is not a single client. OMS is the *prototype* for
how the entire industrial vertical works for you. Get this right and
2027's industrial pipeline writes itself.

---

## What's Already Done (per published site state)

Confirmed from the public site:
- BBBEE Level 1 confirmed
- 5 years of mining contracts (track record established)
- 89+ certified inspections (operational credibility)
- Day 0 baseline: 0 citations across 4 AI engines, no schema deployed
- Status as of last commit: "In progress · Day 30 rescan pending"

So OMS is in the **post-baseline, pre-rescan** window. The Day 30
rescan is the next major milestone.

---

## The OMS Week — Mon to Sun

### Monday — Day 30 Rescan + Baseline Comparison

**8-9am — Cafe (Brooklyn or Menlyn)**
- Open OMS folder in your CRM. Re-read the original Day 0 audit.
- Pull up the 4 AI engine queries you ran on Day 0. Write them down.

**9-12pm — Run the Day 30 rescan**
- Trigger automated scan via /api/scan/start with OMS website URL
- While scan runs, manually re-test the same 4 queries on ChatGPT,
  Claude, Gemini, Perplexity. Screenshot every response.
- Compare verbatim against Day 0 captures. Mark every difference.

The 4 queries to test (per CASE STUDY consistency):
1. "Best lifting equipment supplier in Pretoria"
2. "BBBEE Level 1 lifting equipment SA"
3. "Mining lifting equipment certified suppliers Gauteng"
4. "OMS Lifting Solutions" (branded)

**1-2pm — Lunch**

**2-4pm — Document the delta**

Build a comparison table:

```
┌────────────────────────┬─────────────────┬─────────────────┐
│ Metric                 │ Day 0 (Apr 1)   │ Day 30 (May 4)  │
├────────────────────────┼─────────────────┼─────────────────┤
│ ChatGPT mentions       │ 0               │ ?               │
│ Claude mentions        │ 0               │ ?               │
│ Gemini mentions        │ 0               │ ?               │
│ Perplexity mentions    │ 0               │ ?               │
│ Schema deployed        │ None            │ ?               │
│ Citations              │ ? baseline      │ ?               │
│ Reviews count          │ ? baseline      │ ?               │
│ LinkedIn followers     │ ? baseline      │ ?               │
└────────────────────────┴─────────────────┴─────────────────┘
```

Save to `/learnings/oms-day-30-rescan.md` in the repo. This becomes
public when you're ready to publish.

**4-5pm — LinkedIn post: "OMS Day 30 — what changed"**
- Honest. Specific. Numbers (even if 0 → 1, that's a real signal).
- Pair with a Magaliesberg-cradle photo if you took one Sunday.

### Tuesday — Update the case study + proposal pages

**8-12pm — Update /case-studies/oms-lifting-solutions**

Read the current file. Update:
- Status: "Day 30 rescan complete" (was "Day 30 rescan pending")
- Add a "Day 30 results" section with the comparison table from Monday
- Add screenshots of the AI engine responses (anonymise client-specific
  details if needed)
- Add a quote from OMS leadership if they'll provide one

If they haven't given a quote yet, draft one and request approval:

```
Subject: Quick request — quote for the case study

Hi [OMS contact name],

The Day 30 rescan results are in (attached). [Specific metric, e.g.
"You went from 0 mentions across all 4 AI engines to mentions on 2 of
4."]

I'd like to publish the case study update on kabelomore.com this week.
Could you share a 1-2 sentence quote about your experience so far? Even
something simple like:

"We knew we had digital gaps but didn't know AI engines were our biggest
blind spot. Kabelo's audit showed exactly what to fix and we're seeing
real movement in 30 days." — [Name], [Title], OMS Lifting Solutions

Or whatever phrasing works for you. I'll send a draft of the case study
section before we publish — nothing goes live without your sign-off.

— Kabelo
```

**1-3pm — LinkedIn post: deeper case study tease**
- Reference Monday's post.
- Tease specific numbers ("Going from 0 to N AI mentions in 30 days
  showed me [PATTERN]")
- Link to /case-studies/oms-lifting-solutions for the full story.

### Wednesday — HIKE + Synthesis

**6-10am — Magaliesberg hike**

Take 3 questions on the notecard:

1. "What did the OMS Day 30 data tell me that I didn't expect?"
2. "What's the ONE thing OMS got right that other SA industrial firms
   don't do?"
3. "What's the ONE thing every BBBEE Level 1 supplier should fix this
   month based on OMS's pattern?"

**Sit at the summit / mid-trail. Capture 1 quotable line.**

Possible shape (Naval-style — adjust to whatever actually emerges):

> "BBBEE Level 1 verification on a website is decoration. BBBEE Level
> 1 visible in Q&A on your GBP, named in your schema, cited by Engineering
> News — that's procurement-grade. OMS taught me that gap is the entire
> SA industrial AEO opportunity."

**12-4pm — Cafe**
- Pull up the OMS data + the hike insight.
- Draft Wednesday's LinkedIn post: methodology breakdown using OMS as
  the worked example.
- Draft Thursday's newsletter (Issue 1): "What 30 days with OMS taught
  me about SA industrial AEO."

**4-5pm — LinkedIn post + photo from the hike**

### Thursday — Newsletter Issue 1 (The Real First Issue)

**8-11am — Write Issue 1 of The AEO Letter**

This replaces the placeholder "Welcome" issue with substantive content.
Title:

> "Issue 1: 30 days with OMS — what fixing one SA industrial supplier
> taught me about the entire vertical."

Add to `lib/newsletter-issues.ts`. Structure (200-400 words):

1. **The setup** (50 words) — OMS is BBBEE Level 1, 5 years mining
   contracts, 89+ certified inspections, was invisible to every AI
   engine on April 1.
2. **The 30-day deltas** (80 words) — specific numbers (X→Y citations,
   Z schema markup deployed, W AI engine mentions appeared).
3. **The pattern** (100 words) — what this tells me about SA industrial
   firms in general. The non-obvious insight from Wednesday's hike.
4. **The fix** (80 words) — one specific thing every SA industrial firm
   should do this month, drawn from OMS's experience.
5. **CTA** (20 words) — link to /resources/industrial or /scan.

**1-3pm — Update /newsletter index page** (if needed) so Issue 1 lands
clean.

**3-4pm — LinkedIn Thursday post (newsletter teaser)**
- Tease the OMS-30-days story
- Link to /newsletter/issue-1-oms-30-days (or whatever slug you choose)

**4-5pm — Notify any current newsletter subscribers**
- Resend send via /api/newsletter (if subscriber list isn't auto-wired
  to broadcast yet, send manually for Issue 1)
- Email subject: "Issue 1: 30 days with OMS — and what it taught me"

### Friday — Schema deployment (if not done) + LinkedIn

**8-12pm — Continue OMS implementation work**

Whatever the next item on OMS's CLIENT-OPERATIONS plan is:
- Schema not yet deployed? Do it.
- Citations < 5? Submit 2-3 industry-specific (DMRE, Mining Weekly,
  Engineering News supplier directory).
- LinkedIn ghost-writing for OMS leadership starts? Draft post 1.
- HelloPeter not claimed? Claim it.

**1-3pm — Document Friday's progress**
- Status update email to OMS contact (the 3-day cadence promise)
- Add to OMS Notion CRM row
- Update `/learnings/` if any new pattern emerged

**3-5pm — LinkedIn post: Friday sector-specific tip**
- Drawn from Friday's deployment work.
- Format: "If you're a SA industrial firm targeting BBBEE-aligned
  procurement, do this in 15 minutes: [SPECIFIC TIP from OMS work]."
- Link to /resources/quick-wins/industrial.

### Saturday — LONG HIKE (big synthesis)

**7am-12pm — Magaliesberg longer trail (or rotate)**

Bigger questions today:

1. "Now that OMS has 30 days of data, what's the methodology
   adjustment? What changes in The Real Estate Method based on what I
   actually learned vs theorized?"
2. "What's the pricing question — is OMS getting more value than the
   tier price suggests? Should industrial clients be priced differently?"
3. "What's the next industrial client I should target — and what's the
   hook based on OMS's results?"

**1-3pm — Capture insights**
- Update `/learnings/index.md`
- If methodology shifted: note it. Maybe AUDIT-PLAYBOOK needs an edit
  next week.
- Draft prospecting list for next week's 5 audits — at least 3 should
  be industrial firms (capitalise on the OMS pattern).
- If pricing shifted: note it. Maybe an industrial-specific tier is
  warranted.

### Sunday — Rest + batch

**Morning: REST.**

**2-5pm — Sunday batch**
- Write next week's Mon-Fri LinkedIn posts (5 posts) — at least 2
  reference OMS as the worked example (compounding the brand
  association).
- Update leaderboard: bump OMS's score if Day 30 data warrants it.
- Update `/learnings/` index.
- Identify next week's 5 prospects (3 industrial, 1 medical, 1 legal).
- Block calendar for next week.
- If OMS case study v2 is ready to publish (with their quote), schedule
  the publish for Tuesday next week.

---

## What to Capture for the Case Study (the IP-rich version)

OMS becomes the template every future named case study mirrors. Capture
**aggressively** during this week and the following 60 days.

### Visuals (must-haves)

```
[ ] Screenshot of every AI engine response — Day 0
[ ] Screenshot of every AI engine response — Day 30
[ ] Screenshot of every AI engine response — Day 60
[ ] Screenshot of every AI engine response — Day 90 (publish trigger)
[ ] GBP screenshot before/after (categories, posts, photos count)
[ ] LinkedIn company page before/after
[ ] Schema markup screenshots (Rich Results Test before/after)
[ ] Citation count before/after (with directories listed)
[ ] Reviews count + rating before/after
[ ] Magaliesberg photo from synthesis hike (for "behind the scenes")
```

### Numbers (must-track)

```
[ ] Day 0 baseline metrics (fully populated)
[ ] Day 30 metrics (filling in this week)
[ ] Day 60 metrics (in 30 days)
[ ] Day 90 metrics (publish-ready milestone)
[ ] If OMS shares it: any inbound inquiries that mention "AI" or
    "ChatGPT" since work began
[ ] Any new contracts won in the period (correlate with AI visibility)
```

### Quotes (capture along the way)

```
[ ] OMS leadership quote at Day 30 (this week)
[ ] OMS leadership quote at Day 90 (publish-ready)
[ ] Direct quote from a procurement officer (if any reach out citing AI)
[ ] Internal team quote (operational lead, marketing, etc.)
```

### Permissions document

```
[ ] Written confirmation OMS is OK to be named publicly
[ ] Permission to use BBBEE Level 1 status in marketing
[ ] Permission to name mining contracts (with appropriate redaction)
[ ] Right to use the case study URL as a reference for future prospects
[ ] Right to mention OMS in newsletter, LinkedIn, and conference talks
```

A simple email confirming all of the above is enough — it doesn't need
to be a contract.

---

## Case Study v2 (publish-ready by Day 90)

Building on the existing /case-studies/oms-lifting-solutions, the v2
version (publishable June 2026) should include:

1. **Hero section** — refreshed with Day 90 numbers in the metrics
   block.

2. **Day 0 / Day 30 / Day 60 / Day 90 timeline** — visual chronology
   with specific actions and outcomes for each milestone.

3. **The exact methodology applied** — which of the 7 properties were
   touched, in what order, with what effort. Mirror the AUDIT-PLAYBOOK
   structure.

4. **Quantified outcomes** — citations growth, AI engine appearances,
   reviews growth, GBP completeness shift, schema deployment specifics.

5. **What it cost (approx)** — be honest about what tier OMS is on
   (Local Growth or Local Growth Lite or Foundation Pack — whichever
   applies). Show the ROI math.

6. **Two quotes** — one from OMS leadership, one from an internal lead
   if available.

7. **What's next** — Day 180 milestone, what we're working on now.

8. **CTA** — "Want similar results for your firm?" → /scan.

The publish-ready v2 is the trust artifact that converts the next 30
industrial prospects.

---

## LinkedIn Content Plan — OMS as Worked Example for 4 Weeks

### Week 1 (this week)
- Mon: "Day 30 OMS results"
- Tue: "What changed in 30 days — specific numbers"
- Wed: Methodology breakdown + Magaliesberg insight
- Thu: Newsletter teaser
- Fri: "If you're a SA industrial firm: do this 15-min fix"

### Week 2
- Mon: "OMS Week 5 update — citations submitted to DMRE"
- Tue: Quote from the week ("BBBEE Level 1 visibility ≠ BBBEE Level 1
  certification")
- Wed: Methodology + photo from Hennops hike
- Thu: Newsletter Issue 2 (build on OMS pattern, expand to 2nd industrial firm)
- Fri: Quick-wins post

### Week 3
- Mon: "OMS Day 60 milestone — interim rescan"
- Tue: One specific thing OMS got that competitors didn't
- Wed: Hike + insight + photo
- Thu: Newsletter Issue 3
- Fri: Quick-wins or sector-specific tip

### Week 4
- Mon: "OMS Day 75 — preparing the v2 case study"
- Tue: Quote from OMS leadership (with permission)
- Wed: Hike insight
- Thu: Newsletter Issue 4 — meta-pattern across multiple industrial audits
- Fri: Pre-launch teaser for case study v2

This 4-week LinkedIn drumbeat creates anticipation for the case study
v2 publish — and seeds direct inbound from procurement officers who
recognise OMS in their own searches.

---

## End of OMS Week 1 Checklist

By Sunday night, these should exist:

**Public**:
- [ ] OMS Day 30 update on /case-studies/oms-lifting-solutions
- [ ] 5 LinkedIn posts published, at least 3 referencing OMS
- [ ] Newsletter Issue 1 published on /newsletter (if needed, /newsletter index updated)
- [ ] Magaliesberg hike photo paired with insight on LinkedIn
- [ ] Leaderboard score for OMS updated if data warrants

**Private (operational)**:
- [ ] OMS Day 30 metrics fully captured in `/learnings/oms-day-30-rescan.md`
- [ ] Updated CRM row for OMS (Day 30 milestone hit)
- [ ] Day 60 calendar reminder set
- [ ] Day 90 case study publish reminder set
- [ ] Permissions document confirmed via email

**Strategic / leverage**:
- [ ] Methodology adjustment notes (if any) captured for AUDIT-PLAYBOOK update
- [ ] Pricing thesis updated if industrial vertical needs different tier
- [ ] Next week's 3 industrial prospects identified (using OMS as the
      hook in outreach)

---

## Why OMS Specifically (Strategic Frame)

Three reasons OMS is the right flagship:

1. **Industrial vertical = highest customer LTV in your ICP.** A
   medical practice averages R20-50k/patient. An industrial supplier's
   contract average is R100-500k. ROI math is clearest in industrial.

2. **BBBEE Level 1 + mining track record = highest-trust positioning.**
   Procurement officers in mining + SOE care about BBBEE more than any
   other signal. OMS being your flagship sends a specific buyer signal:
   "we work with serious BBBEE-aligned suppliers, not generic SMEs."

3. **The methodology fits perfectly.** OMS's gaps (no schema, no
   citations, GBP underused) are the textbook gaps The Real Estate
   Method addresses. Their wins will validate the framework concretely.

---

## The Compounding View

If OMS Day 90 case study v2 ships in early June 2026:

- Direct inbound from 2-5 BBBEE-certified industrial firms (procurement
  managers see the case study + reach out)
- 2-3 conference talk inquiries (Heavy Engineering events love
  documented BBBEE growth stories)
- Press inquiry potential from Engineering News, Mining Weekly,
  BizCommunity industrial — all audiences that cite verified case studies
- Industrial vertical positioning solidifies — "Kabelo More = the AEO
  consultant for SA industrial mid-market"

By 6 months in, OMS is the case study you reference in every Industrial
prospect's discovery call. Three more named case studies (medical,
legal, second industrial) by month 6, and the trust artifact pipeline
is fully populated.

OMS is the prototype. Get this right and the next 30 industrial clients
sell themselves.

— Kabelo
