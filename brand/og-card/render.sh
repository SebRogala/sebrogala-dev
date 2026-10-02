#!/usr/bin/env bash
# Render og-card.html to a 1200x630 PNG.
# Usage: brand/og-card/render.sh public/og-card-vN.png
# Needs google-chrome, ImageMagick `convert`, and the DejaVu fonts (fc-list | grep DejaVu).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:?usage: render.sh <output.png>}"
tmp="$(mktemp --suffix=.png)"
trap 'rm -f "$tmp"' EXIT
google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1200,630 \
  --screenshot="$tmp" "file://$here/og-card.html" >/dev/null 2>&1
convert "$tmp" -filter Box -resize 1200x630 -strip "PNG24:$out"
