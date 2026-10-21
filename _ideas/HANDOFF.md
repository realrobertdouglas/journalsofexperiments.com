# Handoff: Journal of Experiments, 21 October 2026 (01:30 UTC)

For whoever picks this up next, person or agent. Read `AGENTS.md` first: it is the house guide, and everything
below assumes it. This note covers only where the work stopped and what to do next. When you have finished the
"Finish first" steps, update or delete this file. Two machines have been working on this site at once (see
"Things learned"); check `git log origin/main` before trusting anything here.

## Where things stand

- **Sixty entries are on `main`, every one with its narration**: 60 posts, 60 younger-readers versions, 114
  companion pieces, 237 narrated files, about 82 hours of audio, every file on the R2 bucket behind
  audio.journalsofexperiments.com. The last build from this machine is `345ffa9`. No pull request is open.
- **The eight harder entries of this session are merged and wired** (pull requests #43 to #50, merged on the
  evening of 20 October, squash, branches kept, figures and titles as their writers left them): *Seven Hundred
  Metres* (Vajont), *The Silver Skin* (Eijkman's chickens), *Fifteen Sledges* (Wegener at Eismitte), *One in a
  Hundred Thousand* (the swine flu programme), *Five Drops* (Pasteur at Pouilly-le-Fort), *Tape Two* (the Stanford
  tapes), *Four Million Minutes* (Mars-500) and *Thirty-One Percent* (Project Stormfury), with `date` hours 03:00
  to 10:00 on 21 October. **They are not yet visible on the site**: Jekyll leaves out posts dated in the future,
  and GitHub Pages builds only on a push, so each appears at the first build after its UTC hour. Their 24
  companion episodes are already in `/podcast.xml` (companions are not posts); the 16 entry and younger-version
  episodes follow. Any push after 10:00 UTC on 21 October (05:00 Central) surfaces them all; the other machine's
  pushes will probably do it first.
- **The other machine** (sessions under another user account on the same Mac, or another Mac; the GitHub author
  is the same) wrote and merged the seventeen ideas of 20 October's backlog (#32 to #42 and #51 to #56), wired
  their narrations itself, added more ideas to the backlog, and at this writing has claimed *The Comet, 1954*.
  Do not touch its claims or its pull requests.
- **The backlog** (`_ideas/experiment-ideas.md`): 55 `[published]`, 32 `[open]`, 1 `[claimed]` (the other
  machine's).
- **Nobody has listened to the narrations of this session's entries** (the eight; nor, as far as this session
  knows, to the twelve, the eight and the nine of 19 and 20 October).
- **The narration machine** is set up under the `stephen` account on this Mac: journal-audio beside the site, a
  native `.venv`, the model files, wrangler logged in as robert@douglasmining.com. `out/` holds this session's
  renders.

## Finish first

1. **Listen.** The player on each page, or journal-audio's `out/`. A mispronunciation goes in the entry's
   `say-as/<slug>.txt` (one `wrong => right` per line; the table matches inside words, so check a short
   respelling against the other files); then, in journal-audio:

   ```bash
   FORCE=1 ./render-many.sh ../journalsofexperiments.com/_posts/<file>.md    # and the younger text or companion, as needed
   .venv/bin/python ./wire-audio.py ../journalsofexperiments.com/_posts/<file>.md
   ```

   and commit the new `audio_length` and `audio_duration` lines to the site (`git pull --rebase` first). A text
   change goes straight to `main` now, followed by the same re-render of every file whose text changed. Figures
   and captions are not narrated, so dropping or re-captioning one needs no re-render; a title change does.

2. **Figures and titles the writers of the eight left to the owner's judgment** (each pull request's body has
   the detail):
   - *Seven Hundred Metres*: Figure 29 of the Corps of Engineers report is drawn "after Müller's 1964 data".
   - *The Silver Skin*: the Leiden photograph (KITLV 15344, CC BY 4.0) is dated about 1900, after the laboratory
     years; the entry's span is 1889 to 1901 against the backlog's 1890–97; short Nobel-lecture quotations.
   - *Fifteen Sledges*: the Foto Marburg portrait's caption on `main` now cites the Bildindex record and a
     CC BY-SA licence (changed on the branch before the merge); the 1910 portrait is the firmer alternative.
   - *Tape Two*: the reluctant guard is left unnamed (Haslam and Zimbardo name him; he never identified himself).
   - *Four Million Minutes*: two ESA crew photographs under the ESA Standard Licence (editorial use with credit).
   - *Thirty-One Percent*: a second percentage title after *Ninety-One Percent* (alternative: *Two Hundred and
     Eight Canisters*); the 1966 crew photograph is 700 px.
   - Still open from the earlier waves: *Three Million Acres* (Flickr Commons basis), *Four Billion Gallons*
     (`hatfield-1916.jpg` on its date alone), *A Million Observations* (the Okamoto photograph), *Twelve Stamps*
     (`inn-valley-1933.jpg`, URAA to 2028), *Two Silver Dollars* (the writer's own reading; second-hand *Times*
     quotations), *Seventy-Five Words* (the 1947 postcard), *Ninety-One Percent* (the NASA-scanned Soviet
     photograph), *Two Hundred Feet* (the 1934 aerial), *One Day in Sixty-Five* (title beside *Sixty-Five Hours*).

