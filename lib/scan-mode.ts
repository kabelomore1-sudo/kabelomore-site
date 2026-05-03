/**
 * SCAN_MODE — operational switch controlling whether public scan
 * submissions trigger paid Anthropic API calls.
 *
 * THE PROBLEM IT SOLVES:
 *
 * Until the automated scan reliably finishes inside Vercel's 60s
 * function limit AND the email pipeline is proven, every public scan
 * submission risks:
 *   - Burning Anthropic credits ($0.10-0.30 per scan)
 *   - Generating fallback states that look unprofessional to prospects
 *   - Hiding the underlying delivery problems with noise
 *
 * Manual-first mode (current default) skips Anthropic entirely. The
 * submission is saved, Kabelo gets the notification email, the user
 * gets a clean acknowledgment email, and Kabelo runs the scan via
 * the audit-agent CLI within 24 hours. Same UX, zero cost leak,
 * zero unreliable promises.
 *
 * MODES:
 *
 *   "manual"     (default) — skip paid API call entirely. Save +
 *                  email + manual fallback. Safest. Use until both
 *                  email AND scan are independently proven reliable.
 *
 *   "automated"  — try Anthropic with 45s hard timeout. Fall back
 *                  to manual flow if it doesn't complete. Use when
 *                  scan reliability is high enough to handle it.
 *
 *   "disabled"   — refuse all scan submissions entirely. Returns
 *                  503. Use as emergency switch if abuse, cost runs,
 *                  or system-wide failures need stopping.
 *
 * HOW TO CHANGE:
 *
 *   Vercel → Settings → Environment Variables → SCAN_MODE
 *   Set to "automated" / "manual" / "disabled" → redeploy
 *
 *   No code change required to flip modes.
 */

export type ScanMode = "manual" | "automated" | "disabled";

const VALID_MODES: ScanMode[] = ["manual", "automated", "disabled"];

/**
 * Get the current scan mode from env.
 *
 * Default = "manual" (safe). Operator must explicitly opt into
 * "automated" by setting SCAN_MODE=automated in Vercel.
 *
 * Invalid values fall back to "manual" — never crash the route on
 * a typo'd env var.
 */
export function getScanMode(): ScanMode {
  const raw = process.env.SCAN_MODE?.toLowerCase().trim() as ScanMode | undefined;
  if (raw && VALID_MODES.includes(raw)) {
    return raw;
  }
  return "manual";
}

/**
 * Whether the current mode is allowed to make paid API calls.
 * Only "automated" gets to spend money.
 */
export function isPaidApiAllowed(): boolean {
  return getScanMode() === "automated";
}

/**
 * Whether the current mode accepts new scan submissions at all.
 * Both "manual" and "automated" accept; only "disabled" refuses.
 */
export function acceptsSubmissions(): boolean {
  return getScanMode() !== "disabled";
}
