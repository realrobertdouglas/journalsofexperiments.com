# Handoff: Journal of Experiments, 20 October 2026

For whoever picks this up next, person or agent. Read `AGENTS.md` first: it is the house guide, and everything
below assumes it. This note covers only where the work stopped and what to do next. When you have finished the
"Finish first" steps, update or delete this file.

## Where things stand

- **Twenty-six entries are live, every one with its narration.** Five earlier ones; the twelve merged on
  19 October from pull requests #1 to #12; *Thirty Inches* (#13); and the eight merged on the morning of
  20 October (#14, #15, #17 to #22), in `date` order, squash, branches kept, figures as their writers left them.
  Every entry has a younger-readers version and 38 companion pieces are published. `/podcast.xml` lists
  **91 episodes**, every served file answers 200 with `accept-ranges: bytes` and a `Content-Length` equal to its
  `audio_length` line, and `_tools/check-entry.py` reports no FAIL and no WARN on any of the twenty. The last
  build is `b1ff8f4`. No pull request is open.
- **The owner has listened to none of the twenty entries' narrations** (the twelve of 19 October and the
  eight of 20 October: 67 files, about 24 hours of audio).
- **The backlog** (`_ideas/experiment-ideas.md`): 21 `[published]`, 9 `[open]`, none `[claimed]`. Byrd at
  Advance Base and Kon-Tiki are marked `[open, suggested next]` (chosen by the owner on 20 October).
- **The narration machine** is set up under the `stephen` account on this Mac: journal-audio beside the site,
  a native `.venv` (see "Things learned"), the model files, wrangler logged in on 20 October as
  robert@douglasmining.com. `out/` holds the 30 renders of 19 October.

## Finish first

1. **Listen.** Start with the eight of 20 October, from the site's player or journal-audio's `out/`. A
   mispronunciation goes in the entry's `say-as/<slug>.txt` (one `wrong => right` per line; it covers the entry,
   its younger version and its companions); then, in journal-audio:

   ```bash
   FORCE=1 ./render-many.sh ../journalsofexperiments.com/_posts/<file>.md    # and the younger text or companion, as needed
   .venv/bin/python ./wire-audio.py ../journalsofexperiments.com/_posts/<file>.md
   ```

   and commit the new `audio_length` and `audio_duration` lines to the site (`git pull --rebase` first). A text
   change goes straight to `main` now, followed by the same re-render of every file whose text changed.

