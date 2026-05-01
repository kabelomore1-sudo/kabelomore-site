# 02 — Execution: New Build (Foundation Pack)

For clients with **no existing website**. R12,500. 4 weeks. Domain → live site → GBP → schema → citations → handover.

Foundation Lite uses the same playbook with reduced scope (single page, 1 social, 5 citations, 2 weeks).

---

## What "delivered" looks like

By Day 28 the client has:

1. Live 5-page website on Vercel/Next.js, on their own domain (.co.za or .com)
2. Google Business Profile claimed, verified, fully complete
3. Schema markup deployed (LocalBusiness, Service x3, FAQ, Breadcrumb)
4. Facebook + Instagram pages set up with branding + 5 posts each
5. 10 directory citations (NAP-consistent)
6. Business email on their domain (you@yourbusiness.co.za)
7. PDF documentation with every login + URL + step we did
8. 30-min walkthrough call complete
9. Free 10-min self-edit walkthrough OR Self-Edit Admin Panel installed (R2,500 add-on)
10. 60-day support window started

---

## Week-by-week breakdown

### Week 0 — Pre-kickoff (Days 1-3)

Triggered when deposit clears. Before the kickoff call, set up the infrastructure:

**Day 1 (deposit clears)**
- Send confirmation email + Stripe receipt
- Schedule kickoff call within 48 hours
- Send brief link (`/brief/foundation`)
- Add client to internal tracker (Notion DB)

**Day 2-3**
- Receive completed brief
- Review brief, identify gaps, schedule kickoff for Day 3-4

### Week 1 — Foundation infrastructure (Days 4-10)

**Day 4 — Kickoff call (30 min)**
- Confirm scope, timeline, payment terms
- Walk through brief together — fill gaps
- Get domain choice approved (or research if uncertain)
- Get logo + photos uploaded to shared Drive folder
- Confirm 3 services + 3 competitors

**Day 4-5 — Domain + hosting**
- Register domain (Namecheap or GoDaddy preferred for SA, depending on TLD)
  - .co.za → GoDaddy SA or Domains.co.za
  - .com → Namecheap
  - Always register in CLIENT'S name with CLIENT'S email — never yours
- Send registrar login to client (they own this from day 1)
- Set up Vercel project (kabelomore agency account)
- Configure DNS A record (76.76.21.21) + CNAME (cname.vercel-dns.com)
- Verify SSL certificate provisions automatically

**Day 5-6 — Repo + scaffold**
- Clone the kabelomore-site template OR build minimal Next.js scaffold
- Add client's logo, brand colours, photos to repo
- Set up Tailwind config with brand colours
- Configure metadata (site.name, description, ogImage)

