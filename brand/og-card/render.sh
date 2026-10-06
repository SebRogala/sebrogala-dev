#!/usr/bin/env bash
# Render an OG card template to PNGs in three aspect ratios:
#   <out>.png 1200x630 (16:9, og:image), <out>-4x3.png 1200x900, <out>-1x1.png 1200x1200.
# The 4:3 and 1:1 files exist for structured data, which lists one image per
# ratio. The suffixes match cardFormats() in src/lib/ogCard.ts.
# Usage: brand/og-card/render.sh <output.png> [template.html] [query]
#   site card: brand/og-card/render.sh public/og-card-vN.png
#   memo card: brand/og-card/render.sh out.png memo-card.html 'title=…&date=…'
#              (normally via render-memos.mjs, which builds the query)
# Fails, writing nothing for that format, when the template marks <body>
# data-overflow (a memo title too long for the card).
# Needs google-chrome, ImageMagick `convert`, and the DejaVu fonts (fc-list | grep DejaVu).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="${1:?usage: render.sh <output.png> [template.html] [query]}"
template="${2:-og-card.html}"
query="${3:-}"
tmp="$(mktemp --suffix=.png)"
trap 'rm -f "$tmp"' EXIT
# format:file suffix:window size. The template lays out from ?format=.
for spec in "16x9::1200,630" "4x3:-4x3:1200,900" "1x1:-1x1:1200,1200"; do
  IFS=: read -r format suffix size <<<"$spec"
  url="file://$here/$template?format=$format${query:+&$query}"
  if google-chrome --headless --disable-gpu --no-sandbox --window-size="$size" --dump-dom "$url" 2>/dev/null \
      | grep -q '<body[^>]*data-overflow'; then
    echo "render.sh: content overflows the ${size/,/x} card; shorten the title" >&2
    exit 1
  fi
  google-chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
    --force-device-scale-factor=2 --window-size="$size" \
    --screenshot="$tmp" "$url" >/dev/null 2>&1
  convert "$tmp" -filter Box -resize "${size/,/x}" -strip "PNG24:${out%.png}$suffix.png"
done