2. **Figures the writers left to the owner's judgment**, now live: *Three Million Acres* (both figures rest on
   Flickr Commons "no known copyright restrictions"; the TNA one, CO 1069/157, is undated 1950s and might
   post-date 1957); *Four Billion Gallons* (`hatfield-1916.jpg` rests on its 1916 date alone); *A Million
   Observations* (the Okamoto photograph: Commons' "White House photographer" rationale does not hold); *Twelve
   Stamps* (`inn-valley-1933.jpg`, Mittelholzer/ETH, is URAA-restored in the US until the end of 2028). Also
   *Two Silver Dollars*' own "two silver dollars" reading and its three second-hand *New York Times* quotations,
   and *Twelve Stamps*' hour (00:00 on 20 October, the next day). Dropping a figure is a text change: re-render
   the entry and its younger version afterwards.

## Then: the rest of the backlog

Nine ideas are open: Michel Siffre, Byrd at Advance Base, BIOS-3, Alain Bombard, the dolphin house,
Cambridge-Somerville, Kon-Tiki, Fordlandia and Project Cybersyn. The owner wants all of them written.

All nine lean on copyrighted books (Byrd's *Alone*, Siffre's, Bombard's, Heyerdahl's, Lilly's, Beer's, Grandin's
on Fordlandia, McCord's papers), so each entry quotes those briefly and builds on what is open: Byrd's expedition
reports and the newspapers, Kon-Tiki's 1947 press coverage and the museum's documents, the NASA and Navy contracts
behind the dolphin house, Ford's own archive catalogue for Fordlandia, the Chilean press of 1971 to 1973 for
Cybersyn, and the Russian institute's publications for BIOS-3.

The waves so far ran one session per entry, each in its own worktree under "Several entries at once" in
`AGENTS.md`, each opening a pull request; six at a time worked, and three at a time on 19 October finished in
under two hours. Each brief names the entry's primary sources, its exact `date:` hour (the next free hour after
00:00 on 20 October), and the owner's constraints (no shared files, public-domain figures only, verbatim
quotations, British spelling, no rendering by the writing session itself, nothing run in journal-audio but
`check-names.py` and the entry's own `say-as` file). The brief, with the parts in angle brackets filled in:

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

When the next wave's pull requests open, whoever runs the narration machine renders each entry from its branch
for the owner to hear before the merge (`AGENTS.md`, step 6 of "Several entries at once"): check the branch out
as a worktree somewhere short, run `./render-many.sh` on its files, and hand over `out/`. After the merge the
text is identical, so `render-many.sh` skips everything and `wire-audio.py` only uploads and writes the lines.

## Things learned the hard way

- **This Mac has several user accounts, and each has its own `~/Documents/GitHub`.** Sessions have run as
  `robertdouglas`, `williamdouglas` and `stephen` (the GitHub account is `realrobertdouglas`). The repos "missing"
  on the afternoon and again on the night of 19 October were almost certainly under another account's home, which
  is closed (mode 700) to the others; so were the earlier worktrees, renders and the wrangler login. Before cloning
  afresh, check `whoami` and `ls -ld /Users/*/`. Whatever account you are in: push every `say-as` file and list as
  soon as it is written, and treat `out/` as that account's. The clones, `.venv`, model, renders and wrangler
  login of 19 to 20 October are under `stephen`.
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
  .venv`), and a full entry then takes about ten minutes: the 30 files took 58 minutes at five at a time. Run
  `wire-audio.py` with that `.venv/bin/python` (or `/usr/bin/python3`): the Intel Python starts `node` as Intel,
  which cannot load the arm64 `workerd`, and every upload fails. The 24 uploads of 20 October took twenty seconds.
- **macOS `xargs -I` allows 255 bytes per substituted line**, and `render-many.sh` uses it, so a file path longer
  than that makes it fail at once with "command line cannot be assembled, too long". Keep worktrees somewhere
  short.
- **The model download from GitHub releases stalled once** at 268 of 311 MB; `curl -C -` on the same URL resumed
  it. `setup.sh` has `set -e`, so a stalled `curl` has to be killed and the script run again (it skips what exists).
- **`wire-audio.py`'s output is buffered** when redirected to a file, so a log that looks empty may be fine: check
  `git status` in the site instead.
- **Review before merging.** The owner chose to have all twelve, and then all eight, merged without reading them
  first. Before merging, run the checker on each pull request and read every figure's credit. One photograph was
  removed from Forty-Two because it came from a 2004 journal article credited "courtesy of" its photographer,
  which is not public domain. A "copyright not renewed" claim (Three Menus) was checked against archive.org's record.
- **Merge in date order, with squash, and do not delete the branches.** The app's session worktrees use them.
- **A cancelled build looks like a failure.** Merging several pull requests in a row cancels each build in favour
  of the next, and the Pages API reports those as `errored`. Check `gh run list` and wait for the run on the last
  commit before looking for a real error. For the same reason, push the backlog and handoff after the build of
  the merge you are checking has finished, not during it.
- **Never remove `.claude/worktrees/` folders by hand.** They belong to the app's sessions; archive those sessions
  from the app when they are no longer needed.
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
- Among the eight entries of 20 October, several figures are far under the house width because nothing larger
  exists: MacDougall's portrait (355 px), Unterguggenberger's (300 px), the 1922 *JEM* plate (726 px), both
  Groundnut figures (about 845 px).
- journal-audio's wrangler is 3.114.17; the current release is 4.x and prints an out-of-date warning on every call.
  It still uploads. `package.json` pins `^3` because wrangler 4 needs Node 22 and this Mac's `node` is v20.
