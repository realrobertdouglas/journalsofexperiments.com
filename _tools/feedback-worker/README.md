# Improve this entry: the worker

The row at the foot of an entry (`_includes/improve-entry.html`, `static/js/improve-entry.js`) posts two things
here: an answer to "Could this entry improve?" (No, Partly, Yes) and a reader's note ("Something is unclear",
"Something seems wrong", "Something is missing", with the passage when one was selected). The worker keeps **one
GitHub issue per entry** in the site's repo, titled `Reader notes: <entry title>` and labelled `reader`: the tally
of answers sits in the issue's body, and each note arrives as a comment. Issues are where the entries are planned,
so the notes sit beside the backlog, and GitHub mails the owner on each comment. Closing an entry's issue starts a
fresh one at the next signal. Nothing about the reader is kept.

## Deploying (once)

From the root of this repo, with `wrangler` signed in to the Cloudflare account (`npx -y wrangler@3 login`):

1. A fine-grained GitHub token for `realrobertdouglas/journalsofexperiments.com` with **Issues: Read and write**
   (github.com → Settings → Developer settings → Fine-grained tokens; a year is the longest it can live, so note
   the renewal). Store it as the worker's secret:

       npx -y wrangler@3 secret put GITHUB_TOKEN --config _tools/feedback-worker/wrangler.toml

2. Deploy:

       npx -y wrangler@3 deploy --config _tools/feedback-worker/wrangler.toml

   It prints the worker's URL; today that is `https://journal-write-back.robert-7ca.workers.dev`.

3. Put that URL in `_config.yml` as `feedback_endpoint` (and, if wanted, the author's address as
   `feedback_email`, where a note goes when the worker cannot be reached), push, and the row appears on every entry.

Redeploy after editing `worker.js` (step 2). `ALLOWED_ORIGINS` in `wrangler.toml` lists the pages it accepts
posts from.

## Testing it by hand

An answer (the reply names the entry's issue):

    curl -s -X POST https://journal-write-back.robert-7ca.workers.dev \
      -H 'Origin: https://journalsofexperiments.com' -H 'Content-Type: application/json' \
      -d '{"type":"answer","answer":"partly","title":"ZZ test entry","url":"https://journalsofexperiments.com/zz-test"}'

A note (the reply names the comment):

    curl -s -X POST https://journal-write-back.robert-7ca.workers.dev \
      -H 'Origin: https://journalsofexperiments.com' -H 'Content-Type: application/json' \
      -d '{"type":"note","kind":"missing","text":"test","title":"ZZ test entry","url":"https://journalsofexperiments.com/zz-test"}'

Close the `Reader notes: ZZ test entry` issue afterwards.

## Testing it locally

Run a stand-in for GitHub on a port of your own (anything that answers the four calls the worker makes: list open
issues by label, open an issue, patch its body, add a comment), then:

    npx -y wrangler@3 dev --config _tools/feedback-worker/wrangler.toml --port 8788 \
      --var ALLOWED_ORIGINS:http://localhost:4000 --var GITHUB_API:http://localhost:8787 --var GITHUB_TOKEN:test-token

and serve the site with `feedback_endpoint: "http://localhost:8788"` in a second config file
(`jekyll serve --config _config.yml,dev-config.yml`).

## If notes get noisy

The forms have a field only robots fill, the worker takes posts only from the site's own pages, and GitHub's own
limits apply. Beyond that, Cloudflare Turnstile on the form and a rate limit in the worker are the next steps.
