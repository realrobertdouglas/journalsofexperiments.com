# Handoff: Journal of Experiments, 19 October 2026, night

For whoever picks this up next, person or agent. Read `AGENTS.md` first: it is the house guide, and everything
below assumes it. This note covers only where the work stopped and what to do next. When you have finished the
"Finish first" steps, update or delete this file.

## Where things stand

- **Eighteen entries are live, every one with its narration.** Five earlier ones, the twelve merged on 19 October
  from pull requests #1 to #12, and *Thirty Inches* (Camp Century, #13). The twelve's 37 narrations (12 entries,
  12 younger texts, 13 companions) went live when #16 was merged at 20:45 on 19 October (commit `4914bb4`, squash,
  branch kept): every served file answers 200 with a `Content-Length` equal to its `audio_length` line, every page
  shows the player, and `/podcast.xml` lists **61 episodes** (24 before). The twelve are marked `[published]` in the
  backlog.
- **Nobody has listened to the twelve's 37 narrations yet.**
- **Eight more entries are written and waiting in pull requests**, one session each, all pushed to GitHub, none
  merged; their narrations are rendered (next bullet) but not uploaded. In `date` order, which is the merge order:

  | PR | entry | `date` hour | companions | for the owner's judgment |
  |---|---|---|---|---|
  | #15 | *Three Million Acres* (the Groundnut Scheme) | 19 Oct 17:00 | 1 | both figures rest on Flickr Commons "no known copyright restrictions"; the TNA one (CO 1069/157) is undated 1950s and might post-date 1957 |
  | #14 | *Four Billion Gallons* (Hatfield and San Diego) | 18:00 | 1 | `hatfield-1916.jpg` rests on its 1916 date alone; the City Clerk's site carries a blanket copyright footer |
  | #17 | *A Million Observations* (Universe 25) | 19:00 | 1 | the Okamoto photograph, added at the owner's request: Commons' "White House photographer" rationale does not hold (he left in January 1969; the photograph is 1970) |
  | #18 | *One Cubic Centimetre* (Pettenkofer) | 20:00 | 0 | nothing; all four figures public domain by date |
  | #19 | *Two Silver Dollars* (MacDougall) | 21:00 | 2 | the "two silver dollars" reading is the writer's own observation; three *New York Times* quotations come second-hand through a Substack post |
  | #21 | *Chicken Heart* (Carrel) | 22:00 | 3 | nothing; Bain portraits (Library of Congress) and *JEM* plates of 1912 to 1922 |
  | #22 | *Four Hundred Telegrams* (the Italia) | 23:00 | 3 | nothing; all seven marked public domain by Commons or the national libraries |
  | #20 | *Twelve Stamps* (Wörgl) | 20 Oct 00:00 | 3 | `inn-valley-1933.jpg` (Mittelholzer, ETH) is URAA-restored in the US until the end of 2028; and the hour puts it on the next day |

  On the night of 19 October `_tools/check-entry.py --no-links` was run on each from its branch: **0 FAIL on all
  eight**; the only WARNs are the expected "no narration yet" lines and a few source links that refuse robots
  (sandiegohistory.org, the Wiley and AJE DOIs, nytimes.com, loc.gov). All eight are `MERGEABLE/CLEAN` against
  `main`. Each pull request's description lists its unreachable sources, second-hand quotations and disputed
  numbers; read it before merging. Their pronunciation files are already pushed to journal-audio.
- **The eight are narrated, for the owner to listen to before merging.** All 30 files (8 entries, 8 younger texts,
  14 companions) were rendered from the pull-request branches on the night of 19 October, natively on Apple
  silicon (see "Things learned"), into journal-audio's `out/`: 299 MB, about ten hours of audio, every
  `out/render-<slug>.log` ending `exit 0`. They are **not uploaded and have no audio lines**; that follows the
  merges. The branches are checked out as detached worktrees at `~/Documents/GitHub/journal-review/pr<N>/`
  (one per pull request; `files.txt` there lists the 30 files), so a text change on a branch can be re-rendered
  from there with `FORCE=1 ./render-many.sh <file>`. Remove those worktrees (`git worktree remove`) once the
  eight are merged.
- **Nobody has listened to any of the eight's narrations yet**, nor to the twelve's.
- **The backlog** (`_ideas/experiment-ideas.md`): 13 `[published]`, 8 `[claimed]` (the eight pull requests), 9
  `[open]`. None is marked `suggested next`; the wave has ended, so mark two.

## Finish first

1. **Review and merge the eight**, in the order of the table, with squash, without deleting the branches. Before
   each merge settle the figure question in its row with the owner, run `_tools/check-entry.py` on its post from
   `main` after the merge, and read every figure's credit. `gh pr merge` is refused by the app's auto mode
   ("merge without review"); the owner says "merge it" in chat, or presses Merge on GitHub.

