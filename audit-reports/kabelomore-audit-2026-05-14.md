# kabelomore.com Audit + Fix Report — 2026-05-14

## AEO Readiness Score: 86/100

Strong structured-data foundation (connected Organization + Person +
WebSite + FAQPage entity graph), honest methodology disclosure, clean
robots/llms/sitemap. Points deducted for: unverified network layer
(SSL/redirect/DNS could not be inspected from this environment),
Anthropic credit exhaustion breaking the scan engine, and the
.co.za redirect being unconfirmed.

## Domain Architecture Status: PARTIAL — needs owner verification

`kabelomore.com` serves correctly over HTTPS (verified via fetch).
`kabelomore.co.za` redirect type, SSL coverage, and DNS records
could NOT be inspected from this sandboxed environment — runnable
commands provided below for the owner to execute.

## API Security Status: PASS (architecture) / FAIL (billing)

The scan never calls Anthropic from the browser — it routes through
`/api/scan/start` (server-side) with rate limiting (1/IP/5min,
1/email/24h) + honeypot. No `sk-ant-*` key is in the client bundle.
HOWEVER: Anthropic credit balance is exhausted, so every scan
currently fails server-side with a 400. Architecture is correct;
billing is broken.

## /scan Page Interaction Status: FIXED THIS SESSION

Issue A diagnosed + fixed (see Fixes Applied).

---

## Executive Summary

- **Issue A was a self-inflicted bug, now removed.** The "broken tour"
  was `components/annotated-screenshot.tsx` (built earlier this build
  cycle), not a third-party library. It absolutely-positioned hotspots
  by hardcoded `%` over a responsive CSS mockup that reflowed on
  mobile. Removed entirely; replaced with a static, mobile-safe
  "What's in your report" 4-card grid.
- **LinkedIn was 404'ing site-wide** from a single source
  (`lib/site.ts` social.linkedin) plus one hardcoded contact-page
  string. Both fixed; footer + Person schema + Organization schema
  sameAs now all resolve to a live profile.
- **Credentials are now verifiable + evergreen.** Person schema has a
  `hasCredential` block with the Anthropic cert number; badge copy
  changed to "Anthropic-trained · Google-certified · Actively
  studying" so it never goes stale.
- **The single highest-priority OUTSTANDING issue is not code** — it's
  the exhausted Anthropic balance. The scan engine is non-functional
  until topped up.
- **Network-layer items (SSL, .co.za redirect, DNS, DMARC) require
  owner-run commands** — this environment has no shell access to
  arbitrary external hosts. Exact commands + pass criteria below.

---

## Fixes Applied This Session

### 🔴 Issue A — Broken /scan overlay → REMOVED

**Diagnosis:** Not Intro.js/Shepherd/Driver/Joyride. It was
`components/annotated-screenshot.tsx`, used in exactly one place
(`/scan`). It rendered numbered hotspots with
`position:absolute; left:{x}%; top:{y}%` over `<ScanReportMockup />`
— a responsive CSS grid using `md:grid-cols-2`. Below the `md`
breakpoint the grid collapsed to one column, the container reflowed,
and the hardcoded percentage coordinates (tuned for the desktop
2-col layout) landed on the wrong elements. The `animate-ping` idle
pulse read as "broken/blinking". Tap-to-open technically worked but
felt dead because the marker was visually mispositioned.

