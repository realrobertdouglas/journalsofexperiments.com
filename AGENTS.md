# Working on the Journal of Experiments

This is journalsofexperiments.com: recounts of other people's experiments and what they taught. It is a Jekyll
site built by GitHub Pages from the root of `main` (repo `realrobertdouglas/journalsofexperiments.com`).
`README.md` covers the mechanics of the site. This file covers how the work is done, for whoever picks it up next.

**The backlog of entries to write is `_ideas/experiment-ideas.md`.** Start there. Claim an idea by moving it to
"In progress" and committing that before you begin.

## The sister sites

The site is one of three by the same author, sharing one theme, each linking to the other two in its sidebar:

- **douglas.lol** (`realrobertdouglas/realrobertdouglas.github.io`, branch `master`): essays and a research section.
- **Captain's Notes**, captainnotes.com (`realrobertdouglas/captainnotes.com`, branch `main`): the author's own field
  and expedition lessons. Has an "I am 5" toggle fed by `_simple/<slug>.md`.
- **Journal of Experiments**, this repo (branch `main`): other people's experiments. Has a "younger readers" toggle
  fed by `_includes/young/<slug>.md`.

An idea that is the author's own lesson belongs on Captain's Notes, not here.

## What an entry is

One experiment, told so the lesson outlives the moment. Someone builds a thing or seals a system to test a
hypothesis, an instrument speaks, and the entry asks whether anyone was listening, or listening to the right thing.
A person or a ship is never the subject on its own; they are the people who ran it or the instrument they used.

The published entries are the model. Read `_posts/2026-10-18-sixteen-reindeer.md` and
`_posts/2026-10-18-dive-eighty-eight.md` before writing.

**Shape.** A cold open on one exact moment, with its date, place and a number or a quotation that only makes sense
later. Then sections that are always these, in this order, renamed only when the story needs it:

1. *Who ran it*
2. *What they were trying to find out* (state the hypothesis; if it is two claims, say so)
3. *What they built*
4. the turning point, named for the story ("Dive 80", "Three hundred eighty-two")
5. *What it looked like from inside*
6. *What happened*, then *After* if the consequences run on
7. *What it taught* (short; the lesson, with its complication, not a moral)
8. *Sources*

**Title and subtitle.** The title is a concrete noun or a number ("Sixteen Reindeer", "Dive Eighty-Eight"). The
subtitle begins "The story of", then names the thing and the years, then the turn: "The story of the cutter Bear and
Alaska, 1881 to 1950: the herd that grew
to six hundred thousand, and the number that was the only thing anyone read."

**Voice.** Plain, exact and dated. Short declarative sentences; let numbers and quotations carry the weight. No
adjectives of judgment, no villains: the failure should come out of the design. British spelling (programme, harbour,
metres, organised, recognised). Readers must always know who "he" is and which place is meant. Long rhythmic
sentences are kept for the endings of sections.

**Length.** 4,000 to 6,500 words before Sources.

**Numbers.** Write years as bare four-digit numbers (1898) and counts with commas (1,466). The narration script
reads the first as a year ("eighteen ninety-eight") and the second as a number, so keep to this.

## Research standards

- Work from primary sources wherever they exist: government reports, logbooks, court records, diaries, contemporary
  newspapers. archive.org, HathiTrust, the Library of Congress and ERIC hold many.
- Every quotation is verbatim from a source you read, and attributed in the sentence.
- When sources disagree on a date or a number, say so in your notes and use the primary figure in the text.
- The *Sources* section is a bullet list: author, title, publication and year, what the source supports in the
  entry, and a link.

## Figures

- Only images that are public domain or clearly reusable with credit (US government works, pre-1930 publications,
  archives that permit non-commercial use with credit). Never an image from a modern book or a news site.
- Files go in `static/img/<slug>/`, about 1,600 px wide, compressed. Crop off any archive credit strip and put the
  credit in the caption instead.
- Markup, placed at the moment the text reaches it:

  ```html
  <figure>
    <img src="/static/img/<slug>/<file>.jpg" alt="What the picture shows">
    <figcaption>What it is, date. Credit.</figcaption>
  </figure>
  ```

## Front matter

```yaml
---
layout: post
title:  "Sixteen Reindeer"
subtitle: "The story of the cutter Bear and Alaska, 1881 to 1950: the herd that grew to six hundred thousand, and the number that was the only thing anyone read."
date:   2026-10-18 02:00:00 +0000
young: young/sixteen-reindeer.md     # optional: the version for younger readers
audio: https://...                   # optional: the narration (see below)
audio_length: 19031020
audio_duration: "39:38"
audio_young: https://...             # optional: the narration of the younger-readers text; the player follows the toggle
audio_young_length: 9000000
audio_young_duration: "19:00"
categories: [experiments]
comments: false
---
```

- `date` is UTC. Entries on the same day are ordered by the hour, so give a new one the next free hour.
- Every category needs a page in `category/`.
- Companion pieces ("Go deeper") go in `_deeper/<entry slug>/`; see `README.md`.

## Optional extras

- **Younger readers.** Every entry has one: `_includes/young/<slug>.md`, named by `young:` in the entry, written
  from the finished entry. It opens with the line about the button, keeps the same facts, and runs about a third of
  the entry's length (around 2,000 words). Shorter sentences; a term explained the first time it comes ("a revenue
  cutter: a government ship that patrolled the coast"); counts rounded ("2,800 in 1899", "about twenty thousand");
  dates written "February 3rd 1898"; the entry's figures may be reused; a link to a companion piece carries `#young`
  so it opens in the same version. It ends with "What it teaches" written plainly for children: "What does this story
  teach? A few plain things.", then a few bold-led points that spell the lesson out, then "So the lesson is simple."
  and one or two sentences. See `_includes/young/sixteen-reindeer.md`.
- **Narration.** Made with the private repo `realrobertdouglas/journal-audio` (free, runs locally, Kokoro voice
  "George"). Clone it beside this repo and run its `./setup.sh` once; its `README.md` has the rest. In short,
  `.venv/bin/python make-audio.py ../journalsofexperiments.com/_posts/<file>.md` writes `out/<slug>.mp3` and
  prints the three `audio` lines for the front matter; `./publish-audio.sh <slug>` then puts the MP3 on the R2 bucket
  behind audio.journalsofexperiments.com. Entries with `audio:` get a player and appear in `/podcast.xml`. Re-render
  whenever the text changes, and listen to it: when a word comes out wrong, fix the rule in the script, not the entry.
  The same script narrates a younger-readers text (`make-audio.py _includes/young/<slug>.md`) and prints `audio_young`
  lines; with those in the front matter the player plays whichever text the reader has showing, and the feed carries
  the younger version as a bonus episode.

## Publishing and checking

Nothing builds on the author's Mac (it has only the system Ruby 2.6), so check on the live site:

1. `git pull --rebase` before every push. Other sessions and agents push here, and setting the custom domain through
   the API makes GitHub commit `CNAME` on its own.
2. Push to `main`.
3. Poll `gh api repos/realrobertdouglas/journalsofexperiments.com/pages/builds/latest` until `status` is `built` for
   your commit. `errored` means the build failed.
4. `curl` the live page and confirm what you changed is there.

## Things that bite

- **A colon inside an unquoted value in `_config.yml`** makes the GitHub build hang and then fail with no message.
  Quote `title`, `description` and `tagline`.
- **`exclude:` in `_config.yml` replaces Jekyll's defaults**, so a file added there must keep the existing list
  intact. Files in a folder whose name starts with `_` (like `_ideas/`) are never published.
- **`_includes/young/`** files are Markdown included into the page, so they have no front matter.
