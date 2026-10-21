# The overnight pipeline: entries written and published one at a time, without the owner

How the Journal of Experiments writes its backlog unattended for hours at a stretch. A **foreman** session keeps a
queue and runs one **writer** session at a time; each writer researches, writes, narrates and lands its entry on
`main` itself, deciding every judgement call by the rules below and recording the decision instead of asking.
`AGENTS.md` is still the house guide and this file assumes it. Where the two differ, this file wins only for runs the
owner has started with the prompt at the end.

Why one at a time: tokens are spent on one entry at a time, the narration machine never saturates, and a usage limit
pauses the run instead of breaking seventeen things at once. Why two lanes: writing costs tokens and no CPU,
narration costs CPU and almost no tokens, so the next writer starts the moment the last one's text is final.

## The standing rules (what replaces the owner's decisions)

1. **Figures.** Only images that are public domain beyond doubt: US government works, publications before 1930, or
   an archive's own CC BY, CC BY-SA or CC0 release checked on the archive's page (not on a Commons tag alone). Never
   upscaled, never under 700 pixels wide, never from a modern book, a news site, or a "no known restrictions" statement
   alone. In doubt, leave it out. An entry with no figure is fine.
2. **Length.** 4,000 to 6,500 words before Sources; overflow goes to companions, each under 6,500 words, split rather
   than run long. The younger version is 2,000 to 2,800 words by the checker's count, no exceptions.
3. **Sources.** Primary sources first; a source that blocks automated readers is noted and skipped, never waited on
   (see "Sources that block" below). Every quotation verbatim and attributed; a quotation taken at second hand says so
   in the Sources bullet. Copyrighted books are quoted briefly.
4. **The date.** Set at the end, just before the push: the current UTC hour, rounded down. If a post on `main` already
   carries that day and hour, take the nearest earlier free hour of the same day. The file name carries the same date.
   Nothing is ever future-dated, so every entry appears on the build its push triggers.
5. **Titles.** A concrete noun or a number, as the house pattern says, and not one already used in `_posts/`.
6. **No pull request.** The entry lands on `main` by a direct push after the checker passes and the narration is wired.
   The pull-request merge command is never used. The record a pull request used to carry goes into the entry's
   colophon (rule 7).
7. **The colophon.** After Sources, a closed `<details class="colophon">` with the summary "How this entry came about":
   the sources not reached and what stood in for them, the quotations at second hand, the numbers sources disagree on,
   the WARN lines left, and each decision taken under these rules (a figure left out, a companion split, a date hour
   moved). The narration stops at Sources, so none of it is read aloud. The owner reviews it on the live page.
8. **Text lands even when audio cannot.** If rendering or uploading fails twice, the entry is pushed without audio
   lines, the run log says `AUDIO PENDING`, and the morning person narrates it. An entry never waits on the audio.
9. **Nothing shared is touched.** Not `_config.yml`, the layouts, the stylesheet, the includes other than the entry's
   own young file, the feed, `_tools/`, `make-audio.py`, nor any existing entry. In journal-audio only the entry's own
   `say-as/<slug>.txt`.
10. **Nobody asks the owner anything.** A writer that cannot decide under these rules picks the more conservative
    option, says so in the colophon and the run log, and continues.

## Files the run uses

- `_ideas/QUEUE.md` — the order to write in, one backlog name per line. The foreman takes the first name that is still
  `[open]` in `_ideas/experiment-ideas.md`. The owner may reorder or remove lines at any time.
- `_ideas/RUN-LOG.md` — on `main`, one block per entry, appended by the writer when it finishes (format below).
- `_ideas/overnight/` — untracked marker files in the main checkout (`/Users/diane/Documents/GitHub/journalsofexperiments.com`),
  written by writers, read by the foreman:
  `<slug>.claimed`, `<slug>.text-final` (contains the branch name), `<slug>.rendered`, `<slug>.published`,
  `<slug>.audio-pending`. A writer creates each as it passes the stage, so a restart can see where it got to.
- `_ideas/overnight/state.json` — the foreman's own notes: for each entry in flight, the session id, the branch, the
  start time and how many times it has been resumed.

## The foreman's cycle

The foreman runs in the main checkout on `main`, never in a worktree, and edits nothing but `_ideas/overnight/`. The
owner starts it with the prompt at the end of this file, as a recurring `/loop` every 15 minutes; each firing runs one
cycle. A cycle is idempotent: it looks at the facts and does the one next thing, or nothing.

1. `git pull --rebase`. Read `state.json`, the marker files, `QUEUE.md` and the backlog's status words.
2. **On the first cycle only**, check the preconditions and stop the run (delete the loop, write a note at the top of
   `RUN-LOG.md`, push it) if any fails: `~/Documents/GitHub/journal-audio/.venv/bin/python` exists; in that folder
   `npx wrangler whoami` reports a login; no `make-audio.py` process is running from an earlier day; the disk has
   more than 10 GB free; `QUEUE.md` has at least one name still `[open]`.
