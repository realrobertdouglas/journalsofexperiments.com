#!/usr/bin/env bash
# Usage: ./new-entry.sh "A title for today"
# Creates _posts/YYYY-MM-DD-a-title-for-today.md and opens it in $EDITOR if set.
set -euo pipefail
title="${1:-Untitled}"
slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
day="$(date +%Y-%m-%d)"
stamp="$(date +"%Y-%m-%d %H:%M:%S %z")"
file="_posts/${day}-${slug}.md"
if [ -e "$file" ]; then echo "exists: $file"; exit 1; fi
printf -- '---\ntitle: "%s"\ndate: %s\ntags: []\n---\n\n' "$title" "$stamp" > "$file"
echo "created $file"
[ -n "${EDITOR:-}" ] && "$EDITOR" "$file" || true
