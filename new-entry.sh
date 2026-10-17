#!/usr/bin/env bash
# Usage: ./new-entry.sh "A title" [category]
# Creates _posts/YYYY-MM-DD-a-title.md in this site's front-matter format and opens it in $EDITOR if set.
# A category needs a page in category/ (copy an existing one) before its link in the post header resolves.
set -euo pipefail
title="${1:-Untitled}"
category="${2:-}"
slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
day="$(date -u +%Y-%m-%d)"
stamp="$(date -u +"%Y-%m-%d %H:%M:%S +0000")"
file="_posts/${day}-${slug}.md"
if [ -e "$file" ]; then echo "exists: $file"; exit 1; fi
printf -- '---\nlayout: post\ntitle:  "%s"\ndate:   %s\ncategories: [%s]\ncomments: false\n---\n\n' "$title" "$stamp" "$category" > "$file"
echo "created $file"
[ -n "${EDITOR:-}" ] && "$EDITOR" "$file" || true
