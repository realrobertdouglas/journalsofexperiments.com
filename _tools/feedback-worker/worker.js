/*  Improve this entry: the endpoint behind the row at the foot of an entry (static/js/improve-entry.js).
    Two kinds of POST, both JSON. An answer to "Could this entry improve?":
      { type: 'answer', answer: 'no' | 'partly' | 'yes', title, url, mode }
    and a note:
      { type: 'note', kind: 'unclear' | 'wrong' | 'missing', text, quote, title, url, mode }
    Every entry that has had either gets one GitHub issue, "Reader notes: <title>", labelled reader: the tally sits in
    its body, each note is a comment. The reply carries the issue's `number`, and the page sends it back as `issue`
    on its next post: GitHub's issue list lags a few seconds behind a new issue, so without it two posts in quick
    succession would open two threads. Settings: wrangler.toml [vars] GITHUB_REPO (owner/name) and ALLOWED_ORIGINS
    (comma-separated; the site's origins, for CORS and to check the entry URL); the secret GITHUB_TOKEN (a
    fine-grained token with Issues read and write on the repo); GITHUB_API only for a stand-in during local tests.
    Nothing about the reader is kept: no name, no address, no cookie.
*/
const KINDS = {
  unclear: 'Something is unclear',
  wrong: 'Something seems wrong',
  missing: 'Something is missing',
  // the first strip's three, kept so a note from a page built before this worker still lands
  curious: "I'm curious about…",
  gap: 'I see a gap…',
  more: 'I want to know more…',
};
const ANSWERS = { no: 'No', partly: 'Partly', yes: 'Yes' };
const QUESTION = 'Could this entry improve?';
const TALLY = /^\*\*Could this entry improve\?\*\* No (\d+) · Partly (\d+) · Yes (\d+)$/m;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors = ok
      ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type', 'Vary': 'Origin' }
      : {};
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);
    if (!ok) return json({ error: 'origin not allowed' }, 403, cors);

    let p;
    try { p = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }
    if (typeof p.website === 'string' && p.website) return json({ ok: true }, 200, cors);   // the honeypot

    const title = clean(p.title, 200).replace(/\s+/g, ' ');
    const url = clean(p.url, 500);
    if (!title || !url) return json({ error: 'missing fields' }, 400, cors);
    if (!allowed.some((o) => url.startsWith(o + '/'))) return json({ error: 'url not on the site' }, 400, cors);
    const young = p.mode === 'young';
    const hint = Number.isInteger(p.issue) && p.issue > 0 ? p.issue : 0;
    const gh = github(env);

    if (p.type === 'answer') {
      const answer = ANSWERS[p.answer] ? p.answer : '';
      if (!answer) return json({ error: 'missing fields' }, 400, cors);
      const issue = await thread(gh, env, title, url, hint);
      if (!issue) return json({ error: 'github' }, 502, cors);
      const counts = tally(issue.body);
      counts[answer] += 1;
      const res = await gh(`/repos/${env.GITHUB_REPO}/issues/${issue.number}`, 'PATCH',
                           { body: withTally(issue.body, counts, title, url) });
      if (!res.ok) return json({ error: `github ${res.status}` }, 502, cors);
      return json({ ok: true, issue: issue.html_url, number: issue.number }, 200, cors);
    }

    const kind = KINDS[p.kind] ? p.kind : '';
    const text = clean(p.text, 2000);
    const quote = clean(p.quote, 300).replace(/\s+/g, ' ');
    if (!kind || !text) return json({ error: 'missing fields' }, 400, cors);
    const issue = await thread(gh, env, title, url, hint);
    if (!issue) return json({ error: 'github' }, 502, cors);
    const body = [
      `**${KINDS[kind]}**`, '', text,
      ...(quote ? ['', `> ${quote}`] : []),
      ...(young ? ['', '_Read in the younger readers version._'] : []),
      '', '_Sent from the entry page. No name or address was collected._',
    ].join('\n');
    const res = await gh(`/repos/${env.GITHUB_REPO}/issues/${issue.number}/comments`, 'POST', { body });
    if (!res.ok) return json({ error: `github ${res.status}` }, 502, cors);
    const comment = await res.json();
    return json({ ok: true, issue: issue.html_url, number: issue.number, comment: comment.html_url }, 200, cors);
  },
};

function github(env) {
  const api = env.GITHUB_API || 'https://api.github.com';
  return (path, method, body) => fetch(api + path, {
    method,
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'journal-improve-entry',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// One issue per entry, "Reader notes: <title>", labelled reader: the one the page remembers when it still fits,
// else found by its exact title among the open reader issues, else opened now. Closing the issue starts a fresh
// one at the next signal.
async function thread(gh, env, title, url, hint) {
  const name = `Reader notes: ${title}`;
  if (hint) {
    const one = await gh(`/repos/${env.GITHUB_REPO}/issues/${hint}`, 'GET');
    if (one.ok) {
      const i = await one.json();
      if (i.title === name && i.state === 'open' && !i.pull_request) return i;
    }
  }
  const list = await gh(`/repos/${env.GITHUB_REPO}/issues?labels=reader&state=open&per_page=100`, 'GET');
  if (!list.ok) return null;
  const found = (await list.json()).find((i) => i.title === name && !i.pull_request);
  if (found) return found;
  const made = await gh(`/repos/${env.GITHUB_REPO}/issues`, 'POST',
                        { title: name, body: withTally('', { no: 0, partly: 0, yes: 0 }, title, url), labels: ['reader'] });
  return made.ok ? made.json() : null;
}

function tally(body) {
  const m = TALLY.exec(body || '');
  return m ? { no: +m[1], partly: +m[2], yes: +m[3] } : { no: 0, partly: 0, yes: 0 };
}

function withTally(body, c, title, url) {
  const line = `**${QUESTION}** No ${c.no} · Partly ${c.partly} · Yes ${c.yes}`;
  if (TALLY.test(body || '')) return body.replace(TALLY, line);
  return [`Entry: [${title}](${url})`, '', line, '',
          '_Each note from the entry page is a comment below. No name or address is collected._'].join('\n');
}

function clean(v, max) {
  return typeof v === 'string' ? v.replace(/\r/g, '').trim().slice(0, max) : '';
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}
