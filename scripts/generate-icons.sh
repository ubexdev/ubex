#!/usr/bin/env bash
# generate-icons.sh — Convert SVG placeholders to PNG icons for PWA manifest
#
# Prerequisites:
#   brew install librsvg   (provides rsvg-convert)
#   — or —
#   npm install -g svgexport
#
# Usage:
#   bash scripts/generate-icons.sh

set -euo pipefail

ICONS_DIR="public/icons"

echo "Generating PWA icons from SVGs..."

if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 192 -h 192 "$ICONS_DIR/icon-192.svg" -o "$ICONS_DIR/icon-192.png"
  rsvg-convert -w 512 -h 512 "$ICONS_DIR/icon-512.svg" -o "$ICONS_DIR/icon-512.png"
  echo "✓ PNGs generated with rsvg-convert"
elif command -v npx &> /dev/null; then
  npx svgexport "$ICONS_DIR/icon-192.svg" "$ICONS_DIR/icon-192.png" 192:192
  npx svgexport "$ICONS_DIR/icon-512.svg" "$ICONS_DIR/icon-512.png" 512:512
  echo "✓ PNGs generated with svgexport"
else
  echo "✗ No SVG-to-PNG tool found. Install librsvg or svgexport."
  exit 1
fi

echo "Done! Icons saved to $ICONS_DIR/"
