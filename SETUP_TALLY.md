# Tally Setup Guide

The intake briefs at `/brief/[tier]` are wired to render Tally form embeds when form IDs are configured. Until you create the Tally forms, the pages render a fallback that captures contact info and emails you within 1 hour — so the flow works end-to-end today, just less polished.

## Why Tally?

- **Free tier covers everything we need** — unlimited forms, file uploads, email notifications
- **No code changes needed when you edit questions** — change them in Tally, page updates instantly
- **Submissions pipe to Sheets, Notion, Slack, email** — pick whichever inbox you actually check
- **File uploads handled natively** — Foundation Pack needs logo + 5 photos; building this in Next.js means S3/Cloudinary; Tally does it for free

## What you need to do

1. Sign up at [tally.so](https://tally.so) (use `kabelo@kabelomore.com`)
2. Create 6 forms — one per paid tier. Each form takes about 10 minutes.
3. Drop the form ID into `lib/intake-briefs.ts` — that's it.

## Where to find the form ID

When you create a Tally form, the URL looks like:

```
https://tally.so/r/wAxYz9
                    ^^^^^^
                    this is the formId
```

Copy `wAxYz9` (or whatever yours is). Open `lib/intake-briefs.ts`, find the matching tier, replace `tallyFormId: null` with `tallyFormId: "wAxYz9"`. Commit, push, done.

## Per-form settings to enable

For every Tally form, in Settings:

- **Notifications** → email to `kabelo@kabelomore.com` on every submission
- **Redirect on submit** → `https://kabelomore.com/thank-you?tier=foundation` (or whichever tier)
- **Branding** → set the accent colour to `#FF6B00` (matches `accent-500` on the site)
- **Background** → transparent (the embed handles styling around it)

Optional but recommended:

- **Notion integration** → pipe submissions to a Notion DB so you have a CRM-lite of all leads
- **Google Sheets integration** → backup view, nice for spreadsheet thinking
- **Stripe / PayFast** integration if available — collect deposit at brief submission instead of separate invoice step

---

## The 6 forms — exact questions to paste

Each section below = one Tally form. Copy the question text directly into Tally. Keep the `*` for required fields.

### Form 1: Foundation Pack (`tallyFormId` for `foundation`)

**Form name:** Foundation Pack — Intake Brief
**Form description:** R12,500. 8 questions, 10 minutes. After submit, you get a R6,250 deposit invoice within 1 hour.

Questions:

1. **Business name + 1-sentence description of what you do** *
   _(Short text)_

2. **Where you're physically based + the geographic area you serve** *
   _(Short text — e.g. "Pretoria. We serve Gauteng + parts of North West.")_

3. **Your phone, business email, and any existing online presence** *
   _(Long text — Facebook page URL, Instagram, old website, anything)_

4. **Upload your logo** _(File upload — optional, accept .png .jpg .pdf .svg)_

5. **Upload 5 photos of your business, work, or team** *
   _(File upload — accept multiple, .png .jpg, max 10MB each)_

6. **Your top 3 services + 1-line description of each** *
   _(Long text)_

7. **Name 3 competitors you respect or want to beat (URLs preferred)** *
   _(Long text)_

8. **Brand colour preferences** *
   _(Multiple choice: "Use your judgment" / "I have specific colours" — branch the second option to a follow-up text field for hex codes)_

9. **What does success look like 6 months from launch?** *
   _(Long text)_

10. **Anything else we should know?** _(Long text — optional)_

---

### Form 2: Foundation Lite (`tallyFormId` for `foundation-lite`)

**Form name:** Foundation Lite — Intake Brief
**Form description:** R6,500. 6 questions, 7 minutes. Sole-trader version of Foundation Pack.

Questions:

1. **Business name + 1-sentence description of what you do** *
2. **Where you're based + your service area** *
3. **Your phone, email, and any existing online presence** *
4. **Upload your logo** _(File — optional)_
5. **Upload 3 photos of your work or business** *
6. **Your single main service + 1-line description** *
7. **1 competitor you respect (URL or name)** *
8. **Anything else we should know?** _(Long text — optional)_

---

### Form 3: Discovery & Strategy Sprint (`tallyFormId` for `discovery`)

**Form name:** Discovery Sprint — Intake Brief
**Form description:** R3,500 paid upfront. 8 questions, 10 minutes.

Questions:

1. **Business name + tagline (or what you'd put on a billboard)** *
2. **Describe your 3 BEST customers in 1 sentence each** *
   _(Long text — industry, size, what they buy, why they chose you)_
3. **Describe customers you do NOT want — who's a wrong fit, and why** *
   _(Long text)_
4. **Top 3 competitors (URLs)** *
5. **Top 3-5 things people Google or ask AI to find businesses like yours** *
6. **If everything goes right in 6 months, what does it look like?** *
7. **Biggest constraint right now: time, budget, team, clarity, or something else?** *
   _(Multiple choice + "Other" text option)_
8. **What have you tried before that didn't work?** *
   _(Long text — agencies, freelancers, tools, courses)_

---

### Form 4: Starter Audit (`tallyFormId` for `starter`)

**Form name:** Starter Audit — Intake Brief
**Form description:** R5,000. 6 questions, 5 minutes. Audit delivered in 5 working days.

Questions:

1. **Business name + service area** *
2. **Current website URL** _(URL field — required if you have one)_
3. **Google Business Profile URL** _(URL — optional)_
4. **Top 3 services you specifically want to be found for** *
5. **3 competitors (URLs)** *
6. **What have you already tried?** *
   _(Long text — SEO firm, Google Ads, content marketing, etc.)_
7. **Pick the closest match:** *
   _(Multiple choice: "I think we're invisible to AI" / "We rank but don't get leads" / "We're new and starting fresh" / "Other — describe")_

---

### Form 5: Growth Retainer (`tallyFormId` for `growth`)

**Form name:** Growth Retainer — Intake Brief
**Form description:** R8,500/mo. 8 questions, 10 minutes. 3-month minimum.

Questions:

1. **Business name + 1-sentence description of what you do** *
2. **Current website URL, GBP URL, social profile URLs** *
   _(Long text — paste them all)_
3. **Last 6 months — rough monthly inbound leads, monthly traffic, conversion rate** *
   _(Long text — estimates fine)_
4. **Top 3 services + which is highest-margin** *
5. **3 competitors (URLs)** *
6. **What's worked before, what's failed?** *
7. **Goal for next 6 months — specific number preferred** *
8. **Decision-maker for marketing — is it you, or someone else?** *

---

### Form 6: Premium Retainer (`tallyFormId` for `premium`)

**Form name:** Premium Retainer — Intake Brief
**Form description:** R15,000/mo. 8 questions, 12 minutes. By application.

Questions:

1. **Business name + what you do (1-2 sentences) + size (revenue band or headcount)** *
2. **Current website, GBP, LinkedIn (especially leadership profiles), other digital assets** *
3. **Last 12 months — monthly leads, traffic, conversion rate, average deal size** *
4. **Top services + which 1-2 you want us to dominate AI visibility for** *
5. **3 competitors + 3 'aspirational' brands** *
6. **All-in marketing budget per month** *
7. **Internal team — who owns marketing, sales, and is the executive sponsor?** *
8. **What does 12-month success look like?** *

---

## After you've created all 6 forms

1. Open `lib/intake-briefs.ts`
2. For each tier, replace `tallyFormId: null` with `tallyFormId: "your-form-id"`
3. Run `npm run build` to confirm no breakage
4. `git add lib/intake-briefs.ts && git commit -m "Wire up Tally form IDs" && git push`
5. Vercel auto-deploys. Tally embeds light up automatically. Fallback forms disappear.

## Testing one form before doing all six

Pick the lowest-stakes one (Starter Audit, fewest questions) — create it in Tally, drop the ID into `intake-briefs.ts`, push. Hit `kabelomore.com/brief/starter` in incognito. If the embed loads + a test submission lands in your inbox, repeat for the other 5.

## Optional: thank-you page

If you set the Tally redirect to `/thank-you?tier=foundation` etc., create `app/(marketing)/thank-you/page.tsx` that reads the `tier` query param and shows tier-specific next steps. Skip for now — fallback redirects to Tally's default thank-you screen, which is fine.
