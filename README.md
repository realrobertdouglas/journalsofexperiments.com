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

## How the site is put together

- `_posts/` — the entries. Front matter: `title`, `date` (UTC), `categories: [name]`, optional `subtitle` and `image`.
- `category/` — one small page per category; the post header links to `/category/<name>`, so add a page here when you start a new category.
- `index.html` — the list of entries, newest first. `about.md` — the purpose of the site and the appearance toggle.
- `_layouts/`, `_includes/`, `static/` — the theme. `static/img/posts/` is where a post's `image:` lives; `static/img/favicon.svg` is the site mark.
- `search.json` and `static/js/search.js` — the sidebar search; `feed.xml` — RSS.
- Sister sites are linked from the sidebar in `_layouts/default.html`.

## Local preview

Needs Ruby 3 and Bundler 2.6:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.