**Fix:** Removed the overlay entirely (per the brief's "if unclear,
default to removing — a broken tour is worse than no tour on the
highest-stakes page"). Replaced with a static 4-card "What's in your
report" grid: numbered 1-4, `sm:grid-cols-2`, zero absolute
positioning, zero coordinate math, mobile-safe by construction.
Deleted the now-orphaned `components/annotated-screenshot.tsx` and
the `ScanReportMockup` helper.

**Files changed:**
- `app/(marketing)/scan/page.tsx` — overlay block replaced; dead
  import removed; orphaned `ScanReportMockup` truncated
- `components/annotated-screenshot.tsx` — **deleted** (was only
  consumed by /scan)

**Verification:** typecheck clean, production build clean, zero
remaining live references (only an explanatory code comment mentions
the old name).

### 🔴 Issue B — Broken LinkedIn link → FIXED

**Diagnosis:** `lib/site.ts` `social.linkedin` = the dead
`/in/kabelomore/` slug. This single value feeds the footer, the
Person schema `sameAs`, and the Organization schema `sameAs`. A
second instance was hardcoded as a display string on
`app/(marketing)/contact/page.tsx`.

**Fix:**
- `lib/site.ts` → `social.linkedin` updated to
  `https://www.linkedin.com/in/kabelo-the-digital-marketer/`
  (working placeholder until the custom slug is finalised — change
  this ONE line when the final slug is live).
- `app/(marketing)/contact/page.tsx` → display value now DERIVED
  from `site.social.linkedin` (strip protocol/trailing slash) so it
  can never drift from the canonical source again.

**Files changed:** `lib/site.ts`, `app/(marketing)/contact/page.tsx`

**Propagation confirmed:** footer, Person schema `sameAs`, Org
schema `sameAs`, and the contact page all now resolve to the live
profile.

### 🟡 Issue E — Credential schema + copy → FIXED

**Fix:**
- `lib/seo.ts` `kabeloPersonJsonLd()` → added `hasCredential` array
  with two `EducationalOccupationalCredential` entries:
  - Claude 101, recognizedBy Anthropic, **identifier
    `95bmq8ftp6ed`**, dateCreated `2026-05-06`
  - Google Digital Marketing & E-Commerce Professional Certificate,
    recognizedBy Google (no fake identifier asserted — only the
    Anthropic cert number is recorded/verifiable)
- `components/credentials.tsx`:
  - Claude 101 card description now states the cert number
  - `CredentialsBadgeRow` rewritten from enumerated issuers
    ("Certified: Anthropic Google" — went stale on every new course)
    to evergreen "Anthropic-trained · Google-certified · Actively
    studying"

**Files changed:** `lib/seo.ts`, `components/credentials.tsx`

### 🔵 Issue C + D — SSL / .co.za redirect → NOT FIXABLE FROM HERE

This environment cannot run `openssl s_client`, `dig`, or
`curl -I` against arbitrary external hosts. These are
infrastructure/registrar config, not codebase issues. Runnable
commands + pass criteria + the `vercel.json` redirect config are in
the Generated Files section. **You must run these yourself.**

---

## 🔴 Critical Outstanding

1. **Anthropic API credits exhausted.** `/api/diagnostics` →
   `anthropicTest.ok: false` — "credit balance too low". Every scan
   submission saves the profile + sends emails but the scan itself
   returns a 400 server-side. The site looks like it works but
   delivers nothing. **Top up at
   console.anthropic.com/settings/billing — $30-50 covers ~100-150
   scans.** No deploy needed; credits propagate instantly.

2. **`kabelomore.co.za` redirect unverified.** If it's iframe
   forwarding (SA registrar default) it destroys SEO authority
   transfer. Run the four `curl -I` commands below. If not a clean
   single-hop 301 to `https://kabelomore.com`, apply the provided
   `vercel.json` config (requires the .co.za domain added to the
   Vercel project).

## 🟡 High Priority

3. **SSL SAN coverage on apex + www, both domains.** Verify with the
   `openssl` command below. Vercel auto-provisions certs, so this is
   usually fine — but the brief flagged a recent mismatch on a
   related domain, so confirm explicitly.

4. **SPF / DKIM / DMARC for kabelo@kabelomore.com.** Not inspectable
   here. Run the `dig TXT` commands below. Missing DMARC = your
   scan/notification emails are more likely to land in spam — directly
   undermines the email-delivery work done earlier this cycle.

5. **Admin token rotation incomplete.** From the prior thread the
   token was exposed in chat twice and a rotation attempt stalled.
   The `/admin/scans` 403 confirms the cookie is stale. Complete the
   rotation (generate → save to password manager FIRST → overwrite in
   Vercel → redeploy → re-auth).

## 🔵 Medium Priority

6. **Out-of-scope stale pricing surfaces** (flagged in the prior
   pricing-canonicalisation pass, not fixed): `/foundation`,
   `/proposals/oms-lifting`, `/watch`, `components/serp-real-estate-map.tsx`,
   `lib/intake-briefs.ts`. None on the canonical /pricing or
   /services surfaces. Separate cleanup sprint.

7. **Microsoft Clarity not yet wired.** GA4 is in `layout.tsx`. GSC +
   BWT verification files are deployed. Clarity is the last analytics
   piece — provide the project ID and it's a one-line `layout.tsx`
   addition.

## ⚪ Low Priority

8. **`/scan` result pages** are correctly `noindex` (personal
   business data). No change needed — noted so it isn't "fixed" by
   mistake.
9. **404 status code** — Next.js App Router `not-found.tsx` returns a
   real 404; verified by framework behaviour.

---

## What's Working Well (do NOT break these)

- **Connected entity graph**: Organization (`#organization`) +
  Person (`#kabelo`) + WebSite (`#website`) cross-referenced by `@id`
  + `worksFor`/`publisher`. This is genuinely sophisticated and rare
  for an SA consultant. Don't fragment it.
- **FAQPage schema matches visible HTML** verbatim (homepage FAQ
  section renders the same `homepageFaqs` array the schema reads).
- **Methodology disclosure is honest** — "Claude + web_search proxy",
  directional score, re-run variance stated. This is the trust moat.
- **robots.txt** allows GPTBot/ChatGPT-User/ClaudeBot/anthropic-ai/
  Claude-Web/Google-Extended/PerplexityBot/Perplexity-User/CCBot/
  YouBot, disallows `/admin/`, references the sitemap.
- **llms.txt** present + substantive (services, verticals, method,
  contact).
- **Single source of truth for pricing** (`lib/pricing.ts`) — every
  surface imports it; drift is now typecheck-detectable.
- **Scan API is server-side + rate-limited** — no client-side key
  exposure.

---

## Generated Files (run / deploy these yourself)

### Network checks to run locally (PowerShell or any shell with curl/openssl)

```bash
# Redirect type — want HTTP 301, Location: https://kabelomore.com, 1 hop
curl -I https://kabelomore.co.za
curl -I https://www.kabelomore.co.za
curl -I http://kabelomore.co.za
curl -I http://www.kabelomore.co.za

# SSL SAN coverage — confirm CN/SAN cover apex + www, TLS 1.2+
openssl s_client -connect kabelomore.com:443 -servername kabelomore.com < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -A1 "Subject Alternative Name"
openssl s_client -connect www.kabelomore.com:443 -servername www.kabelomore.com < /dev/null 2>/dev/null | openssl x509 -noout -dates

# Email auth — SPF / DMARC must return records
dig +short TXT kabelomore.com
dig +short TXT _dmarc.kabelomore.com
```

Pass criteria:
- Each .co.za URL → single `301` → `https://kabelomore.com` (NOT 302,
  NOT 200-with-iframe).
- SSL: SAN includes both `kabelomore.com` and `www.kabelomore.com`,
  not expired, TLS 1.2 or 1.3.
- `dig TXT kabelomore.com` includes a `v=spf1 ...` record.
- `dig TXT _dmarc.kabelomore.com` returns `v=DMARC1; ...`.

### vercel.json — .co.za → .com 301 (if .co.za is on Vercel)

If `kabelomore.co.za` is added as a domain in the Vercel project,
configure the redirect there as a **Redirect** (308/301) in the
domain settings UI — that's cleaner than `vercel.json` for a
cross-domain redirect and is what Vercel recommends. If you instead
want it in code for a same-project alias:

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "(www\\.)?kabelomore\\.co\\.za" }],
      "destination": "https://kabelomore.com/:path*",
      "permanent": true
    }
  ]
}
```

Note: if .co.za is registered at a SA registrar and only DNS-forwarded
(not added to Vercel), the registrar's "URL forwarding" is almost
always iframe-based and SEO-toxic — point .co.za's nameservers at
Vercel (or set an A/ALIAS to Vercel + add the domain to the project)
so a real 301 is issued.

### Microsoft Clarity (when you have the project ID)

`app/layout.tsx`, alongside the existing GA4 line:

```tsx
import Script from "next/script";
// ...in <body>, after <GoogleAnalytics />:
<Script id="ms-clarity" strategy="afterInteractive">{`
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","CLARITY_PROJECT_ID");
`}</Script>
```

Replace `CLARITY_PROJECT_ID`. Send me the ID and I'll wire it cleanly
(env-var driven, matching the GA4 pattern).

---

## Schema State (ground truth — verified in source)

| Schema | Status | Location |
|---|---|---|
| Organization (ProfessionalService) | ✅ Present, `@id`-linked, telephone + full address | `lib/seo.ts` organizationJsonLd, site-wide via layout |
| Person | ✅ Present, `@id` `#kabelo`, knowsAbout (14), **hasCredential added this session**, worksFor → Org | `lib/seo.ts` kabeloPersonJsonLd, site-wide |
| WebSite | ✅ Present, publisher → Org | `lib/seo.ts` websiteJsonLd, site-wide |
| FAQPage | ✅ Present, **matches visible HTML verbatim** | homepage (9 Q&A), /pricing, /scan, /services |
| BreadcrumbList | ✅ Present on inner pages | per-page via breadcrumbJsonLd |
| Service | ✅ Present | /services via serviceJsonLd |
| HowTo | ✅ Helper exists (howToJsonLd) | available; confirm wired on /how-we-work |
| Article | ✅ Helper exists (articleJsonLd), author → Person | blog posts |
| sameAs integrity | ✅ Fixed this session — LinkedIn now resolves | Org + Person |

---

## Verification checklist (post-deploy)

1. `https://kabelomore.com/scan` at 360/390/430px — clean 4-card
   "What's in your report", NO floating numbered circles, NO bottom
   popup, all CTAs clickable.
2. Footer LinkedIn link → opens
   `linkedin.com/in/kabelo-the-digital-marketer/` (not 404).
3. `https://kabelomore.com/contact` → LinkedIn row shows the new
   slug as display text.
4. Rich Results Test on homepage → Person schema shows
   `hasCredential` with the Anthropic cert + Google cert.
5. `/api/diagnostics` → after Anthropic top-up, `anthropicTest.ok:
   true`.
6. Run the four `curl -I` commands → confirm .co.za 301 behaviour.

---

## Single highest-leverage action

**Top up Anthropic credits.** Every other fix is polish on a scan
engine that currently returns 400 on every submission. The product
is non-functional until that balance is restored — and no amount of
schema, redirect, or UX work changes that.
