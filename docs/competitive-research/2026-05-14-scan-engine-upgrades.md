# Scan engine upgrades — derived from Ubersuggest competitive analysis

**Date:** 2026-05-14
**Source:** `2026-05-14-ubersuggest-ai-scan.md`
**Scope:** Backlog tickets derived from the analysis.

**Status log:**
- ✅ **Ticket 1 — SHIPPED** 2026-05-15 (commit `0c50e33`): prompt mining + intent classification live in the scan engine + report + sample/preview.
- ✅ **Ticket 2 — SHIPPED** 2026-05-16 (commit `5593c18`): competitor leaderboard with avgRank + mentionCount in the engine, report table, sample/preview, and admin email.
- ✅ **Ticket 3 — SHIPPED** 2026-05-16 (commit `0c31a3d`): competitor locality tagging (local/regional/national/unknown) inferred from the AI proxy's own phrasing; Locality column in the report leaderboard + admin email + sample/preview. This is the "they don't do nearby" wedge vs SEMrush/Ubersuggest. Originally pitched mid-stream as "Ticket 3"; the prior Ticket 3 (headline framing) renumbered to **Ticket 4** below.
- Tickets 4–6: backlog.

Context: our scan currently runs ~4 fixed query shapes against a Claude + live-web proxy and returns a score, classification, verbatim responses, and competitor names. Ubersuggest's analysis exposes five gaps/opportunities. Tickets are ordered by leverage.

---

## TICKET 1 — Prompt mining + intent classification ✅ SHIPPED (commit `0c50e33`, 2026-05-15)

**Why:** Ubersuggest's single strongest feature. Replacing our 4 fixed query shapes with a generated set of *real category questions* (buyer language, SA-localised) makes the diagnosis credible and specific instead of templated. Intent tagging (Informational / Navigational / Transactional) adds a layer Ubersuggest paywalls the *chart* for — we can show the full breakdown free.

**Scope:**
- Generate 8–15 category prompts per scan from the business's vertical + region (LLM-generated, reviewed in manual mode before send).
- Classify each prompt by intent. Surface the list + intent tags in the report.
- Keep verbatim response capture per prompt (our existing differentiator — Ubersuggest never shows answer text).

**Effort:** M · **Risk:** low (additive to existing scan loop). Mind the Vercel 60s ceiling — keep prompt count bounded and parallelised (Promise.allSettled, as already done for the 4-query path).

**Differentiator framing:** "We don't guess what your customers ask AI — we mine the actual questions, then show you the exact answers."

## TICKET 2 — Competitor leaderboard with average rank ✅ SHIPPED (commit `5593c18`, 2026-05-16)

**Why:** Ubersuggest's free "Top Brands / Avg. rank" table is its most concrete threat signal. We already list "names that surfaced instead of you"; adding **average position when cited** turns a list into a ranking and quantifies the gap.

**Scope:**
- Per competitor: citation count (have) + **average ordinal position** across prompts where they appear (new).
- Render as a sorted table in the report + sample preview. Lower avg = more prominent.

**Effort:** S · **Risk:** low (post-processing of data we already collect).

## TICKET 3 — Competitor locality tagging ✅ SHIPPED (commit `0c31a3d`, 2026-05-16)

**Why:** SEMrush/Ubersuggest measure AI mentions in the abstract and have *no* "near me" dimension. For SA industrial/legal/medical buyers AI weights local trust heavily — a local competitor winning the answer is a different, more urgent, more fixable problem than a national firm doing so. This is the sharpest wedge in the comparison: a column their tools structurally cannot produce.

**Scope (shipped):**
- `classifyLocality` infers local | regional | national | unknown from sentence-level co-occurrence of the competitor name with the prospect's city / region / country / global markers, across the verbatim answer + context snippet.
- Zero extra API calls/latency (sentence heuristic on text we already have). Punctuation-safe token matching; sentence-scoped to avoid false-positive "local".
- Colour-coded Locality column in the report leaderboard (Local = emerald), admin email tag, sample/preview.
- Framed honestly as **inferred from the AI's phrasing, not a verified registration check**.

**Deliberately deferred (future ticket):** Places-API-backed per-competitor verification — adds N API calls + latency the synchronous 60s scan path won't spend. Our existing Places fusion is for the *prospect's* business; extending it per-competitor is a separate, heavier piece of work.

## TICKET 4 — "Industry rank + visibility %" headline framing

**Why:** Ubersuggest's funnel works because the first number is a brutal "0% / rank: —". We have the same data but bury it in a 0–100 score. Add the ordinal framing — *then immediately pair it with the fix list* (their model paywalls the fix; ours doesn't — that's the whole pitch).

**Scope:**
- Derive "you appear in X% of AI responses" + "you rank Nth of M named businesses" from existing scan data.
- Lead the report with it; fixes directly underneath (explicit contrast vs the paywall model).

**Effort:** S · **Risk:** low. **Note:** keep honest — if 0%, say 0%; never inflate. Pair every gut-punch with a concrete next step.

## TICKET 5 — Multi-engine coverage made explicit

**Why:** Ubersuggest is ChatGPT-default and **paywalls Gemini**. Our proxy already stands in for ChatGPT/Gemini/Perplexity — but the report doesn't make multi-engine coverage legible as a value prop, and the methodology nuance is buried in the FAQ.

**Scope:**
- Surface a short "engines covered + method" box in the report body (not just FAQ).
- Roadmap line: native per-engine adapters (Phase 1.5) — state current proxy honestly.

**Effort:** S · **Risk:** low (presentation + copy; honesty-audit any claim before it ships).

## TICKET 6 — Verbatim-response + methodology panel (moat reinforcement)

**Why:** The biggest thing Ubersuggest cannot do: show the *actual* AI answer and disclose how the scan was run. We already capture verbatim responses — this ticket is about *presenting* them as the centrepiece and adding a transparent methodology block (proxy engine, run date, prompt rationale, # runs).

**Scope:**
- Dedicated report section: per-prompt verbatim AI answer, with the competitor names highlighted in-line.
- Methodology box: engine/proxy, date, prompt count, known limitations. Mirrors /scan FAQ language for consistency.

**Effort:** M · **Risk:** low–medium (layout; ensure no PII / no overclaiming).

---

## Recommended sequencing

1. ✅ **Ticket 1** (prompt mining + intent) — highest leverage, the feature that makes the rest credible.
2. ✅ **Ticket 2** (avg-rank leaderboard) — cheap, high-impact threat signal, builds on Ticket 1's expanded prompt set.
3. ✅ **Ticket 3** (locality tagging) — the "they don't do nearby" wedge; a column SEMrush/Ubersuggest can't produce.
4. **Ticket 4** (rank/% framing) — cheap conversion lift, pairs the threat with our paywall-free fix list. *Next.*
5. **Tickets 5 & 6** — presentation/positioning; reinforce the moat once the data layer (1–4) is richer.

All stay within "diagnose hard, then hand over the fix for free" — the exact wedge against Ubersuggest's "pay to see how bad it is" model.
