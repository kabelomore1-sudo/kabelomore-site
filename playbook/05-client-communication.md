# 05 — Client Communication Templates

Every email, status update, and handover note. Copy-paste, adjust, send.

**Principle:** Predictable communication is half the perceived value of consulting work. Clients don't always notice good schema — they always notice clear updates. Make your comms boringly consistent.

---

## 1. Confirmation email (sent within 1 hour of brief submission)

```
Subject: Got your [TIER NAME] brief — what happens next

Hi [CLIENT FIRST NAME],

Got it. Your [TIER NAME] brief landed, and I've reviewed everything.

Here's what happens in the next 24-48 hours:

1. I'll send a deposit invoice for R[DEPOSIT AMOUNT] (50% of R[TOTAL])
   — payable by card or EFT.
2. The moment that clears, I schedule our 30-min kickoff call —
   probably for [DAY], [DATE].
3. From the kickoff call onward, you get a status update every 3 days
   so you always know where things are.

Quick check: anything missing or unclear in your brief that I should
ask about before kickoff? Just reply here if so.

Talk soon,

Kabelo
kabelomore.com
+27 [PHONE]
```

---

## 2. Deposit invoice email

```
Subject: Deposit invoice — [TIER NAME] for [BUSINESS NAME]

Hi [CLIENT FIRST NAME],

Here's the deposit invoice for the [TIER NAME] engagement.

Amount: R[DEPOSIT AMOUNT] (50% of R[TOTAL])
Reference: [BUSINESS NAME] — [TIER]
Banking details + card payment link below.

Card payment: [STRIPE / YOCO / PAYFAST LINK]

EFT details:
   Bank:        [BANK NAME]
   Account:     [ACCOUNT NUMBER]
   Branch:      [BRANCH CODE]
   Reference:   [BUSINESS NAME-INVOICE-NUMBER]

Once this clears, I lock in our kickoff call. Looking at [DAY/DATE]
options — let me know what works for you and I'll send a calendar
invite.

— Kabelo
```

---

## 3. Kickoff call confirmation + agenda

```
Subject: Kickoff call confirmed — [DATE] at [TIME]

Hi [CLIENT FIRST NAME],

Confirmed for [DAY, DATE] at [TIME, TIMEZONE].
[GOOGLE MEET / ZOOM / WHATSAPP CALL] link: [LINK]

Agenda (30 min):

1. Confirm scope + timeline (5 min)
2. Walk through your brief together (10 min)
3. Get access we need: [admin/editor login OR confirmation we'll use GTM] (5 min)
4. Confirm 3 priority services + 3 competitors for benchmarking (5 min)
5. Q&A from your side (5 min)

Before the call, please have ready:
- Logo file (high-res PNG with transparent background, or SVG, or original
  Illustrator file — whatever you have)
- 5 photos minimum of your business / work / team
- List of 3 competitors (URLs preferred)
- The login(s) for your existing website if applicable, OR confirmation
  that I should set up Google Tag Manager for schema deployment

If anything's missing don't worry — we'll figure it out on the call.

— Kabelo
```

---

## 4. The 3-day status update (THE most important comms template)

Send every 3 working days during active engagement. **This single discipline is worth more than any feature you ship.**

```
Subject: [BUSINESS NAME] — Day [X] update

Hi [CLIENT FIRST NAME],

3-day update on the [TIER NAME] engagement.

✓ DONE this period:
   - [Concrete deliverable 1]
   - [Concrete deliverable 2]
   - [Concrete deliverable 3]

▸ DOING next period:
   - [Specific task 1]
   - [Specific task 2]

? FROM YOU (anything I'm waiting on):
   - [Specific thing OR "Nothing — we're on track"]

📅 Next milestone: [Day X — what lands]
📅 Final delivery: [Day Y — handover call]

Quick links:
- Working preview: [LINK if applicable]
- This week's deliverable: [LINK if applicable]

Reply if anything's unclear. Otherwise, talk in 3 days.

— Kabelo
```

**Rules for this email:**
- Send every 3 working days. Skip weekends but never skip a Tuesday/Thursday.
- Concrete bullets only — no "working on schema" (vague) — say "Deployed LocalBusiness, Service x3, FAQ schema on homepage. Validated in Google Rich Results Test, all green."
- The "FROM YOU" section is THE conversion mechanism. Most projects stall because clients don't know they're blocking. Tell them.
- Subject line always includes the day number — easy for client to find later in their inbox.

---

## 5. Mid-engagement scope-creep response

When the client asks for something that's outside scope, respond warmly but firmly:

