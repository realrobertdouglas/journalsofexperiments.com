# Write back: the worker

The three buttons at the foot of an entry ("I'm curious about…", "I see a gap…", "I want to know more…";
`_includes/write-back.html`, `static/js/write-back.js`) post a reader's note here, and this worker opens a GitHub
issue in the site's repo, labelled `reader` plus the kind (`curious`, `gap`, `more`). Issues are where the entries
are planned, so a note that says "I want to know more" sits beside the backlog, and GitHub mails the owner on each.
Nothing about the reader is kept.

## Deploying (once)

From the root of this repo, with `wrangler` signed in to the Cloudflare account (`npx -y wrangler@3 login`):

1. A fine-grained GitHub token for `realrobertdouglas/journalsofexperiments.com` with **Issues: Read and write**
   (github.com → Settings → Developer settings → Fine-grained tokens). Store it as the worker's secret:

       npx -y wrangler@3 secret put GITHUB_TOKEN --config _tools/feedback-worker/wrangler.toml

2. Deploy:

       npx -y wrangler@3 deploy --config _tools/feedback-worker/wrangler.toml

   It prints the worker's URL; today that is `https://journal-write-back.robert-7ca.workers.dev`.

3. Put that URL in `_config.yml` as `feedback_endpoint` (and, if wanted, the author's address as
   `feedback_email`, the fallback when the worker cannot be reached), push, and the buttons appear on every entry.

Redeploy after editing `worker.js` (step 2). `ALLOWED_ORIGINS` in `wrangler.toml` lists the pages it accepts
notes from; add `http://localhost:4000` while testing against a local preview.

## Testing it by hand

    curl -s -X POST https://journal-write-back.robert-7ca.workers.dev \
      -H 'Origin: https://journalsofexperiments.com' -H 'Content-Type: application/json' \
      -d '{"kind":"more","text":"test","title":"Seven Feet","url":"https://journalsofexperiments.com/experiments/2026/10/22/seven-feet.html"}'

A reply of `{"ok":true,"issue":"https://github.com/…/issues/N"}` means the issue was opened; close it afterwards.

## If notes get noisy

The form has a field only robots fill, the worker takes notes only from the site's own pages, and GitHub's own
limits apply. Beyond that, Cloudflare Turnstile on the form and a rate limit in the worker are the next steps.
