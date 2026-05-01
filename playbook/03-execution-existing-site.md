# 03 — Execution: Existing Site (Optimization Pack)

For clients with **a working website on any platform** (WordPress, Wix, Squarespace, Shopify, custom). R10,500. 3 weeks. Audit → schema → GBP → citations → content → handover.

Optimization Lite uses the same playbook with reduced scope (lighter audit, single-page schema, 5 citations, 1 page rewrite, 2 weeks).

**Important principle:** **We don't touch the client's existing build.** We layer AEO infrastructure on top. If the original developer (cousin, freelancer, agency) is still around, we credit them and collaborate. We never bypass them or imply their work was wrong.

---

## What "delivered" looks like

By Day 21 the client has:

1. Schema markup deployed on their existing site (LocalBusiness, Service x3, FAQ, Breadcrumb)
2. Google Business Profile claimed/refreshed and 100% complete
3. 10 directory citations established with NAP-consistent data
4. 3 priority pages on their existing site rewritten in answer-shape
5. 5 starter LinkedIn or Facebook posts written + scheduled
6. Sitemap.xml audited, robots.txt updated, llms.txt added
7. Before/after AI scan data captured (4 engines)
8. PDF documentation of everything done
9. 30-min handover call complete
10. 60-day support window started

---

## Week-by-week breakdown

### Week 0 — Pre-kickoff (Days 1-3)

**Day 1 (deposit clears)**
- Send confirmation email + Stripe receipt
- Schedule kickoff call within 48 hours
- Send brief link (`/brief/optimization`)
- Add client to internal tracker

**Day 2-3**
- Receive completed brief
- Review brief: confirm platform, admin access, services, competitors

### Week 1 — Audit + Strategy (Days 4-10)

**Day 4 — Kickoff call (30 min)**
- Confirm platform (WordPress/Wix/Squarespace/Shopify/custom)
- Get admin or editor access (or set up GTM if access not granted)
- Confirm 3 priority services to optimize for
- Confirm 3 competitors for benchmarking
- Walk through the 3-week timeline

