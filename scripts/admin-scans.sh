#!/usr/bin/env bash
# admin-scans.sh — list recent submissions from the terminal.
#
# Usage:
#   ./scripts/admin-scans.sh                # list against prod (kabelomore.com)
#   ADMIN_BASE=http://localhost:3000 ./scripts/admin-scans.sh  # against local dev
#
# Requires: ADMIN_TOKEN env var (same token set in Vercel + .env.local).
#
# Why bash + curl: zero new dependencies. The site already deploys without
# a separate node script runtime, and Kabelo's local terminal already has
# bash + curl + jq (or can install jq with `brew install jq`).
#
# If jq isn't installed, we still print raw JSON — readable, just less pretty.

set -euo pipefail

if [[ -z "${ADMIN_TOKEN:-}" ]]; then
  echo "ERROR: ADMIN_TOKEN env var is not set." >&2
  echo "       Set it from your .env.local: \`export ADMIN_TOKEN=\$(grep ADMIN_TOKEN .env.local | cut -d= -f2)\`" >&2
  exit 1
fi

BASE="${ADMIN_BASE:-https://kabelomore.com}"
LIMIT="${1:-50}"

URL="${BASE}/api/admin/scans?limit=${LIMIT}"

if command -v jq >/dev/null 2>&1; then
  curl -sS -H "Authorization: Bearer ${ADMIN_TOKEN}" "$URL" | jq '.rows[] | {
    submitted: .submittedAt,
    business: .businessName,
    contact: .contactName,
    email: .email,
    status: .status,
    score: .score,
    scanId: .scanId
  }'
else
  echo "# Tip: install jq (brew install jq) for pretty output." >&2
  curl -sS -H "Authorization: Bearer ${ADMIN_TOKEN}" "$URL"
fi
