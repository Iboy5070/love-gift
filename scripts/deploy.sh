#!/bin/zsh
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v gh >/dev/null; then
  echo "Install gh first: brew install gh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  echo "Then run this script again."
  exit 1
fi

USER=$(gh api user --jq .login)
REPO="love-gift"
URL="https://${USER}.github.io/${REPO}/"

if ! gh repo view "${USER}/${REPO}" >/dev/null 2>&1; then
  gh repo create "${REPO}" --public --source=. --remote=origin --push
else
  git push -u origin main
fi

gh api -X POST "repos/${USER}/${REPO}/pages" -f "build_type=workflow" >/dev/null 2>&1 || true

# rewrite site URL in config.js
python3 - << PY
from pathlib import Path
p = Path("config.js")
t = p.read_text(encoding="utf-8")
old = 'siteUrl: "https://example.github.io/love-gift/"'
new = f'siteUrl: "{URL}"'
if old in t:
    p.write_text(t.replace(old, new), encoding="utf-8")
    print("updated config.js")
PY

.venv/bin/python scripts/make_heart_qr.py --url "$URL"
echo "Live URL: $URL"
echo "QR: qr/qr-heart.png and qr/qr-square.png"
