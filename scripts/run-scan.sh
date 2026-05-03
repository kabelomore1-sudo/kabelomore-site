#!/usr/bin/env bash
# run-scan.sh — manually run a scan from the terminal.
#
# Usage:
#   ./scripts/run-scan.sh <scanId>
#   ADMIN_BASE=http://localhost:3000 ./scripts/run-scan.sh <scanId>
#
# Requires: ADMIN_TOKEN env var.
#
# What it does: POSTs to /api/admin/scans/<scanId>/run, which loads the
# saved profile from KV, calls the orchestrator (Claude+web_search), and
# saves the result. Costs ~$0.30 per invocation. Takes ~30-50 seconds.
#
# What it does NOT do: send the prospect's report email. That's a manual
# step — review the result at /scan/<scanId>/results first, then send
# the personalised email yourself. Manual mode exists precisely so you
# can verify before delivering.

set -euo pipefail

if [[ -z "${1:-}" ]]; then
  echo "Usage: $0 <scanId>" >&2
  echo "       e.g. $0 scan_20260503_abc123def456" >&2
  exit 1
fi

if [[ -z "${ADMIN_TOKEN:-}" ]]; then
  echo "ERROR: ADMIN_TOKEN env var is not set." >&2
  exit 1
fi

SCAN_ID="$1"
BASE="${ADMIN_BASE:-https://kabelomore.com}"
URL="${BASE}/api/admin/scans/${SCAN_ID}/run"

echo "Running scan ${SCAN_ID}…" >&2
echo "Hitting ${URL}" >&2
echo "(this takes 30-50 seconds — Claude+web_search runs ~6 searches)" >&2
echo "" >&2

START=$(date +%s)

if command -v jq >/dev/null 2>&1; then
  RESPONSE=$(curl -sS -X POST -H "Authorization: Bearer ${ADMIN_TOKEN}" --max-time 90 "$URL")
  echo "$RESPONSE" | jq .
else
  curl -sS -X POST -H "Authorization: Bearer ${ADMIN_TOKEN}" --max-time 90 "$URL"
  echo ""
fi

END=$(date +%s)
echo "" >&2
echo "Done in $((END - START))s" >&2
echo "View: ${BASE}/scan/${SCAN_ID}/results" >&2
