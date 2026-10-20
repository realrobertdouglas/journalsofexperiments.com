# Handoff: Journal of Experiments, 19 October 2026, evening

For whoever picks this up next, person or agent. Read `AGENTS.md` first: it is the house guide, and everything
below assumes it. This note covers only where the work stopped and what to do next. When you have finished the
"Finish first" steps, update or delete this file.

## Where things stand

- **Seventeen entries are live**, five earlier ones and the twelve merged on 19 October from pull requests #1 to
  #12. Every one has a younger-readers version, and five have companion pieces (22 companion pages in all).
- **The twelve now have narrations, in pull request #16** (branch `audio/twelve-narrations`): all 37 files (12
  entries, 12 younger texts, 13 companions) rendered on the owner's Mac on the afternoon of 19 October, uploaded to
  the R2 bucket behind audio.journalsofexperiments.com, and their `audio` lines written into the front matter.
  14 hours 1 minute of audio, 404 MB. Every served file's length matches its front matter, and
  `_tools/check-entry.py` reports no FAIL and no WARN on the twelve. **It is not merged**, so the live site still
  shows no player on them and `/podcast.xml` still lists 20 episodes. The backlog is not in that pull request:
  six writing sessions push claim lines into `_ideas/experiment-ideas.md` at the same time, and a pull request
  that edits neighbouring lines of that file goes stale within minutes, so the twelve are marked `[published]`
  directly on `main` instead (step 1 below).
- **Nobody has listened to any of the 37 narrations yet.**
- **Three more entries are written and waiting in pull requests**, one session each, from the brief below:
  #13 *Thirty Inches* (Camp Century, `date` 16:00), #15 *Three Million Acres* (the Groundnut Scheme, 17:00) and
  #14 *Four Billion Gallons* (Hatfield and San Diego, 18:00), so that is their merge order. Each reports no
  checker FAIL; #15 flags its two figures' licence basis for the owner's judgment; #14 has a 403 from
  sandiegohistory.org in its link check. Their pronunciation files are already pushed to journal-audio. None is
  merged, none narrated.
- **Six more entries are being written**, one session each from the brief below, each to open a pull request:
  Universe 25 (`date` 19:00 on 19 October), Pettenkofer (20:00), MacDougall (21:00), Carrel's chicken heart
  (22:00), the Italia (23:00) and Wörgl (00:00 on 20 October).
- **The backlog** (`_ideas/experiment-ideas.md`): the twelve still read `[claimed]` until step 1 below; the nine
  in pull requests or being written read `[claimed]` as their sessions push; nine are `[open]`, and none is marked
  `suggested next` while this wave runs (mark two when it ends).

## Finish first

1. **Merge #16**, then wait for the Pages build and check the live site as `AGENTS.md` says. Then, once the
   six sessions' claim lines are on `main` (`git log origin/main -- _ideas/experiment-ideas.md`), mark the twelve
   `[published: _posts/2026-10-19-<slug>.md]` in the backlog, each on its own line, and push that directly to
   `main` (`git pull --rebase` first). When the site is built:

   ```bash
   curl -s https://journalsofexperiments.com/podcast.xml | grep -c '<item>'     # expect 57 (20 before)
   grep -L '^audio_young:' ~/Documents/GitHub/journalsofexperiments.com/_posts/2026-10-19-*.md   # expect nothing
   ```

2. **Review and merge #13, #14 and #15**, in `date` order, with squash, without deleting the branches. Before
   each merge run `_tools/check-entry.py` on its post and read every figure's credit (see "Things learned").

3. **Narration is part of the review.** The narrations of #13, #14 and #15 (entries, younger texts and companions,
   ten files) were rendered from their branches on the evening of 19 October into journal-audio's `out/` for the
   owner to listen to before merging; they are not uploaded and have no audio lines yet. Do the same for Universe
   25 and Pettenkofer when their pull requests open: their files are in the session's worktree under the site's
   `.claude/worktrees/`, and `./render-many.sh <files>` renders them. After each merge, once the text is final,
   re-render only what changed (`render-many.sh` skips files whose text is unchanged; `FORCE=1` redoes one), then
   wire the lines from a list of the merged files:

   ```bash
   cd ~/Documents/GitHub/journal-audio
   xargs ./render-many.sh < lists/<your list>.txt            # about 40 minutes per entry on this Mac (see below)
   xargs /usr/bin/python3 ./wire-audio.py < lists/<your list>.txt   # the arm64 Python, not .venv's (see below)
   ```

   Commit the audio lines to the site (`git pull --rebase` first), push, check the build, and mark the three
   `[published: <path>]` in the backlog.