3. **Count the writers in flight**: entries with a `.claimed` marker and no `.published` or `.audio-pending` marker.
   - If a writer's session is still running: leave it alone.
   - If a writer's session has ended (not running) without reaching `.published`: send it one message by
     `SendMessage` to its session id, "Continue where you left off, per _ideas/OVERNIGHT.md; your markers show you
     reached <stage>." Count the resume in `state.json`. On the third resume, or four hours after its start, stop the
     session, set the backlog line back to `[open]` with ` (overnight: failed, see RUN-LOG)` after the name, note it in
     `RUN-LOG.md`, push, and go on to the next idea.
4. **Start the next writer** when fewer than two are in flight and the one in flight (if any) has its `.text-final`
   marker. Take the first name in `QUEUE.md` whose backlog line is `[open]`. Fill the writer brief below from that line
   and start the session: `start_session`, initiation `user_asked`, context `fresh`, `use_worktree` true,
   `branch_name` `entry-<short slug>`, `wake_when_done` true, model inherited (the owner sets the foreman's model to
   the one the writers should use). Record the session id, branch and time in `state.json`. Then send the new
   session one message: "Your foreman is this session. When your text is pushed, message me the line `TEXT FINAL
   <slug>` as well as writing the marker." (The reply reaches the foreman between cycles and lets it start the next
   writer at once.)
5. **When a writer reports** (the app wakes the foreman when a child's turn ends, and `TEXT FINAL` messages arrive
   between cycles): if `.published` exists, confirm the entry's page answers 200 on the live site and the backlog line
   says published; if not, treat as step 3. Then run step 4.
6. **Stop** when `QUEUE.md` has no `[open]` name left and nothing is in flight: delete the loop, write the closing
   block in `RUN-LOG.md` (entries done, pending audio, failures, time), push it.

The foreman never writes an entry, never renders, never lands anything on `main` itself, and never edits the backlog
except to re-open a failed idea, and never asks the owner anything. If the foreman's own turn fails on a usage limit,
the next `/loop` firing runs the cycle again; nothing is lost because every stage left its marker.

## The writer brief (the foreman fills the angle brackets from the backlog line)

> Write the Journal of Experiments entry on <the backlog name and years>. The backlog line, which gives the pitch,
> where the primary sources are open, and the published entry it sits beside, is: <the line, verbatim>.
>
> You are one writer in an unattended overnight run. Read `_ideas/OVERNIGHT.md` in full before anything else: its
> standing rules replace the owner's decisions tonight, and nobody will answer a question, so decide by the rules,
> record each decision in the colophon, and keep going. The main checkout is
> `/Users/diane/Documents/GitHub/journalsofexperiments.com`; you work in your own worktree on your own branch. Write
> a marker file in `/Users/diane/Documents/GitHub/journalsofexperiments.com/_ideas/overnight/` as you pass each stage
> (`<slug>.claimed`, `<slug>.text-final` containing your branch name, `<slug>.rendered`, `<slug>.published`, or
> `<slug>.audio-pending`); create the folder if it is missing.
>
> 1. Read AGENTS.md in full; then the two published entries the line names after "Beside" (find each by its `title:`
>    in `_posts/`) as the models, `_includes/young/sixteen-reindeer.md` as the model for the younger version, and
>    "Things learned the hard way" in `_ideas/HANDOFF.md`.
> 2. Claim the idea first, before any other commit on your branch: in `_ideas/experiment-ideas.md` change only that
>    line's status to `[claimed: Claude (<name> session), <today's date>]`, exactly as step 1 of "Several entries at
>    once" in AGENTS.md says (`git fetch origin && git rebase origin/main`, edit, commit that one line alone, `git push
>    origin HEAD:main`; on rejection fetch, rebase and push again). Write `<slug>.claimed`.
> 3. Research from primary sources, starting from the line's sources. Note where sources disagree on dates and counts
>    and use the primary figure in the text. A source that blocks you is noted and skipped.
> 4. Write `_posts/<date>-<slug>.md` with a title on the house pattern not already used in `_posts/`: 4,000 to 6,500
>    words before Sources, the standard sections, a subtitle beginning "The story of". Write `_includes/young/<slug>.md`
>    on the Reindeer model, 2,000 to 2,800 words, ending with the plain "What it teaches". Move overflow into
>    companion pieces in `_deeper/<slug>/`, each under 6,500 words. Link to the "Beside" entries where the comparison
>    is natural. Set the `date:` line last, by rule 4 of OVERNIGHT.md, and name the file to match.
> 5. Figures only by rule 1; in doubt, none.
> 6. Write the colophon by rule 7.
> 7. Run `python3 _tools/check-entry.py _posts/<file>.md` and fix every FAIL. The only WARN lines allowed to remain
>    are the narration lines (no audio yet) and source links that answer 403 to the checker but open in a browser.
> 8. Commit the entry and its files on your branch as `Entry: <Title> (<subject>, <years>)` and push the branch
>    (`git push -u origin HEAD`). Write `<slug>.text-final` containing the branch name, and message your foreman
>    `TEXT FINAL <slug>` (the foreman tells you its session id in a message after you start; if it has not arrived,
>    the marker is enough).
> 9. Narrate, in `~/Documents/GitHub/journal-audio`. First wait until no other `make-audio.py` process is running
>    (check every two minutes; another writer may be finishing). Run `check-names.py` on the entry, the younger
>    version and each companion; put respellings in `say-as/<slug>.txt` (append, never overwrite), commit and push
>    that file to journal-audio's `main`. Then `JOBS=2 ./render-many.sh <the files in your worktree>`; when it ends,
>    confirm each MP3 exists and its log ends `exit 0`; re-run a failed file once with `FORCE=1`. Write
>    `<slug>.rendered`.
> 10. Wire: `.venv/bin/python wire-audio.py <each file>` uploads the MP3 and writes the audio lines into the file.
>    Confirm with `curl -I` that each audio URL answers 200 with a Content-Length equal to its `audio_length`. Commit
>    the audio lines as `Narration: <Title>`. If render or wiring fails twice, remove any partial audio lines, write
>    `<slug>.audio-pending`, and go on with the text alone (rule 8).
> 11. Land on `main`: `git fetch origin && git rebase origin/main && git push origin HEAD:main`; on rejection, fetch,
>    rebase and push again. Never open a pull request and never use the pull-request merge command.
> 12. Verify: poll `gh api repos/realrobertdouglas/journalsofexperiments.com/pages/builds/latest` until a build for
>    your commit or a later one is `built` (a build cancelled by a later push reports `errored`; check `gh run list`
>    for the run on the newest commit before calling it a failure). Then `curl` the live page and confirm the title,
>    the player (if audio), and each companion page; confirm the podcast feed lists the episodes.
> 13. Mark the backlog line `[published: _posts/<file>.md]` and append your block to `_ideas/RUN-LOG.md` (format in
>    OVERNIGHT.md), in one commit, rebased and pushed to `main`. Write `<slug>.published`.
> 14. Your final message is the same block as the run log. Then stop.
>
> Constraints throughout: touch only your entry's own files (`_posts/<file>.md`, `_includes/young/<slug>.md`,
> `static/img/<slug>/`, `_deeper/<slug>/`, journal-audio's `say-as/<slug>.txt`) plus the one backlog line, the run
> log and your markers. British spelling; years as bare four-digit numbers, counts with commas. Do not stop to ask
> anything; decide by the rules and record it.
>
> Sources that block, and what stands in: the Library of Congress and Chronicling America answer 403 to scripts but
> read through loc.gov's JSON and full-text service; archive.org's newspaper scans stop at 1930 for the New York
> Times; HathiTrust full view is usually on archive.org too; Gallica wants a human to tick its box, so use archive.org's
> copy; Trove and Papers Past block curl and may block the machine's address; Google Books' API quota is zero;
> publishers' DOIs answer 403 to the checker but open in a browser. The sandbox refuses Bash commands containing the
> word "digital", `set --`, shell for loops over paths, and `cd` into another repo combined with git; one-line commands
> and `git -C <path>` work. If you use the browser pane, work in your own tab and pass its tab id; name scratch files
> uniquely.

## The run log block

```
## <Title> (<backlog name>, <years>) — <date> <HH:MM> UTC
- Entry: _posts/<file>.md, <n> words before Sources; younger <n> words; companions: <n> (<names>)
- Figures: <n>, basis: <...> | none, because <...>
- Narration: <entry mm:ss, young mm:ss, companions ...> | AUDIO PENDING (<why>)
- Checker: 0 FAIL, <n> WARN (<which>)
- Decisions under the rules: <each, one clause>
- Not reached / second hand: <...>
- Live: https://journalsofexperiments.com/experiments/<yyyy>/<mm>/<dd>/<slug>.html
- Started <HH:MM>, text final <HH:MM>, published <HH:MM>
```

## The morning after

1. Read `_ideas/RUN-LOG.md` from the bottom: what landed, what says `AUDIO PENDING`, what failed and was re-opened.
2. Listen to each entry's narration from its page; respellings go in `say-as/<slug>.txt` and a `FORCE=1` re-render.
3. Read each colophon for the decisions taken under the rules, and change what you disagree with; a text change goes
   straight to `main` and re-renders the files it touched.
4. For `AUDIO PENDING` entries, run steps 9 and 10 of the writer brief by hand on the `main` paths and push the lines.
5. Archive the night's sessions from the app once their branches are on `main`; never remove `.claude/worktrees/` by
   hand. Delete `_ideas/overnight/` when the run is over.

## The prompt the owner pastes to start the run

Open a new session in `/Users/diane/Documents/GitHub/journalsofexperiments.com`, choose in the model menu the model the
writers should run on (Opus is the default choice; the writers inherit the foreman's model and effort), and send:

```
/loop 15m Run one cycle of the overnight pipeline: read _ideas/OVERNIGHT.md and follow "The foreman's cycle" exactly, doing the one next thing the markers call for. You have my authorisation, for this whole run, to claim ideas, start and resume writing sessions, let them push entries to main, re-open a failed idea, and stop the run as that file says, without asking me. Do not write, render or publish anything yourself.
```

To pause the run, stop the loop; the writer in flight finishes its entry on its own. To resume, send the same
command again.