```
Subject: Re: [WHAT THEY ASKED]

Hi [CLIENT FIRST NAME],

Good thinking — that would definitely add value. Quick check on scope:
that's outside what's covered in [TIER NAME], so it'd be an add-on.

Here's the cost + timeline if you want to add it now:

[ADD-ON NAME]: R[PRICE]
Time: [DAYS]
What it adds: [1 SENTENCE]

If yes, I'll send a small top-up invoice and slot it in. If you want
to wait — totally fine, we can do it as a separate project after
delivery.

No pressure either way.

— Kabelo
```

**The script:** never say no, never absorb scope creep silently. Quote the add-on. They either pay or wait. Both are fine outcomes.

---

## 6. Mid-engagement client-blocking-progress email

When you've sent a status update flagging "from you: I need [X]" and the client has gone silent for 3+ days:

```
Subject: [BUSINESS NAME] — Quick check, am I blocking you?

Hi [CLIENT FIRST NAME],

Just checking in — last message I needed [SPECIFIC THING] to keep moving
on the [TIER NAME] engagement. Without it I can't [WHAT IT BLOCKS].

Three options:
1. Send me the [THING] today/tomorrow and we stay on the original
   timeline ([ORIGINAL DATE]).
2. We push delivery by [N] days — happens to lots of clients, no penalty.
3. If circumstances changed and you want to pause, just tell me
   honestly and we'll work it out.

Just need a quick reply to know which.

— Kabelo
```

**The script:** give them three outs (provide / extend / pause). One of them will land. Silence kills projects faster than honest renegotiation.

---

## 7. Pre-handover prep email (Day 28 of Foundation, Day 19 of Optimization)

```
Subject: We're at the finish line — handover call options

Hi [CLIENT FIRST NAME],

We're [days] from final delivery. Time to schedule the handover call —
30 min, walks you through every login, every page, what we did, before/after
data, and your free 60-day support window.

Three time slots that work for me this week:

1. [DAY 1] at [TIME]
2. [DAY 2] at [TIME]
3. [DAY 3] at [TIME]

Reply with your pick, I'll send a calendar invite + Meet/Zoom link.

After the call I'll send the final invoice (R[FINAL HALF]) and the
handover PDF with everything documented.

Talk soon,

— Kabelo
```

---

## 8. Handover PDF — structure

This is the deliverable that defines whether they remember you well in 6 months. Always include:

```markdown
# [BUSINESS NAME] — AEO Engagement Handover
## Delivered by Kabelomore on [DATE]

---

## What we delivered

[Numbered list of every concrete deliverable from the engagement]

## Where everything lives

| Asset | URL / Location | Login |
|---|---|---|
| Website | [URL] | [Hosting login info OR "see Vercel below"] |
| Domain registrar | [REGISTRAR] | [Login URL + username — password should be in a separate password manager note] |
| Google Business Profile | [GBP SHARE LINK] | Linked to [client@email.com] |
| Vercel hosting | https://vercel.com/... | Linked to [client@email.com] |
| Google Search Console | https://search.google.com/search-console | Linked to [client@email.com] |
| Google Analytics 4 | https://analytics.google.com/ | Linked to [client@email.com] |
| Facebook Page | [URL] | Linked to [client@email.com] |
| Instagram | [URL] | Linked to [client@email.com] |
| LinkedIn Company | [URL] | Linked to [client@email.com] |
| Email (business) | [admin@domain.co.za] | Google Workspace login |

## Schema deployed (and where to validate)

[List of every schema type deployed + which page each is on]

To validate any page in the future:
1. Go to https://search.google.com/test/rich-results
2. Paste the page URL
3. Check it returns no errors

## Citations established

[Numbered list of all 10 directories with the exact NAP data used]

## Before / After AI scan results

[Screenshots from the BEFORE scan (Day 5-6 of engagement)]
[Screenshots from the AFTER scan (Day 27-28 of engagement)]

What changed:
- [Specific improvement 1]
- [Specific improvement 2]
- [Specific improvement 3]

## How to update content yourself (free walkthrough is included)

[Either: link to your free 10-min walkthrough video for them
 OR: instructions for using the Self-Edit Admin Panel if installed
 OR: instructions for editing markdown via GitHub web UI for blog posts]

## Your 60-day support window

For 60 days from today, email me at kabelo@kabelomore.com with:
- Login issues
- Small content updates (under 30 min)
- Schema validation questions
- GBP question answering

Larger changes after delivery:
- Hourly: R750/hour
- Or convert to Growth Retainer (R8,500/month) for ongoing AEO work

## What to expect over the next 90 days

AEO is a compounding game. You won't see all the citation improvement immediately:

- **Days 0-30:** AI engines re-crawl and re-index your site. Some will
  start citing you in this window.
- **Days 30-60:** Citation rate stabilises. Most engines now have
  consistent data.
- **Days 60-90:** You're cited more reliably for your priority queries.
  Compounding kicks in as more sites link to you / mention you organically.

I recommend checking your AI visibility yourself at day 30 and day 60 by
running the same queries we ran in your scan. If results haven't moved
after 60 days, email me — sometimes a tweak is needed.

## Final invoice

R[FINAL HALF] — [PAYMENT LINK / REFERENCE / EFT DETAILS]

Thank you for trusting me with this. The work compounds for months and
years, not just at delivery. If anything ever feels off, you have my
direct email and WhatsApp.

— Kabelo More
   kabelomore.com
   kabelo@kabelomore.com
   +27 [PHONE]
```

