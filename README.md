# journalsofexperiments.com

Journal of Experiments: Recounts of other people's experiments and the lessons they learned from them.

Published with GitHub Pages at https://journalsofexperiments.com. The theme is the one douglas.lol uses (Jekyll, the github-pages gem, Roboto Condensed, a light and a dark mode that follows the clock and the device).

## Writing an entry

```bash
./new-entry.sh "What happened" experiments
```

That creates `_posts/YYYY-MM-DD-what-happened.md` with the front matter the layout expects. Write in Markdown below it, then:

```bash
git add -A && git commit -m "Entry: what happened" && git push
```

GitHub rebuilds the site within a minute or two.

### Companion pieces

An entry can carry pieces that go deeper on one part of it. Put each in `_deeper/<entry slug>/<piece>.md` with this front matter:

```yaml
---
title:  "The seal"
subtitle: "One line, shown under the title and in the entry's Go deeper list."
parent: two-years-under-glass   # the entry's slug (its filename without the date and .md)
order: 1                        # position in the list
date:   2026-10-18 00:00:00 +0000   # the entry's date, so the page shows it
---
```

The entry lists its companions under "Go deeper" at the foot of its text; each companion names the entry at the top, lists its siblings at the bottom, and links back. Companions publish at `/deeper/<entry slug>/<piece>/`. They stay out of the front-page list and the feed; search and the sitemap include them.

## How the site is put together

- `_ideas/experiment-ideas.md` — the backlog of entries to write; `AGENTS.md` — how an entry is researched, written and published (read by Claude Code through `CLAUDE.md`). Neither is published.
- `_posts/` — the entries. Front matter: `title`, `date` (UTC), `categories: [name]`, optional `subtitle` and `image`.
- `_deeper/` — companion pieces, one folder per entry (see above). Layout `deeper.html`; styles `.go-deeper` and `.deeper-kicker` in `static/css/main.css`.
- `category/` — one small page per category; the post header links to `/category/<name>`, so add a page here when you start a new category.
- `index.html` — the list of entries, newest first. `about.md` — the purpose of the site and the appearance toggle.
- `_layouts/`, `_includes/`, `static/` — the theme. `static/img/posts/` is where a post's `image:` lives; `static/img/favicon.svg` is the site mark.
- `search.json` and `static/js/search.js` — the sidebar search; `feed.xml` — RSS.
- `_includes/improve-entry.html`, `static/js/improve-entry.js` and `_tools/feedback-worker/` — the row at the foot of an entry that holds "Could this entry improve?" (No, Partly, Yes) beside Share. No thanks the reader and points at Share; Partly or Yes opens "Something is" with unclear, wrong, missing, each a short note, and Share drops below once answered. Selecting a passage in the entry raises the same three as a pill, so the note carries the passage. Answers and notes post to the Cloudflare worker, which keeps one GitHub issue per entry (the tally in its body, each note a comment). `feedback_endpoint` in `_config.yml` is the worker's URL; `revised_after_note: YYYY-MM-DD` in an entry's front matter says so above the row.
- Sister sites are linked from the sidebar in `_layouts/default.html`.

## Local preview

Needs Ruby 3 and Bundler 2.6:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.
