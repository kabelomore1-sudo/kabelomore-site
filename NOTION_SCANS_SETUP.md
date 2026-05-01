# Notion Setup — "Free Scans" Database

The AI Visibility scan system writes every prospect submission to a Notion database. This is your CRM-lite for Phase 1 + 2. (We migrate to Postgres in Phase 3 once you have 50+ scans/month.)

You already have a Notion workspace and the **Daily Visibility Log** database (used for tracking your own AI visibility daily). This new database is **separate** — it stores prospect submissions, scan results, and follow-up status.

Same Notion integration token works for both databases. You just need to create the new database and connect it.

---

## What you do (10 minutes)

### Step 1 — Create the database

1. In your Notion workspace, create a new page called **"Free Scans — Prospect CRM"**
2. Inside it, type `/database` → choose **Database — Full page**
3. Name it **"Free Scans"**

### Step 2 — Add these properties (case- and type-sensitive)

Delete the default columns and add these in order:

| Property name | Type | Options (if select) |
|---|---|---|
| `Business name` | Title | (default — rename it) |
| `Scan ID` | Text | — |
| `Submitted at` | Date | — |
| `Contact name` | Text | — |
| `Email` | Email | — |
| `Phone` | Phone | — |
| `Industry` | Select | industrial-supplier, professional-services, medical, legal, construction, retail, hospitality, manufacturing, automotive, other |
| `City` | Text | — |
| `Country` | Select | ZA, GB, US, other |
| `Website` | URL | — |
| `GBP URL` | URL | — |
| `Score` | Number | — |
| `Classification` | Select | type-a-no-presence, type-b-partial-presence, type-c-active-presence, type-d-strong-presence |
| `Citation count` | Number | — |
| `Citation level` | Select | none, low, medium, high |
| `Top issue` | Text | — |
| `Top recommendation` | Text | — |
| `Diagnosis one-liner` | Text | — |
| `Status` | Select | submitted, scanning, scan-complete, contact-captured, day-1-sent, day-2-sent, day-3-sent, day-5-sent, converted, ghosted |
| `Converted to` | Select | scan-only, starter-audit, discovery, optimization-pack, optimization-lite, foundation-pack, foundation-lite, growth-retainer, premium-retainer |
| `Notes` | Text | — (free-form notes from your sales calls) |

### Step 3 — Connect the integration

You should already have an integration called **"Kabelomore Tracker"** from the AI Visibility tracker setup.

1. Open the **Free Scans** database in Notion
2. Click the **`···`** (three dots, top right)
3. Scroll to **Connections** → **Add connections** → search for `Kabelomore Tracker` → connect

### Step 4 — Send me the database ID

Copy the database ID from the URL (the 32-character hex string between `/` and `?`):

```
https://www.notion.so/<workspace>/<title>-abc123def456...?v=...
                                          ^^^^^^^^^^^^^
                                          this part
```

Add it to your `.env.local` file (or wherever Vercel env vars are configured):

```
NOTION_TOKEN=ntn_<your existing token>          (already set)
NOTION_DATABASE_ID=<your existing tracker DB id> (already set)
NOTION_SCANS_DATABASE_ID=<the NEW Free Scans DB id>  ← add this
```

Then add the same `NOTION_SCANS_DATABASE_ID` to **Vercel → Settings → Environment Variables** so production has it too.

---

## Useful Notion views to set up

After the database has data flowing in, build these saved views:

### "New scans this week" (Calendar view)
- Filter: `Submitted at` is within the last 7 days
- Sort: most recent first
- This is your "what's incoming" daily check.

### "Action needed today" (Table view)
- Filter: `Status` is one of `scan-complete` OR `contact-captured`
- Sort: `Submitted at` ascending (oldest first — they've been waiting longest)
- This is your "who needs a WhatsApp from me today."

### "Hot leads" (Board view by Status)
- Group by `Status`
- Filter: `Submitted at` is within the last 30 days
- This is your kanban — drag cards left to right as leads progress.

### "Conversion analysis" (Table view)
- Filter: `Converted to` is not empty
- Sort: by `Submitted at`
- This is your monthly "what's converting" data.

---

## Phase 1 vs Phase 2 vs Phase 3

| Phase | Who writes to Notion | Cadence |
|---|---|---|
| **Phase 1 (now)** | The `/api/scan/start` endpoint writes the initial row when scan submitted. The scan engine updates the row when scan completes. You manually update `Status`, `Notes`, `Converted to` as you sell. | Real-time on submit/complete |
| **Phase 2 (after 10 scans)** | Same as Phase 1, plus the `/api/cron/followup` endpoint updates `Status` as each drip message is sent. | Daily cron at 09:00 SAST |
| **Phase 3 (after 50 scans)** | Migrate to Postgres (Neon) for proper relational queries. Notion becomes a **reporting layer only** — synced from Postgres for visual review. | Weekly sync |

---

## Privacy + PoPIA notes

The Free Scans database stores Personally Identifiable Information (email, phone, business details). PoPIA requires:

1. **Lawful basis for processing.** The user submits voluntarily by completing the form, with clear notice of what we'll do with it. Our `/scan` form will include this notice.
2. **Retention limit.** Don't keep prospect data forever. Set a Notion automation or manual quarterly review to archive prospects > 12 months old who didn't convert.
3. **Right to deletion.** If a prospect emails asking us to delete their data, find the row, click delete. Document the request in a separate "Deletion Log" view.
4. **Security.** Notion is SOC2 compliant. Two-factor auth on your Notion account (Settings → Security → Two-step verification).

---

## What goes in this database vs the Daily Visibility Log

| Database | What it stores | Who reads it |
|---|---|---|
| **Daily Visibility Log** (existing) | Your own AI visibility tracking data — 25 prompts × 4 engines × daily | You only — internal |
| **Free Scans** (this new one) | Prospect submissions + scan results + follow-up status | You + future contractors + (later) automation |

Different schemas, different purposes, same Notion workspace, same integration token.

---

## When something breaks

**Symptom:** scan submission succeeds but doesn't appear in Notion
**Likely cause:** integration not connected to Free Scans DB
**Fix:** Step 3 above

**Symptom:** Notion API returns "property not found"
**Likely cause:** property name typo (case-sensitive)
**Fix:** Check the exact name in Step 2 above. "Business name" ≠ "Business Name" ≠ "business_name".

**Symptom:** Notion API rate-limited (3 requests/second is the cap)
**Likely cause:** more than 3 scans submitting at exactly the same time
**Fix:** Phase 1 unlikely to hit this. If you do, that's a great problem — switch to Postgres earlier than planned.

---

When you've finished steps 1-4, tell me the new database ID and I wire the API endpoint. Then we ship Sprint 1B (the actual API + form expansion + scan engine wiring).
