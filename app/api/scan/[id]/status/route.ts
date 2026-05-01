import { NextResponse } from "next/server";
import {
  getStatus,
  getResult,
  getError,
  isStorageConfigured,
} from "@/lib/storage/scanStore";

export const runtime = "nodejs";

/**
 * GET /api/scan/[id]/status
 *
 * Returns the current status + result of a scan. Used by:
 *  - Results page when loaded fresh (e.g. shared URL, refresh) and
 *    sessionStorage doesn't have the result
 *  - Future polling page (Phase 2 when we move to async scan execution)
 *
 * Response shape:
 *  { status: "scanning" }                  → still in progress
 *  { status: "complete", result: ... }     → scan finished, full result included
 *  { status: "failed", error: "..." }      → scan errored out
 *  { status: "not-found" }                 → scanId unknown OR storage not configured
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { ok: false, message: "Invalid scan ID" },
      { status: 400 },
    );
  }

  // If KV isn't configured, we can never retrieve historical scans.
  if (!isStorageConfigured()) {
    return NextResponse.json({
      ok: true,
      status: "not-found",
      message:
        "Persistent storage not configured. Scan results are sent via email only.",
    });
  }

  const status = await getStatus(id);

  if (!status) {
    return NextResponse.json({ ok: true, status: "not-found" });
  }

  if (status === "scanning") {
    return NextResponse.json({ ok: true, status });
  }

  if (status === "failed") {
    const error = await getError(id);
    return NextResponse.json({
      ok: true,
      status,
      error: error ?? "Unknown error",
    });
  }

  // status === "complete"
  const result = await getResult(id);
  if (!result) {
    return NextResponse.json({
      ok: true,
      status: "not-found",
      message: "Scan was marked complete but result data is missing.",
    });
  }

  return NextResponse.json({ ok: true, status, result });
}