---

## 9. Final invoice email (sent same day as handover PDF)

```
Subject: [BUSINESS NAME] — Final invoice + handover doc attached

Hi [CLIENT FIRST NAME],

Walkthrough call done — thanks for the time.

Two attachments:

1. Handover PDF — every login, every change, before/after data,
   and how to maintain things going forward.
2. Final invoice — R[FINAL HALF].

Card payment link: [LINK]
EFT details: [SAME AS DEPOSIT]

About retainer — I'll follow up separately on whether ongoing AEO work
makes sense for you. No rush; that's a decision for next week, not today.

Thanks again. The work compounds for the next 90 days at least, and
keeps building from there.

— Kabelo
```

---

## 10. Retainer pitch follow-up (1 week post-handover)

```
Subject: 1 week on — quick check-in + retainer thinking

Hi [CLIENT FIRST NAME],

Hope week 1 post-launch went well. Quick check-in:

1. Anything broken or unclear from the handover doc?
2. Have you tried any of the queries we ran in the scan to see how
   AI engines respond now? If you have, what did you see?

Also — separately — I want to share thinking on the Growth Retainer
since I mentioned it on the handover call but didn't push.

Why it makes sense for [BUSINESS NAME] specifically:

- [SPECIFIC REASON 1 — e.g. "the citation work needs monthly maintenance
   to stay consistent as AI engines update"]
- [SPECIFIC REASON 2 — e.g. "your top competitor [X] just published a
   new schema-rich service page, which means the AEO race in your
   vertical is heating up"]
- [SPECIFIC REASON 3 — e.g. "we're 60-90 days from peak compounding
   effect, and the businesses that maintain through that window
   widen the gap from those that don't"]

If retainer makes sense: R8,500/month, 3-month minimum, includes the
Discovery & Strategy Sprint (R3,500 value) free in month 1. Cancel
anytime after month 3, 30 days notice.

If retainer doesn't make sense right now: totally fine. The 60-day
support window is still active, and I'm here when you need me.

Either way, reply with what you're thinking.

— Kabelo
```

---

## 11. The "ghost client" recovery email (if no reply for 14 days)

```
Subject: [BUSINESS NAME] — last check-in

Hi [CLIENT FIRST NAME],

It's been a couple weeks. I want to make sure I haven't dropped any ball
on my side.

If now's not the right time for ongoing AEO work, no problem at all —
just say so and I'll close the loop. If something's blocking you that
I can help with, tell me.

Either way, the door's open. Drop a line whenever.

— Kabelo
```

After this, mark them inactive. Don't email again. They'll come back at month 2-3 if they're real.

---

## 12. The referral request email (1 month post-handover)

```
Subject: Quick favour — referral ask

Hi [CLIENT FIRST NAME],

Hope month 1 has been good. Quick ask: do you know any [VERTICAL]
business owners in SA / UK / US who might want a free AI scan?

What I do is undersaturated — most marketers haven't caught up to AEO
yet. Each of your referrals just gets the same free scan you got, no
hard sell, no obligation.

If anyone comes to mind, you can either:
- WhatsApp them my contact + free scan link (kabelomore.com/scan)
- Reply with their name + email and I'll reach out gently

For every referral that becomes a paying client, I'll credit your next
[retainer month / hourly hours / discount] — your call which.

Thanks for backing this. Real referrals from real clients are how a
small consulting practice grows.

— Kabelo
```

---

## Comms golden rules

1. **Reply to every client email within 24 hours**, even if it's just *"Got it, will respond fully tomorrow."*
2. **Never go silent for more than 3 working days** during active engagement.
3. **Always quote scope creep — never absorb it.** Even small extras compound to lost margin.
4. **Use WhatsApp for quick questions, email for anything that needs a paper trail.**
5. **Send status updates BEFORE the client asks.** The moment they ask "how's it going?", you're already late.
6. **Be concrete in every comm.** "Working on schema" is bad. "Deployed LocalBusiness + Service x3 schema on homepage and 3 service pages, all green in Google Rich Results Test" is good.
7. **Confirm calendar invites with both Google Meet AND a phone fallback.** SA infrastructure isn't always reliable.
8. **Never apologise for prices. Explain them.** "It's R10,500 because we're doing X, Y, Z — here's what each piece does for you."
9. **End every active engagement with a referral request.** Most happy clients refer when asked, never when not asked.
