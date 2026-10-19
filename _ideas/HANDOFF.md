# Handoff: Journal of Experiments, 19 October 2026

For whoever picks this up next, person or agent. Read `AGENTS.md` first: it is the house guide, and everything
below assumes it. This note covers only where the work stopped and what to do next. When you have finished the
"Finish first" steps, update or delete this file.

## Where things stand

- **Seventeen entries are live.** Five earlier ones, and twelve merged on 19 October from pull requests #1 to #12:
  The Demon Core, Eighteen Hundred Boxes, Four Thousand Pads, Seven Miles, Nine Days, Two Oranges and a Lemon,
  Forty-Two, Thirty Strings, Two Crews, Thirty-Six Seconds, Three Menus and Six Hundred Feet. Every one has a
  younger-readers version, and five have companion pieces (22 companion pages on the site in all).
- **The five earlier entries are finished**, including narrations of the entry, its younger version and every
  companion piece, all on the R2 bucket behind audio.journalsofexperiments.com and in `/podcast.xml`.
- **The twelve new entries have no narration yet.** Their 37 renders (12 entries, 12 younger texts, 13 companions)
  were started on the owner's Mac at 12:37 on 19 October, five at a time, from the session that merged them. That
  session may have finished the job; check before you start (see below).
- **Pronunciation work for the twelve is done** and pushed to the journal-audio repo: a `say-as/<slug>.txt` for
  each, and new general rules in `make-audio.py` for Roman numerals, "No. 8", "Mk", "m.p.h.", "h.p.", CO2,
  Glaisher's "1h 52m" times, and abbreviations spelled letter by letter. These do not change any older narration.
- **The backlog** (`_ideas/experiment-ideas.md`) still shows the twelve as `[claimed]`. Eighteen ideas are `[open]`.

## Finish first: the twelve narrations

1. See whether they are done. In the journal-audio repo, beside this one:

   ```bash
   cd ~/Documents/GitHub/journal-audio
   ls out/*.json | wc -l
   ```

   and on the site, whether the new entries have `audio:` lines:

   ```bash
   grep -L '^audio:' ~/Documents/GitHub/journalsofexperiments.com/_posts/2026-10-19-*.md
   ```

   If every 2026-10-19 post has `audio:` and `audio_young:` lines and `/podcast.xml` lists 57 episodes (20 before), the
   narration is finished: skip to step 4.

2. Render whatever is missing. This skips anything already finished or already rendering, so it is safe to run
   while the first batch is still going, or after it was interrupted. Expect about an hour for all 37.

   ```bash
   cd ~/Documents/GitHub/journal-audio
   xargs ./render-many.sh < lists/2026-10-19-twelve-entries.txt
   ```

   Every log, `out/render-<slug>.log`, should end with `exit 0 <slug>`.

3. Upload them and write their lines into the front matter, then publish:

   ```bash
   cd ~/Documents/GitHub/journal-audio
   xargs ./wire-audio.py < lists/2026-10-19-twelve-entries.txt
   ```

   Then, in the site repo, `git pull --rebase`, commit, push to `main`, and wait for the build as `AGENTS.md` says.
   `_tools/check-entry.py` on each of the twelve should then report no audio WARNs.

4. Mark the twelve `[published: <path>]` in the backlog, each on its own line, with the path of its post. Pick two
   `[open]` ideas and mark them `suggested next`; Camp Century and the Groundnut Scheme have the strongest
   public-domain sources.

5. The owner has not yet listened to any of the twelve narrations. Ask them to, and fix what they report in the
   entry's `say-as/<slug>.txt`, then re-render that file with `FORCE=1 ./render-many.sh <file>` and re-run
   `wire-audio.py` on it.

## Then: the rest of the backlog

Eighteen ideas are open: the Italia, Michel Siffre, Byrd at Advance Base, BIOS-3, Camp Century, Alain Bombard,
Pettenkofer, MacDougall, Hatfield, the dolphin house, Cambridge-Somerville, Carrel's chicken heart, Kon-Tiki,
Universe 25, Fordlandia, the Groundnut Scheme, Project Cybersyn and Wörgl. The owner wants all of them written.

Two waves of six ran in parallel on 19 October, one session per entry, each in its own worktree under the
"Several entries at once" workflow in `AGENTS.md`, each opening a pull request. Six at a time worked. Each brief
should name the entry's primary sources, its exact `date:` hour (the next free hours after 15:00 on 19 October,
or the next day's), and the owner's constraints (no shared files, public-domain figures only, verbatim quotations,
British spelling, no narration before the merge). The brief used for the twelve, with the parts in angle brackets
filled in:

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

Byrd's *Alone* (1938) is still in copyright, so that entry can quote it only briefly.

## Things learned the hard way

- **Review before merging.** The owner chose to have all twelve merged without reading them first. Before
  merging, run the checker on each pull request and read every figure's credit. One photograph was removed from
  Forty-Two because it came from a 2004 journal article credited "courtesy of" its photographer, which is not
  public domain. A "copyright not renewed" claim (Three Menus) was checked against archive.org's record.
- **Merge in date order, with squash, and do not delete the branches.** The app's session worktrees use them.
- **A cancelled build looks like a failure.** Merging several pull requests in a row cancels each build in favour
  of the next, and the Pages API reports those as `errored`. Check `gh run list` and wait for the run on the last
  commit before looking for a real error.
- **Never remove `.claude/worktrees/` folders by hand.** They belong to the app's sessions. Ten from the second
  wave are still there; archive those sessions from the app when they are no longer needed.
- **Usage limits.** Three of the second wave's sessions stopped on the Fable usage limit and were resumed on Opus
  5.5. A stopped session keeps its uncommitted work in its worktree, so resuming it loses nothing.
- **Narrate only after the text is final.** Every edit means a re-render, and the Reindeer younger version was
  rendered eight times in one day.
- **The letter A.** The voice reads a lone "A" as the article, so spelled abbreviations write it "Eh"
  ("I Eh E Eh" for IAEA). `check-names.py <file>` shows how every unfamiliar name will be said before rendering.

## Known small issues

- Sixteen Reindeer's expedition chart is 2,000 px wide and 859 KB; the house size is about 1,600 px.
- Two Years Under Glass is 3,983 words before Sources, 17 under the house minimum.
- The feed's companion episodes are named "<piece>, going deeper on <entry>".
