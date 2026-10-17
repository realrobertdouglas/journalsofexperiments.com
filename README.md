# journalsofexperiments.com

Personal journal, published with GitHub Pages at https://journalsofexperiments.com.

## Writing an entry

```bash
./new-entry.sh "What happened today"
```

That creates `_posts/YYYY-MM-DD-what-happened-today.md`. Write in Markdown below the front matter, then:

```bash
git add -A && git commit -m "Entry: what happened today" && git push
```

GitHub rebuilds the site within a minute or two. Anything in `_drafts/` stays unpublished.

## Pages

- `index.md` — the log (newest first)
- `archive.md` — every entry grouped by year
- `about.md` — about page
- `_config.yml` — site title, description, timezone, nav

## Local preview (optional)

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.
