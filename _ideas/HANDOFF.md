# Handoff: Journal of Experiments, 20 October 2026, midday

For whoever picks this up next, person or agent. Read `AGENTS.md` first: it is the house guide, and everything
below assumes it. This note covers only where the work stopped and what to do next. When you have finished the
"Finish first" steps, update or delete this file.

## Where things stand

- **Thirty-five entries are live, every one with its narration.** Five earlier ones; the twelve merged on
  19 October (#1 to #12); *Thirty Inches* (#13); the eight merged on the morning of 20 October (#14, #15, #17 to
  #22); and nine more merged at midday on 20 October from pull requests #23 to #31, in `date` order, squash,
  branches kept, figures and titles as their writers left them: *Seventy-Eight Below* (Byrd at Advance Base),
  *Seventy-Five Words* (Kon-Tiki), *Twenty-Five Days* (Siffre), *Ninety-One Percent* (BIOS-3), *One Day in
  Sixty-Five* (Bombard), *One Clear Word* (the dolphin house), *Thirty-Eight Boys* (Cambridge-Somerville), *Two
  Hundred Feet* (Fordlandia) and *Five Thousand Numbers* (Cybersyn). Every entry has a younger-readers version;
  57 companion pieces are published. `/podcast.xml` lists **128 episodes**; every served file answers 200 with
  `accept-ranges: bytes` and a `Content-Length` equal to its `audio_length` line; `_tools/check-entry.py` reports
  no FAIL and no WARN on the twenty-nine entries of 19 and 20 October. The last build is `33c68f2`. No pull
  request is open.
- **The owner has listened to none of the narrations of the twenty-nine** (104 files, about 36 hours).
- **The backlog** (`_ideas/experiment-ideas.md`): 30 `[published]`, 17 `[open]` (added on 20 October, each with
  its sources and the published entry it sits beside), none `[claimed]`, none `suggested next`.
- **The narration machine** is set up under the `stephen` account on this Mac: journal-audio beside the site, a
  native `.venv` (see "Things learned"), the model files, wrangler logged in on 20 October as
  robert@douglasmining.com. `out/` holds the renders of 19 and 20 October (67 files).

## Finish first

1. **Listen.** The player on each page, or journal-audio's `out/`. A mispronunciation goes in the entry's
   `say-as/<slug>.txt` (one `wrong => right` per line; it covers the entry, its younger version and its
   companions; the table matches inside words, so a short respelling can catch other words); then, in journal-audio:

   ```bash
   FORCE=1 ./render-many.sh ../journalsofexperiments.com/_posts/<file>.md    # and the younger text or companion, as needed
   .venv/bin/python ./wire-audio.py ../journalsofexperiments.com/_posts/<file>.md
   ```

   and commit the new `audio_length` and `audio_duration` lines to the site (`git pull --rebase` first). A text
   change goes straight to `main` now, followed by the same re-render of every file whose text changed. Figures
   are not narrated, so dropping or swapping one needs no re-render; a title change does (the title is spoken).

2. **Figures and titles the writers left to the owner's judgment**, now live:
   - *Seventy-Five Words*: the 1947 postcard of the raft under sail rests on the National Library of Norway's
     CC BY licence on its Flickr copy, photographer unknown, the negative plainly a crew member's. The telegram
     (Archives New Zealand, CC BY-SA) and the museum photograph (Mittet, before 1957) are clear.
   - *Ninety-One Percent*: the one figure (wheat on the racks) is cropped from NASA's scan of Conference
     Publication 10040, which NTRS marks "public use permitted", but the photograph was taken by the Soviet
     authors and the record says it is not a US government work.
   - *Two Hundred Feet*: the 1934 aerial from The Henry Ford rests on Commons' statement that it was published
     without notice in Russell's 1942 article; The Henry Ford's site gives no per-item rights statement. The two
     USDA plates are clear.
   - *One Day in Sixty-Five*: the title sits beside the existing *Sixty-Five Hours*; a rename re-renders the
     entry and its younger version.
   - Younger versions a little over 2,800 words by the checker's count: *Seventy-Five Words* (80 over),
     *Twenty-Five Days* (24 over).
   - From the eight of the morning, still open: *Three Million Acres* (both figures on Flickr Commons "no known
     copyright restrictions"; the TNA one undated 1950s), *Four Billion Gallons* (`hatfield-1916.jpg` rests on its
     date alone), *A Million Observations* (the Okamoto photograph), *Twelve Stamps* (`inn-valley-1933.jpg`,
     URAA-restored in the US to 2028; and its 00:00 hour), *Two Silver Dollars* (the writer's own "two silver
     dollars" reading; three second-hand *New York Times* quotations).

3. **Mark two `[open]` ideas `suggested next`** when the owner has chosen. The ones richest in public-domain
   sources: Apollo 1, USS Thresher, Camp Lazear, Goldberger's pellagra, Project Cirrus, Tacoma Narrows, the
   O-rings, the cane toads, myxomatosis.

## Then: the rest of the backlog

Seventeen ideas are open, each line in `_ideas/experiment-ideas.md` giving the pitch, where its primary sources
are open, and which published entry it sits beside. The next free `date:` hour is 10:00 on 20 October.

The waves so far ran one writer per entry, each in its own worktree under "Several entries at once" in
`AGENTS.md`, each opening a pull request: six at a time as app sessions on 19 October, and nine at a time as
subagents of one session on 20 October (40 to 80 minutes each, about half a million tokens each). Each brief names
the entry's primary sources and which sites block automated readers, its exact `date:` hour, the two published
entries to read as models, and the owner's constraints (no shared files, public-domain figures only with "leave it
out" as the default, verbatim quotations with second-hand ones flagged, British spelling, no rendering by the
writing session itself, nothing run in journal-audio but `check-names.py` and the entry's own `say-as` file). The
brief, with the parts in angle brackets filled in:

> Write the Journal of Experiments entry on <the experiment: who, where, the dates, the hypothesis, the turn, and
> the instrument nobody read, in four or five sentences>.
>
> 1. Read AGENTS.md in full, including "Several entries at once"; then <two published entries close in kind> as the
>    models, and _includes/young/sixteen-reindeer.md as the model for the younger version.
> 2. Claim the idea: in _ideas/experiment-ideas.md change its line's status to `[claimed: Claude (<name> session),
>    <date>]`, commit that one line, and push it to main exactly as step 1 of "Several entries at once" says.
> 3. Research from primary sources: <the reports, logbooks, papers and newspapers, with where to find them, and
>    which sites block automated readers>. Note where sources disagree on <the numbers likely to differ>.
> 4. Write _posts/<date>-<slug>.md with a title on the house pattern: 4,000 to 6,500 words before Sources, the
>    standard sections, a subtitle beginning "The story of", and this exact date line: `date:   <date> <hour>:00:00
>    +0000`. Write _includes/young/<slug>.md on the Reindeer model, 2,000 to 2,800 words, ending with the plain
>    "What it teaches". Move any overflow into companion pieces in _deeper/<slug>/.
> 5. Figures only if clearly public domain: <which archives' images qualify, and which do not>.
> 6. Run `python3 _tools/check-entry.py _posts/<file>.md` and fix every FAIL.
> 7. Open a pull request with a summary, the sources you could not reach, the numbers sources disagree on, the WARN
>    lines you are leaving, and anything in the workflow that was unclear. Do not merge it, do not render audio,
>    and do not touch the shared files named in AGENTS.md.

When the pull requests open, whoever runs the narration machine renders each entry from its branch for the owner
to hear before the merge (`AGENTS.md`, step 6 of "Several entries at once"): the writers' worktrees (the app's
under `.claude/worktrees/`, or a detached one somewhere short) hold the files; `./render-many.sh` on them, five
at a time, took 80 minutes for 37 files. After the merge the text is identical, so `render-many.sh` skips
everything and `wire-audio.py` on the `main` paths only uploads and writes the lines.

## Things learned the hard way

- **This Mac has several user accounts, and each has its own `~/Documents/GitHub`.** Sessions have run as
  `robertdouglas`, `williamdouglas` and `stephen` (the GitHub account is `realrobertdouglas`). The repos "missing"
  on the afternoon and again on the night of 19 October were almost certainly under another account's home, which
  is closed (mode 700) to the others; so were the earlier worktrees, renders and the wrangler login. Before cloning
  afresh, check `whoami` and `ls -ld /Users/*/`. Whatever account you are in: push every `say-as` file and list as
  soon as it is written, and treat `out/` as that account's. The clones, `.venv`, model, renders and wrangler
  login of 19 to 20 October are under `stephen`.
- **Nine subagents at once worked.** One session's Agent tool, each with its own worktree
  (`.claude/worktrees/agent-<id>/`, branch `worktree-agent-<id>`), each claiming, writing and opening a pull
  request; the reports came back to the session as they finished. They share the session's browser pane and
  scratchpad, so tabs got navigated away and one draft file was overwritten: tell them to pass a tab id and to
  name scratch files uniquely. Their worktrees are the app's; leave them.
- **Auto mode refuses `gh pr merge`** ("merge without review"), even for a pull request the session has just
  checked line by line. The owner's "merge it" in chat lets it through; so does pressing Merge on GitHub.
- **After each merge GitHub recomputes every open pull request's mergeability**, and for a few seconds
  `gh pr view` reports `UNKNOWN`; a script that merges several in a row must wait for `MERGEABLE` before each.
- **`wrangler login` has to be started by the session and approved by the owner in the browser.** It opens the
  Cloudflare page itself and waits on localhost:8976 for the approval; run it in the background and read
  "Successfully logged in" from its output.
- **The owner reviews by listening.** Render an entry's narration as soon as its pull request is open and hand
  over the MP3s; it is part of the review, not something that waits for the merge (said on 19 October).
- **Use an Apple-silicon Python.** Homebrew's Python 3.13 here is the Intel build (`/usr/local/bin/python3`), and
  a `.venv` made from it renders under Rosetta at about 40 minutes an entry. Under `stephen` there is now a native
  CPython 3.13.16 at `~/.local/opt/cpython-3.13-arm64/` (the `astral-sh/python-build-standalone` tarball, no
  installer); `.venv` was made from it before `setup.sh` ran (`~/.local/opt/cpython-3.13-arm64/bin/python3 -m venv
  .venv`), and a full entry then takes about ten minutes. Run `wire-audio.py` with that `.venv/bin/python` (or
  `/usr/bin/python3`): the Intel Python starts `node` as Intel, which cannot load the arm64 `workerd`, and every
  upload fails. Thirty-seven uploads took under a minute.
- **macOS `xargs -I` allows 255 bytes per substituted line**, and `render-many.sh` uses it, so a file path longer
  than that makes it fail at once with "command line cannot be assembled, too long". Keep worktrees somewhere
  short; the app's `.claude/worktrees/agent-<id>/` paths are fine (150 bytes to the longest file).
- **The model download from GitHub releases stalled once** at 268 of 311 MB; `curl -C -` on the same URL resumed
  it. `setup.sh` has `set -e`, so a stalled `curl` has to be killed and the script run again (it skips what exists).
- **`wire-audio.py`'s output is buffered** when redirected to a file, so a log that looks empty may be fine: check
  `git status` in the site instead.
- **Sources, as of 20 October.** The *New York Times* on archive.org stops at 1930 (nothing for 1934 or 1947);
  the Washington *Evening Star* on Chronicling America, read through loc.gov's JSON and full-text service, and the
  New Zealand cables through the DigitalNZ API (no key needed) stood in. Papers Past now blocks `curl` (Incapsula)
  but reads in the built-in browser; Trove's search dies after one query, its article renditions still open in
  the browser; Gallica wants a human to tick its ALTCHA box; Google Books' API quota is zero; the Boston Public
  Library's Leslie Jones photographs carry "All rights reserved" on Digital Commonwealth, whatever the Flickr
  posting says; The Henry Ford's digital collections show no per-item rights statement. The sandbox refuses Bash
  commands containing the word "digital" (it reads it as `git`), `set --`, shell `for` loops over paths, and `cd`
  into another repo combined with `git`; one-line commands and `git -C <path>` work.
- **Review before merging.** The owner chose to have the twelve, the eight and the nine merged without reading
  them first. Before merging, run the checker on each pull request and read every figure's credit. One
  photograph was removed from Forty-Two because it came from a 2004 journal article credited "courtesy of" its
  photographer, which is not public domain. A "copyright not renewed" claim (Three Menus) was checked against
  archive.org's record.
- **Merge in date order, with squash, and do not delete the branches.** The app's session worktrees use them.
- **A cancelled build looks like a failure.** Merging several pull requests in a row cancels each build in favour
  of the next, and the Pages API reports those as `errored`. Check `gh run list` and wait for the run on the last
  commit before looking for a real error. For the same reason, push the backlog and handoff after the build of
  the merge you are checking has finished, not during it.
- **Never remove `.claude/worktrees/` folders by hand.** They belong to the app's sessions and agents; archive
  those sessions from the app when they are no longer needed.
- **Usage limits.** Sessions that stop on a usage limit keep their uncommitted work in their worktree, so resuming
  them loses nothing.
- **Narrate only after the text is final.** Every edit means a re-render, and the Reindeer younger version was
  rendered eight times in one day.
- **The letter A.** The voice reads a lone "A" as the article, so spelled abbreviations write it "Eh"
  ("I Eh E Eh" for IAEA). `check-names.py <file>` shows how every unfamiliar name will be said before rendering.

## Known small issues

- Sixteen Reindeer's expedition chart is 2,000 px wide and 859 KB; the house size is about 1,600 px.
- Two Years Under Glass is 3,983 words before Sources, 17 under the house minimum.
- Sixty-Five Hours' younger version is 3,379 words, 56% of the entry; the house range is 2,000 to 2,800.
- The feed's companion episodes are named "<piece>, going deeper on <entry>".
- Several figures are far under the house width because nothing larger exists: MacDougall's portrait (355 px),
  Unterguggenberger's (300 px), the 1922 *JEM* plate (726 px), both Groundnut figures (about 845 px), the
  Fordlandia aerial (917 px).
- journal-audio's wrangler is 3.114.17; the current release is 4.x and prints an out-of-date warning on every call.
  It still uploads. `package.json` pins `^3` because wrangler 4 needs Node 22 and this Mac's `node` is v20.