**Day 7-9 — Build pages**
- Home page (hero, services overview, contact CTA, schema)
- About page (company story, BBBEE if applicable, schema Person if owner-led)
- Services page or pages (one per service, schema-rich)
- Contact page (form via Resend, NAP, map embed, schema)
- 1 custom page (FAQ, Pricing, Portfolio — client's choice)

**Day 10 — Status update #1 + week-1 review**
- Send 3-day status email (deploy preview link)
- Client reviews preview, returns feedback within 48h

### Week 2 — Content + Schema deployment (Days 11-17)

**Day 11-13 — Content rewrite**
- Write/edit page copy in answer-shape (FAQ blocks, structured how-to's)
- Avoid pure brochure copy — every paragraph should answer a customer question
- Use the schema templates ([04-schema-templates.md](./04-schema-templates.md)) as the source for FAQ content

**Day 14-15 — Schema deployment**
- LocalBusiness schema on `/` (use industry-specific template from 04)
- Service schema on each service page
- FAQ schema on FAQ page or homepage FAQ block
- Person schema on About page (if owner-led brand)
- Organization schema on `/`
- BreadcrumbList on inner pages
- Validate every page with Google's Rich Results Test (free): https://search.google.com/test/rich-results

**Day 16 — Final content polish**
- Proofread all copy
- Compress images (use Squoosh or built-in Next.js Image)
- Check Lighthouse score: target 90+ on all 4 metrics

**Day 17 — Status update #2 + go-live prep**
- Send week-2 status email (link to preview, what's deployed)
- Confirm with client: ready to go live? Domain switch happens Day 18.

### Week 3 — GBP + Social setup (Days 18-24)

**Day 18 — Domain go-live**
- DNS fully propagates (usually <1h after Vercel cutover)
- Verify HTTPS works
- Test site on mobile + desktop
- Submit sitemap.xml to Google Search Console
- Add llms.txt + robots.txt allowing AI crawlers

**Day 19-21 — Google Business Profile**
- Create GBP if doesn't exist (sign in with client's Google account, not yours)
- Verify (postcard, video, or phone — depends on category)
- Fill in EVERY field:
  - Primary category (most specific match)
  - Secondary categories (2-3, specific)
  - Services list (each service with description + price band if comfortable)
  - Hours (regular + special hours for SA public holidays)
  - Description (160 chars front-loaded, mention primary keyword + city)
  - Photos: 10+ minimum (interior, exterior, team, work, products)
  - Q&A: seed 5 common customer questions with answers
  - Posts: publish 3 starter Google Posts
  - Attributes: every applicable one (BBBEE level, woman-owned, accessibility, etc.)

**Day 22-23 — Social setup**
- Facebook Business Page: claim or create, brand consistently with site
- Instagram Business: connect to Facebook, sync brand assets
- LinkedIn Company Page: create, link to founder's profile
- Write + publish 5 starter posts on each platform (use audit-agent for content drafting)
- Add WhatsApp Business if not already set up

**Day 24 — Status update #3**
- Send week-3 status email (GBP screenshot, social links, what's left)

### Week 4 — Citations + Handover (Days 25-28)

**Day 25-26 — Citations**

The 10 directory baseline (use NAP-consistent details from GBP):

1. **Brabys** — `brabys.com` (free for basic)
2. **Cylex SA** — `cylex.co.za` (free)
3. **Yellosa** — `yellosa.co.za` (free)
4. **Showme** — `showme.co.za` (free)
5. **SAYellow** — `sayellow.com` (free)
6. **Hellopeter** — `hellopeter.com` (free; reviews live here)
7. **Bing Places** — `bingplaces.com` (free; matters for Bing AI / Copilot)
8. **Apple Business Connect** — `businessconnect.apple.com` (free; matters for Apple Maps + Siri)
9. **Industry-specific #1** — varies by vertical (see table below)
10. **Industry-specific #2** — varies by vertical

**Industry-specific directories**

| Vertical | Where to list |
|---|---|
| Industrial / Manufacturing | LME (Local Manufacturing Experts), SAIMM, BBBEE Procurement Portal |
| Mining suppliers | Mining Weekly suppliers directory, IMIESA |
| Legal | Law Society of SA member directory, Legal500 SA |
| Medical | HPCSA registry (mandatory anyway), Medpages, Doctor.co.za |
| Accounting | SAICA member directory, SAIT directory |
| Construction | NHBRC, Master Builders Association directory |

**Day 27 — Final polish**
- Set up Google Analytics 4 + Search Console
- Set up Plausible (or confirm Vercel Analytics is on)
- Check llms.txt is accurate for client's actual services
- Run final 4-engine AI scan (use audit-agent) — capture baseline data
- Generate handover PDF (template in [05-client-communication.md](./05-client-communication.md))

**Day 28 — Handover call (30 min)**
- Walk through every login (domain, hosting, GBP, social, email)
- Show schema validation in Google Rich Results Test
- Show baseline AI scan results
- Pitch Growth retainer (see [01-vetting-and-scoping.md, Stage 5](./01-vetting-and-scoping.md#what-happens-at-delivery-the-upsell-moment))
- Send final invoice (R6,250 for Foundation Pack)

---

## Tools you'll use (set up once, reuse forever)

| Tool | Purpose | Cost |
|---|---|---|
| Vercel | Hosting, deployment | Free hobby tier; $20/mo for pro |
| Namecheap or GoDaddy | Domain registration | R150-300/yr per .co.za, $10-15/yr per .com |
| Google Workspace | Business email | $6/user/mo (often Foundation client expense, not yours) |
| Resend | Form submissions | Free up to 100/day |
| Plausible OR Vercel Analytics | Analytics | Free hobby; €9/mo Plausible |
| audit-agent (your tool) | Pre-build + post-launch AI scans | API costs only (~$2-5/scan) |
| Google Rich Results Test | Schema validation | Free |
| Squoosh | Image compression | Free |
| Notion | Project tracking | Free |
| GitHub | Version control + Vercel auto-deploy | Free |

---

## Common pitfalls (and how to avoid them)

**Pitfall 1: Client logo arrives in JPEG, not transparent PNG/SVG.**
Fix at brief stage — request "high-resolution PNG with transparent background, OR vector SVG, OR original Illustrator file." If client only has JPG, use it but note in handover doc that re-vectorising is recommended.

**Pitfall 2: GBP verification denied or stuck.**
Postcard verification fails 30% of the time on first attempt. Always offer video verification as backup. If both fail, schedule a Google support call (free, takes 15 min, almost always resolves it).

**Pitfall 3: Client sends 50 photos, all blurry / dark / wrong orientation.**
Set expectation in brief: "5 well-lit photos beat 50 blurry ones." If photos arrive bad, use stock industry photos (with attribution) on the website but mark "professional photoshoot recommended" in handover.

**Pitfall 4: Domain transfer takes longer than expected.**
.co.za transfers can take 5-7 business days. Always factor this into Week 1, not later. If client has existing domain at another registrar, transfer EARLY (day 1).

**Pitfall 5: Client wants daily updates instead of every-3-day cadence.**
Reset expectation politely once. If they push, it's a scope/comms issue — they're not buying 3-day cadence, they're buying anxiety relief. Address the anxiety, don't ramp the cadence.

---

## Quality checks before handover

Before invoicing the final 50%, verify:

- [ ] Lighthouse score: 85+ across Performance, Accessibility, Best Practices, SEO
- [ ] All schema validates in Google Rich Results Test (no errors)
- [ ] GBP is 100% complete (every field filled)
- [ ] At least 10 photos on GBP
- [ ] Sitemap submitted to Google Search Console
- [ ] sitemap.xml renders correctly
- [ ] llms.txt is accurate
- [ ] robots.txt allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- [ ] All forms submit successfully (test via fake submission)
- [ ] Mobile experience tested on real phone (not just emulator)
- [ ] All 10 directory listings live (screenshot each)
- [ ] All social pages set up + 5 posts each
- [ ] Handover PDF complete with all logins
- [ ] Final AI scan run + screenshots captured for handover

If any item is incomplete, **don't invoice the final 50%** — push delivery date until it's done. Trust survives one delay; it doesn't survive a half-done handover.

---

## After handover — the 60-day support window

For 60 days after handover, the client gets free email support for:
- Login issues
- Small content updates (under 30 min of your time)
- Schema validation questions
- GBP question answering

Beyond 60 days, or for anything bigger:
- Hourly: R750/hour
- Or convert to Growth retainer

Track support requests in Notion — if a client uses >2 hours of support in 60 days, that's a strong retainer-conversion signal.