4. **Ask the owner to listen** to the narrations, starting with the twelve. Fix what they report in the entry's
   `say-as/<slug>.txt`, then `FORCE=1 ./render-many.sh <file>` and `/usr/bin/python3 ./wire-audio.py <file>` for
   that one file, and commit the new `audio_length` and `audio_duration` lines.

## Then: the rest of the backlog

Nine ideas are open once this wave's claims are in: Michel Siffre, Byrd at Advance Base, BIOS-3, Alain Bombard,
the dolphin house, Cambridge-Somerville, Kon-Tiki, Fordlandia and Project Cybersyn. The owner wants all of them
written.

All nine lean on copyrighted books (Byrd's *Alone*, Siffre's, Bombard's, Heyerdahl's, Lilly's, Beer's, Grandin's
on Fordlandia, McCord's papers), so each entry quotes those briefly and builds on what is open: Byrd's expedition
reports and the newspapers, Kon-Tiki's 1947 press coverage and the museum's documents, the NASA and Navy contracts
behind the dolphin house, Ford's own archive catalogue for Fordlandia, the Chilean press of 1971 to 1973 for
Cybersyn, and the Russian institute's publications for BIOS-3. Byrd's *Alone* (1938) is still in copyright, so that entry can quote it only briefly;
Siffre, Bombard, Kon-Tiki, Cybersyn, Cambridge-Somerville, BIOS-3, Fordlandia, the dolphin house and Wörgl lean on
copyrighted books and need the same care.

The waves so far ran one session per entry, each in its own worktree under "Several entries at once" in
`AGENTS.md`, each opening a pull request; six at a time worked, and three at a time on 19 October finished in
under two hours. Each brief names the entry's primary sources, its exact `date:` hour (the next free hour after
18:00 on 19 October, or the next day's), and the owner's constraints (no shared files, public-domain figures only,
verbatim quotations, British spelling, no rendering by the writing session itself, nothing run in journal-audio but
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

- **The owner reviews by listening.** Render an entry's narration as soon as its pull request is open and hand
  over the MP3s; it is part of the review, not something that waits for the merge (said on 19 October).
- **The narration toolchain on this Mac runs under Rosetta.** The only Python 3.13 is the Intel Homebrew build
  (`/usr/local/bin/python3`), so `.venv` and the voice model are Intel too: a full entry takes about 40 minutes to
  render, not the ten the README promises, and the 37 files took three and a half hours at five at a time. An
  Apple-silicon Python (python.org's installer, or `uv`) would make `setup.sh` build an arm64 `.venv` and fix it.
- **Run `wire-audio.py` with `/usr/bin/python3`** (the arm64 system Python; the script needs only the standard
  library). Under the Intel Python the universal `node` binary runs as Intel and cannot load the arm64 `workerd`
  that `npm install` put in `node_modules`, so every upload fails with "You installed workerd on another
  platform". `publish-audio.sh` run from an ordinary shell works either way. The script's output is buffered when
  it is redirected to a file, so a log that looks empty may be fine: check `git status` in the site instead.
- **The repos were not on this Mac on the afternoon of 19 October.** Neither `~/Documents/GitHub/
  journalsofexperiments.com` nor `journal-audio` existed, and no `out/` folder from the first render attempt was
  anywhere on the disk; both were cloned afresh, `setup.sh` run (it needs `python3` and `lame`; it downloads the
  350 MB model), and everything rendered again. The wrangler login survived in `~/Library/Preferences/.wrangler/`.
- **Review before merging.** The owner chose to have all twelve merged without reading them first. Before
  merging, run the checker on each pull request and read every figure's credit. One photograph was removed from
  Forty-Two because it came from a 2004 journal article credited "courtesy of" its photographer, which is not
  public domain. A "copyright not renewed" claim (Three Menus) was checked against archive.org's record.
- **Merge in date order, with squash, and do not delete the branches.** The app's session worktrees use them.
- **A cancelled build looks like a failure.** Merging several pull requests in a row cancels each build in favour
  of the next, and the Pages API reports those as `errored`. Check `gh run list` and wait for the run on the last
  commit before looking for a real error.
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