2. **The owner listens to the eight** from journal-audio's `out/` (the entry first, then its younger version and
   companions), alongside reading the pull request. A mispronunciation goes in the entry's `say-as/<slug>.txt`;
   a text change goes on the pull request's branch. Re-render only what changed, from the worktree:
   `FORCE=1 ./render-many.sh ~/Documents/GitHub/journal-review/pr<N>/<file>`.

3. **Log wrangler in**, once, before any upload: `node_modules/.bin/wrangler login` in journal-audio, from the
   owner's own shell (it opens a browser). Under the `stephen` account `wrangler whoami` says "Not logged in"; the
   September token there does not refresh.

4. **After the merges, upload and wire.** The merged text is the branch text, so `render-many.sh` on the paths on
   `main` reports every file "done already" and nothing re-renders unless its text changed after the render; then
   `wire-audio.py` uploads each finished MP3 and writes its lines:

   ```bash
   cd ~/Documents/GitHub/journal-audio
   xargs ./render-many.sh < lists/2026-10-19-eight-entries.txt    # expect thirty "done already"
   xargs ./wire-audio.py  < lists/2026-10-19-eight-entries.txt    # uploads, writes the audio lines on main
   ```

   Then in the site: `git pull --rebase`, commit the audio lines, push to `main`, wait for the build, and expect
   `/podcast.xml` to list 91 episodes (61 now). Mark each entry `[published: <path>]` in the backlog.

5. **The twelve's narrations are still unheard.** Fix what the owner reports in the entry's `say-as/<slug>.txt`,
   then `FORCE=1 ./render-many.sh <file>` and `./wire-audio.py <file>` for that one file, and commit the new
   `audio_length` and `audio_duration` lines.

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

## Things learned the hard way

- **This Mac has several user accounts, and each has its own `~/Documents/GitHub`.** Sessions have run as
  `robertdouglas`, `williamdouglas` and `stephen` (the GitHub account is `realrobertdouglas`). The repos "missing"
  on the afternoon and again on the night of 19 October were almost certainly under another account's home, which
  is closed (mode 700) to the others; so were the earlier worktrees, renders and the wrangler login. Before cloning
  afresh, check `whoami` and `ls -ld /Users/*/`. Whatever account you are in: push every `say-as` file and list as
  soon as it is written, and treat `out/` as that account's. Tonight's clones, worktrees, `.venv`, model and
  renders are under `stephen`.
- **Auto mode refuses `gh pr merge`** ("merge without review"), even for a pull request the session has just
  checked line by line. The owner's "merge it" in chat lets it through; so does pressing Merge on GitHub.
- **The owner reviews by listening.** Render an entry's narration as soon as its pull request is open and hand
  over the MP3s; it is part of the review, not something that waits for the merge (said on 19 October).
- **Use an Apple-silicon Python.** Homebrew's Python 3.13 here is the Intel build (`/usr/local/bin/python3`), and
  a `.venv` made from it renders under Rosetta at about 40 minutes an entry. Under `stephen` there is now a native
  CPython 3.13.16 at `~/.local/opt/cpython-3.13-arm64/` (the `astral-sh/python-build-standalone` tarball, no
  installer); `.venv` was made from it before `setup.sh` ran (`~/.local/opt/cpython-3.13-arm64/bin/python3 -m venv
  .venv`), and a full entry then takes about ten minutes: the 30 files took 58 minutes at five at a time. With a
  native `.venv` the old "run `wire-audio.py` with `/usr/bin/python3`" workaround is unnecessary (it was the Intel
  Python starting `node` as Intel, which could not load the arm64 `workerd`); it still does no harm.
- **macOS `xargs -I` allows 255 bytes per substituted line**, and `render-many.sh` uses it, so a file path longer
  than that makes it fail at once with "command line cannot be assembled, too long". Keep the worktrees somewhere
  short (`~/Documents/GitHub/journal-review/pr<N>` is 107 bytes to the longest file).
- **The model download from GitHub releases stalled once** at 268 of 311 MB; `curl -C -` on the same URL resumed
  it. `setup.sh` has `set -e`, so a stalled `curl` has to be killed and the script run again (it skips what exists).
- **`wire-audio.py`'s output is buffered** when redirected to a file, so a log that looks empty may be fine: check
  `git status` in the site instead.
- **Review before merging.** The owner chose to have all twelve merged without reading them first. Before
  merging, run the checker on each pull request and read every figure's credit. One photograph was removed from
  Forty-Two because it came from a 2004 journal article credited "courtesy of" its photographer, which is not
  public domain. A "copyright not renewed" claim (Three Menus) was checked against archive.org's record.
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
- Among the eight waiting entries, several figures are far under the house width because nothing larger exists:
  MacDougall's portrait (355 px), Unterguggenberger's (300 px), the 1922 *JEM* plate (726 px), both Groundnut
  figures (about 845 px).
