#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

trap 'echo "Deploy aborted - a previous step failed, nothing was committed or deployed." >&2' ERR

echo "Running Email Signature Builder production hosting deploy"
echo "Firebase project context: taliferrotech"
firebase use taliferrotech

echo "Building the production Email Signature Builder bundle..."
npm run build

echo "Running Email Signature Builder unit tests..."
npm run test:ci

echo "Running TypeScript validation..."
npm run typecheck

if [ -n "$(git status --porcelain)" ]; then
  echo "Build and checks passed - committing changes before deploy..."
  VERSION="$(node -p "require('./package.json').version")"
  git add -A
  git commit -m "Deploy: v${VERSION}"
else
  echo "No changes to commit - working tree already clean."
fi

echo "Deploying Email Signature Builder to Firebase Hosting site taliferro-email-signature-builder..."
firebase deploy --project taliferrotech --only hosting:taliferro-email-signature-builder

echo "Email Signature Builder hosting deploy complete."