3. **Mark two `[open]` ideas `suggested next`** when the owner has chosen; none is marked now.

## Then: the rest of the backlog

Thirty-two ideas are open, each line in `_ideas/experiment-ideas.md` giving the pitch and, for the ones added
from this machine, where its sources are open and which published entry it sits beside. Before claiming, pull
`main` and read the file again: the other machine claims and writes too. The next free `date:` hour is 11:00 on
21 October, unless the other machine has taken it.

The waves so far ran one writer per entry, each in its own worktree under "Several entries at once" in
`AGENTS.md`, each opening a pull request: six at a time as app sessions on 19 October; nine, then eight, as
subagents of one session on 20 October (40 to 80 minutes each when uninterrupted; about 600,000 tokens each).
Each brief names the entry's primary sources and which sites block automated readers, its exact `date:` hour, the
two published entries to read as models, and the owner's constraints (no shared files, public-domain figures only
with "leave it out" as the default, verbatim quotations with second-hand ones and own translations flagged,
British spelling, no rendering by the writing session itself, nothing run in journal-audio but `check-names.py`
and the entry's own `say-as` file). The brief, with the parts in angle brackets filled in:

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
to hear before the merge (`AGENTS.md`, step 6 of "Several entries at once"); `./render-many.sh` on the worktree
files, five at a time, takes about an hour and a half for forty files. After the merge the narrated text is
identical, so `render-many.sh` skips everything and `wire-audio.py` on the `main` paths only uploads and writes
the lines.

## Things learned the hard way

