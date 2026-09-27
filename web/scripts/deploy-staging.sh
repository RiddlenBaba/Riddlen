#!/usr/bin/env bash
# Deploy web/ to the riddlen-staging Vercel project (team kkalmanowiczs-projects), the v2 staging
# environment. Production (riddlen.com) is the linked project in .vercel/project.json and is deployed
# with a plain `vercel --prod`. The IDs below are not secrets.
#   ./scripts/deploy-staging.sh            # production deployment OF THE STAGING PROJECT
#   ./scripts/deploy-staging.sh --preview  # throwaway preview URL on the staging project
set -euo pipefail
cd "$(dirname "$0")/.."
export VERCEL_ORG_ID=team_mBfh5FQZ4V0Le9xjqPHqFXhM
export VERCEL_PROJECT_ID=prj_ehjBNjDFiwNhC4tx4rDtgXFIJtcE
if [[ "${1:-}" == "--preview" ]]; then vercel --yes; else vercel --prod --yes; fi
