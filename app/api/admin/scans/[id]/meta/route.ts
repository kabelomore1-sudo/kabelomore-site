import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  getScanMeta,
  updateScanMeta,
  type ScanMeta,
} from "@/lib/storage/scanStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET  /api/admin/scans/[id]/meta — read admin-set metadata
 * POST /api/admin/scans/[id]/meta — patch admin-set metadata
 *
 * Admin-only. Tracks Kabelo's manual workflow state for each scan:
 *   - handled  → he's reviewed the scan output
 *   - emailed  → he's sent the personalised report email
 *   - archived → moved out of "active leads"
 *   - note     → free-form note
 *
 * The patch is a merge — sending `{ handled: true }` does NOT clear
 * `emailed` or the note. Each flag is independent.
 *
 * Validation: zod schema rejects unknown fields and types. Note has a
 * 2,000 char ceiling — comfortably more than any one-line admin note
 * but bounded against runaway payloads.
 */

const PatchSchema = z
  .object({
    handled: z.boolean().optional(),
    emailed: z.boolean().optional(),
    archived: z.boolean().optional(),
    note: z.string().max(2_000).optional(),
  })
  .strict();

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    return unauthorised(auth.reason);
  }

  const { id } = await ctx.params;
  if (!isValidScanId(id)) {
    return NextResponse.json(
      { ok: false, message: "Invalid scan ID." },
      { status: 400 },
    );
  }

  try {
    const meta = await getScanMeta(id);
    return NextResponse.json({ ok: true, scanId: id, meta });
  } catch (err) {
    console.error("[admin/scans/meta] getScanMeta failed:", safeErr(err));
    return NextResponse.json(
      { ok: false, message: "Server error reading scan metadata." },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    return unauthorised(auth.reason);
  }

  const { id } = await ctx.params;
  if (!isValidScanId(id)) {
    return NextResponse.json(
      { ok: false, message: "Invalid scan ID." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid payload.",
      },
      { status: 400 },
    );
  }

  try {
    const next: ScanMeta = await updateScanMeta(id, parsed.data);
    console.info(
      JSON.stringify({
        event: "admin_meta_updated",
        scanId: id,
        keys: Object.keys(parsed.data),
      }),
    );
    return NextResponse.json({ ok: true, scanId: id, meta: next });
  } catch (err) {
    console.error("[admin/scans/meta] updateScanMeta failed:", safeErr(err));
    return NextResponse.json(
      { ok: false, message: "Server error writing scan metadata." },
      { status: 500 },
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────

function unauthorised(reason: string): NextResponse {
  if (reason === "no-token-configured") {
    return NextResponse.json(
      { ok: false, message: "ADMIN_TOKEN env var is not configured." },
      { status: 503 },
    );
  }
  if (reason === "invalid") {
    return NextResponse.json(
      { ok: false, message: "Forbidden — invalid admin token." },
      { status: 403 },
    );
  }
  return NextResponse.json(
    { ok: false, message: "Unauthorised — access token required." },
    { status: 401 },
  );
}

// Defensive: scanIds we generate look like `scan_YYYYMMDD_<12 chars>` —
// reject obvious garbage to avoid hitting KV with arbitrary strings.
function isValidScanId(id: string): boolean {
  return /^scan_[a-z0-9_-]{6,80}$/i.test(id);
}

function safeErr(err: unknown): string {
  if (err instanceof Error) {
    return err.message
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, "[REDACTED]")
      .replace(/re_[a-zA-Z0-9_-]{20,}/g, "[REDACTED]")
      .slice(0, 300);
  }
  return String(err).slice(0, 300);
}