**Day 5-6 — Run baseline audit**
- Run audit-agent on the client's domain → AEO baseline + competitor data
- Document current schema state (use Google Rich Results Test on key pages)
- NAP consistency audit (search business name + phone — find every existing listing)
- GBP completeness review (logged-in audit)
- Capture 4-engine AI baseline (use the `track` module — run the 25 prompts adapted to client's vertical)
- Screenshot all baseline data — these become the BEFORE in the case study

**Day 7-8 — Strategy doc**
- Identify schema gaps (LocalBusiness? Service? FAQ? Review? Person?)
- Identify the 3 priority pages for content rewrite
- Identify citation gaps (which 10 directories matter for this vertical)
- Draft GBP rebuild plan (what's missing, what needs updating)

**Day 9 — Internal review**
- Cross-check strategy against the brief
- Confirm Optimization Pack scope vs Optimization Lite vs Foundation rebuild — adjust if reality differs from initial scope (raise this with client BEFORE doing extra work)

**Day 10 — Status update #1 + week-1 review**
- Send week-1 status email with:
  - Baseline data + screenshots from AI engines (the BEFORE)
  - Strategy summary
  - "Here's what we'll fix in the next 2 weeks"
- Get any clarifications back within 48h

### Week 2 — Schema + GBP (Days 11-17)

**Days 11-13 — Schema deployment (platform-specific)**

Use templates from [04-schema-templates.md](./04-schema-templates.md). Deploy method varies by platform:

#### WordPress (most common)

**Best path:** Install **Rank Math** plugin (free version covers everything we need). Configure:

- Schema → Templates → set LocalBusiness as default
- Edit each priority page → Schema → add Service or FAQ schema as appropriate
- Configure Organization schema in Site Settings

Alternative: **Yoast SEO** (also free) covers Article and Organization but weaker on LocalBusiness/Service. Use Rank Math for AEO work.

If the client refuses to add a plugin: use **Code Snippets** plugin to inject custom JSON-LD, OR add to the theme's `functions.php` (carefully — back up first).

#### Wix

Wix is restrictive. Two paths:

1. **Wix's native SEO** → Site Settings → SEO → fill in basic schema fields. Limited.
2. **Custom code** → Site Settings → Custom Code → Header section. Paste full JSON-LD `<script type="application/ld+json">...</script>` block. Better.

For full schema control on Wix, the second path is mandatory. Use the templates from 04 verbatim.

#### Squarespace

Squarespace allows code injection but only on certain pages. Two paths:

1. **Site-wide schema** → Settings → Advanced → Code Injection → Header. Paste full JSON-LD block.
2. **Per-page schema** → Page Settings → Advanced → Code Injection. Paste page-specific JSON-LD here.

Squarespace also has built-in Local Business fields (Settings → Business Information). Fill those — they auto-generate basic LocalBusiness schema. Then layer custom JSON-LD for Service and FAQ.

#### Shopify

Shopify is most complex of the major platforms:

1. **Theme.liquid edit** — open theme.liquid in the theme editor → add JSON-LD blocks before `</head>`. Backup the theme first.
2. **Schema.org SEO app** — Shopify App Store, ~$10/mo. Easier but client pays ongoing.
3. **Yoast for Shopify** — paid, ~$20/mo. Most polished.

Recommend Schema.org SEO app to most Shopify clients (low monthly cost, no theme editing).

#### Custom-coded site (rare in SA but happens)

Two paths:

1. **Direct edit** — if you have repo access, add JSON-LD blocks to layout/template files in `<head>`. Commit, deploy.
2. **Google Tag Manager** — install GTM container, push JSON-LD via GTM "Custom HTML" tag. Works on any site without code access. **This is your fallback for any platform.**

#### What schema goes where (every platform)

| Page type | Schema needed |
|---|---|
| Homepage | LocalBusiness + Organization |
| Service pages | Service (one per service) |
| About page | Person (if owner-led) + Organization |
| FAQ page | FAQPage |
| Blog posts | Article + Author |
| Inner pages | BreadcrumbList |
| Reviews / testimonials | Review (if showcasing) |

Validate every page after deployment in Google Rich Results Test.

**Day 14-15 — GBP rebuild**

Same checklist as Foundation Pack execution (see [02-execution-new-build.md](./02-execution-new-build.md), Day 19-21):

- Primary category + 2-3 secondary
- Services list with descriptions
- Hours + special hours
- 10+ photos minimum
- 160-char description (front-loaded)
- 5 seeded Q&A
- 3 starter Google Posts
- All applicable attributes

**Day 16-17 — Status update #2**
- Send week-2 status email
- Include:
  - Schema validation screenshots (Google Rich Results Test)
  - GBP before/after screenshots
  - List of what's deployed
- Confirm citation work + content rewrite for week 3

### Week 3 — Citations + Content + Handover (Days 18-21)

**Day 18-19 — 10 citations**

Use the same baseline 10 from Foundation Pack execution. Critical: ensure NAP data is identical to GBP. Inconsistent NAP = wasted effort.

If the client already has 5+ citations with consistent NAP, you only need to add 5 new industry-specific ones. Adjust scope accordingly.

**Day 19-20 — Priority page rewrites (the AEO content layer)**

Take 3 priority pages on the client's existing site. Add answer-shaped content to each.

The pattern:

```
EXISTING brochure copy:
"Welcome to [Client]. We have 18 years of experience..."

ADD this BELOW the brochure copy (don't replace it):

## How does [their service] work?
[2-3 sentence direct answer with concrete information]

## What does [their service] cost in [their city]?
[Direct answer with price band or "from R[x]" framing]

## How long does [their service] take?
[Direct timeline]

## Who needs [their service]?
[Specific customer profile]

## What's included in [their service]?
[Bulleted list]
```

Then deploy FAQ schema on that page that mirrors the question-answer pairs.

The brochure copy stays for human visitors. The Q&A blocks are what AI engines quote. Both win.

**Day 20 — Off-site polish**
- 5 LinkedIn or Facebook starter posts written + scheduled
- Sitemap audit (does it exist? does it list all pages? add `/llms.txt`)
- robots.txt audit (allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- Add `/llms.txt` if missing — see [04-schema-templates.md](./04-schema-templates.md) for template
- Run final 4-engine AI scan with audit-agent → capture AFTER data

**Day 21 — Handover call (30 min)**
- Walk through everything deployed (schema validation, GBP, citations, content, before/after AI data)
- Hand over PDF doc with all changes documented
- Pitch Growth retainer
- Send final invoice (R5,250 for Optimization Pack)

---

## Platform-specific gotchas (catch these in week 1)

**WordPress: 50+ plugins installed by previous developer**
Don't touch them. Add Rank Math, do your work, leave. If the site is broken because of plugin conflicts, that's a separate scope (rebuild conversation).

**Wix: client doesn't want to upgrade plan**
Wix free / starter plans block custom code. Schema deployment requires the "Light" plan minimum (~R200/mo). Have this conversation in week 1 or earlier — budget for upgrade in the quote.

**Squarespace: pages built with Squarespace 5 (legacy)**
Squarespace 5 is being deprecated. If the client is on Squarespace 5, they need to migrate to Squarespace 7 BEFORE we can do AEO work properly. This is a Foundation Pack rebuild conversation, not Optimization Pack.

**Shopify: client is on Basic plan and changes incur app fees**
Shopify charges per app. If you install Schema.org SEO app, that's $10/mo on the client. Get explicit approval before installing. Some Optimization clients prefer the theme.liquid edit path to avoid app fees.

**Custom-coded site: developer is unavailable**
If the original dev is unreachable and you don't have repo access, default to **Google Tag Manager** for schema deployment. GTM works on any HTML page that lets you paste a script in `<head>`. Most CMS / hosting providers allow this.

**Custom-coded site: developer is the client's family member (OMS situation)**
ALWAYS loop them in. WhatsApp/email: *"Hey [Dev Name], I'm doing AEO work on [Client]'s site. Want to be credited in the case study? I'd rather give you credit for the foundation than work around you."* This preserves the relationship and often opens repo access.

---

## Time scoping (be realistic about hours)

For Optimization Pack (R10,500 / 3 weeks):

| Phase | Hours estimate |
|---|---|
| Audit + strategy | 4-6 hrs |
| Schema deployment | 4-8 hrs (varies wildly by platform) |
| GBP rebuild | 3-5 hrs |
| Citations (10 listings) | 3-5 hrs |
| Content rewrite (3 pages) | 4-6 hrs |
| Off-site polish | 1-2 hrs |
| Communication + status updates | 3-5 hrs |
| Handover prep + call | 2-3 hrs |
| **Total** | **24-40 hrs** |

At R10,500 ÷ 30 hrs = R350/hr. Fair for AEO specialty work in SA.

**If your hours blow past 40, something's wrong.** Either:
- Scope creep (client added things) → invoice for the extras
- You're doing work that wasn't in the brief → push back
- Platform is harder than expected (e.g. Shopify with custom theme + 50 products) → next time, charge platform-complexity uplift in the quote

Track hours in Notion or a simple spreadsheet. After 5 deliveries you'll know your true average and can refine pricing.

---

## Quality checks before handover

Before invoicing the final 50%, verify:

- [ ] All schema validates in Google Rich Results Test (no errors)
- [ ] GBP is 100% complete (every field filled)
- [ ] At least 10 photos on GBP
- [ ] All 10 citation listings live (screenshot each)
- [ ] 3 priority pages have answer-shaped content + FAQ schema
- [ ] Sitemap submitted to Google Search Console
- [ ] robots.txt allows AI crawlers
- [ ] llms.txt is in place
- [ ] 5 social posts published or scheduled
- [ ] Final AI scan run + screenshots captured for AFTER data
- [ ] Before/after comparison documented in handover PDF
- [ ] Handover PDF complete with all changes + login refs

If any item is incomplete, **don't invoice the final 50%.** Same rule as Foundation Pack.

---

## The OMS-style "existing site case study" framing

When a client's existing site was built by a previous developer (very common — cousin, freelancer, agency), use this framing in delivery + case study:

> *"[Client] had a working website built by [Developer Name]. Solid foundation, just not AEO-optimized. We didn't recommend a rebuild — we added the AI visibility layer on top, in 3 weeks, for R10,500 instead of R25,000+ they'd have paid an agency for an unnecessary new build. They went from 0 AI citations to cited within 30 days, on the same site."*

This positions you as honest (you didn't push a rebuild) AND credits the original developer (preserves relationships). Both compounds across referrals.

This is the case study angle for **70-80% of your future clients.** Most SA businesses already have a website. Most of those websites work fine. The story is always: *we layered AEO on, no rebuild needed.*