- **Two machines, one repository.** On 20 October another machine (the same GitHub account) claimed every idea
  this machine had just added, wrote them, merged them and wired their narrations, while this machine's session
  was doing the same for its own. It worked because claims go to `main` first, hours were handed out in blocks
  (this machine took 03:00 to 10:00 on 21 October after reading the other's open pull requests), and neither
  touched the other's pull requests. Before any wave: `git pull`, read the backlog, read the open pull requests'
  `date` lines, and take a block of hours clear of them.
- **Posts dated in the future do not build.** Jekyll's default `future: false` leaves them out, and GitHub Pages
  builds only on a push, so an entry whose `date` hour is still ahead appears at the first push after that hour,
  not at its merge. Companion pieces are not posts and appear at once. Nothing is wrong when a freshly merged
  entry answers 404 and the home page count is short; check the hour.
- **A session that runs out of tokens stops its subagents with it.** Seven of eight writers stopped on the Fable
  usage limit mid-draft; their worktrees kept every file (the drafts were 6,900 to 8,600 words, over the limit, so
  each still had its trimming to do), and a `SendMessage` to each agent's id resumed it in its own context with a
  note of what its worktree held and what was left. All seven finished. The session itself was later cut off the
  same way with a render running detached; the render died with it and `render-many.sh` picked up the eight
  missing files on restart (it skips what is finished).
- **This Mac has several user accounts, and each has its own `~/Documents/GitHub`.** Sessions have run as
  `robertdouglas`, `williamdouglas` and `stephen`. The repos "missing" on 19 October were almost certainly under
  another account's home, closed (mode 700) to the others. Before cloning afresh, check `whoami` and
  `ls -ld /Users/*/`. The clones, `.venv`, model, renders and wrangler login of 19 to 21 October are under `stephen`.
- **Nine subagents at once worked.** One session's Agent tool, each with its own worktree
  (`.claude/worktrees/agent-<id>/`, branch `worktree-agent-<id>`), each claiming, writing and opening a pull
  request; the reports came back to the session as they finished. They share the session's browser pane and
  scratchpad: tell them to pass a tab id and to name scratch files with their slug. Their worktrees are the app's;
  leave them. The branches had commits beyond the worktrees' heads by merge time (caption changes), which is why
  a file-by-file comparison of worktree and `main` can differ in captions alone; captions are not narrated.
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
  a `.venv` made from it renders under Rosetta at about 40 minutes an entry. Under `stephen` there is a native
  CPython 3.13.16 at `~/.local/opt/cpython-3.13-arm64/` (the `astral-sh/python-build-standalone` tarball, no
  installer); `.venv` was made from it before `setup.sh` ran, and a full entry then takes about ten minutes. Run
  `wire-audio.py` with that `.venv/bin/python` (or `/usr/bin/python3`): the Intel Python starts `node` as Intel,
  which cannot load the arm64 `workerd`, and every upload fails. Forty uploads take under a minute.
- **macOS `xargs -I` allows 255 bytes per substituted line**, and `render-many.sh` uses it, so a file path longer
  than that fails at once with "command line cannot be assembled, too long". The app's
  `.claude/worktrees/agent-<id>/` paths are fine (165 bytes to the longest file so far).
- **The model download from GitHub releases stalled once** at 268 of 311 MB; `curl -C -` on the same URL resumed
  it. `setup.sh` has `set -e`, so a stalled `curl` has to be killed and the script run again (it skips what exists).
- **`wire-audio.py`'s output is buffered** when redirected to a file, so a log that looks empty may be fine: check
  `git status` in the site instead.
- **Sources, as of 21 October.** The *New York Times* on archive.org stops at 1930; the Washington *Evening Star*
  on Chronicling America reads through loc.gov's JSON and full-text service; the New Zealand cables through the
  DigitalNZ API (no key needed); Papers Past blocks `curl` but reads in the built-in browser; Trove's search dies
  after one query, its article renditions still open; Gallica wants a human to tick its bot check (archive.org
  has the *Comptes rendus*); Delpher (Dutch) and the Deutsches Zeitungsportal (German, item pages behind a
  proof-of-work wall the browser passes) are open; the AMS journals, PNAS and NOAA's media site block `curl` but
  the Wayback Machine or the built-in browser gets them; Google Books' API quota is zero; the Boston Public
  Library's Leslie Jones photographs carry "All rights reserved" on Digital Commonwealth; The Henry Ford's digital
  collections show no per-item rights statement. The sandbox refuses Bash commands containing the word "digital"
  (it reads it as `git`), `set --`, shell `for` loops over paths, variable assignments beside `cd`, and `cd` into
  another repo combined with `git`; one-line commands and `git -C <path>` work. In zsh, `$s[...]` inside double
  quotes is an array subscript, so write `${s}` before a bracket in a pattern.
- **Review before merging.** The owner chose to have every wave merged without reading it first. Before merging,
  run the checker on each pull request and read every figure's credit. One photograph was removed from Forty-Two
  because it came from a 2004 journal article credited "courtesy of" its photographer, which is not public domain.
  A "copyright not renewed" claim (Three Menus) was checked against archive.org's record.
- **Merge in date order, with squash, and do not delete the branches.** The app's session worktrees use them.
- **A cancelled build looks like a failure.** Merging several pull requests in a row cancels each build in favour
  of the next, and the Pages API reports those as `errored`. Check `gh run list` and wait for the run on the last
  commit before looking for a real error. For the same reason, push the backlog and handoff after the build of
  the merge you are checking has finished, not during it.
- **Never remove `.claude/worktrees/` folders by hand.** They belong to the app's sessions and agents; archive
  those sessions from the app when they are no longer needed. The folder is untracked and not in `.gitignore`;
  do not `git add -A`.
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
  Fordlandia aerial (917 px), the Stormfury crew (700 px), Eijkman's two portraits (624 and 670 px).
- journal-audio's wrangler is 3.114.17; the current release is 4.x and prints an out-of-date warning on every call.
  It still uploads. `package.json` pins `^3` because wrangler 4 needs Node 22 and this Mac's `node` is v20.
